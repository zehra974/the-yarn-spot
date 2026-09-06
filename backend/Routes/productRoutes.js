// // const express = require("express");

// // const router = express.Router();

// // const {
// //   getProducts,
// //   getProductById,
// //   createProduct,
// //   updateProduct,
// //   deleteProduct,
// // } = require("../controllers/productcontroller");

// // const upload =
// //   require("../middleware/upload");

// // // =====================================================
// // // GET ALL PRODUCTS
// // // =====================================================

// // router.get(
// //   "/",
// //   getProducts
// // );

// // // =====================================================
// // // GET SINGLE PRODUCT
// // // =====================================================

// // router.get(
// //   "/:id",
// //   getProductById
// // );

// // // =====================================================
// // // CREATE PRODUCT
// // // =====================================================

// // router.post(
// //   "/",
// //   upload.single("image"),
// //   createProduct
// // );

// // // =====================================================
// // // UPDATE PRODUCT
// // // =====================================================

// // router.put(
// //   "/:id",
// //   upload.single("image"),
// //   updateProduct
// // );

// // // =====================================================
// // // DELETE PRODUCT
// // // =====================================================

// // router.delete(
// //   "/:id",
// //   deleteProduct
// // );

// // module.exports = router;




// // const jwt = require("jsonwebtoken");

// // const adminAuth = (req, res, next) => {
// //   try {
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //       return res.status(401).json({
// //         message: "Admin authentication required.",
// //       });
// //     }

// //     const token = authHeader.split(" ")[1];

// //     const decoded = jwt.verify(
// //       token,
// //       process.env.JWT_SECRET
// //     );

// //     if (decoded.role !== "admin") {
// //       return res.status(403).json({
// //         message: "Admin access denied.",
// //       });
// //     }

// //     req.admin = decoded;

// //     next();
// //   } catch (error) {
// //     console.error("ADMIN AUTH ERROR:", error);

// //     return res.status(401).json({
// //       message: "Invalid or expired admin token.",
// //     });
// //   }
// // };

// // module.exports = adminAuth;




// const express = require("express");

// const router = express.Router();

// const {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/productcontroller");

// const upload = require("../middleware/upload");
// const adminAuth = require("../middleware/adminAuth");

// // =====================================================
// // GET ALL PRODUCTS
// // PUBLIC
// // =====================================================

// router.get(
//   "/",
//   getProducts
// );

// // =====================================================
// // GET SINGLE PRODUCT
// // PUBLIC
// // =====================================================

// router.get(
//   "/:id",
//   getProductById
// );

// // =====================================================
// // CREATE PRODUCT
// // ADMIN ONLY
// // =====================================================

// router.post(
//   "/",
//   adminAuth,
//   upload.single("image"),
//   createProduct
// );

// // =====================================================
// // UPDATE PRODUCT
// // ADMIN ONLY
// // =====================================================

// router.put(
//   "/:id",
//   adminAuth,
//   upload.single("image"),
//   updateProduct
// );

// // =====================================================
// // DELETE PRODUCT
// // ADMIN ONLY
// // =====================================================

// router.delete(
//   "/:id",
//   adminAuth,
//   deleteProduct
// );

// module.exports = router;


const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productcontroller");

const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth");

// =====================================================
// GET ALL PRODUCTS
// PUBLIC
// =====================================================

router.get(
  "/",
  getProducts
);

// =====================================================
// GET SINGLE PRODUCT
// PUBLIC
// =====================================================

router.get(
  "/:id",
  getProductById
);

// =====================================================
// CREATE PRODUCT
// ADMIN ONLY
// =====================================================

router.post(
  "/",
  adminAuth,
  upload.single("image"),
  createProduct
);

// =====================================================
// UPDATE PRODUCT
// ADMIN ONLY
// =====================================================

router.put(
  "/:id",
  adminAuth,
  upload.single("image"),
  updateProduct
);

// =====================================================
// DELETE PRODUCT
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  adminAuth,
  deleteProduct
);

module.exports = router;