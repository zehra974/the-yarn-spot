const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // =====================================================
    // CUSTOMER INFORMATION
    // =====================================================

    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      notes: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // =====================================================
    // ORDER ITEMS
    // =====================================================

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        image: {
          type: String,
          default: "",
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // =====================================================
    // ORDER TOTAL
    // =====================================================

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // =====================================================
    // PAYMENT INFORMATION
    // =====================================================

    payment: {
      type: {
        type: String,
        enum: ["Advance", "Full"],
        default: "Advance",
      },

      amount: {
        type: Number,
        default: 0,
        min: 0,
      },

      remainingAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      method: {
        type: String,
        enum: [
          "Easypaisa",
          "JazzCash",
          "Cash on Delivery",
          "Other",
        ],
        default: "Easypaisa",
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Paid",
          "Partially Paid",
          "Failed",
        ],
        default: "Pending",
      },

      transactionId: {
        type: String,
        default: "",
        trim: true,
      },

      paymentDate: {
        type: Date,
        default: null,
      },
    },

    // =====================================================
    // ORDER STATUS
    // =====================================================

    status: {
      type: String,

      enum: [
        "Pending Payment",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],

      default: "Pending Payment",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);