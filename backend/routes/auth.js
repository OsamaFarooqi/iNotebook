const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../modules/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRECT = "JDH#&*DH";

// Create a user using: POST "/api/auth/createuser". Doesn't required Auth
router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = await validationResult(req);
    // cheack if there is any error, return with 400 response code and error messages in json formate.
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      // Check if email already registered, then return with status code 400
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).send({ error: "Email already registered!" });
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });
      console.log(securePassword);

      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRECT);

      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

module.exports = router;
