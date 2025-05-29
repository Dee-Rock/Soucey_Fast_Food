import mongoose, { Schema, Document } from 'mongoose';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  restaurant?: string;
  image?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  paymentMethod: 'mobile_money' | 'card' | 'cash';
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  notes: { type: String },
  restaurant: { type: String },
  image: { type: String }
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { 
      type: String, 
      required: true,
      unique: true,
      default: () => 'ORD' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 5).toUpperCase()
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true }
    },
    items: [OrderItemSchema],
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'delivered', 'cancelled'], 
      default: 'pending' 
    },
    paymentStatus: { 
      type: String, 
      enum: ['paid', 'pending', 'refunded', 'failed'], 
      default: 'pending' 
    },
    paymentMethod: { 
      type: String, 
      enum: ['mobile_money', 'card', 'cash'], 
      required: true 
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    address: { type: String, required: true },
    notes: { type: String, default: '' }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
