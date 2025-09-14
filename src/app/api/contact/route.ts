import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // In a real app, you would send an email here
    // For now, we'll just log it and return success
    console.log('New contact form submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: `Soucey Fast Food <${process.env.RESEND_FROM_EMAIL}>`,
      to: process.env.RESEND_TO_EMAIL || 'your-email@example.com',
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>This message was sent from the contact form on Soucey Fast Food website.</p>
      `,
      text: `
        New Contact Form Submission
        -------------------------
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        -------------------------
        This message was sent from the contact form on Soucey Fast Food website.
      `,
    });

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
