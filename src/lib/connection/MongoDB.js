import mongoose from "mongoose";

// Safely encode credentials in case they contain special characters
const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASS);
const dbName = "EntryCode";

// MongoDB connection URL
const url = `mongodb+srv://${username}:${password}@ty-n.4mvmvpi.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=TY-N`;

export const CONNECT_DATABASE = async () => {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        console.log("Already connected or connecting to MongoDB");
        return;
    }

    try {
        await mongoose.connect(url);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
    }
};


export const DISCONNECT_DATABASE = async () => {
    if (mongoose.connection.readyState === 0) {
        console.log("Already disconnected from MongoDB");
        return;
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.")
}
