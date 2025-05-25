import { createClient } from '@supabase/supabase-js';

// These would typically be environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Food = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  restaurant_id: number;
  preparation_time: number;
  created_at: string;
};

export type Restaurant = {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  address: string;
  phone: string;
  email: string;
  opening_hours: string;
  rating: number;
  created_at: string;
};

export type Order = {
  id: number;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  delivery_address: string;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  food_id: number;
  quantity: number;
  price: number;
  created_at: string;
};

// Helper functions for database operations
export async function getFeaturedFoods() {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .limit(6);
  
  if (error) {
    console.error('Error fetching featured foods:', error);
    return [];
  }
  
  return data;
}

export async function getAllFoods() {
  const { data, error } = await supabase
    .from('foods')
    .select('*');
  
  if (error) {
    console.error('Error fetching all foods:', error);
    return [];
  }
  
  return data;
}

export async function getFoodsByCategory(category: string) {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('category', category);
  
  if (error) {
    console.error(`Error fetching foods by category ${category}:`, error);
    return [];
  }
  
  return data;
}

export async function getRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*');
  
  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
  
  return data;
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>, orderItems: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]) {
  // Insert the order first
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([order])
    .select();
  
  if (orderError || !orderData || orderData.length === 0) {
    console.error('Error creating order:', orderError);
    return null;
  }
  
  const orderId = orderData[0].id;
  
  // Insert the order items with the new order ID
  const orderItemsWithOrderId = orderItems.map(item => ({
    ...item,
    order_id: orderId
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsWithOrderId);
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return null;
  }
  
  return orderData[0];
}
