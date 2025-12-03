import 'dotenv/config';
import { MONGODB_URI } from "@/config/config.js";
import mongoose from "mongoose";

mongoose.set('strictQuery', false);

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const _db = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      console.warn("MONGODB_URI is missing from .env file");
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default _db;
