import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching order by ID:', params.id);
    const order = await OrderService.getById(params.id);
    
    if (!order) {
      console.log('Order not found:', params.id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error(`Error fetching order ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const { id } = params;
    
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

    // First check if order exists
    const existingOrder = await OrderService.getById(id);
    if (!existingOrder) {
      console.log('Order not found:', id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Existing order found:', existingOrder);

    // Update the order using OrderService
    const updatedOrder = await OrderService.update(id, {
      status,
      updatedAt: new Date()
    });

    if (!updatedOrder) {
      console.log('Failed to update order:', id);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    console.log('Order updated successfully:', updatedOrder);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Attempting to delete order:', params.id);
    const success = await OrderService.remove(params.id);
    
    if (!success) {
      console.log('Order not found for deletion:', params.id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    console.log('Order deleted successfully:', params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting order ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
