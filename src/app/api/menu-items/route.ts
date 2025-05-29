import { NextRequest, NextResponse } from 'next/server';
import { MenuItemService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection
    await dbConnect();
    
    // Check if we need to filter by restaurant
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    
    let menuItems;
    if (restaurantId) {
      menuItems = await MenuItemService.getByRestaurant(restaurantId);
    } else {
      menuItems = await MenuItemService.getAll();
    }
    
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await dbConnect();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.price || !data.restaurantId || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const menuItem = await MenuItemService.create(data);
    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create menu item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
