import mongoose from 'mongoose';
import User from '../models/User';
import Restaurant from '../models/Restaurant';
import MenuItem from '../models/MenuItem';
import Order from '../models/Order';
import Payment from '../models/Payment';
import dbConnect from './dbConnect';

// Generic database service functions
export async function getAll<T>(model: any): Promise<T[]> {
  await dbConnect();
  return model.find({}).lean();
}

export async function getById<T>(model: any, id: string): Promise<T | null> {
  await dbConnect();
  return model.findById(id).lean();
}

export async function create<T>(model: any, data: any): Promise<T> {
  await dbConnect();
  return model.create(data);
}

export async function update<T>(model: any, id: string, data: any): Promise<T | null> {
  await dbConnect();
  return model.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function remove(model: any, id: string): Promise<boolean> {
  await dbConnect();
  const result = await model.findByIdAndDelete(id);
  return !!result;
}

export async function query<T>(model: any, queryObj: any): Promise<T[]> {
  await dbConnect();
  return model.find(queryObj).lean();
}

// Specific service functions for each model
export const UserService = {
  getAll: () => getAll(User),
  getById: (id: string) => getById(User, id),
  create: (data: any) => create(User, data),
  update: (id: string, data: any) => update(User, id, data),
  remove: (id: string) => remove(User, id),
  query: (queryObj: any) => query(User, queryObj)
};

export const RestaurantService = {
  getAll: () => getAll(Restaurant),
  getById: (id: string) => getById(Restaurant, id),
  create: (data: any) => create(Restaurant, data),
  update: (id: string, data: any) => update(Restaurant, id, data),
  remove: (id: string) => remove(Restaurant, id),
  query: (queryObj: any) => query(Restaurant, queryObj)
};

export const MenuItemService = {
  getAll: () => getAll(MenuItem),
  getById: (id: string) => getById(MenuItem, id),
  create: (data: any) => create(MenuItem, data),
  update: (id: string, data: any) => update(MenuItem, id, data),
  remove: (id: string) => remove(MenuItem, id),
  query: (queryObj: any) => query(MenuItem, queryObj),
  getByRestaurant: (restaurantId: string) => query(MenuItem, { restaurantId })
};

export const OrderService = {
  getAll: () => getAll(Order),
  getById: (id: string) => getById(Order, id),
  create: (data: any) => create(Order, data),
  update: (id: string, data: any) => update(Order, id, data),
  remove: (id: string) => remove(Order, id),
  query: (queryObj: any) => query(Order, queryObj)
};

export const PaymentService = {
  getAll: () => getAll(Payment),
  getById: (id: string) => getById(Payment, id),
  create: (data: any) => create(Payment, data),
  update: (id: string, data: any) => update(Payment, id, data),
  remove: (id: string) => remove(Payment, id),
  query: (queryObj: any) => query(Payment, queryObj)
};
