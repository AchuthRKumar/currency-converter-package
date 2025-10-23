import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('FATAL ERROR: MONGO_URI is not defined in the .env file.');
      process.exit(1); 
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); 
  }
};

export default connectDB;