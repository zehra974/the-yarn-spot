import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/admin";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset password."
        );
      }

      setSuccess(
        data.message ||
          "Password reset successful. You can now log in."
      );

      setPassword("");
      setConfirmPassword("");

      // Redirect to admin login after 2 seconds
      setTimeout(() => {
        navigate("/admin-login");
      }, 2000);
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      setError(
        error.message ||
          "Unable to reset password."
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
            Reset Password
          </h1>

          <p className="mt-3 text-gray-500">
            Create a new password for your admin account.
          </p>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-[30px] p-7 md:p-9 shadow-xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NEW PASSWORD */}
            <div>

              <label className="block text-sm font-medium mb-2">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
              />

            </div>

            {/* CONFIRM PASSWORD */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                autoComplete="new-password"
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
            {success && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* RESET BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black py-4 font-semibold text-white transition hover:bg-[#D4A017] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Resetting..."
                : "Reset Password →"}
            </button>

            {/* BACK TO LOGIN */}
            <button
              type="button"
              onClick={() => navigate("/admin-login")}
              className="w-full text-sm text-gray-500 hover:text-black transition"
            >
              ← Back to Admin Login
            </button>

          </form>

        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Admin access only
        </p>

      </div>

    </div>
  );
}
