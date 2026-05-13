import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import User from "../models/User.js";

const router = express.Router();


// ================= REGISTER =================

router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration Successful",
    });

  } catch (error) {

    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// ================= LOGIN =================

router.post("/login", async (req, res) => {

  try {

    console.log("BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    console.log("USER:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      message: "Login Successful",
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// ================= FORGOT PASSWORD =================

router.post("/forgot-password", async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token =
      crypto.randomBytes(32).toString("hex");

    user.resetToken = token;

    user.resetTokenExpiry =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetURL =
      `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset</h2>

        <p>Click below link to reset password</p>

        <a href="${resetURL}">
          Reset Password
        </a>
      `,
    });

    res.json({
      message: "Reset link sent to email",
    });

  } catch (error) {

    console.log("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// ================= VERIFY TOKEN =================

router.get("/verify-token/:token", async (req, res) => {

  try {

    const user = await User.findOne({
      resetToken: req.params.token,

      resetTokenExpiry: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    res.json({
      message: "Token valid",
    });

  } catch (error) {

    console.log("VERIFY TOKEN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// ================= RESET PASSWORD =================

router.post("/reset-password/:token", async (req, res) => {

  try {

    const user = await User.findOne({
      resetToken: req.params.token,

      resetTokenExpiry: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    const hashedPassword =
      await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {

    console.log("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


export default router;