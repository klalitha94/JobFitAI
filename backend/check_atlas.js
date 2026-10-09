import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function checkAtlas() {
  console.log('Testing Atlas URI:', process.env.MONGODB_URI?.replace(/:([^:@]{4})[^:@]*@/, ':****@'));
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('CONNECTED_SUCCESSFULLY to database:', mongoose.connection.name);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in Atlas:', collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error('CONNECTION_FAILED:', err.message);
    process.exit(1);
  }
}

checkAtlas();
