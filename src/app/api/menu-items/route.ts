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
    const populateRestaurant = searchParams.get('populate') === 'true';
    
    let menuItems;
    if (restaurantId) {
      menuItems = await MenuItemService.getByRestaurant(restaurantId);
    } else {
      menuItems = await MenuItemService.getAll();
    }
    
    // If we need to populate restaurant data
    if (populateRestaurant && menuItems.length > 0) {
      const Restaurant = (await import('@/models/Restaurant')).default;
      
      // Get unique restaurant IDs using Array.from() for better compatibility
      const restaurantIds = Array.from(new Set(
        menuItems
          .map((item: any) => item.restaurantId?.toString())
          .filter(Boolean)
      ));
      
      if (restaurantIds.length > 0) {
        const restaurants = await Restaurant.find({ 
          _id: { $in: restaurantIds } 
        }).lean();
        
        // Create a map of restaurant ID to restaurant data
        const restaurantMap = new Map(
          restaurants.map((r: any) => [r._id.toString(), r])
        );
        
        // Add restaurant data to each menu item
        menuItems = menuItems.map((item: any) => {
          const restaurant = restaurantMap.get(item.restaurantId?.toString());
          return {
            ...item,
            _id: item._id.toString(),
            restaurantId: item.restaurantId?.toString(),
            restaurant: restaurant ? {
              _id: restaurant._id.toString(),
              name: restaurant.name,
              deliveryFee: restaurant.deliveryFee || 0,
              // Add other restaurant fields as needed
            } : null
          };
        });
      } else {
        // Ensure all items have a restaurant field even if no restaurant data was found
        menuItems = menuItems.map((item: any) => ({
          ...item,
          _id: item._id.toString(),
          restaurantId: item.restaurantId?.toString(),
          restaurant: null
        }));
      }
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
