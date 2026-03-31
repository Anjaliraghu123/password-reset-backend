const express = require("express");
const router = express.Router();

// TEMP test controller
router.post("/forgot", (req, res) => {
  res.json({ msg: "Forgot route working ✅" });
});

module.exports = router;