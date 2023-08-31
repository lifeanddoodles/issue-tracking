import dotenv from "dotenv";
import mongoose from "mongoose";
import { getErrorMessage } from "../../shared/utils/index.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
};

export default connectDB;
