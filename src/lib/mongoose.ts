import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Initialize the cache if it doesn't exist
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

const { mongooseCache } = global;

async function connectDB(): Promise<typeof mongoose> {
  if (mongooseCache?.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache) {
    throw new Error('Mongoose cache not initialized');
  }

  if (!mongooseCache?.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    };

    if (mongooseCache) {
      mongooseCache.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongooseInstance) => {
          console.log('MongoDB connected successfully');
          return mongooseInstance;
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          throw error;
        });
    }
  }

  try {
    mongooseCache.conn = await mongooseCache.promise!;
    return mongooseCache.conn;
  } catch (e) {
    mongooseCache.promise = null;
    throw e;
  }
}

export default connectDB;
