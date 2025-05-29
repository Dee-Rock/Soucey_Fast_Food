import { NextResponse } from 'next/server';
import { fetchRecentOrders } from '@/lib/admin-mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await fetchRecentOrders(5); // Get 5 most recent orders
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    );
  }
}
