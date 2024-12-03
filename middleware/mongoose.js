import mongoose from "mongoose";

let isConnected = false; // Track connection status

const dbConnect = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return mongoose.connection.db; // Return the existing database instance
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1; // 1 means connected
    console.log("New database connection established");
    return mongoose.connection.db; // Return the database instance
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error; // Ensure errors are propagated
  }
};

export default dbConnect;
