import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

// Install uuid with: pnpm add uuid @types/uuid

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Generate a unique filename with original extension
    const filename = `${uuidv4()}-${file.name}`;
    
    // Upload to Vercel Blob Storage
    const { url } = await put(filename, file, {
      access: 'public',
    });
    
    return NextResponse.json({ 
      url,
      success: true 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
