import mongoose from 'mongoose';
import type { IOrder as Order } from '@/models/Order';
import type { IMenuItem as MenuItem } from '@/models/MenuItem';
import type { IUser as User } from '@/models/User';
import dbConnect from './dbConnect';

// Ensure this file is only used on the server side
if (typeof window !== 'undefined') {
  throw new Error('❌ admin-mongodb.ts should not be imported on the client side. Use API routes instead.');
}

// Type for paginated results
interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Type for user query result
type UserQueryResult = Omit<User, 'id'> & { _id: string };

// Type for menu item query result
type MenuItemQueryResult = Omit<MenuItem, 'id'> & { _id: string };

// Type for order query result
type OrderQueryResult = Omit<Order, 'id'> & { _id: string };

// Admin Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  ordersTrend: string;
  revenueTrend: string;
  usersTrend: string;
  conversionTrend: string;
}

// Analytics Data
export interface AnalyticsData {
  revenueData: { 
    labels: string[];
    data: number[];
  };
  ordersData: { 
    labels: string[];
    data: number[];
  };
  usersData: { 
    labels: string[];
    data: number[];
  };
  categoryData: {
    labels: string[];
    data: number[];
  };
  topSellingItems: { 
    name: string; 
    quantity: number; 
    revenue: number;
  }[];
  topRestaurants: { 
    name: string; 
    orders: number; 
    revenue: number;
  }[];
}

// Fetch dashboard statistics
export async function fetchDashboardStats(): Promise<{
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalMenuItems: number;
  orderTrend: number;
  revenueTrend: number;
}> {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');
    
    try {
      // Get counts for all time
      const [orders, users, menuItems] = await Promise.all([
        db.collection('orders').countDocuments({}),
        db.collection('users').countDocuments({}),
        db.collection('menuItems').countDocuments({})
      ]);

      // Get current period (last 30 days) revenue and orders
      const currentPeriodStart = new Date();
      currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);
      
      const [currentRevenue, currentOrders] = await Promise.all([
        db.collection('orders').aggregate([
          { $match: { createdAt: { $gte: currentPeriodStart } } },
          { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
        ]).toArray(),
        db.collection('orders').countDocuments({ createdAt: { $gte: currentPeriodStart } })
      ]);
      
      // Get previous period (30-60 days ago) revenue and orders
      const previousPeriodEnd = new Date(currentPeriodStart);
      const previousPeriodStart = new Date();
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 60);
      
      const [previousRevenue, previousOrders] = await Promise.all([
        db.collection('orders').aggregate([
          { $match: { 
            createdAt: { 
              $gte: previousPeriodStart, 
              $lt: previousPeriodEnd 
            } 
          }},
          { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
        ]).toArray(),
        db.collection('orders').countDocuments({ 
          createdAt: { 
            $gte: previousPeriodStart, 
            $lt: previousPeriodEnd 
          } 
        })
      ]);
      
      const currentPeriodRevenue = currentRevenue[0]?.total || 0;
      const currentPeriodOrders = currentOrders;
      const previousPeriodOrders = previousOrders;
      const previousPeriodRevenue = previousRevenue[0]?.total || 0;
      
      // Calculate trends
      const orderTrendValue = previousPeriodOrders > 0 
        ? ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100 
        : 100;
        
      const revenueTrendValue = previousPeriodRevenue > 0 
        ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
        : 100;
      
      return {
        totalOrders: Number(orders) || 0,
        totalRevenue: Number(currentPeriodRevenue) || 0,
        totalUsers: Number(users) || 0,
        totalMenuItems: Number(menuItems) || 0,
        orderTrend: Number(orderTrendValue.toFixed(2)),
        revenueTrend: Number(revenueTrendValue.toFixed(2))
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Failed to connect to database');
  }
}

// Fetch recent orders
export async function fetchRecentOrders(limitCount = 5): Promise<Order[]> {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');
    
    const orders = await db.collection<Order>('orders')
      .find()
      .sort({ createdAt: -1 })
      .limit(limitCount)
      .toArray();

    return orders.map(order => {
      const orderObj = order as any; // Temporary type assertion
      return {
        ...orderObj,
        id: orderObj._id?.toString() || '',
        _id: undefined
      };
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw new Error('Failed to fetch recent orders');
  }
}

// Fetch menu items with pagination
export async function fetchMenuItems(
  page = 1,
  itemsPerPage = 10,
  filterCategory = '',
  searchQuery = '',
  sortBy = 'name',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<{ items: MenuItem[]; total: number; page: number; totalPages: number }> {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');
    
    const query: Record<string, unknown> = {};
    
    if (filterCategory) {
      query.category = filterCategory;
    }
    
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
    
    const skip = (page - 1) * itemsPerPage;
    
    const [items, total] = await Promise.all([
      db.collection<MenuItemQueryResult>('menuItems')
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .toArray(),
      db.collection('menuItems').countDocuments(query)
    ]);
    
    // Ensure all required fields are present in the returned items
    const formattedItems = items.map(item => {
      const itemObj = item.toObject ? item.toObject() : item;
      return {
        ...itemObj,
        id: itemObj._id?.toString() || '',
        name: itemObj.name || '',
        description: itemObj.description || '',
        price: itemObj.price || 0,
        category: itemObj.category || 'other',
        imageUrl: itemObj.imageUrl || '',
        isAvailable: itemObj.isAvailable ?? true,
        isFeatured: itemObj.isFeatured ?? false,
        isVegetarian: itemObj.isVegetarian ?? false,
        isSpicy: itemObj.isSpicy ?? false,
        isGlutenFree: itemObj.isGlutenFree ?? false,
        restaurantId: itemObj.restaurantId || '',
        preparationTime: itemObj.preparationTime || 0,
        calories: itemObj.calories || 0,
        discountedPrice: itemObj.discountedPrice || 0,
        createdAt: itemObj.createdAt || new Date(),
        updatedAt: itemObj.updatedAt || new Date(),
        _id: undefined
      };
    });

    return {
      items: formattedItems,
      total,
      page,
      totalPages: Math.ceil(total / itemsPerPage)
    };
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw new Error('Failed to fetch menu items');
  }
}

// Fetch users with pagination
export async function fetchUsers(
  page = 1,
  itemsPerPage = 10,
  filterRole = '',
  filterStatus = '',
  searchQuery = ''
): Promise<{ items: User[]; total: number; page: number; totalPages: number }> {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');
    const query: Record<string, unknown> = {};
    
    if (filterRole) {
      query.role = filterRole;
    }
    
    if (filterStatus) {
      query.status = filterStatus;
    }
    
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phone: { $regex: searchQuery, $options: 'i' } }
      ] as any[];
    }
    
    const skip = (page - 1) * itemsPerPage;
    
    const [users, total] = await Promise.all([
      db.collection<UserQueryResult>('users')
        .find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .toArray(),
      db.collection('users').countDocuments(query)
    ]);
    
    // Format the users to include the id field and ensure all required fields are present
    const formattedUsers = users.map(user => {
      const userObj = user as any; // Temporary type assertion
      return {
        ...userObj,
        id: userObj._id?.toString() || '',
        name: userObj.name || '',
        email: userObj.email || '',
        role: userObj.role || 'user',
        isActive: userObj.isActive ?? true,
        phone: userObj.phone || '',
        address: userObj.address || '',
        createdAt: userObj.createdAt || new Date(),
        updatedAt: userObj.updatedAt || new Date(),
        _id: undefined
      };
    });
    
    return {
      items: formattedUsers,
      total,
      page,
      totalPages: Math.ceil(total / itemsPerPage)
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

// Fetch analytics data
export async function fetchAnalyticsData(timeRange = 'last_7_days'): Promise<AnalyticsData> {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');
    
    // This is a simplified implementation
    // You should implement proper aggregation pipelines based on your data model
    return {
      revenueData: {
        labels: [],
        data: []
      },
      ordersData: {
        labels: [],
        data: []
      },
      usersData: {
        labels: [],
        data: []
      },
      categoryData: {
        labels: [],
        data: []
      },
      topSellingItems: [],
      topRestaurants: []
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw new Error('Failed to fetch analytics data');
  }
}
