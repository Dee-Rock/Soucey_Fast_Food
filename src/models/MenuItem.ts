import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  restaurantId: mongoose.Types.ObjectId;
  imageUrl: string;
  preparationTime?: number;
  calories?: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    category: { type: String, required: true },
    restaurantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Restaurant',
      required: true 
    },
    imageUrl: { type: String, required: true },
    preparationTime: { type: Number },
    calories: { type: Number },
    isVegetarian: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { 
    timestamps: true 
  }
);

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
