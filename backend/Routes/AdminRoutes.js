const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const Admin = require("../models/Admin");

const router = express.Router();

// =====================================================
// EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
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

    return res.status(200).json({
      message: "Admin login successful.",
      token,

      admin: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error during login.",
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
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    // Do not reveal whether the email exists.
    if (!admin) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate secure reset token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Store only hashed token in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordToken = hashedToken;

    // Token expires after 15 minutes
    admin.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await admin.save();

    // Frontend URL
    const frontendURL =
      process.env.FRONTEND_URL ||
      "https://the-yarn-spot.com";

    const resetURL =
      `${frontendURL}/admin/reset-password/${resetToken}`;

    // Send reset email
    await transporter.sendMail({
      from: `"The Yarn Spot" <${process.env.EMAIL_USER}>`,
      to: admin.email,

      subject:
        "The Yarn Spot - Reset Your Admin Password",

      html: `
        <!DOCTYPE html>

        <html>
          <body
            style="
              margin: 0;
              padding: 0;
              background: #f7f1e3;
              font-family: Arial, sans-serif;
            "
          >

            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
              "
            >

              <div
                style="
                  background: #ffffff;
                  padding: 40px 30px;
                  border-radius: 24px;
                  text-align: center;
                "
              >

                <p
                  style="
                    margin: 0 0 10px;
                    color: #8b6914;
                    font-size: 12px;
                    letter-spacing: 4px;
                    text-transform: uppercase;
                  "
                >
                  The Yarn Spot
                </p>

                <h1
                  style="
                    margin: 0 0 20px;
                    color: #111111;
                    font-size: 28px;
                  "
                >
                  Password Reset
                </h1>

                <p
                  style="
                    color: #555555;
                    line-height: 1.6;
                    font-size: 15px;
                  "
                >
                  We received a request to reset
                  your admin password.
                </p>

                <p
                  style="
                    color: #555555;
                    line-height: 1.6;
                    font-size: 15px;
                  "
                >
                  Click the button below to create
                  a new password.
                </p>

                <div style="margin: 30px 0;">

                  <a
                    href="${resetURL}"
                    style="
                      display: inline-block;
                      background: #000000;
                      color: #ffffff;
                      padding: 15px 28px;
                      border-radius: 30px;
                      text-decoration: none;
                      font-weight: bold;
                    "
                  >
                    Reset Password
                  </a>

                </div>

                <p
                  style="
                    color: #777777;
                    font-size: 13px;
                    line-height: 1.5;
                  "
                >
                  This password reset link will
                  expire in 15 minutes.
                </p>

                <p
                  style="
                    color: #777777;
                    font-size: 13px;
                    line-height: 1.5;
                  "
                >
                  If you did not request this reset,
                  you can safely ignore this email.
                </p>

              </div>

            </div>

          </body>
        </html>
      `,
    });

    return res.status(200).json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to process password reset request.",
    });
  }
});

// =====================================================
// RESET PASSWORD
// =====================================================

router.post(
  "/reset-password/:token",
  async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!token) {
        return res.status(400).json({
          message: "Reset token is missing.",
        });
      }

      if (!password) {
        return res.status(400).json({
          message: "New password is required.",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters.",
        });
      }

      // Hash token before checking database
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const admin = await Admin.findOne({
        resetPasswordToken: hashedToken,

        resetPasswordExpires: {
          $gt: Date.now(),
        },
      });

      if (!admin) {
        return res.status(400).json({
          message:
            "Reset link is invalid or has expired.",
        });
      }

      // Hash new password
      const hashedPassword =
        await bcrypt.hash(password, 12);

      admin.password = hashedPassword;

      // Invalidate reset token
      admin.resetPasswordToken = null;
      admin.resetPasswordExpires = null;

      await admin.save();

      return res.status(200).json({
        message:
          "Password reset successful. You can now log in.",
      });
    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error while resetting password.",
      });
    }
  }
);

// =====================================================
// CHANGE PASSWORD
// =====================================================

router.post(
  "/change-password",
  async (req, res) => {
    try {
      const authHeader =
        req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          message:
            "Authentication required.",
        });
      }

      const parts =
        authHeader.split(" ");

      if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
      ) {
        return res.status(401).json({
          message:
            "Invalid authentication format.",
        });
      }

      const token = parts[1];

      // Verify JWT
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const admin = await Admin.findById(
        decoded.id
      );

      if (!admin) {
        return res.status(404).json({
          message: "Admin not found.",
        });
      }

      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            "Current password and new password are required.",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          message:
            "New password must be at least 8 characters.",
        });
      }

      // Check current password
      const passwordMatch =
        await bcrypt.compare(
          currentPassword,
          admin.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Current password is incorrect.",
        });
      }

      // Hash new password
      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          12
        );

      admin.password = hashedPassword;

      await admin.save();

      return res.status(200).json({
        message:
          "Password changed successfully.",
      });
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      if (
        error.name ===
        "TokenExpiredError"
      ) {
        return res.status(401).json({
          message:
            "Your session has expired. Please log in again.",
        });
      }

      if (
        error.name ===
        "JsonWebTokenError"
      ) {
        return res.status(401).json({
          message:
            "Invalid authentication token.",
        });
      }

      return res.status(500).json({
        message:
          "Server error while changing password.",
      });
    }
  }
);

module.exports = router;
