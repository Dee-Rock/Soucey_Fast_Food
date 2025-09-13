import { NextRequest, NextResponse } from 'next/server';
import { RestaurantService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate the ID parameter
  if (!params.id || params.id === 'undefined' || params.id === 'null') {
    console.error('[API] Error: No restaurant ID provided');
    return NextResponse.json(
      { error: 'Restaurant ID is required' },
      { status: 400 }
    );
  }

  console.log(`[API] Fetching restaurant with ID: ${params.id}`);
  
  try {
    // Check database connection
    console.log('[API] Checking database connection...');
    await dbConnect();
    console.log('[API] Database connection established');
    
    // Log database connection state
    console.log(`[API] MongoDB connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'}`);
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.error(`[API] Error: Invalid restaurant ID format: ${params.id}`);
      return NextResponse.json(
        { error: 'Invalid restaurant ID format' },
        { status: 400 }
      );
    }
    
    console.log(`[API] Fetching restaurant...`);
    const restaurant = await RestaurantService.getById(params.id);
    
    if (!restaurant) {
      console.log(`[API] Restaurant ${params.id} not found`);
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Type assertion for the restaurant object
    const restaurantObj = restaurant as any;
    console.log(`[API] Successfully fetched restaurant:`, restaurantObj.name || 'Unnamed Restaurant');
    return NextResponse.json(restaurantObj);
    
  } catch (error) {
    console.error(`[API] Error fetching restaurant ${params.id}:`, error);
    
    // More detailed error information
    if (error instanceof Error) {
      console.error(`[API] Error details:`, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if ('code' in error) {
        console.error(`[API] Error code:`, error.code);
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch restaurant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate the ID parameter
  if (!params.id || params.id === 'undefined' || params.id === 'null') {
    console.error('[API] Error: No restaurant ID provided for update');
    return NextResponse.json(
      { error: 'Restaurant ID is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.error(`[API] Error: Invalid restaurant ID format for update: ${params.id}`);
      return NextResponse.json(
        { error: 'Invalid restaurant ID format' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const restaurant = await RestaurantService.update(params.id, data);
    
    if (!restaurant) {
      console.log(`[API] Restaurant ${params.id} not found for update`);
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error(`[API] Error updating restaurant ${params.id}:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to update restaurant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate the ID parameter
  if (!params.id || params.id === 'undefined' || params.id === 'null') {
    console.error('[API] Error: No restaurant ID provided for deletion');
    return NextResponse.json(
      { error: 'Restaurant ID is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.error(`[API] Error: Invalid restaurant ID format for deletion: ${params.id}`);
      return NextResponse.json(
        { error: 'Invalid restaurant ID format' },
        { status: 400 }
      );
    }

    const success = await RestaurantService.remove(params.id);
    
    if (!success) {
      console.log(`[API] Restaurant ${params.id} not found for deletion`);
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[API] Error deleting restaurant ${params.id}:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to delete restaurant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
