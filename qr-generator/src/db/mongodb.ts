import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectToDb() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}