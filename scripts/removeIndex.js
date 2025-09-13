const { MongoClient } = require('mongodb');
require('dotenv').config();

async function removeIndex() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    // List all indexes
    const indexes = await db.collection('reviews').indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));
    
    // Remove the unique index
    await db.collection('reviews').dropIndex('userId_1_restaurantId_1');
    console.log('Successfully removed unique index');
    
    // Verify indexes after removal
    const updatedIndexes = await db.collection('reviews').indexes();
    console.log('Updated indexes:', JSON.stringify(updatedIndexes, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

removeIndex();
