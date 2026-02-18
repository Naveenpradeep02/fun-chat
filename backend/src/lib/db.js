import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`db connected ${conn.connection.host}`);
    console.log("ENV MONGO_URL:", process.env.MONGO_URL);
  } catch (err) {
    console.log(err.message + "db not connected");
  }
};
