import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    if (!connectionString) {
      throw new Error("No connection string found");
    }

    await mongoose.connect(connectionString);
    console.log("Connected to the Database");
  } catch (error) {
    console.log(error);
    console.log("Error connecting to the Database");
  }
};