// MongoDB connection configuration using Mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB Atlas cluster
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Exit process with failure if DB connection fails
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
