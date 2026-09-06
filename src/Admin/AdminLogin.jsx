import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/admin";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [error, setError] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error("Authentication token was not received.");
      }

      localStorage.setItem("adminToken", data.token);

      navigate("/admin");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      setError("Please enter your admin email.");
      return;
    }

    try {
      setForgotLoading(true);
      setError("");
      setForgotMessage("");

      const response = await fetch(
        `${API_URL}/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: forgotEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to process request."
        );
      }

      setForgotMessage(data.message);
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      setError(
        error.message ||
          "Unable to process password reset request."
      );
    } finally {
      setForgotLoading(false);
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
            Admin Login
          </h1>

          <p className="mt-3 text-gray-500">
            Sign in to manage your store.
          </p>

        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-[30px] p-7 md:p-9 shadow-xl">

          {!showForgotPassword ? (
            /* LOGIN FORM */
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label className="block text-sm font-medium mb-2">
                  Admin Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@theyarnspot.com"
                  autoComplete="username"
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label className="block text-sm font-medium mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                />

              </div>

              {/* FORGOT PASSWORD */}
              <div className="text-right">

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError("");
                    setForgotMessage("");
                    setForgotEmail(formData.email);
                  }}
                  className="text-sm text-[#8B6914] hover:text-[#D4A017] transition"
                >
                  Forgot Password?
                </button>

              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-black py-4 font-semibold text-white transition hover:bg-[#D4A017] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In →"}
              </button>

            </form>
          ) : (
            /* FORGOT PASSWORD FORM */
            <form
              onSubmit={handleForgotPassword}
              className="space-y-5"
            >

              <div className="text-center mb-6">

                <h2 className="text-2xl font-semibold">
                  Reset Password
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Enter your admin email and we'll send
                  you a password reset link.
                </p>

              </div>

              {/* EMAIL */}
              <div>

                <label className="block text-sm font-medium mb-2">
                  Admin Email
                </label>

                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setError("");
                    setForgotMessage("");
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
              {forgotMessage && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {forgotMessage}
                </div>
              )}

              {/* SEND BUTTON */}
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full rounded-full bg-black py-4 font-semibold text-white transition hover:bg-[#D4A017] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {forgotLoading
                  ? "Sending..."
                  : "Send Reset Link →"}
              </button>

              {/* BACK TO LOGIN */}
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError("");
                  setForgotMessage("");
                }}
                className="w-full text-sm text-gray-500 hover:text-black transition"
              >
                ← Back to Admin Login
              </button>

            </form>
          )}

        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Admin access only
        </p>

      </div>

    </div>
  );
}

