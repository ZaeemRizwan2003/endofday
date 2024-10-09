import mongoose from 'mongoose';

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    console.log('Connecting to database with URI:', uri); // Log to verify

    return mongoose.connect(uri, {
        dbName: 'endofday'
    });
};

export default dbConnect;
