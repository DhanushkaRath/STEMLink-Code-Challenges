import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const connectionString = process.env.MONGODB_URI;
        await mongoose.connect(connectionString);
        console.log("Connected to the Database");
    } catch (error) {
        console.log(error);
        console.log("Error connecting to the Database");
    }
};