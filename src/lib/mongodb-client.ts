// Client-side MongoDB utilities
// This file provides safe MongoDB operations that can run in the browser

// This is a client-side safe version that doesn't include server-side MongoDB code
// It's used to maintain type safety without importing server-side MongoDB code in the client

export type { WithId, Document } from 'mongodb';

// Client-safe types that mirror the server-side models
export interface IMenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: string | { name: string; email: string; phone: string };
  items: Array<{
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'mobile_money' | 'cash';
  deliveryAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Client-side API functions that make requests to our API routes
export async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred while fetching data');
  }

  return response.json();
}

// Example usage:
// const menuItems = await fetchFromAPI<IMenuItem[]>('menu/items');
// const order = await fetchFromAPI<IOrder>(`orders/${orderId}`);
