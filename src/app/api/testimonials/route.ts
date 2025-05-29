import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const testimonials = await db
      .collection('testimonials')
      .find({ approved: true })
      .sort({ rating: -1 })
      .limit(3)
      .toArray();

    // Convert ObjectId to string for serialization
    const formattedTestimonials = testimonials.map(testimonial => ({
      id: testimonial._id.toString(),
      name: testimonial.name || 'Anonymous',
      role: testimonial.role || 'Customer',
      comment: testimonial.comment || 'Great service!',
      rating: testimonial.rating || 5,
      campus: testimonial.campus || ''
    }));

    return NextResponse.json(formattedTestimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
