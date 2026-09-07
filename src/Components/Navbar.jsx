import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SignUpButton, UserButton, useUser } from "@clerk/react";
import { useCart } from "../Context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { isSignedIn } = useUser();

  const isAdmin = Boolean(localStorage.getItem("adminToken"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="relative z-50 bg-black text-white">
      {/* ============================= */}
      {/* MAIN NAVBAR */}
      {/* ============================= */}

      <div className="flex items-center justify-between px-6 py-3 md:px-16">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center"
          onClick={closeMobileMenu}
        >
          <img
            src="/images/Logo.png"
            alt="The Yarn Spot"
            className="h-16 w-16 rounded-full object-contain"
          />
        </Link>

        {/* ============================= */}
        {/* DESKTOP NAVIGATION */}
        {/* ============================= */}

        <div className="hidden gap-8 text-sm md:flex">

          <Link
            to="/"
            className="text-[#D4A017] transition duration-300"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="text-white transition duration-300 hover:text-[#D4A017]"
          >
            Shop
          </Link>

          <Link
            to="/about"
            className="text-white transition duration-300 hover:text-[#D4A017]"
          >
            About
          </Link>

        </div>

        {/* ============================= */}
        {/* DESKTOP RIGHT SIDE */}
        {/* ============================= */}

        <div className="hidden items-center gap-3 md:flex">

          {/* CART */}
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-full border border-[#D4A017] bg-transparent px-4 py-2 text-white transition duration-300 hover:-translate-y-1 hover:bg-[#D4A017] hover:text-black"
            title="Shopping Cart"
          >
            {/* Cart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="20" cy="20" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            <span>{totalItems}</span>
          </Link>

{/* ADMIN OPTION - ADMIN ONLY */}
{isAdmin && (
  <Link
    to="/admin"
    className="rounded-full border border-[#D4A017] bg-transparent px-4 py-2 text-white transition duration-300 hover:-translate-y-1 hover:bg-[#D4A017] hover:text-black"
    title="Admin Dashboard"
  >
    Admin
  </Link>
)}

          {/* CUSTOMER AUTHENTICATION */}
          {!isSignedIn ? (
            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-full bg-[#D4A017] px-5 py-2 font-medium text-black transition duration-300 hover:-translate-y-1 hover:bg-white"
              >
                Get Started
              </button>
            </SignUpButton>
          ) : (
            <UserButton />
          )}

        </div>

        {/* ============================= */}
        {/* MOBILE RIGHT SIDE */}
        {/* ============================= */}

        <div className="flex items-center gap-2 md:hidden">

          {/* MOBILE CART */}
          <Link
            to="/cart"
            onClick={closeMobileMenu}
            className="flex items-center gap-1 rounded-full border border-[#D4A017] px-3 py-2 text-white transition duration-300 hover:bg-[#D4A017] hover:text-black"
            title="Shopping Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="20" cy="20" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            <span className="text-sm">{totalItems}</span>
          </Link>

          {/* MOBILE USER BUTTON */}
          {isSignedIn && <UserButton />}

          {/* HAMBURGER BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4A017] text-[#D4A017] transition duration-300 hover:bg-[#D4A017] hover:text-black"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              /* CLOSE ICON */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* HAMBURGER ICON */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* ============================= */}
      {/* MOBILE MENU */}
      {/* ============================= */}

      {mobileMenuOpen && (
        <div className="border-t border-[#D4A017]/30 bg-black px-6 py-5 md:hidden">

          <div className="flex flex-col gap-3">

            {/* HOME */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-[#D4A017] transition duration-300 hover:bg-[#D4A017] hover:text-black"
            >
              Home
            </Link>

            {/* SHOP */}
            <Link
              to="/shop"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-white transition duration-300 hover:bg-[#D4A017] hover:text-black"
            >
              Shop
            </Link>

            {/* ABOUT */}
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-white transition duration-300 hover:bg-[#D4A017] hover:text-black"
            >
              About
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-white transition duration-300 hover:bg-[#D4A017] hover:text-black"
            >
              <span>Cart</span>

              <span className="rounded-full border border-[#D4A017] px-2 py-1 text-xs">
                {totalItems}
              </span>
            </Link>
            
{/* ADMIN - ADMIN ONLY */}
{isAdmin && (
  <Link
    to="/admin"
    onClick={closeMobileMenu}
    className="rounded-lg px-4 py-3 text-white transition duration-300 hover:bg-[#D4A017] hover:text-black"
  >
    Admin
  </Link>
)}
            

            {/* GET STARTED */}
            {!isSignedIn && (
              <SignUpButton mode="modal">
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="mt-2 w-full rounded-full bg-[#D4A017] px-5 py-3 font-medium text-black transition duration-300 hover:bg-white"
                >
                  Get Started
                </button>
              </SignUpButton>
            )}

          </div>
        </div>
      )}

    </nav>
  );
}