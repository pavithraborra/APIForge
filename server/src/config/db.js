const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Support both Render/Atlas (MONGODB_URI) and local dev (MONGO_URI)
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error('No MongoDB URI found. Set MONGODB_URI or MONGO_URI in environment.');
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
