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
  console.log('DB Service - Creating document in model:', model.modelName);
  console.log('DB Service - Input data:', JSON.stringify(data, null, 2));
  
  try {
    await dbConnect();
    console.log('DB Service - Database connected');
    
    // Create a new document instance to leverage Mongoose validation
    const doc = new model(data);
    
    // Validate the document
    await doc.validate();
    
    // Save the document
    const result = await doc.save();
    console.log('DB Service - Document created successfully:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('DB Service - Error creating document:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      console.error('DB Service - Validation errors:', Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })));
    }
    throw error;
  }
}

export async function update<T>(model: any, id: string, data: any): Promise<T | null> {
  console.log('DB Service - Updating document:', { model: model.modelName, id, data });
  try {
    await dbConnect();
    console.log('DB Service - Database connected');

    // Convert string ID to ObjectId if needed
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      console.error('DB Service - Invalid ObjectId:', id);
      throw new Error('Invalid ID format');
    }

    // Ensure the document exists
    const existingDoc = await model.findById(objectId);
    if (!existingDoc) {
      console.log('DB Service - Document not found:', id);
      return null;
    }

    console.log('DB Service - Found existing document:', existingDoc);

    // Update the document
    const updatedDoc = await model.findByIdAndUpdate(
      objectId,
      { $set: data },
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    ).lean();

    console.log('DB Service - Document updated successfully:', updatedDoc);
    return updatedDoc;
  } catch (error) {
    console.error('DB Service - Error updating document:', error);
    throw error;
  }
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
  create: async (data: any) => {
    console.log('OrderService - Creating new order with data:', JSON.stringify(data, null, 2));
    try {
      // Ensure all required fields are present
      const requiredFields = [
        'customer',
        'items',
        'paymentMethod',
        'subtotal',
        'deliveryFee',
        'total',
        'address'
      ];
      
      const missingFields = requiredFields.filter(field => !data[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Ensure numeric fields are numbers
      data.subtotal = Number(data.subtotal);
      data.deliveryFee = Number(data.deliveryFee);
      data.total = Number(data.total);
      
      // Ensure items have proper numeric values
      data.items = data.items.map((item: any) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
        total: Number(item.price) * Number(item.quantity)
      }));
      
      const result = await create(Order, data);
      console.log('OrderService - Order created successfully:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('OrderService - Error creating order:', error);
      throw error;
    }
  },
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
