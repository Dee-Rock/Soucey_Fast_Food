import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';

interface Order {
  _id: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  orderNumber: string;
  createdAt: Date;
}

export async function GET() {
  try {
    await dbConnect();
    
    // Get all orders
    const orders = await OrderService.getAll() as Order[];
    
    // Calculate analytics
    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length 
        : 0,
      ordersByStatus: {
        pending: orders.filter(order => order.status === 'pending').length,
        processing: orders.filter(order => order.status === 'processing').length,
        delivered: orders.filter(order => order.status === 'delivered').length,
        cancelled: orders.filter(order => order.status === 'cancelled').length
      }
    };

    return NextResponse.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch analytics'
      },
      { status: 500 }
    );
  }
} 