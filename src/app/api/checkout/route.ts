import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  restaurant?: string;
  image?: string;
}

interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: string;
}

interface OrderResponse {
  _id: string;
  orderNumber: string;
}

export async function POST(request: Request) {
  console.log('=== Starting Checkout Process ===');
  try {
    const body = await request.json();
    console.log('1. Received checkout request body:', JSON.stringify(body, null, 2));
    
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
      console.error('2. Validation Error - Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    console.log('2. All required fields validated successfully');

    console.log('3. Attempting database connection...');
    await dbConnect();
    console.log('4. Database connected successfully');
    
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
        price: Number(item.price),
        total: Number(item.price) * item.quantity,
        notes: item.notes || '',
        restaurant: item.restaurant || '',
        image: item.image || ''
      })),
      status: 'pending',
      paymentStatus: body.paymentMethod === 'cash' ? 'pending' : 'paid',
      paymentMethod: body.paymentMethod,
      subtotal: Number(body.subtotal),
      deliveryFee: Number(body.deliveryFee),
      total: Number(body.total),
      address: `${body.address}, ${body.campus}${body.landmark ? `, ${body.landmark}` : ''}`,
      notes: body.notes || ''
    };

    console.log('5. Formatted order data:', JSON.stringify(orderData, null, 2));
    console.log('6. Attempting to create order in database...');
    
    try {
      const order = await OrderService.create(orderData) as OrderResponse;
      console.log('7. Order created successfully:', JSON.stringify(order, null, 2));
      
      return NextResponse.json({
        success: true,
        orderId: order._id,
        orderNumber: order.orderNumber
      });
    } catch (dbError) {
      console.error('Database Error:', dbError);
      console.error('Full database error details:', JSON.stringify(dbError, Object.getOwnPropertyNames(dbError), 2));
      throw new Error('Failed to save order to database');
    }
  } catch (error) {
    console.error('Checkout Error:', error);
    console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
