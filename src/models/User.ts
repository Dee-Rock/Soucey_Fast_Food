import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'restaurant_owner';
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin: string;
  orders: number;
  address?: string;
  campus?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['customer', 'admin', 'restaurant_owner'], 
      default: 'customer' 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
    },
    joinDate: { type: String, required: true },
    lastLogin: { type: String, default: '' },
    orders: { type: Number, default: 0 },
    address: { type: String },
    campus: { type: String },
  },
  { 
    timestamps: true 
  }
);

// Prevent model overwrite error in development with Next.js hot reloading
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
