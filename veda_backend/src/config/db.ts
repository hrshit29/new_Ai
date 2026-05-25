import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

export async function connectDB(retries = MAX_RETRIES): Promise<void> {
  try {
    mongoose.connection.on('connected', () =>
      console.log('✅ MongoDB connected')
    );
    mongoose.connection.on('error', (err) =>
      console.error('❌ MongoDB error:', err)
    );
    mongoose.connection.on('disconnected', () =>
      console.warn('⚠️  MongoDB disconnected, retrying...')
    );

    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    if (retries > 0) {
      console.log(`🔄 MongoDB retry in ${RETRY_DELAY / 1000}s... (${retries} left)`);
      await new Promise((res) => setTimeout(res, RETRY_DELAY));
      return connectDB(retries - 1);
    }
    console.error('❌ MongoDB connection failed after max retries');
    throw error;
  }
}