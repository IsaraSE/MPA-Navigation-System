import mongoose from 'mongoose';

export default async function connectDB() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MongoDB URI is not defined in environment variables");
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log("MongoDB connected");
}
