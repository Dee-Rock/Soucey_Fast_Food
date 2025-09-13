const mongoose = require('mongoose');
const dbConnect = require('../src/lib/dbConnect');

async function removeUniqueIndex() {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    
    // Drop the unique index
    await db.collection('reviews').dropIndex('userId_1_restaurantId_1');
    
    console.log('Successfully removed unique index');
    process.exit(0);
  } catch (error) {
    console.error('Error removing unique index:', error);
    process.exit(1);
  }
}

removeUniqueIndex();
