import { Document, Types } from 'mongoose';

export interface IRestaurant {
  _id: Types.ObjectId;
  name: string;
  deliveryFee: number;
  // Add other restaurant fields as needed
}

export interface IMenuItemBase {
  _id: Types.ObjectId | string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  restaurantId: Types.ObjectId | string;
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

export interface IMenuItem extends IMenuItemBase, Document {
  _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
  // Add any other Document methods/properties here
}

export interface IMenuItemWithRestaurant extends Omit<IMenuItemBase, 'restaurantId'> {
  _id: string;
  restaurantId: string;
  restaurant: IRestaurant;
}
