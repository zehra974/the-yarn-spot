const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
const fs = require("fs");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/AdminRoutes");

const app = express();

// =====================================================
// CHECK ENV VARIABLES
// =====================================================

console.log(
  "EMAIL_USER exists:",
  !!process.env.EMAIL_USER
);

console.log(
  "EMAIL_PASS exists:",
  !!process.env.EMAIL_PASS
);

console.log(
  "MONGO_URI exists:",
  !!process.env.MONGO_URI
);

// =====================================================
// CREATE UPLOADS FOLDER
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
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

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

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message:
      "The Yarn Spot Backend is running!",
  });
});
app.use(
  "/api/admin",
  adminRoutes
);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "SERVER ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Something went wrong",
    });
  }
);

// =====================================================
// CHECK REQUIRED ENV VARIABLES
// =====================================================

if (!process.env.MONGO_URI) {
  console.error(
    "ERROR: MONGO_URI is missing from .env"
  );
}

if (!process.env.EMAIL_USER) {
  console.error(
    "ERROR: EMAIL_USER is missing from .env"
  );
}

if (!process.env.EMAIL_PASS) {
  console.error(
    "ERROR: EMAIL_PASS is missing from .env"
  );
}

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    const PORT =
      process.env.PORT || 8000;

    app.listen(PORT, "0.0.0.0", () =>  {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });