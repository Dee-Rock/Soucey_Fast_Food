import { addDocument } from './firestore';
import type { Order, Payment, Restaurant, MenuItem, User } from './firestore';

// Sample restaurants data
const restaurants: Omit<Restaurant, 'id' | 'createdAt'>[] = [
  {
    name: 'Ghana Kitchen',
    logo: '/images/restaurants/ghana-kitchen.jpg',
    address: 'Legon Road, Near University of Ghana',
    phone: '+233 50 123 4567',
    email: 'info@ghanakitchen.com',
    rating: 4.8,
    totalOrders: 1245,
    status: 'active',
    featured: true,
    cuisineType: 'Ghanaian',
    deliveryTime: '25-35 min'
  },
  {
    name: 'Pizza Corner',
    logo: '/images/restaurants/pizza-corner.jpg',
    address: 'East Legon, Accra',
    phone: '+233 55 987 6543',
    email: 'orders@pizzacorner.com',
    rating: 4.5,
    totalOrders: 980,
    status: 'active',
    featured: true,
    cuisineType: 'Italian',
    deliveryTime: '30-45 min'
  },
  {
    name: 'Accra Delights',
    logo: '/images/restaurants/accra-delights.jpg',
    address: 'Osu, Accra',
    phone: '+233 24 555 7890',
    email: 'hello@accradelights.com',
    rating: 4.6,
    totalOrders: 1050,
    status: 'active',
    featured: false,
    cuisineType: 'Ghanaian',
    deliveryTime: '20-30 min'
  },
  {
    name: 'Spice Route',
    logo: '/images/restaurants/spice-route.jpg',
    address: 'Airport Residential Area, Accra',
    phone: '+233 20 111 2222',
    email: 'contact@spiceroute.com',
    rating: 4.7,
    totalOrders: 875,
    status: 'active',
    featured: true,
    cuisineType: 'Indian',
    deliveryTime: '35-50 min'
  },
  {
    name: 'Burger Hub',
    logo: '/images/restaurants/burger-hub.jpg',
    address: 'Cantonments, Accra',
    phone: '+233 27 333 4444',
    email: 'info@burgerhub.com',
    rating: 4.3,
    totalOrders: 720,
    status: 'inactive',
    featured: false,
    cuisineType: 'American',
    deliveryTime: '15-25 min'
  }
];

// Sample menu items data
const menuItems: Omit<MenuItem, 'id' | 'createdAt'>[] = [
  {
    name: 'Jollof Rice with Chicken',
    image: '/images/menu/jollof-rice.jpg',
    description: 'Spicy rice dish cooked with tomatoes, peppers, and aromatic spices, served with grilled chicken',
    price: 35,
    category: 'Main Course',
    restaurant: 'Ghana Kitchen',
    restaurantId: '',  // Will be populated after restaurants are added
    available: true,
    popular: true,
    preparationTime: '20 min',
    calories: 650
  },
  {
    name: 'Margherita Pizza',
    image: '/images/menu/margherita-pizza.jpg',
    description: 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil',
    price: 45,
    category: 'Pizza',
    restaurant: 'Pizza Corner',
    restaurantId: '',
    available: true,
    popular: true,
    preparationTime: '15 min',
    calories: 800
  },
  {
    name: 'Waakye with Fish',
    image: '/images/menu/waakye.jpg',
    description: 'Rice and beans dish served with fish, spaghetti, gari, and spicy pepper sauce',
    price: 30,
    category: 'Main Course',
    restaurant: 'Accra Delights',
    restaurantId: '',
    available: true,
    popular: true,
    preparationTime: '10 min',
    calories: 700
  },
  {
    name: 'Butter Chicken',
    image: '/images/menu/butter-chicken.jpg',
    description: 'Tender chicken cooked in a rich, creamy tomato sauce with Indian spices',
    price: 50,
    category: 'Main Course',
    restaurant: 'Spice Route',
    restaurantId: '',
    available: true,
    popular: true,
    preparationTime: '25 min',
    calories: 750
  },
  {
    name: 'Classic Cheeseburger',
    image: '/images/menu/cheeseburger.jpg',
    description: 'Beef patty with cheese, lettuce, tomato, and special sauce on a toasted bun',
    price: 40,
    category: 'Burgers',
    restaurant: 'Burger Hub',
    restaurantId: '',
    available: true,
    popular: true,
    preparationTime: '12 min',
    calories: 850
  }
];

// Sample orders data
const orders: Omit<Order, 'id' | 'createdAt'>[] = [
  {
    customer: 'Kwame Mensah',
    email: 'kwame@example.com',
    phone: '+233 50 111 2222',
    amount: '85.00',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'mobile_money',
    date: '2025-05-25',
    items: [
      { name: 'Jollof Rice with Chicken', quantity: 2, price: '35.00' },
      { name: 'Kelewele', quantity: 1, price: '15.00' }
    ],
    address: '123 Independence Ave, Accra'
  },
  {
    customer: 'Ama Darko',
    email: 'ama@example.com',
    phone: '+233 24 333 4444',
    amount: '45.00',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    date: '2025-05-25',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: '45.00' }
    ],
    address: '45 Airport Road, Accra'
  },
  {
    customer: 'Kofi Boateng',
    email: 'kofi@example.com',
    phone: '+233 27 555 6666',
    amount: '90.00',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    date: '2025-05-25',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: '50.00' },
      { name: 'Naan Bread', quantity: 2, price: '20.00' }
    ],
    address: '78 Cantonments Road, Accra'
  }
];

// Sample payments data
const payments: Omit<Payment, 'id' | 'createdAt'>[] = [
  {
    orderId: '',  // Will be populated after orders are added
    customer: 'Kwame Mensah',
    amount: '85.00',
    method: 'mobile_money',
    provider: 'MTN Mobile Money',
    status: 'successful',
    reference: 'PAY-MTN-123456',
    date: '2025-05-25'
  },
  {
    orderId: '',
    customer: 'Ama Darko',
    amount: '45.00',
    method: 'card',
    provider: 'Visa',
    status: 'successful',
    reference: 'PAY-VISA-789012',
    date: '2025-05-25'
  },
  {
    orderId: '',
    customer: 'Kofi Boateng',
    amount: '90.00',
    method: 'cash',
    provider: 'Cash on Delivery',
    status: 'pending',
    reference: 'PAY-CASH-345678',
    date: '2025-05-25'
  }
];

// Sample users data
const users: Omit<User, 'id' | 'createdAt'>[] = [
  {
    name: 'Admin User',
    email: 'admin@soucey.com',
    phone: '+233 50 999 8888',
    role: 'admin',
    status: 'active',
    joinDate: '2025-01-01',
    lastLogin: '2025-05-25',
    orders: 0
  },
  {
    name: 'Kwame Mensah',
    email: 'kwame@example.com',
    phone: '+233 50 111 2222',
    role: 'customer',
    status: 'active',
    joinDate: '2025-03-15',
    lastLogin: '2025-05-25',
    orders: 5
  },
  {
    name: 'Ama Darko',
    email: 'ama@example.com',
    phone: '+233 24 333 4444',
    role: 'customer',
    status: 'active',
    joinDate: '2025-04-10',
    lastLogin: '2025-05-24',
    orders: 3
  },
  {
    name: 'Restaurant Owner',
    email: 'owner@ghanakitchen.com',
    phone: '+233 50 123 4567',
    role: 'restaurant_owner',
    status: 'active',
    joinDate: '2025-02-20',
    lastLogin: '2025-05-25',
    orders: 0
  }
];

// Function to seed the database
export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Add restaurants
    console.log('Adding restaurants...');
    const restaurantIds: Record<string, string> = {};
    for (const restaurant of restaurants) {
      const id = await addDocument('restaurants', restaurant);
      if (id && restaurant.name) {
        restaurantIds[restaurant.name] = id;
      }
    }
    console.log('Restaurants added successfully!');
    
    // Add menu items with restaurant IDs
    console.log('Adding menu items...');
    for (const menuItem of menuItems) {
      if (menuItem.restaurant && restaurantIds[menuItem.restaurant]) {
        menuItem.restaurantId = restaurantIds[menuItem.restaurant];
        await addDocument('menuItems', menuItem);
      }
    }
    console.log('Menu items added successfully!');
    
    // Add orders
    console.log('Adding orders...');
    const orderIds: string[] = [];
    for (const order of orders) {
      const id = await addDocument('orders', order);
      if (id) {
        orderIds.push(id);
      }
    }
    console.log('Orders added successfully!');
    
    // Add payments with order IDs
    console.log('Adding payments...');
    for (let i = 0; i < payments.length && i < orderIds.length; i++) {
      payments[i].orderId = orderIds[i];
      await addDocument('payments', payments[i]);
    }
    console.log('Payments added successfully!');
    
    // Add users
    console.log('Adding users...');
    for (const user of users) {
      await addDocument('users', user);
    }
    console.log('Users added successfully!');
    
    console.log('Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

export default {
  seedDatabase
};
