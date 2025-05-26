/**
 * Simple localStorage-based data store for Soucey application
 * This provides a lightweight alternative to external databases
 */

// Define types for our data models
export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  amount: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: 'mobile_money' | 'card' | 'cash';
  date: string;
  items: Array<{name: string; quantity: number; price: string}>;
  address: string;
}

export interface Payment {
  id: string;
  orderId: string;
  customer: string;
  amount: string;
  method: 'mobile_money' | 'card' | 'cash';
  provider: string;
  status: 'successful' | 'pending' | 'refunded' | 'failed';
  reference: string;
  date: string;
}

export interface Restaurant {
  id: number;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  totalOrders: number;
  status: 'active' | 'inactive';
  featured: boolean;
  cuisineType: string;
  deliveryTime: string;
}

export interface MenuItem {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  restaurant: string;
  restaurantId: number;
  available: boolean;
  popular: boolean;
  preparationTime: string;
  calories: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'restaurant_owner';
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin: string;
  orders: number;
}

// Define store collections
export type StoreCollection = 'orders' | 'payments' | 'restaurants' | 'menuItems' | 'users';

// Initialize store with default data if empty
const initializeStore = () => {
  // Check if store is already initialized
  if (typeof window === 'undefined') return;
  
  const initialized = localStorage.getItem('soucey_store_initialized');
  if (initialized) return;
  
  // Import mock data from admin pages
  import('@/data/mock-data').then((mockData) => {
    // Set each collection
    setCollection('orders', mockData.orders);
    setCollection('payments', mockData.payments);
    setCollection('restaurants', mockData.restaurants);
    setCollection('menuItems', mockData.menuItems);
    setCollection('users', mockData.users);
    
    // Mark as initialized
    localStorage.setItem('soucey_store_initialized', 'true');
  }).catch(error => {
    console.error('Failed to initialize store:', error);
  });
};

// Get all items from a collection
export const getCollection = <T>(collection: StoreCollection): T[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(`soucey_${collection}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting ${collection}:`, error);
    return [];
  }
};

// Set all items in a collection
export const setCollection = <T>(collection: StoreCollection, data: T[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`soucey_${collection}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting ${collection}:`, error);
  }
};

// Get a single item by ID
export const getItem = <T extends {id: string | number}>(
  collection: StoreCollection,
  id: string | number
): T | null => {
  const items = getCollection<T>(collection);
  return items.find(item => item.id === id) || null;
};

// Add a new item to a collection
export const addItem = <T>(collection: StoreCollection, item: T): void => {
  const items = getCollection<T>(collection);
  setCollection(collection, [...items, item]);
};

// Update an existing item
export const updateItem = <T extends {id: string | number}>(
  collection: StoreCollection,
  updatedItem: T
): void => {
  const items = getCollection<T>(collection);
  const updatedItems = items.map(item => 
    // @ts-ignore - We know id exists on both items
    item.id === updatedItem.id ? updatedItem : item
  );
  setCollection(collection, updatedItems);
};

// Delete an item
export const deleteItem = <T extends {id: string | number}>(
  collection: StoreCollection,
  id: string | number
): void => {
  const items = getCollection<T>(collection);
  // @ts-ignore - We know id exists on the items
  const filteredItems = items.filter(item => item.id !== id);
  setCollection(collection, filteredItems);
};

// Generate a unique ID (simple implementation)
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Initialize the store when this module is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  initializeStore();
}

export default {
  getCollection,
  setCollection,
  getItem,
  addItem,
  updateItem,
  deleteItem,
  generateId,
};
