const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();   

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", require("./routes/authRoutes"));

    app.listen(process.env.PORT, () =>
      console.log(`Server running on ${process.env.PORT}`)
    );
  } catch (error) {
    console.error(" SERVER START ERROR:", error);
  }
};

startServer();