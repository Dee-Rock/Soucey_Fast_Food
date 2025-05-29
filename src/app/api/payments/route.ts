import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    // Check if we need to filter by status or method
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    
    let payments;
    if (status && method) {
      payments = await PaymentService.query({ status, method });
    } else if (status) {
      payments = await PaymentService.query({ status });
    } else if (method) {
      payments = await PaymentService.query({ method });
    } else {
      payments = await PaymentService.getAll();
    }
    
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.orderId || !data.customer || !data.amount || !data.method || !data.reference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Add current date if not provided
    if (!data.date) {
      data.date = new Date().toISOString().split('T')[0];
    }
    
    // Set default values
    if (!data.status) data.status = 'pending';
    if (!data.provider) {
      if (data.method === 'mobile_money' || data.method === 'card') {
        data.provider = 'Paystack'; // Default to Paystack for mobile money and card payments
      } else {
        data.provider = 'Cash'; // Default for cash payments
      }
    }
    
    const payment = await PaymentService.create(data);
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
