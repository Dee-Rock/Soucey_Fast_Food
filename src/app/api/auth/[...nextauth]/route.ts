import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

// This is the new way to configure route handlers in Next.js 14.1.0+
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  return NextResponse.json({ success: true, userId });
}

