import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ReceiptEmail } from '@/emails/receipt-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { order, to } = await req.json();
    
    const { data, error } = await resend.emails.send({
      from: 'Soucey Fast Food <receipts@yourdomain.com>',
      to: to,
      subject: `Order Confirmation - #${order.orderNumber}`,
      react: ReceiptEmail({ order }),
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to send receipt:', error);
    return NextResponse.json(
      { error: 'Failed to send receipt email' },
      { status: 500 }
    );
  }
}
