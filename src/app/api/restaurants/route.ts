import { NextRequest, NextResponse } from 'next/server';
import { RestaurantService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    const restaurants = await RestaurantService.getAll();
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await dbConnect();
    
    const data = await request.json();
    console.log('Received restaurant data:', data);
    
    // Validate required fields
    const requiredFields = ['name', 'address', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          message: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }
    
    // Ensure numeric fields are numbers
    if (data.deliveryFee) data.deliveryFee = Number(data.deliveryFee);
    if (data.minOrderAmount) data.minOrderAmount = Number(data.minOrderAmount);
    
    // Set default values for required fields if not provided
    const defaultValues = {
      logo: '/images/placeholder-restaurant.jpg',
      logoUrl: '/images/placeholder-restaurant.jpg',
      coverUrl: '/images/placeholder-cover.jpg',
      rating: 0,
      totalOrders: 0,
      isActive: true,
      featuredRestaurant: false,
      deliveryTime: '30-45',
      cuisineType: 'Other',
      openingTime: '09:00',
      closingTime: '22:00'
    };

    const restaurantData = {
      ...defaultValues,
      ...data
    };
    
    const restaurant = await RestaurantService.create(restaurantData);
    console.log('Created restaurant:', restaurant);
    
    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    
    // Handle validation errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Failed to create restaurant',
          message: error.message,
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}
