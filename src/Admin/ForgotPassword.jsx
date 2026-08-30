
import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://the-yarn-spot.vercel.app/api/admin/forgot-password";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your admin email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: cleanEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to process your request."
        );
      }

      setMessage(
        data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );

      setEmail("");

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E3] flex items-center justify-center px-5">

      <div className="w-full max-w-md">

        {/* HEADER */}

        <div className="text-center mb-8">

          <p className="text-xs uppercase tracking-[4px] text-[#8B6914] mb-3">
            The Yarn Spot
          </p>

          <h1 className="text-4xl font-bold">
            Forgot Password?
          </h1>

          <p className="mt-3 text-gray-500">
            Enter your admin email and we will
            send you a password reset link.
          </p>

        </div>


        {/* CARD */}

        <div className="bg-white rounded-[30px] p-7 md:p-9 shadow-xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Admin Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="admin@theyarnspot.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
              />

            </div>


            {/* ERROR */}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {message && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}


            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black py-4 font-semibold text-white transition hover:bg-[#D4A017] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link →"}
            </button>

          </form>


          {/* BACK TO LOGIN */}

          <div className="mt-6 text-center">

            <Link
              to="/admin-login"
              className="text-sm font-medium text-gray-600 transition hover:text-[#8B6914]"
            >
              ← Back to Admin Login
            </Link>

          </div>

        </div>


        {/* FOOTER */}

        <p className="mt-6 text-center text-xs text-gray-400">
          Admin access only
        </p>

      </div>

    </div>
  );
}

