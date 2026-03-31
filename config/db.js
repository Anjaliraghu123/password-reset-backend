const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(" Connecting to DB...");
    console.log("URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log(" MongoDB Connected");
  } catch (error) {
    console.error(" DB ERROR FULL:");
    console.error(error);   // 👈 THIS WILL SHOW REAL ISSUE
    throw error;
  }
};

module.exports = connectDB;