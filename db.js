// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // ✅ Load .env variables before anything else

const mongoURI = process.env.MONGO_URI;

// Optional debug log
console.log("🔌 Connecting to MongoDB URI:", mongoURI);

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit if connection fails
  }
};

module.exports = connectToMongo;
