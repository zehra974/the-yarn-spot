// const express = require("express");
// const jwt = require("jsonwebtoken");

// const router = express.Router();

// // =====================================================
// // ADMIN LOGIN
// // =====================================================

// router.post("/login", (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if email and password were provided
//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password are required",
//       });
//     }

//     // Check admin credentials
//     if (
//       email !== process.env.ADMIN_EMAIL ||
//       password !== process.env.ADMIN_PASSWORD
//     ) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//       });
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       {
//         email: process.env.ADMIN_EMAIL,
//         role: "admin",
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );

//     res.status(200).json({
//       message: "Admin login successful",
//       token,
//       admin: {
//         email: process.env.ADMIN_EMAIL,
//         role: "admin",
//       },
//     });
//   } catch (error) {
//     console.error("ADMIN LOGIN ERROR:", error);

//     res.status(500).json({
//       message: "Server error during login",
//     });
//   }
// });

// module.exports = router;






// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// const Admin = require("../models/Admin");

// const router = express.Router();

// // =====================================================
// // ADMIN LOGIN
// // =====================================================

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if email and password were provided
//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password are required",
//       });
//     }

//     // Find admin by email
//     const admin = await Admin.findOne({
//       email: email.toLowerCase().trim(),
//     });

//     if (!admin) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//       });
//     }

//     // Compare entered password with hashed password
//     const isPasswordValid = await bcrypt.compare(
//       password,
//       admin.password
//     );

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//       });
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       {
//         id: admin._id,
//         email: admin.email,
//         role: "admin",
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );

//     res.status(200).json({
//       message: "Admin login successful",
//       token,
//       admin: {
//         id: admin._id,
//         email: admin.email,
//         role: "admin",
//       },
//     });
//   } catch (error) {
//     console.error("ADMIN LOGIN ERROR:", error);

//     res.status(500).json({
//       message: "Server error during login",
//     });
//   }
// });

// module.exports = router;



const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const Admin = require("../models/Admin");

const router = express.Router();

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
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
        id: admin._id,
        email: admin.email,
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

// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    // Do not reveal whether an admin email exists
    if (!admin) {
      return res.status(200).json({
        message:
          "If an admin account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expires after 15 minutes
    const resetTokenExpiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = resetTokenExpiry;

    await admin.save();

    // Frontend reset page
    const frontendURL =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetLink =
      `${frontendURL}/admin/reset-password?token=${resetToken}`;

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "The Yarn Spot - Admin Password Reset",
      text: `You requested a password reset for The Yarn Spot admin account.

Reset your password using this link:

${resetLink}

This link will expire in 15 minutes.

If you did not request this reset, you can safely ignore this email.`,
    });

    return res.status(200).json({
      message:
        "If an admin account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Unable to process password reset request",
    });
  }
});

// =====================================================
// RESET PASSWORD
// =====================================================

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Reset token and new password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!admin) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    admin.password = hashedPassword;

    // Invalidate reset token after successful reset
    admin.resetPasswordToken = null;
    admin.resetPasswordExpires = null;

    await admin.save();

    return res.status(200).json({
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Unable to reset password",
    });
  }
});

module.exports = router;



