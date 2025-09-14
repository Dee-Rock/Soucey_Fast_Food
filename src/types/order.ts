export interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  restaurant: {
    id: string;
    name: string;
    deliveryFee: number;
  };
  image?: string;
}

export interface OrderResponse {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: 'mobile_money' | 'card' | 'cash';
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  campus: string;
  landmark?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
