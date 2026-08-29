const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productcontroller");

const upload =
  require("../middleware/upload");

// =====================================================
// GET ALL PRODUCTS
// =====================================================

router.get(
  "/",
  getProducts
);

// =====================================================
// GET SINGLE PRODUCT
// =====================================================

router.get(
  "/:id",
  getProductById
);

// =====================================================
// CREATE PRODUCT
// =====================================================

router.post(
  "/",
  upload.single("image"),
  createProduct
);

// =====================================================
// UPDATE PRODUCT
// =====================================================

router.put(
  "/:id",
  upload.single("image"),
  updateProduct
);

// =====================================================
// DELETE PRODUCT
// =====================================================

router.delete(
  "/:id",
  deleteProduct
);

module.exports = router;
