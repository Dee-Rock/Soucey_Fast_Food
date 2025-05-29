// Mock data for development and testing

// Define types to ensure type safety
type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';
type PaymentStatus = 'paid' | 'pending' | 'refunded';
type PaymentMethod = 'mobile_money' | 'card' | 'cash';

export const orders = [
  {
    id: '1',
    customer: 'John Doe',
    email: 'john@example.com',
    phone: '+233 50 123 4567',
    amount: '65.00',
    status: 'pending' as OrderStatus,
    paymentStatus: 'paid' as PaymentStatus,
    paymentMethod: 'mobile_money' as PaymentMethod,
    date: new Date().toISOString(),
    items: [
      { name: 'Jollof Rice', quantity: 2, price: '25.00' },
      { name: 'Fried Chicken', quantity: 1, price: '15.00' }
    ],
    address: '123 Campus Road, Accra'
  }
];

export const payments = [
  {
    id: 'p1',
    orderId: '1',
    customer: 'John Doe',
    amount: '65.00',
    method: 'mobile_money' as PaymentMethod,
    provider: 'Paystack',
    status: 'successful' as const,
    reference: 'txn_123456789',
    date: new Date().toISOString()
  }
];

export const restaurants = [
  {
    id: 1,
    name: 'Campus Bites',
    logo: '/images/restaurants/campus-bites.jpg',
    address: '123 Campus Road, Accra',
    phone: '+233 50 123 4567',
    email: 'info@campusbites.com',
    rating: 4.5,
    totalOrders: 124,
    status: 'active' as const,
    featured: true,
    cuisineType: 'African',
    deliveryTime: '30-45 min'
  }
];

export const users = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+233 50 123 4567',
    role: 'admin' as const,
    status: 'active' as const,
    joinDate: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    orders: 0
  }
];

export const menuItems = [
  {
    id: 1,
    name: 'Jollof Rice',
    image: '/images/menu/jollof-rice.jpg',
    description: 'Spicy rice cooked in tomato sauce',
    price: 25,
    category: 'main',
    restaurant: 'Campus Bites',
    restaurantId: 1,
    available: true,
    popular: true,
    preparationTime: '20 min',
    calories: 450
  },
  {
    id: 2,
    name: 'Fried Chicken',
    image: '/images/menu/fried-chicken.jpg',
    description: 'Crispy fried chicken with spices',
    price: 15,
    category: 'main',
    restaurant: 'Campus Bites',
    restaurantId: 1,
    available: true,
    popular: true,
    preparationTime: '15 min',
    calories: 650
  }
];
