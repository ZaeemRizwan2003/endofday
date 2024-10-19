import mongoose from 'mongoose';

let isConnected = false; // Track connection status

const dbConnect = async () => {
    if (isConnected) {
        // If already connected, do nothing
        console.log('Using existing database connection');
        return;
    }

    // Establish new connection if not already connected
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = db.connections[0].readyState === 1; // 1 means connected
        console.log('New database connection established');
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error; // Ensure that any errors during connection are still handled
    }
};

export default dbConnect;
