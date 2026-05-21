const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to legal_case_db");
    } catch (err) {
        console.error("❌ Connection failed", err.message);
    }
};

module.exports = connectDB;