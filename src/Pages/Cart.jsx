import React, { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";

export default function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    totalItems,
    subtotal,
  } = useCart();

  const [visibleItems, setVisibleItems] = useState(false);
  const [checkoutPulse, setCheckoutPulse] = useState(false);

  // Fast page entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleItems(true);
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  // Small checkout attention animation
  useEffect(() => {
    if (cartItems.length === 0) return;

    const timer = setTimeout(() => {
      setCheckoutPulse(true);

      setTimeout(() => {
        setCheckoutPulse(false);
      }, 500);
    }, 500);

    return () => clearTimeout(timer);
  }, [cartItems.length]);

  return (
    <div className="min-h-screen bg-[#F7F1E3] text-[#171717]">

      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-50 bg-black text-white px-6 md:px-16 py-5 flex items-center justify-between shadow-lg">

        <a
          href="/"
          className="text-xl md:text-2xl font-bold tracking-[2px] text-[#D4A017] transition-all duration-300 hover:tracking-[3px]"
        >
          THE YARN SPOT
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm">

          <a
            href="/"
            className="relative hover:text-[#D4A017] transition duration-300"
          >
            Home
          </a>

          <a
            href="/shop"
            className="relative hover:text-[#D4A017] transition duration-300"
          >
            Shop
          </a>

          <a
            href="/about"
            className="relative hover:text-[#D4A017] transition duration-300"
          >
            About
          </a>

        </div>

        {/* CART */}

        <a
          href="/cart"
          className="border border-[#D4A017] bg-[#D4A017] text-black px-5 py-2 rounded-full transition-all duration-300 hover:bg-white hover:border-white hover:scale-105"
        >
          🛒 Cart ({totalItems})
        </a>

      </nav>


      {/* ================= HEADER ================= */}

      <section className="relative overflow-hidden bg-black text-white px-6 md:px-16 py-20">

        {/* GOLD ORB */}

        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#D4A017]/10 blur-[100px]" />

        <div className="absolute -left-32 bottom-[-150px] w-80 h-80 rounded-full bg-[#D4A017]/5 blur-[100px]" />

        <div className="relative max-w-7xl mx-auto">

          <p className="text-[#D4A017] uppercase tracking-[5px] text-sm mb-4">
            Your Selection
          </p>

          <h1 className="text-5xl md:text-6xl font-bold">
            Your Cart
          </h1>

          <p className="text-gray-400 mt-5 max-w-xl leading-7">
            Review your handmade crochet pieces before placing
            your order.
          </p>

        </div>

      </section>


      {/* ================= CART CONTENT ================= */}

      <section className="px-6 md:px-16 py-16">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-10">

          {/* ================= ITEMS ================= */}

          <div>

            <div className="flex items-center justify-between mb-7">

              <h2 className="text-2xl font-bold">
                Your Items
              </h2>

              <p className="text-sm text-gray-500">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>

            </div>


            {/* EMPTY CART */}

            {cartItems.length === 0 ? (

              <div className="bg-white rounded-[25px] p-10 text-center shadow-sm">

                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#F7F1E3] flex items-center justify-center text-2xl">
                  🧶
                </div>

                <h3 className="text-2xl font-bold">
                  Your cart is empty
                </h3>

                <p className="text-gray-500 mt-3">
                  Explore our handmade crochet collection.
                </p>

                <a
                  href="/shop"
                  className="inline-flex mt-6 bg-black text-white px-7 py-3 rounded-full hover:bg-[#D4A017] hover:text-black transition-all duration-300 hover:-translate-y-1"
                >
                  Continue Shopping
                </a>

              </div>

            ) : (

              <div className="space-y-5">

                {cartItems.map((item, index) => (

                  <div
                    key={item.id}
                    className={`
                      group
                      bg-white
                      rounded-[25px]
                      p-5
                      flex flex-col sm:flex-row
                      gap-5
                      shadow-sm
                      transition-all
                      duration-500
                      hover:-translate-y-1
                      hover:shadow-xl
                      ${
                        visibleItems
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }
                    `}
                    style={{
                      transitionDelay: `${index * 70}ms`,
                    }}
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="relative overflow-hidden rounded-2xl w-full sm:w-32 h-32 shrink-0">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* IMAGE SHINE */}

                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-500" />

                    </div>


                    {/* PRODUCT DETAILS */}

                    <div className="flex-1 flex flex-col justify-between">

                      <div className="flex justify-between gap-5">

                        <div>

                          <h3 className="font-semibold text-lg transition-colors duration-300 group-hover:text-[#8B6914]">
                            {item.name}
                          </h3>

                          <p className="text-[#8B6914] font-medium mt-2">
                            Rs. {item.price.toLocaleString()}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Item total: Rs.{" "}
                            {(item.price * item.quantity).toLocaleString()}
                          </p>

                        </div>


                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-black transition-all duration-300 hover:rotate-90"
                        >
                          ×
                        </button>

                      </div>


                      {/* QUANTITY */}

                      <div className="flex items-center gap-3 mt-5">

                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-9 h-9 rounded-full border border-gray-200 hover:bg-black hover:text-white hover:scale-110 transition-all duration-300"
                        >
                          −
                        </button>

                        <span
                          key={item.quantity}
                          className="w-8 text-center font-medium"
                        >
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="w-9 h-9 rounded-full border border-gray-200 hover:bg-black hover:text-white hover:scale-110 transition-all duration-300"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}


            {/* CONTINUE SHOPPING */}

            <a
              href="/shop"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium group"
            >

              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>

              <span className="underline underline-offset-4 group-hover:text-[#8B6914] transition-colors duration-300">
                Continue Shopping
              </span>

            </a>

          </div>


          {/* ================= ORDER SUMMARY ================= */}

          <div>

            <div className="bg-black text-white rounded-[30px] p-7 md:p-8 sticky top-28 shadow-2xl">

              <p className="text-[#D4A017] uppercase tracking-[3px] text-xs mb-4">
                Order Summary
              </p>

              <h2 className="text-3xl font-bold mb-8">
                Your Order
              </h2>


              {/* SUBTOTAL */}

              <div className="flex justify-between text-gray-400 mb-4">

                <span>
                  Subtotal
                </span>

                <span className="text-white">
                  Rs. {subtotal.toLocaleString()}
                </span>

              </div>


              {/* DELIVERY */}

              <div className="flex justify-between text-gray-400 mb-6">

                <span>
                  Delivery
                </span>

                <span className="text-white text-sm">
                  Calculated on order
                </span>

              </div>


              {/* TOTAL */}

              <div className="border-t border-white/10 pt-6">

                <div className="flex justify-between items-center">

                  <span className="text-lg">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#D4A017] transition-all duration-300">
                    Rs. {subtotal.toLocaleString()}
                  </span>

                </div>

              </div>


              {/* CHECKOUT */}

              <a
                href="/checkout"
                className={`
                  block
                  w-full
                  mt-8
                  py-4
                  rounded-full
                  font-semibold
                  text-center
                  transition-all
                  duration-300
                  ${
                    cartItems.length === 0
                      ? "pointer-events-none bg-gray-600 text-gray-400"
                      : "bg-[#D4A017] text-black hover:bg-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,160,23,0.25)]"
                  }
                  ${checkoutPulse ? "scale-[1.02]" : ""}
                `}
              >
                Proceed to Checkout →
              </a>


              {/* TRUST */}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">

                <span className="text-[#D4A017]">
                  ✦
                </span>

                Handmade with care

              </div>

              <p className="text-xs text-gray-500 text-center mt-3 leading-5">
                Your order details will be confirmed with
                The Yarn Spot before payment.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="bg-black text-white px-6 md:px-16 py-12">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between gap-8">

            <div>

              <h2 className="text-2xl font-bold text-[#D4A017] tracking-[2px]">
                THE YARN SPOT
              </h2>

              <p className="text-gray-400 mt-3">
                Handmade crochet, made with love.
              </p>

            </div>

            <div className="flex flex-wrap gap-7 text-sm text-gray-400">

              <a
                href="/"
                className="hover:text-[#D4A017] transition duration-300"
              >
                Home
              </a>

              <a
                href="/shop"
                className="hover:text-[#D4A017] transition duration-300"
              >
                Shop
              </a>

              <a
                href="/about"
                className="hover:text-[#D4A017] transition duration-300"
              >
                About
              </a>

            </div>

          </div>


          <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500">
            © 2026 The Yarn Spot. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}