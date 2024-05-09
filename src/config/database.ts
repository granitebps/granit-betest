import mongoose from 'mongoose';
import { env } from './env';

export const connectDb = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to database');
};
