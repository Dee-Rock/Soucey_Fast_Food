import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/db-service';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all users
    const users = await UserService.getAll();
    
    return NextResponse.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch users'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Add current date for joinDate if not provided
    if (!data.joinDate) {
      data.joinDate = new Date().toISOString().split('T')[0];
    }
    
    // Set default values
    if (!data.role) data.role = 'customer';
    if (!data.status) data.status = 'active';
    if (!data.orders) data.orders = 0;
    
    const user = await UserService.create(data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
