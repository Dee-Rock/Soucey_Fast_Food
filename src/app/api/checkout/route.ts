import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received checkout request:', body);
    
    // Validate required fields
    const requiredFields = [
      'customerName',
      'customerPhone',
      'customerEmail',
      'address',
      'campus',
      'items',
      'subtotal',
      'deliveryFee',
      'total',
      'paymentMethod'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');
    
    // Format the data according to the Order schema
    const orderData = {
      orderNumber: `ORD${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      customer: {
        name: body.customerName,
        email: body.customerEmail,
        phone: body.customerPhone,
        address: body.address
      },
      items: body.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        notes: item.notes || '',
        restaurant: item.restaurant || '',
        image: item.image || ''
      })),
      status: 'pending',
      paymentStatus: body.paymentMethod === 'cash' ? 'pending' : 'paid',
      paymentMethod: body.paymentMethod,
      subtotal: body.subtotal,
      deliveryFee: body.deliveryFee,
      total: body.total,
      address: `${body.address}, ${body.campus}${body.landmark ? `, ${body.landmark}` : ''}`,
      notes: body.notes || ''
    };

    console.log('Attempting to create order with data:', orderData);
    const order = await OrderService.create(orderData);
    console.log('Order created successfully:', order);
    
    return NextResponse.json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
