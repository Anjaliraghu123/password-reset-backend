
const nodemailer = require("nodemailer");

const sendEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: email,
    subject: "Password Reset",
    html: `<a href="${link}">Reset Password</a>`
  });
};

module.exports = sendEmail;