import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Payment, { IPayment } from '@/models/Payment';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch payments from the database
    const payments = await Payment.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Convert MongoDB documents to plain objects and format the data
    const formattedPayments = payments.map((payment: any) => ({
      id: payment._id.toString(),
      orderId: payment.orderId.toString(),
      customer: payment.customer || 'Unknown',
      amount: `₵${parseFloat(payment.amount || '0').toFixed(2)}`,
      method: payment.method || 'other',
      provider: payment.provider || 'Unknown',
      status: payment.status || 'pending',
      reference: payment.reference || 'N/A',
      date: payment.date || new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, data: formattedPayments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
