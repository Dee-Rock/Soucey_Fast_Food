import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';
import { IOrder } from '@/models/Order';
import { Document, HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

interface PlainOrder extends Omit<IOrder, '_id'> {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Fetching orders...');
    await dbConnect();
    const orders = await OrderService.getAll() as HydratedDocument<IOrder>[];
    console.log(`Found ${orders.length} orders`);
    
    // Format orders for frontend consumption
    const formattedOrders = orders.map((order) => {
      // Convert Mongoose document to plain object
      const plainOrder = order.toObject() as PlainOrder;
      
      return {
        ...plainOrder,
        _id: plainOrder._id.toString(),
        id: plainOrder._id.toString(),
        customer: typeof plainOrder.customer === 'string' 
          ? { name: plainOrder.customer, email: '', phone: '', address: '' }
          : plainOrder.customer,
        createdAt: plainOrder.createdAt.toISOString(),
        updatedAt: plainOrder.updatedAt.toISOString()
      };
    });
    
    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id and status' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'processing', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    await dbConnect();
    const updatedOrder = await OrderService.update(id, { status });
    
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
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
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Ensure numeric fields are numbers
    const orderData = {
      ...data,
      subtotal: Number(data.subtotal),
      deliveryFee: Number(data.deliveryFee),
      total: Number(data.total),
      items: data.items.map((item: any) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
        total: Number(item.price) * Number(item.quantity)
      })),
      orderNumber: data.orderNumber || `ORD${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      status: data.status || 'pending',
      paymentStatus: data.paymentStatus || (data.paymentMethod === 'cash' ? 'pending' : 'paid')
    };

    const order = await OrderService.create(orderData);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await dbConnect();
    const result = await OrderService.remove(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
