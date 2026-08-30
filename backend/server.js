const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
const fs = require("fs");

const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const adminRoutes = require("./Routes/AdminRoutes");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// UPLOADS FOLDER
// =====================================================

const uploadsFolder = path.join(
  __dirname,
  "uploads"
);

if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, {
    recursive: true,
  });
}

// =====================================================
// SERVE UPLOADED IMAGES
// =====================================================

app.use(
  "/uploads",
  express.static(uploadsFolder)
);

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "The Yarn Spot Backend is running!",
  });
});

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  res.status(500).json({
    message:
      error.message ||
      "Something went wrong",
  });
});

// =====================================================
// MONGODB CONNECTION
// =====================================================

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(
    process.env.MONGO_URI
  );

  isConnected = true;

  console.log(
    "MongoDB connected successfully"
  );
}

// =====================================================
// VERCEL SERVERLESS HANDLER
// =====================================================

module.exports = async (req, res) => {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error(
      "DATABASE / SERVER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};``