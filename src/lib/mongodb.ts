import { MongoClient, MongoClientOptions, Db, Document, ServerApiVersion } from 'mongodb';

// Only allow this module to be imported on the server side
if (typeof window !== 'undefined') {
  throw new Error('This module should only be imported on the server side');
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'soucey';

// In development mode, use a global variable to preserve the connection across hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

const options: MongoClientOptions = {
  // Basic connection settings
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000,
  
  // SSL/TLS settings for MongoDB Atlas
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV !== 'production',
  
  // Retry settings
  retryWrites: true,
  w: 'majority'
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(dbName);
  return { client, db };
}
const dbPromise = clientPromise.then(client => client.db(dbName));

export { clientPromise, dbPromise };

// Helper function to get a database instance
export async function getDb(): Promise<Db> {
  return dbPromise;
}

// Helper function to get a collection
export async function getCollection<T extends Document>(collectionName: string) {
  const db = await getDb();
  return db.collection<T>(collectionName);
}

// Helper function to disconnect from the database
export async function disconnectFromDatabase() {
  try {
    const client = await clientPromise;
    if (client) {
      await client.close();
      console.log('MongoDB disconnected');
    }
  } catch (e) {
    console.error('Error disconnecting from MongoDB:', e);
  }
}

// This prevents the MongoDB client from being imported on the client side
if (typeof window !== 'undefined') {
  throw new Error('MongoDB client should not be imported in the browser');
}
