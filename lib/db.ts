import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
}

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("✅ MongoDB is already connected.");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("🚀 MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit process on failure
    }
};

// Optional: Disconnect function for cleanup
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("🔌 MongoDB Disconnected Successfully.");
    } catch (error) {
        console.error("❌ MongoDB Disconnection Error:", error);
    }
};
