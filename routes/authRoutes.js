const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, verifyToken, resetPassword } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.get("/verify/:token", verifyToken);
router.post("/reset/:token", resetPassword);

module.exports = router;