// controllers/authController.js

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../untils/sendEmail");


// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const link = `${process.env.CLIENT_URL}/reset/${token}`;

  await sendEmail(email, link);

  res.json({ msg: "Email sent" });
};

// VERIFY TOKEN
exports.verifyToken = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired" });

  res.json({ msg: "Valid token" });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired" });

  const hashed = await bcrypt.hash(password, 10);

  user.password = hashed;
  user.resetToken = null;
  user.resetTokenExpire = null;

  await user.save();

  res.json({ msg: "Password updated" });
};
