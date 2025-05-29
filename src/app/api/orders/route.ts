import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    console.log('Attempting to connect to MongoDB...');
    await dbConnect();
    console.log('MongoDB connection successful');
    
    // Check if we need to filter by status
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    console.log('Fetching orders with status filter:', status || 'none');
    
    let orders;
    try {
      if (status) {
        orders = await OrderService.query({ status });
      } else {
        orders = await OrderService.getAll();
      }
      console.log('Retrieved orders:', orders);
    } catch (dbError) {
      console.error('Database query error:', dbError);
      throw new Error(`Database query failed: ${dbError.message}`);
    }
    
    if (!orders) {
      console.error('No orders returned from database');
      throw new Error('No orders found in database');
    }
    
    // Transform orders to match frontend expectations
    const transformedOrders = orders.map((order: any) => {
      console.log('Processing order:', order);
      return {
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        customer: {
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          address: order.customer.address
        },
        items: order.items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          notes: item.notes || '',
          _id: item._id?.toString(),
          restaurant: item.restaurant || '',
          image: item.image || ''
        })),
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        address: order.address,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString()
      };
    });
    
    console.log('Sending transformed orders to client:', transformedOrders);
    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Error in orders API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received order creation request:', data);
    
    // Validate required fields
    if (!data.customer || !data.email || !data.phone || !data.amount || !data.items || !data.address) {
      console.error('Missing required fields in order creation');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Add current date if not provided
    if (!data.date) {
      data.date = new Date().toISOString().split('T')[0];
    }
    
    console.log('Creating order with data:', data);
    const order = await OrderService.create(data);
    console.log('Order created:', order);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
