const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Check admin credentials
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error during login",
    });
  }
});

module.exports = router;