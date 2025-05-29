import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MongoError } from 'mongodb';

export async function GET() {
  const startTime = Date.now();
  let connectionTime = 0;
  
  try {
    // Test the database connection
    const connectStart = Date.now();
    const { client, db } = await connectToDatabase();
    connectionTime = Date.now() - connectStart;
    
    // Test a simple query
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get server info
    const serverInfo = await db.command({ buildInfo: 1 });
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      database: db.databaseName,
      connectionTime: `${connectionTime}ms`,
      totalTime: `${Date.now() - startTime}ms`,
      collections: collectionNames,
      server: {
        version: serverInfo.version,
        gitVersion: serverInfo.gitVersion,
        storageEngine: serverInfo.storageEngine?.name
      }
    });
    
  } catch (error: unknown) {
    console.error('MongoDB connection error:', error);
    
    // Type guard to check if error is a MongoError
    const isMongoError = (error: any): error is MongoError & { code?: number; codeName?: string } => {
      return error && typeof error === 'object' && 'name' in error && 'message' in error;
    };
    
    // More detailed error information
    const errorInfo = {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: isMongoError(error) ? error.name : 'Error',
      code: isMongoError(error) ? error.code : undefined,
      codeName: isMongoError(error) ? error.codeName : undefined,
      connectionAttempt: connectionTime > 0 ? 'Connected but query failed' : 'Connection failed',
      connectionTime: connectionTime > 0 ? `${connectionTime}ms` : 'N/A',
      totalTime: `${Date.now() - startTime}ms`
    };
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to MongoDB',
        details: errorInfo
      },
      { status: 500 }
    );
  }
}
