import React, {
  useEffect,
  useState,
} from "react";

import { useCart } from "../Context/CartContext";

const API_URL =
  "https://the-yarn-spot.vercel.app/api/orders";

// =====================================================
// PAYMENT SETTINGS
// =====================================================

const ADVANCE_PERCENTAGE = 50;

const PAYMENT_NUMBER =
  "03451335590";

// =====================================================
// CHECKOUT
// =====================================================

export default function Checkout() {
  const {
    cartItems,
    subtotal,
    totalItems,
    clearCart,
  } = useCart();

  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] =
    useState({
      fullName: "",
      phone: "",
      email: "",
      city: "",
      address: "",
      notes: "",
    });

  // =====================================================
  // PAYMENT
  // =====================================================

  const [paymentType, setPaymentType] =
    useState("Advance");

  const [paymentMethod, setPaymentMethod] =
    useState("Easypaisa");

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  // =====================================================
  // SUCCESS DATA
  // =====================================================

  const [placedOrderId, setPlacedOrderId] =
    useState("");

  const [placedOrderTotal, setPlacedOrderTotal] =
    useState(0);

  const [placedPaidAmount, setPlacedPaidAmount] =
    useState(0);

  const [placedRemainingAmount, setPlacedRemainingAmount] =
    useState(0);

  const [placedPaymentType, setPlacedPaymentType] =
    useState("Advance");

  const [placedPaymentMethod, setPlacedPaymentMethod] =
    useState("Easypaisa");

  // =====================================================
  // TOTAL
  // =====================================================

  const orderTotal =
    Number(subtotal || 0);

  const advanceAmount =
    Math.round(
      (orderTotal *
        ADVANCE_PERCENTAGE) /
        100
    );

  const selectedPaymentAmount =
    paymentType === "Full"
      ? orderTotal
      : advanceAmount;

  const remainingAmount =
    Math.max(
      orderTotal -
        selectedPaymentAmount,
      0
    );

  // =====================================================
  // ANIMATION
  // =====================================================

  useEffect(() => {
    const elements =
      document.querySelectorAll(
        ".checkout-animate"
      );

    elements.forEach(
      (element, index) => {
        element.animate(
          [
            {
              opacity: 0,
              transform:
                "translateY(18px)",
            },
            {
              opacity: 1,
              transform:
                "translateY(0)",
            },
          ],
          {
            duration: 500,
            delay: index * 70,
            easing:
              "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );
      }
    );
  }, []);

  // =====================================================
  // ESCAPE
  // =====================================================

  useEffect(() => {
    const handleEscape =
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          setShowSuccess(false);
        }
      };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // INPUT
  // =====================================================

  const handleChange =
    (e) => {
      const {
        name,
        value,
      } = e.target;

      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );

      setMessage("");
    };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder =
    async (e) => {
      e.preventDefault();

      // =================================================
      // CART
      // =================================================

      if (
        !cartItems ||
        cartItems.length === 0
      ) {
        setMessage(
          "Your cart is empty."
        );

        return;
      }

      // =================================================
      // REQUIRED FIELDS
      // =================================================

      if (
        !formData.fullName.trim() ||
        !formData.phone.trim() ||
        !formData.email.trim() ||
        !formData.city.trim() ||
        !formData.address.trim()
      ) {
        setMessage(
          "Please fill in all required fields."
        );

        return;
      }

      // =================================================
      // EMAIL
      // =================================================

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          formData.email.trim()
        )
      ) {
        setMessage(
          "Please enter a valid email address."
        );

        return;
      }

      // =================================================
      // TOTAL
      // =================================================

      if (
        orderTotal <= 0
      ) {
        setMessage(
          "Invalid order total. Please check your cart."
        );

        return;
      }

      setLoading(true);
      setMessage("");

      try {
        // ===============================================
        // ORDER DATA
        // ===============================================

        const orderData = {
          customer: {
            fullName:
              formData.fullName.trim(),

            phone:
              formData.phone.trim(),

            email:
              formData.email.trim(),

            city:
              formData.city.trim(),

            address:
              formData.address.trim(),

            notes:
              formData.notes.trim(),
          },

          items:
            cartItems.map(
              (item) => ({
                ...(item.product
                  ? {
                      product:
                        item.product,
                    }
                  : item._id
                  ? {
                      product:
                        item._id,
                    }
                  : {}),

                name:
                  item.name,

                price:
                  Number(
                    item.price || 0
                  ),

                image:
                  item.image || "",

                quantity:
                  Number(
                    item.quantity || 1
                  ),
              })
            ),

          totalAmount:
            orderTotal,

          paymentType:
            paymentType,

          paymentMethod:
            paymentMethod,
        };

        console.log(
          "Sending order:",
          orderData
        );

        // ===============================================
        // API
        // ===============================================

        const response =
          await fetch(
            API_URL,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  orderData
                ),
            }
          );

        const data =
          await response.json();

        console.log(
          "Order response:",
          data
        );

        // ===============================================
        // ERROR
        // ===============================================

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              "Failed to place order."
          );
        }

        // ===============================================
        // SAVED ORDER
        // ===============================================

        const savedOrder =
          data.order;

        setPlacedOrderId(
          savedOrder?._id ||
            ""
        );

        setPlacedOrderTotal(
          Number(
            savedOrder?.totalAmount ??
              orderTotal
          )
        );

        setPlacedPaidAmount(
          Number(
            savedOrder?.paidAmount ??
              selectedPaymentAmount
          )
        );

        setPlacedRemainingAmount(
          Number(
            savedOrder?.remainingAmount ??
              remainingAmount
          )
        );

        setPlacedPaymentType(
          savedOrder?.paymentType ||
            paymentType
        );

        setPlacedPaymentMethod(
          savedOrder?.paymentMethod ||
            paymentMethod
        );

        // ===============================================
        // CLEAR CART
        // ===============================================

        clearCart();

        // ===============================================
        // RESET FORM
        // ===============================================

        setFormData({
          fullName: "",
          phone: "",
          email: "",
          city: "",
          address: "",
          notes: "",
        });

        // ===============================================
        // SUCCESS
        // ===============================================

        setShowSuccess(true);

      } catch (error) {
        console.error(
          "Place Order Error:",
          error
        );

        setMessage(
          error.message ||
            "Something went wrong. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // CONTINUE SHOPPING
  // =====================================================

  const handleContinueShopping =
    () => {
      setShowSuccess(false);

      window.location.href =
        "/shop";
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen overflow-hidden bg-[#F7F1E3] text-[#171717]">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="sticky top-0 z-50 flex items-center justify-between bg-black px-6 py-5 text-white shadow-lg md:px-16">

        <a
          href="/"
          className="text-xl font-bold tracking-[2px] text-[#D4A017] transition-all duration-300 hover:tracking-[3px] md:text-2xl"
        >
          THE YARN SPOT
        </a>

        <div className="hidden items-center gap-8 text-sm md:flex">

          <a
            href="/"
            className="text-white transition duration-300 hover:text-[#D4A017]"
          >
            Home
          </a>

          <a
            href="/shop"
            className="text-white transition duration-300 hover:text-[#D4A017]"
          >
            Shop
          </a>

          <a
            href="/about"
            className="text-white transition duration-300 hover:text-[#D4A017]"
          >
            About
          </a>

        </div>

        <a
          href="/cart"
          className="rounded-full border border-[#D4A017] px-5 py-2 transition duration-300 hover:bg-[#D4A017] hover:text-black"
        >
          🛒 Cart ({totalItems})
        </a>

      </nav>

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="relative overflow-hidden bg-black px-6 py-16 text-white md:px-16">

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#D4A017]/10 blur-[120px]" />

        <div className="absolute -bottom-[180px] -left-32 h-96 w-96 rounded-full bg-[#D4A017]/5 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl checkout-animate opacity-0">

          <p className="mb-4 text-sm uppercase tracking-[5px] text-[#D4A017]">
            Almost There
          </p>

          <h1 className="text-5xl font-bold md:text-6xl">
            Checkout
          </h1>

          <p className="mt-4 max-w-xl leading-7 text-gray-400">
            Complete your details to place your handmade crochet order.
          </p>

        </div>

      </section>

      {/* =================================================
          CHECKOUT
      ================================================= */}

      <section className="px-6 py-16 md:px-16">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_400px]">

          {/* =================================================
              CUSTOMER DETAILS
          ================================================= */}

          <div className="checkout-animate rounded-[30px] bg-white p-7 opacity-0 shadow-sm md:p-10">

            <p className="mb-3 text-xs uppercase tracking-[3px] text-[#8B6914]">
              Delivery Information
            </p>

            <h2 className="mb-8 text-3xl font-bold">
              Your Details
            </h2>

            <form
              id="checkout-form"
              onSubmit={handlePlaceOrder}
              className="space-y-6"
            >

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition duration-300 focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address *
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition duration-300 focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  WhatsApp Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="03XX XXXXXXX"
                  required
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition duration-300 focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                />
              </div>

              {/* CITY */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  City *
                </label>

                <input
                  type="text"
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your city"
                  required
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition duration-300 focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                />
              </div>

              {/* ADDRESS */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Complete Delivery Address *
                </label>

                <textarea
                  rows="4"
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="House / Flat, Street, Area..."
                  required
                  className="w-full resize-none rounded-2xl border border-gray-200 px-5 py-4 outline-none transition duration-300 focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                />
              </div>

              {/* NOTES */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Order Notes
                  <span className="font-normal text-gray-400">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <textarea
                  rows="3"
                  name="notes"
                  value={
                    formData.notes
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Any special instructions?"
                  className="w-full resize-none rounded-2xl border border-gray-200 px-5 py-4 outline-none transition duration-300 focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                />
              </div>

            </form>

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="checkout-animate opacity-0">

            <div className="sticky top-28 rounded-[30px] bg-black p-7 text-white shadow-2xl md:p-8">

              <p className="mb-3 text-xs uppercase tracking-[3px] text-[#D4A017]">
                Order Summary
              </p>

              <h2 className="mb-8 text-3xl font-bold">
                Your Order
              </h2>

              {/* PRODUCTS */}

              <div className="max-h-[300px] space-y-5 overflow-y-auto pr-2">

                {cartItems.length === 0 ? (

                  <div className="py-5 text-center">

                    <div className="mb-3 text-4xl">
                      🧶
                    </div>

                    <p className="text-gray-400">
                      Your cart is empty.
                    </p>

                  </div>

                ) : (

                  cartItems.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={
                          item.id ||
                          item._id ||
                          index
                        }
                        className="group flex gap-4"
                        style={{
                          animation:
                            `checkoutItem 0.45s ease ${
                              index * 0.08
                            }s both`,
                        }}
                      >

                        <div className="relative shrink-0">

                          <img
                            src={
                              item.image ||
                              "/images/placeholder.png"
                            }
                            alt={
                              item.name
                            }
                            className="h-16 w-16 rounded-xl object-cover transition duration-300 group-hover:scale-105"
                            onError={(
                              e
                            ) => {
                              e.currentTarget.src =
                                "/images/placeholder.png";
                            }}
                          />

                          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A017] text-[10px] font-bold text-black">
                            {
                              item.quantity
                            }
                          </span>

                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="text-sm font-medium leading-5">
                            {
                              item.name
                            }
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            Qty:{" "}
                            {
                              item.quantity
                            }
                          </p>

                        </div>

                        <p className="whitespace-nowrap text-sm font-medium">
                          Rs.{" "}
                          {(
                            Number(
                              item.price ||
                                0
                            ) *
                            Number(
                              item.quantity ||
                                0
                            )
                          ).toLocaleString()}
                        </p>

                      </div>

                    )
                  )

                )}

              </div>

              {/* =================================================
                  PAYMENT OPTION
              ================================================= */}

              <div className="mt-7 border-t border-white/10 pt-6">

                <p className="mb-4 text-xs uppercase tracking-[3px] text-[#D4A017]">
                  Payment Option
                </p>

                <div className="space-y-3">

                  {/* ADVANCE */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentType(
                        "Advance"
                      )
                    }
                    className={`w-full rounded-2xl border p-4 text-left transition duration-300 ${
                      paymentType ===
                      "Advance"
                        ? "border-[#D4A017] bg-[#D4A017]/10"
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            paymentType ===
                            "Advance"
                              ? "border-[#D4A017]"
                              : "border-gray-500"
                          }`}
                        >

                          {paymentType ===
                            "Advance" && (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#D4A017]" />
                          )}

                        </span>

                        <span className="font-medium">
                          Advance Payment
                        </span>

                      </div>

                      <span className="font-semibold text-[#D4A017]">
                        Rs.{" "}
                        {advanceAmount.toLocaleString()}
                      </span>

                    </div>

                    <p className="ml-8 mt-2 text-xs text-gray-500">
                      Pay {ADVANCE_PERCENTAGE}% now
                    </p>

                  </button>

                  {/* FULL */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentType(
                        "Full"
                      )
                    }
                    className={`w-full rounded-2xl border p-4 text-left transition duration-300 ${
                      paymentType ===
                      "Full"
                        ? "border-[#D4A017] bg-[#D4A017]/10"
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            paymentType ===
                            "Full"
                              ? "border-[#D4A017]"
                              : "border-gray-500"
                          }`}
                        >

                          {paymentType ===
                            "Full" && (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#D4A017]" />
                          )}

                        </span>

                        <span className="font-medium">
                          Full Payment
                        </span>

                      </div>

                      <span className="font-semibold text-[#D4A017]">
                        Rs.{" "}
                        {orderTotal.toLocaleString()}
                      </span>

                    </div>

                    <p className="ml-8 mt-2 text-xs text-gray-500">
                      Pay the complete order amount
                    </p>

                  </button>

                </div>

              </div>

              {/* =================================================
                  PAYMENT METHOD
              ================================================= */}

              <div className="mt-6">

                <p className="mb-4 text-xs uppercase tracking-[3px] text-[#D4A017]">
                  Payment Method
                </p>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "Easypaisa"
                      )
                    }
                    className={`rounded-2xl border p-4 text-sm font-medium transition ${
                      paymentMethod ===
                      "Easypaisa"
                        ? "border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]"
                        : "border-white/10 bg-white/5 text-gray-300"
                    }`}
                  >
                    Easypaisa
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "JazzCash"
                      )
                    }
                    className={`rounded-2xl border p-4 text-sm font-medium transition ${
                      paymentMethod ===
                      "JazzCash"
                        ? "border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]"
                        : "border-white/10 bg-white/5 text-gray-300"
                    }`}
                  >
                    JazzCash
                  </button>

                </div>

                {/* PAYMENT INFO */}

                <div className="mt-4 rounded-2xl border border-[#D4A017]/30 bg-[#D4A017]/10 p-4">

                  <p className="text-sm font-semibold text-[#D4A017]">
                    Pay via {paymentMethod}
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Send:
                    <span className="ml-1 font-bold text-white">
                      Rs.{" "}
                      {selectedPaymentAmount.toLocaleString()}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-gray-300">
                    Number:
                    <span className="ml-1 font-bold text-white">
                      {PAYMENT_NUMBER}
                    </span>
                  </p>

                  <p className="mt-3 text-xs leading-5 text-gray-400">
                    After payment, The Yarn Spot
                    will verify your payment and
                    confirm your order on WhatsApp.
                  </p>

                </div>

              </div>

              {/* =================================================
                  TOTAL
              ================================================= */}

              <div className="mt-7 space-y-4 border-t border-white/10 pt-6">

                <div className="flex justify-between text-gray-400">

                  <span>
                    Subtotal
                  </span>

                  <span className="text-white">
                    Rs.{" "}
                    {orderTotal.toLocaleString()}
                  </span>

                </div>

                <div className="flex justify-between text-gray-400">

                  <span>
                    Payment Type
                  </span>

                  <span className="text-white">
                    {paymentType}
                  </span>

                </div>

                <div className="flex justify-between text-gray-400">

                  <span>
                    Payment Method
                  </span>

                  <span className="text-white">
                    {paymentMethod}
                  </span>

                </div>

                <div className="flex justify-between text-gray-400">

                  <span>
                    Payment Amount
                  </span>

                  <span className="text-[#D4A017]">
                    Rs.{" "}
                    {selectedPaymentAmount.toLocaleString()}
                  </span>

                </div>

                <div className="flex justify-between text-gray-400">

                  <span>
                    Remaining
                  </span>

                  <span className="text-white">
                    Rs.{" "}
                    {remainingAmount.toLocaleString()}
                  </span>

                </div>

                <div className="flex justify-between text-gray-400">

                  <span>
                    Delivery
                  </span>

                  <span className="text-right text-sm text-white">
                    Confirmed on WhatsApp
                  </span>

                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-5">

                  <span className="text-lg">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#D4A017]">
                    Rs.{" "}
                    {orderTotal.toLocaleString()}
                  </span>

                </div>

              </div>

              {/* =================================================
                  PLACE ORDER
              ================================================= */}

              <button
                type="submit"
                form="checkout-form"
                disabled={
                  loading ||
                  cartItems.length === 0
                }
                className={`relative mt-8 w-full overflow-hidden rounded-full py-4 font-semibold transition-all duration-300 ${
                  loading ||
                  cartItems.length === 0
                    ? "cursor-not-allowed bg-gray-600 text-gray-400"
                    : "bg-[#D4A017] text-black hover:scale-[1.02] hover:bg-white active:scale-[0.98]"
                }`}
              >

                {loading ? (

                  <span className="flex items-center justify-center gap-3">

                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />

                    Processing...

                  </span>

                ) : (

                  paymentType ===
                  "Advance"
                    ? "Place Order with Advance →"
                    : "Place Order with Full Payment →"

                )}

              </button>

              {/* ERROR */}

              {message && (

                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center">

                  <p className="text-sm text-red-300">
                    {message}
                  </p>

                </div>

              )}

              <p className="mt-5 text-center text-xs leading-5 text-gray-500">
                Payment will be verified by The Yarn Spot before your order is confirmed.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="bg-black px-6 py-12 text-white md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-8 md:flex-row">

            <div>

              <h2 className="text-2xl font-bold tracking-[2px] text-[#D4A017]">
                THE YARN SPOT
              </h2>

              <p className="mt-3 text-gray-400">
                Handmade crochet, made with love.
              </p>

            </div>

            <div className="flex gap-7 text-sm text-gray-400">

              <a
                href="/"
                className="transition hover:text-[#D4A017]"
              >
                Home
              </a>

              <a
                href="/shop"
                className="transition hover:text-[#D4A017]"
              >
                Shop
              </a>

              <a
                href="/about"
                className="transition hover:text-[#D4A017]"
              >
                About
              </a>

            </div>

          </div>

          <div className="mt-10 border-t border-gray-800 pt-6 text-sm text-gray-500">
            © 2026 The Yarn Spot. All rights reserved.
          </div>

        </div>

      </footer>

      {/* =================================================
          SUCCESS POPUP
      ================================================= */}

      {showSuccess && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() =>
              setShowSuccess(false)
            }
          />

          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[35px] bg-[#F7F1E3] p-8 text-center shadow-2xl md:p-10"
            style={{
              animation:
                "successPopup 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >

            {/* ICON */}

            <div
              className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-black text-[#D4A017]"
              style={{
                animation:
                  "successIcon 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
              }}
            >

              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >

                <path d="M20 6L9 17l-5-5" />

              </svg>

            </div>

            <p className="relative mb-3 text-xs uppercase tracking-[4px] text-[#8B6914]">
              Order Received
            </p>

            <h2
              id="success-title"
              className="relative mb-4 text-3xl font-bold md:text-4xl"
            >
              Thank You! ✨
            </h2>

            <p className="relative mb-7 leading-7 text-gray-600">

              Your order has been
              received successfully.

              Please complete your payment
              using the details below.

            </p>

            {/* ORDER ID */}

            {placedOrderId && (

              <div className="relative mb-4 rounded-2xl bg-white px-5 py-4">

                <p className="text-xs text-gray-500">
                  Order ID
                </p>

                <p className="mt-1 break-all text-sm font-semibold">
                  {placedOrderId}
                </p>

              </div>

            )}

            {/* PAYMENT SUMMARY */}

            <div className="relative mb-5 space-y-3 rounded-2xl bg-white px-5 py-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Order Total
                </span>

                <span className="font-bold text-[#8B6914]">
                  Rs.{" "}
                  {placedOrderTotal.toLocaleString()}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Payment Type
                </span>

                <span className="font-semibold">
                  {placedPaymentType}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Payment Method
                </span>

                <span className="font-semibold">
                  {placedPaymentMethod}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Pay Now
                </span>

                <span className="font-semibold text-[#8B6914]">
                  Rs.{" "}
                  {placedPaidAmount.toLocaleString()}
                </span>

              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">

                <span className="text-sm text-gray-500">
                  Remaining
                </span>

                <span className="font-semibold">
                  Rs.{" "}
                  {placedRemainingAmount.toLocaleString()}
                </span>

              </div>

            </div>

            {/* PAYMENT DETAILS */}

            <div className="relative mb-6 rounded-2xl bg-black p-5 text-left text-white">

              <p className="text-xs uppercase tracking-[3px] text-[#D4A017]">
                Payment Details
              </p>

              <p className="mt-4 text-sm text-gray-400">
                Send payment to:
              </p>

              <p className="mt-1 text-xl font-bold text-[#D4A017]">
                {PAYMENT_NUMBER}
              </p>

              <p className="mt-3 text-sm text-gray-300">
                {placedPaymentMethod}
              </p>

              <p className="mt-4 text-sm leading-6 text-gray-400">
                After sending the payment,
                please keep your payment
                confirmation. The Yarn Spot
                will verify it and confirm
                your order on WhatsApp.
              </p>

            </div>

            {/* STATUS */}

            <div className="relative mb-6 rounded-xl bg-[#F7F1E3] px-4 py-3">

              <p className="text-xs leading-5 text-gray-500">
                Order Status:{" "}
                <strong>
                  Pending Payment
                </strong>
              </p>

            </div>

            {/* CONTINUE */}

            <button
              type="button"
              onClick={
                handleContinueShopping
              }
              className="relative w-full rounded-full bg-black px-7 py-4 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:bg-[#D4A017] hover:text-black active:scale-[0.98]"
            >
              Continue Shopping
            </button>

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setShowSuccess(false)
              }
              className="relative mt-4 text-sm text-gray-500 transition hover:text-black"
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>
        {`
          @keyframes checkoutItem {
            from {
              opacity: 0;
              transform: translateX(15px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes successPopup {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.92);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes successIcon {
            from {
              opacity: 0;
              transform: scale(0.4) rotate(-15deg);
            }

            to {
              opacity: 1;
              transform: scale(1) rotate(0);
            }
          }
        `}
      </style>

    </div>
  );
}