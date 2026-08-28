import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/admin/login";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      // =====================================================
      // CHECK JWT TOKEN
      // =====================================================

      if (!data.token) {
        throw new Error(
          "Authentication token was not received."
        );
      }

      // =====================================================
      // SAVE JWT TOKEN
      // =====================================================

      localStorage.setItem(
        "adminToken",
        data.token
      );

      // =====================================================
      // GO TO ADMIN DASHBOARD
      // =====================================================

      navigate("/admin");

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        error.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E3] flex items-center justify-center px-5">

      <div className="w-full max-w-md">

        {/* =====================================================
            HEADER
        ===================================================== */}

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


        {/* =====================================================
            LOGIN CARD
        ===================================================== */}

        <div className="bg-white rounded-[30px] p-7 md:p-9 shadow-xl">

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

        </div>


        {/* FOOTER */}

        <p className="mt-6 text-center text-xs text-gray-400">
          Admin access only
        </p>

      </div>

    </div>
  );
}