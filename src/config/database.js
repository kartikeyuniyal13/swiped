require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        
        await mongoose.connect(process.env.Mongodb_URI, {
            useNewUrlParser: true,
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDb;