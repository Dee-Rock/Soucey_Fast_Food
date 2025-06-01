import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Fetching orders...');
    await dbConnect();
    const orders = await OrderService.getAll();
    console.log(`Found ${orders.length} orders`);
    
    // Format orders for frontend consumption
    const formattedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      id: order._id.toString(), // Add id field for compatibility
      // Format customer data consistently
      customer: typeof order.customer === 'string' 
        ? { name: order.customer, email: '', phone: '', address: '' }
        : order.customer,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }));
    
    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    // Log detailed error information
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
    console.log('Received update request:', { id, status });
    
    // Validate required fields
    if (!id || !status) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: id and status' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['pending', 'processing', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      console.log('Invalid status:', status);
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    await dbConnect();
    const ordersCollection = await getCollection('orders');
    
    // Ensure id is properly formatted for MongoDB
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      console.error('Invalid ObjectId:', id);
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    console.log('Updating order:', { objectId, status });
    
    // Update the order
    const result = await ordersCollection.updateOne(
      { _id: objectId },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );
    
    console.log('Update result:', result);
    
    if (result.matchedCount === 0) {
      console.log('Order not found:', objectId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      console.log('Order status not modified');
      return NextResponse.json(
        { error: 'Order status was not modified' },
        { status: 400 }
      );
    }
    
    const updatedOrder = await ordersCollection.findOne({ _id: objectId });
    console.log('Updated order:', updatedOrder);
    
    return NextResponse.json({ 
      success: true,
      message: `Order status updated to ${status}`,
      updatedAt: new Date(),
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

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const ordersCollection = await getCollection('orders');
    
    await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received order creation request:', JSON.stringify(data, null, 2));
    
    // Validate required fields
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
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
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
    
    // Add order number if not provided
    if (!data.orderNumber) {
      data.orderNumber = `ORD${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    }
    
    // Set default status if not provided
    if (!data.status) {
      data.status = 'pending';
    }
    
    // Set payment status based on payment method if not provided
    if (!data.paymentStatus) {
      data.paymentStatus = data.paymentMethod === 'cash' ? 'pending' : 'paid';
    }
    
    console.log('Creating order with data:', JSON.stringify(data, null, 2));
    const order = await OrderService.create(data);
    console.log('Order created:', JSON.stringify(order, null, 2));
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
