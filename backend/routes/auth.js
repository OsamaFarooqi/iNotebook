const express = require("express");
const router = express.Router();
const User = require("../modules/User");

// Create a user using: POST "/api/auth". Doesn't required Auth
router.post("/", (req, res) => {
  console.log(req.body);
  const user = User(req.body);
  user.save();
  res.json(req.body);
});

module.exports = router;
