const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/ordercontroller");

// =====================================================
// CREATE ORDER
// POST /api/orders
// =====================================================

router.post("/", createOrder);

// =====================================================
// GET ALL ORDERS
// GET /api/orders
// =====================================================

router.get("/", getOrders);

// =====================================================
// GET SINGLE ORDER
// GET /api/orders/:id
// =====================================================

router.get("/:id", getOrderById);

// =====================================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// =====================================================

router.put("/:id/status", updateOrderStatus);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;