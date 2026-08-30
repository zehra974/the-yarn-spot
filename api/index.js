const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("../backend/Routes/productRoutes");
const orderRoutes = require("../backend/Routes/orderRoutes");
const adminRoutes = require("../backend/Routes/AdminRoutes");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
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
// TEST
// =====================================================

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "The Yarn Spot API is running!",
  });
});

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  res.status(500).json({
    success: false,
    message:
      error.message ||
      "Something went wrong",
  });
});

// =====================================================
// MONGODB
// =====================================================

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  cachedConnection =
    await mongoose.connect(
      process.env.MONGO_URI
    );

  console.log(
    "MongoDB connected successfully"
  );

  return cachedConnection;
}

// =====================================================
// VERCEL HANDLER
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
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};