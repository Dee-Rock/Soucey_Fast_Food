export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { userId, sessionClaims } = auth();
    
    if (!userId || !sessionClaims?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const userEmail = sessionClaims.email;

    const { db } = await connectToDatabase();
    const orders = await db
      .collection('orders')
      .find({ 'customer.email': userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    // Convert _id to string for JSON serialization
    const serializedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      items: order.items.map((item: any) => ({
        ...item,
        _id: item._id?.toString() || Math.random().toString(36).substring(7),
      })),
    }));

    return NextResponse.json(serializedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
