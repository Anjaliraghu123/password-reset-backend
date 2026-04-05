// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: "Password Reset Link",
    text,
  });
};

module.exports = sendEmail; 