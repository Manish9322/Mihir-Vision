import 'dotenv/config';
import { MONGODB_URI } from "@/config/config.js";
import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const _db = async () => {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is missing from .env file");
    return null;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI);
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default _db;
