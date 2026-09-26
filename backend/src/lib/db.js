import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn(
        "⚠️ Warning: MONGO_URL / MONGODB_URI is not defined in environment variables or .env file!",
      );
      return;
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`Database connected successfully: ${conn.connection.host}`);
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};
