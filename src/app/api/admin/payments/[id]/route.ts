import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Payment, { IPayment } from '@/models/Payment';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    await connectToDatabase();
    
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    if (!updatedPayment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        id: (updatedPayment as any)._id?.toString() || '',
        orderId: (updatedPayment as any).orderId?.toString() || '',
        customer: (updatedPayment as any).customer || 'Unknown',
        amount: `₵${parseFloat((updatedPayment as any).amount || '0').toFixed(2)}`,
        method: (updatedPayment as any).method || 'other',
        provider: (updatedPayment as any).provider || 'Unknown',
        status: (updatedPayment as any).status,
        reference: (updatedPayment as any).reference || 'N/A',
        date: (updatedPayment as any).date || new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    
    const deletedPayment = await Payment.findByIdAndDelete(id);
    
    if (!deletedPayment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete payment' },
      { status: 500 }
    );
  }
}
