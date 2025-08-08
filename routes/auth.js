// Import necessary modules
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * ROUTE 1: Create a new user using: POST "/api/auth/createuser"
 * No login required
 */
router.post(
  "/createuser",
  [
    // Validations for request body fields
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
    body("email", "Invalid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      // Validate the incoming request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if user already exists in the database
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, error: "User already exists" });
      }

      // Hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      // Create a new user in the database
      user = await User.create({
        name,
        email,
        password: secPass,
      });

      // Prepare payload for JWT token
      const data = { user: { id: user.id } };

      // Sign the JWT token
      const authToken = jwt.sign(data, JWT_SECRET);

      // Send back the auth token
      res.json({ success: true, authToken });
    } catch (error) {
      console.error("❌ Error in /createuser:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

/**
 * ROUTE 2: Authenticate a user using: POST "/api/auth/login"
 * No login required
 */
router.post(
  '/login',
  [
    // Validation for login credentials
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    let success = false;

    // Check validation result
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success, errors: errors.array() });

    const { email, password } = req.body;

    try {
      // Check if user exists with the given email
      let user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ success, error: "Invalid Credentials" });

      // Compare the entered password with the hashed password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare)
        return res.status(400).json({ success, error: "Invalid Credentials" });

      // Generate JWT token with user payload
      const payload = { user: { id: user.id } };
      const authToken = jwt.sign(payload, JWT_SECRET);
      success = true;

      // Send the token back
      res.json({ success, authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

/**
 * ROUTE 3: Get logged-in user's details using: POST "/api/auth/getuser"
 * Login required
 */
router.post('/getuser', fetchUser, async (req, res) => {
  try {
    // Use the user ID extracted by fetchUser middleware
    const userId = req.user.id;

    // Fetch user details from database, excluding password
    const user = await User.findById(userId).select("-password");

    // Send back the user details
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the router to be used in app.js
module.exports = router;
