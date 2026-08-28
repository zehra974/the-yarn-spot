const Order = require("../models/Order");
const nodemailer = require("nodemailer");

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
// EMAIL CONFIGURATION CHECK
// =====================================================

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn(
    "WARNING: EMAIL_USER or EMAIL_PASS is missing in .env"
  );
}

// =====================================================
// PAYMENT SETTINGS
// =====================================================

const ADVANCE_PERCENTAGE = 50;

// Owner payment number
const PAYMENT_NUMBER = "03451335590";

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      totalAmount,
      paymentType,
      paymentMethod,
      transactionId,
    } = req.body;

    // =================================================
    // CHECK CUSTOMER
    // =================================================

    if (
      !customer ||
      !customer.fullName ||
      !customer.phone ||
      !customer.email ||
      !customer.city ||
      !customer.address
    ) {
      return res.status(400).json({
        message: "Customer information is incomplete",
      });
    }

    // =================================================
    // CHECK ITEMS
    // =================================================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    // =================================================
    // CHECK TOTAL
    // =================================================

    const orderTotal = Number(totalAmount);

    if (
      !Number.isFinite(orderTotal) ||
      orderTotal <= 0
    ) {
      return res.status(400).json({
        message: "Valid total amount is required",
      });
    }

    // =================================================
    // PAYMENT TYPE
    // =================================================

    const selectedPaymentType =
      paymentType === "Full"
        ? "Full"
        : "Advance";

    // =================================================
    // PAYMENT AMOUNT
    // =================================================

    const paymentAmount =
      selectedPaymentType === "Full"
        ? orderTotal
        : Math.round(
            (orderTotal * ADVANCE_PERCENTAGE) / 100
          );

    // =================================================
    // REMAINING AMOUNT
    // =================================================

    const remainingAmount = Math.max(
      orderTotal - paymentAmount,
      0
    );

    // =================================================
    // PAYMENT METHOD
    // =================================================

    const allowedPaymentMethods = [
      "Easypaisa",
      "JazzCash",
      "Cash on Delivery",
      "Other",
    ];

    const selectedPaymentMethod =
      allowedPaymentMethods.includes(paymentMethod)
        ? paymentMethod
        : "Easypaisa";

    // =================================================
    // PREPARE CUSTOMER
    // =================================================

    const customerData = {
      fullName: customer.fullName.trim(),

      phone: customer.phone.trim(),

      email: customer.email
        .trim()
        .toLowerCase(),

      city: customer.city.trim(),

      address: customer.address.trim(),

      notes: customer.notes
        ? customer.notes.trim()
        : "",
    };

    // =================================================
    // PREPARE ITEMS
    // =================================================

    const orderItems = items.map((item) => ({
      ...(item.product
        ? {
            product: item.product,
          }
        : item._id
        ? {
            product: item._id,
          }
        : {}),

      name: item.name || "Product",

      price: Number(item.price || 0),

      image: item.image || "",

      quantity: Number(item.quantity || 1),
    }));

    // =================================================
    // CREATE ORDER
    // =================================================

    const order = await Order.create({
      customer: customerData,

      items: orderItems,

      totalAmount: orderTotal,

      payment: {
        type: selectedPaymentType,

        amount: paymentAmount,

        remainingAmount: remainingAmount,

        method: selectedPaymentMethod,

        status: "Pending",

        transactionId: transactionId
          ? transactionId.trim()
          : "",

        paymentDate: null,
      },

      status: "Pending Payment",
    });

    console.log(
      "===================================="
    );

    console.log(
      "Order saved successfully:",
      order._id.toString()
    );

    console.log(
      "Payment Type:",
      selectedPaymentType
    );

    console.log(
      "Payment Amount:",
      paymentAmount
    );

    console.log(
      "Remaining Amount:",
      remainingAmount
    );

    console.log(
      "Payment Method:",
      selectedPaymentMethod
    );

    console.log(
      "===================================="
    );

    // =================================================
    // ORDER ITEMS HTML
    // =================================================

    const orderItemsHTML = orderItems
      .map(
        (item) => `
          <tr>

            <td style="
              padding:12px;
              border-bottom:1px solid #ddd;
            ">
              ${item.name}
            </td>

            <td style="
              padding:12px;
              border-bottom:1px solid #ddd;
              text-align:center;
            ">
              ${item.quantity}
            </td>

            <td style="
              padding:12px;
              border-bottom:1px solid #ddd;
            ">
              Rs. ${Number(
                item.price
              ).toLocaleString()}
            </td>

            <td style="
              padding:12px;
              border-bottom:1px solid #ddd;
            ">
              Rs. ${(
                Number(item.price) *
                Number(item.quantity)
              ).toLocaleString()}
            </td>

          </tr>
        `
      )
      .join("");

    // =================================================
    // FORMATTED VALUES
    // =================================================

    const formattedTotal =
      orderTotal.toLocaleString();

    const formattedPayment =
      paymentAmount.toLocaleString();

    const formattedRemaining =
      remainingAmount.toLocaleString();

    // =================================================
    // OWNER EMAIL
    // =================================================

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: process.env.EMAIL_USER,

        subject: `New Order Received - ${customerData.fullName}`,

        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:700px;
            margin:auto;
            padding:20px;
            color:#171717;
          ">

            <div style="
              background:#000;
              color:white;
              padding:25px;
              border-radius:15px 15px 0 0;
            ">

              <h1 style="
                margin:0;
                color:#D4A017;
              ">
                THE YARN SPOT
              </h1>

              <p style="
                margin-top:10px;
                color:#ccc;
              ">
                New Order Received
              </p>

            </div>

            <div style="
              background:#F7F1E3;
              padding:30px;
            ">

              <h2>
                New Order Details
              </h2>

              <p>
                <strong>Order ID:</strong>
                ${order._id}
              </p>

              <p>
                <strong>Customer Name:</strong>
                ${customerData.fullName}
              </p>

              <p>
                <strong>Email:</strong>
                ${customerData.email}
              </p>

              <p>
                <strong>WhatsApp:</strong>
                ${customerData.phone}
              </p>

              <p>
                <strong>City:</strong>
                ${customerData.city}
              </p>

              <p>
                <strong>Address:</strong>
                ${customerData.address}
              </p>

              <p>
                <strong>Notes:</strong>
                ${
                  customerData.notes ||
                  "No special notes"
                }
              </p>

              <!-- PAYMENT -->

              <h2 style="margin-top:30px;">
                Payment Information
              </h2>

              <div style="
                background:white;
                padding:20px;
                border-radius:12px;
              ">

                <p>
                  <strong>Payment Type:</strong>
                  ${selectedPaymentType}
                </p>

                <p>
                  <strong>Payment Method:</strong>
                  ${selectedPaymentMethod}
                </p>

                <p>
                  <strong>Payment Number:</strong>
                  ${PAYMENT_NUMBER}
                </p>

                <p>
                  <strong>Amount to Pay:</strong>
                  Rs. ${formattedPayment}
                </p>

                <p>
                  <strong>Remaining:</strong>
                  Rs. ${formattedRemaining}
                </p>

                <p>
                  <strong>Payment Status:</strong>
                  Pending
                </p>

                <p>
                  <strong>Transaction ID:</strong>
                  ${
                    transactionId ||
                    "Not provided"
                  }
                </p>

              </div>

              <!-- ITEMS -->

              <h2 style="margin-top:30px;">
                Order Items
              </h2>

              <table
                width="100%"
                style="
                  border-collapse:collapse;
                  background:white;
                "
              >

                <thead>

                  <tr style="
                    background:#000;
                    color:#D4A017;
                  ">

                    <th style="padding:12px;text-align:left;">
                      Product
                    </th>

                    <th style="padding:12px;">
                      Qty
                    </th>

                    <th style="padding:12px;">
                      Price
                    </th>

                    <th style="padding:12px;">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>
                  ${orderItemsHTML}
                </tbody>

              </table>

              <!-- TOTAL -->

              <div style="
                margin-top:25px;
                padding:20px;
                background:#000;
                color:white;
                border-radius:12px;
              ">

                <h2 style="margin:0;">

                  Order Total:

                  <span style="
                    color:#D4A017;
                  ">
                    Rs. ${formattedTotal}
                  </span>

                </h2>

              </div>

              <p style="
                margin-top:25px;
                color:#777;
              ">

                Order Status:

                <strong>
                  Pending Payment
                </strong>

              </p>

            </div>

            <div style="
              padding:20px;
              text-align:center;
              color:#888;
              font-size:13px;
            ">

              Handmade crochet, made with love. 🧶

            </div>

          </div>
        `,
      });

      console.log(
        "Owner order email sent successfully"
      );

    } catch (emailError) {
      console.error(
        "Owner email sending error:",
        emailError
      );
    }

    // =================================================
    // CUSTOMER EMAIL
    // =================================================

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: customerData.email,

        subject:
          "The Yarn Spot - Order Received",

        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:650px;
            margin:auto;
            padding:20px;
            color:#171717;
          ">

            <div style="
              background:#000;
              color:white;
              padding:25px;
              border-radius:15px 15px 0 0;
            ">

              <h1 style="
                margin:0;
                color:#D4A017;
              ">
                THE YARN SPOT
              </h1>

              <p style="
                color:#ccc;
                margin-top:10px;
              ">
                Order Confirmation
              </p>

            </div>

            <div style="
              background:#F7F1E3;
              padding:30px;
            ">

              <h2>
                Hello ${customerData.fullName} 👋
              </h2>

              <p style="
                font-size:16px;
                line-height:1.7;
              ">

                Thank you for shopping with
                <strong>The Yarn Spot</strong>!

                Your order has been received
                successfully.

              </p>

              <!-- ORDER ID -->

              <div style="
                margin-top:20px;
                padding:15px;
                background:white;
                border-radius:12px;
              ">

                <p style="margin:0;">

                  <strong>
                    Order ID:
                  </strong>

                  ${order._id}

                </p>

              </div>

              <!-- PAYMENT SUMMARY -->

              <h2 style="margin-top:30px;">
                Payment Summary
              </h2>

              <div style="
                background:white;
                padding:20px;
                border-radius:12px;
              ">

                <p>
                  <strong>
                    Payment Type:
                  </strong>

                  ${selectedPaymentType}
                </p>

                <p>
                  <strong>
                    Payment Method:
                  </strong>

                  ${selectedPaymentMethod}
                </p>

                <p>
                  <strong>
                    Amount:
                  </strong>

                  Rs. ${formattedPayment}
                </p>

                <p>
                  <strong>
                    Remaining:
                  </strong>

                  Rs. ${formattedRemaining}
                </p>

                <p>
                  <strong>
                    Payment Status:
                  </strong>

                  Pending
                </p>

              </div>

              <!-- ITEMS -->

              <h2 style="
                margin-top:30px;
              ">
                Your Order
              </h2>

              <table
                width="100%"
                style="
                  border-collapse:collapse;
                  background:white;
                "
              >

                <thead>

                  <tr style="
                    background:#000;
                    color:#D4A017;
                  ">

                    <th style="
                      padding:12px;
                      text-align:left;
                    ">
                      Product
                    </th>

                    <th style="
                      padding:12px;
                    ">
                      Qty
                    </th>

                    <th style="
                      padding:12px;
                    ">
                      Price
                    </th>

                    <th style="
                      padding:12px;
                    ">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  ${orderItemsHTML}

                </tbody>

              </table>

              <!-- TOTAL -->

              <div style="
                margin-top:25px;
                padding:20px;
                background:#000;
                color:white;
                border-radius:12px;
              ">

                <h2 style="margin:0;">

                  Order Total:

                  <span style="
                    color:#D4A017;
                  ">
                    Rs. ${formattedTotal}
                  </span>

                </h2>

              </div>

              <!-- DELIVERY -->

              <div style="
                margin-top:25px;
                padding:18px;
                background:white;
                border-radius:12px;
              ">

                <p style="
                  margin:0 0 10px 0;
                ">

                  <strong>
                    Delivery City:
                  </strong>

                  ${customerData.city}

                </p>

                <p style="margin:0;">

                  <strong>
                    Delivery Address:
                  </strong>

                  ${customerData.address}

                </p>

              </div>

              <p style="
                margin-top:25px;
                line-height:1.7;
                color:#555;
              ">

                We will contact you on WhatsApp
                to confirm your order and
                payment details.

              </p>

              <div style="
                margin-top:30px;
                padding:18px;
                background:#000;
                color:white;
                border-radius:12px;
                text-align:center;
              ">

                <p style="
                  margin:0;
                  color:#D4A017;
                  font-weight:bold;
                  font-size:18px;
                ">

                  Order Received ✓

                </p>

              </div>

            </div>

            <div style="
              padding:20px;
              text-align:center;
              color:#888;
              font-size:13px;
            ">

              Handmade crochet, made with love. 🧶

            </div>

          </div>
        `,
      });

      console.log(
        `Customer order email sent successfully to ${customerData.email}`
      );

    } catch (emailError) {
      console.error(
        "Customer order email error:",
        emailError
      );
    }

    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return res.status(201).json({
      message: "Order placed successfully",

      order,
    });

  } catch (error) {

    console.error(
      "Create Order Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to create order",

      error: error.message,
    });
  }
};

// =====================================================
// GET ALL ORDERS
// =====================================================

const getOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(
      orders
    );

  } catch (error) {

    console.error(
      "Get Orders Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to get orders",

      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(
      order
    );

  } catch (error) {

    console.error(
      "Get Order Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to get order",

      error: error.message,
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (
  req,
  res
) => {
  try {

    const { status } = req.body;

    // =================================================
    // ALLOWED STATUSES
    // =================================================

    const allowedStatuses = [
      "Pending Payment",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid order status",

        allowedStatuses,
      });
    }

    // =================================================
    // FIND ORDER
    // =================================================

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // =================================================
    // UPDATE STATUS
    // =================================================

    order.status = status;

    await order.save();

    console.log(
      `Order ${order._id} status changed to ${status}`
    );

    // =================================================
    // SEND STATUS EMAIL
    // =================================================

    try {

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          order.customer.email,

        subject:
          `The Yarn Spot - Order ${status}`,

        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:650px;
            margin:auto;
            padding:20px;
            color:#171717;
          ">

            <div style="
              background:#000;
              color:white;
              padding:25px;
              border-radius:15px 15px 0 0;
            ">

              <h1 style="
                margin:0;
                color:#D4A017;
              ">
                THE YARN SPOT
              </h1>

              <p style="
                color:#ccc;
                margin-top:10px;
              ">
                Order Status Update
              </p>

            </div>

            <div style="
              background:#F7F1E3;
              padding:30px;
            ">

              <h2>
                Hello ${order.customer.fullName} 👋
              </h2>

              <p style="
                font-size:16px;
                line-height:1.7;
              ">

                Your order status has been
                updated.

              </p>

              <div style="
                margin:25px 0;
                padding:20px;
                background:white;
                border-radius:12px;
                border-left:5px solid #D4A017;
              ">

                <p style="
                  margin:0 0 10px 0;
                ">

                  <strong>
                    Order ID:
                  </strong>

                  ${order._id}

                </p>

                <p style="
                  margin:0 0 10px 0;
                ">

                  <strong>
                    Order Total:
                  </strong>

                  Rs. ${Number(
                    order.totalAmount
                  ).toLocaleString()}

                </p>

                <p style="
                  margin:0 0 10px 0;
                ">

                  <strong>
                    Payment Status:
                  </strong>

                  ${
                    order.payment?.status ||
                    "Pending"
                  }

                </p>

                <p style="margin:0;">

                  <strong>
                    Current Status:
                  </strong>

                  ${order.status}

                </p>

              </div>

              <div style="
                margin-top:30px;
                padding:18px;
                background:#000;
                color:white;
                border-radius:12px;
                text-align:center;
              ">

                <p style="
                  margin:0;
                  color:#D4A017;
                  font-weight:bold;
                  font-size:18px;
                ">

                  ${order.status}

                </p>

              </div>

              <p style="
                margin-top:25px;
                line-height:1.7;
                color:#555;
              ">

                Thank you for shopping with
                <strong>The Yarn Spot</strong>.

                We appreciate your order and
                will keep you updated about
                its progress.

              </p>

            </div>

            <div style="
              padding:20px;
              text-align:center;
              color:#888;
              font-size:13px;
            ">

              Handmade crochet, made with love. 🧶

            </div>

          </div>
        `,
      });

      console.log(
        `Customer status email sent successfully to ${order.customer.email}`
      );

    } catch (emailError) {

      console.error(
        "Customer status email error:",
        emailError
      );
    }

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({

      message:
        "Order status updated successfully",

      order,

    });

  } catch (error) {

    console.error(
      "Update Order Status Error:",
      error
    );

    return res.status(500).json({

      message:
        "Failed to update order status",

      error:
        error.message,

    });
  }
};

// =====================================================
// UPDATE PAYMENT
// =====================================================

const updatePayment = async (req, res) => {
  try {

    const {
      status,
      transactionId,
      paymentDate,
    } = req.body;

    // =================================================
    // ALLOWED PAYMENT STATUSES
    // =================================================

    const allowedPaymentStatuses = [
      "Pending",
      "Paid",
      "Partially Paid",
      "Failed",
    ];

    if (
      !allowedPaymentStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid payment status",

        allowedPaymentStatuses,
      });
    }

    // =================================================
    // FIND ORDER
    // =================================================

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message:
          "Order not found",
      });
    }

    // =================================================
    // UPDATE PAYMENT
    // =================================================

    order.payment.status = status;

    if (transactionId !== undefined) {
      order.payment.transactionId =
        transactionId.trim();
    }

    // =================================================
    // PAYMENT DATE
    // =================================================

    if (status === "Paid" ||
        status === "Partially Paid") {

      order.payment.paymentDate =
        paymentDate
          ? new Date(paymentDate)
          : new Date();

    } else if (status === "Pending") {

      order.payment.paymentDate = null;
    }

    // =================================================
    // UPDATE ORDER STATUS
    // =================================================

    if (
      status === "Paid" ||
      status === "Partially Paid"
    ) {
      order.status = "Confirmed";
    }

    await order.save();

    console.log(
      `Payment for order ${order._id} updated to ${status}`
    );

    // =================================================
    // SEND PAYMENT EMAIL
    // =================================================

    try {

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          order.customer.email,

        subject:
          `The Yarn Spot - Payment ${status}`,

        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:650px;
            margin:auto;
            padding:20px;
            color:#171717;
          ">

            <div style="
              background:#000;
              color:white;
              padding:25px;
              border-radius:15px 15px 0 0;
            ">

              <h1 style="
                margin:0;
                color:#D4A017;
              ">
                THE YARN SPOT
              </h1>

              <p style="
                color:#ccc;
                margin-top:10px;
              ">
                Payment Update
              </p>

            </div>

            <div style="
              background:#F7F1E3;
              padding:30px;
            ">

              <h2>
                Hello ${order.customer.fullName} 👋
              </h2>

              <p style="
                font-size:16px;
                line-height:1.7;
              ">

                Your payment information
                has been updated.

              </p>

              <div style="
                background:white;
                padding:20px;
                border-radius:12px;
              ">

                <p>
                  <strong>
                    Order ID:
                  </strong>

                  ${order._id}
                </p>

                <p>
                  <strong>
                    Payment Type:
                  </strong>

                  ${order.payment.type}
                </p>

                <p>
                  <strong>
                    Payment Method:
                  </strong>

                  ${order.payment.method}
                </p>

                <p>
                  <strong>
                    Payment Amount:
                  </strong>

                  Rs. ${Number(
                    order.payment.amount
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>
                    Remaining Amount:
                  </strong>

                  Rs. ${Number(
                    order.payment.remainingAmount
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>
                    Payment Status:
                  </strong>

                  ${order.payment.status}
                </p>

                <p>
                  <strong>
                    Transaction ID:
                  </strong>

                  ${
                    order.payment.transactionId ||
                    "Not provided"
                  }
                </p>

              </div>

              <div style="
                margin-top:25px;
                padding:18px;
                background:#000;
                color:white;
                border-radius:12px;
                text-align:center;
              ">

                <p style="
                  margin:0;
                  color:#D4A017;
                  font-weight:bold;
                  font-size:18px;
                ">

                  Payment ${status} ✓

                </p>

              </div>

            </div>

            <div style="
              padding:20px;
              text-align:center;
              color:#888;
              font-size:13px;
            ">

              Handmade crochet, made with love. 🧶

            </div>

          </div>
        `,
      });

      console.log(
        `Payment email sent to ${order.customer.email}`
      );

    } catch (emailError) {

      console.error(
        "Payment email error:",
        emailError
      );
    }

    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return res.status(200).json({

      message:
        "Payment updated successfully",

      order,

    });

  } catch (error) {

    console.error(
      "Update Payment Error:",
      error
    );

    return res.status(500).json({

      message:
        "Failed to update payment",

      error:
        error.message,

    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePayment,
};