
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  resetToken: String,
  resetTokenExpire: Date
});

module.exports = mongoose.model("User", userSchema);