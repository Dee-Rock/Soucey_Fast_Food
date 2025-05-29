import mongoose, { Schema, Document } from 'mongoose';

import { Types } from 'mongoose';

export interface IRestaurant extends Document {
  _id: Types.ObjectId;
  id: string;
  name: string;
  logo: string;
  coverUrl: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  cuisineType: string;
  openingTime: string;
  closingTime: string;
  deliveryFee: number;
  minOrderAmount: number;
  rating: number;
  totalOrders: number;
  isActive: boolean;
  featuredRestaurant: boolean;
  deliveryTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    logoUrl: { type: String },
    coverUrl: { type: String },
    description: { type: String },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    cuisineType: { type: String },
    openingTime: { type: String },
    closingTime: { type: String },
    deliveryFee: { type: Number, default: 0 },
    minOrderAmount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    featuredRestaurant: { type: Boolean, default: false },
    deliveryTime: { type: String, default: '30-45' },
  },
  { 
    timestamps: true 
  }
);

export default mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
