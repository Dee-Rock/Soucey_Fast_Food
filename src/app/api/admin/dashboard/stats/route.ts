import { NextResponse } from 'next/server';
import { fetchDashboardStats } from '@/lib/admin-mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await fetchDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
