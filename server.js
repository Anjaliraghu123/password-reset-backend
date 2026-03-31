require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI) // removed old options
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});