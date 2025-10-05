import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_DB_URI;
    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
};

export default connectToMongoDB;
