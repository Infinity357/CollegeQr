const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://infinity:kanpur123@cluster0.affj45y.mongodb.net/SmartCampus?retryWrites=true&w=majority';

let isConnected = false;

const dbConnect = async () => {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};

module.exports = dbConnect;
