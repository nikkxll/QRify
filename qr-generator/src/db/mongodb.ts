import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectToDb() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    
    return await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}