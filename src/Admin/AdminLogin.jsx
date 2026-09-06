// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_URL = "http://localhost:8000/api/admin/login";

// export default function AdminLogin() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//     setError("");
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       setError("Please enter email and password.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(API_URL, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Login failed."
//         );
//       }

//       // =====================================================
//       // CHECK JWT TOKEN
//       // =====================================================

//       if (!data.token) {
//         throw new Error(
//           "Authentication token was not received."
//         );
//       }

//       // =====================================================
//       // SAVE JWT TOKEN
//       // =====================================================

//       localStorage.setItem(
//         "adminToken",
//         data.token
//       );

//       // =====================================================
//       // GO TO ADMIN DASHBOARD
//       // =====================================================

//       navigate("/admin");

//     } catch (error) {
//       console.error(
//         "Admin login error:",
//         error
//       );

//       setError(
//         error.message ||
//           "Invalid email or password."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F7F1E3] flex items-center justify-center px-5">

//       <div className="w-full max-w-md">

//         {/* =====================================================
//             HEADER
//         ===================================================== */}

//         <div className="text-center mb-8">

//           <p className="text-xs uppercase tracking-[4px] text-[#8B6914] mb-3">
//             The Yarn Spot
//           </p>

//           <h1 className="text-4xl font-bold">
//             Admin Login
//           </h1>

//           <p className="mt-3 text-gray-500">
//             Sign in to manage your store.
//           </p>

//         </div>


//         {/* =====================================================
//             LOGIN CARD
//         ===================================================== */}

//         <div className="bg-white rounded-[30px] p-7 md:p-9 shadow-xl">

//           <form
//             onSubmit={handleLogin}
//             className="space-y-5"
//           >

//             {/* EMAIL */}

//             <div>

//               <label className="block text-sm font-medium mb-2">
//                 Admin Email
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="admin@theyarnspot.com"
//                 autoComplete="username"
//                 className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
//               />

//             </div>


//             {/* PASSWORD */}

//             <div>

//               <label className="block text-sm font-medium mb-2">
//                 Password
//               </label>

//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter admin password"
//                 autoComplete="current-password"
//                 className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
//               />

//             </div>


//             {/* ERROR */}

//             {error && (
//               <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//                 {error}
//               </div>
//             )}


//             {/* LOGIN BUTTON */}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-full bg-black py-4 font-semibold text-white transition hover:bg-[#D4A017] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {loading
//                 ? "Signing In..."
//                 : "Sign In →"}
//             </button>

//           </form>

//         </div>


//         {/* FOOTER */}

//         <p className="mt-6 text-center text-xs text-gray-400">
//           Admin access only
//         </p>

//       </div>

//     </div>
//   );
// }








// // import React, { useEffect, useState } from "react";
// // import { useSignIn, useUser } from "@clerk/react";
// // import { useNavigate } from "react-router-dom";

// // export default function AdminLogin() {
// //   const navigate = useNavigate();

// //   const { signIn, errors, fetchStatus } = useSignIn();
// //   const { isSignedIn, user, isLoaded } = useUser();

// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   const [code, setCode] = useState("");
// //   const [showVerification, setShowVerification] = useState(false);
// //   const [error, setError] = useState("");

// //   const loading = fetchStatus === "fetching";

// //   // =========================================
// //   // CHECK EXISTING CLERK SESSION
// //   // =========================================
// //   useEffect(() => {
// //     if (!isLoaded || !isSignedIn || !user) {
// //       return;
// //     }

// //     const role = user.publicMetadata?.role;

// //     if (role === "admin") {
// //       navigate("/admin", { replace: true });
// //     } else {
// //       setError(
// //         "You are signed in, but you are not authorized to access the Admin Dashboard."
// //       );
// //     }
// //   }, [isLoaded, isSignedIn, user, navigate]);

// //   // =========================================
// //   // INPUT CHANGE
// //   // =========================================
// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });

// //     setError("");
// //   };

// //   // =========================================
// //   // FINALIZE LOGIN
// //   // =========================================
// //   const finishLogin = async () => {
// //     try {
// //       await signIn.finalize({
// //         navigate: () => {
// //           navigate("/admin", { replace: true });
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Finalize login error:", err);

// //       setError(
// //         err?.errors?.[0]?.message ||
// //           err?.message ||
// //           "Unable to complete sign in."
// //       );
// //     }
// //   };

// //   // =========================================
// //   // ADMIN LOGIN
// //   // =========================================
// //   const handleLogin = async (e) => {
// //     e.preventDefault();

// //     if (!formData.email || !formData.password) {
// //       setError("Please enter email and password.");
// //       return;
// //     }

// //     // Prevent submitting another login
// //     // if Clerk already has an active session.
// //     if (isSignedIn) {
// //       const role = user?.publicMetadata?.role;

// //       if (role === "admin") {
// //         navigate("/admin", { replace: true });
// //       } else {
// //         setError(
// //           "You are signed in, but you are not authorized to access the Admin Dashboard."
// //         );
// //       }

// //       return;
// //     }

// //     try {
// //       setError("");

// //       const { error: signInError } =
// //         await signIn.password({
// //           emailAddress: formData.email,
// //           password: formData.password,
// //         });

// //       if (signInError) {
// //         console.error(
// //           "Clerk sign in error:",
// //           JSON.stringify(signInError, null, 2)
// //         );

// //         setError(
// //           signInError.message ||
// //             "Invalid email or password."
// //         );

// //         return;
// //       }

// //       // =========================================
// //       // LOGIN COMPLETE
// //       // =========================================
// //       if (signIn.status === "complete") {
// //         await finishLogin();
// //         return;
// //       }

// //       // =========================================
// //       // DEVICE TRUST
// //       // =========================================
// //       if (signIn.status === "needs_client_trust") {
// //         try {
// //           await signIn.mfa.sendEmailCode();

// //           setShowVerification(true);
// //           setError("");
// //         } catch (err) {
// //           console.error(
// //             "Verification code error:",
// //             err
// //           );

// //           setError(
// //             err?.errors?.[0]?.message ||
// //               err?.message ||
// //               "Unable to send verification code."
// //           );
// //         }

// //         return;
// //       }

// //       // =========================================
// //       // SECOND FACTOR
// //       // =========================================
// //       if (signIn.status === "needs_second_factor") {
// //         setError(
// //           "Additional security verification is required for this account."
// //         );

// //         return;
// //       }

// //       console.log(
// //         "Sign-in status:",
// //         signIn.status
// //       );

// //       setError(
// //         "Additional verification is required. Please complete your Clerk verification."
// //       );
// //     } catch (err) {
// //       console.error(
// //         "Admin Clerk login error:",
// //         err
// //       );

// //       setError(
// //         err?.errors?.[0]?.message ||
// //           err?.message ||
// //           "Invalid email or password."
// //       );
// //     }
// //   };

// //   // =========================================
// //   // VERIFY EMAIL CODE
// //   // =========================================
// //   const handleVerification = async (e) => {
// //     e.preventDefault();

// //     if (!code) {
// //       setError("Please enter the verification code.");
// //       return;
// //     }

// //     try {
// //       setError("");

// //       const { error: verificationError } =
// //         await signIn.mfa.verifyEmailCode({
// //           code,
// //         });

// //       if (verificationError) {
// //         console.error(
// //           "Verification error:",
// //           JSON.stringify(
// //             verificationError,
// //             null,
// //             2
// //           )
// //         );

// //         setError(
// //           verificationError.message ||
// //             "Invalid verification code."
// //         );

// //         return;
// //       }

// //       if (signIn.status === "complete") {
// //         await finishLogin();
// //         return;
// //       }

// //       setError(
// //         "Verification was not completed. Please try again."
// //       );
// //     } catch (err) {
// //       console.error(
// //         "Verification error:",
// //         err
// //       );

// //       setError(
// //         err?.errors?.[0]?.message ||
// //           err?.message ||
// //           "Invalid verification code."
// //       );
// //     }
// //   };

// //   // =========================================
// //   // RESEND CODE
// //   // =========================================
// //   const resendCode = async () => {
// //     try {
// //       setError("");

// //       await signIn.mfa.sendEmailCode();

// //       setError(
// //         "A new verification code has been sent to your email."
// //       );
// //     } catch (err) {
// //       console.error(
// //         "Resend code error:",
// //         err
// //       );

// //       setError(
// //         err?.errors?.[0]?.message ||
// //           err?.message ||
// //           "Unable to resend verification code."
// //       );
// //     }
// //   };

// //   // =========================================
// //   // WAIT FOR CLERK
// //   // =========================================
// //   if (!isLoaded) {
// //     return (
// //       <div className="min-h-screen bg-[#F7F1E3] flex items-center justify-center">
// //         <p className="text-gray-500">
// //           Loading...
// //         </p>
// //       </div>
// //     );
// //   }

// //   // =========================================
// //   // VERIFICATION SCREEN
// //   // =========================================
// //   if (showVerification) {
// //     return (
// //       <div className="min-h-screen bg-[#F7F1E3] flex items-center justify-center px-5">

// //         <div className="w-full max-w-md">

// //           <div className="text-center mb-8">
// //             <p className="text-xs uppercase tracking-[4px] text-[#8B6914] mb-3">
// //               The Yarn Spot
// //             </p>

// //             <h1 className="text-4xl font-bold">
// //               Verify Login
// //             </h1>

// //             <p className="mt-3 text-gray-500">
// //               Enter the verification code sent to your email.
// //             </p>
// //           </div>

// //           <div className="bg-white rounded-[30px] p-7 md:p-9 shadow-xl">

// //             <form
// //               onSubmit={handleVerification}
// //               className="space-y-5"
// //             >

// //               <div>
// //                 <label className="block text-sm font-medium mb-2">
// //                   Verification Code
// //                 </label>

// //                 <input
// //                   type="text"
// //                   value={code}
// //                   onChange={(e) => {
// //                     setCode(e.target.value);
// //                     setError("");
// //                   }}
// //                   placeholder="Enter verification code"
// //                   inputMode="numeric"
// //                   autoComplete="one-time-code"
// //                   className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
// //                 />
// //               </div>

// //               {error && (
// //                 <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// //                   {error}
// //                 </div>
// //               )}

// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="w-full rounded-full bg-black py-4 font-semibold text-white transition hover:bg-[#D4A017] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
// //               >
// //                 {loading
// //                   ? "Verifying..."
// //                   : "Verify & Continue →"}
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={resendCode}
// //                 disabled={loading}
// //                 className="w-full text-sm text-gray-500 hover:text-[#8B6914] transition"
// //               >
// //                 Didn't receive the code? Resend
// //               </button>

// //             </form>
// //           </div>

// //           <p className="mt-6 text-center text-xs text-gray-400">
// //             Admin access only
// //           </p>

// //         </div>
// //       </div>
// //     );
// //   }

// //   // =========================================
// //   // ALREADY SIGNED IN BUT NOT ADMIN
// //   // =========================================
// //   if (isSignedIn && user?.publicMetadata?.role !== "admin") {
// //     return (
// //       <div className="min-h-screen bg-[#F7F1E3] flex items-center justify-center px-5">

// //         <div className="w-full max-w-md">

// //           <div className="text-center mb-8">
// //             <p className="text-xs uppercase tracking-[4px] text-[#8B6914] mb-3">
// //               The Yarn Spot
// //             </p>

// //             <h1 className="text-4xl font-bold">
// //               Admin Login
// //             </h1>

// //             <p className="mt-3 text-gray-500">
// //               Admin access is restricted.
// //             </p>
// //           </div>

// //           <div className="bg-white rounded-[30px] p-7 md:p-9 shadow-xl">

// //             <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// //               This account does not have Admin access.
// //             </div>

// //           </div>

// //           <p className="mt-6 text-center text-xs text-gray-400">
// //             Admin access only
// //           </p>

// //         </div>
// //       </div>
// //     );
// //   }

// //   // =========================================
// //   // NORMAL ADMIN LOGIN
// //   // =========================================
// //   return (
// //     <div className="min-h-screen bg-[#F7F1E3] flex items-center justify-center px-5">

// //       <div className="w-full max-w-md">

// //         <div className="text-center mb-8">
// //           <p className="text-xs uppercase tracking-[4px] text-[#8B6914] mb-3">
// //             The Yarn Spot
// //           </p>

// //           <h1 className="text-4xl font-bold">
// //             Admin Login
// //           </h1>

// //           <p className="mt-3 text-gray-500">
// //             Sign in to manage your store.
// //           </p>
// //         </div>

// //         <div className="bg-white rounded-[30px] p-7 md:p-9 shadow-xl">

// //           <form
// //             onSubmit={handleLogin}
// //             className="space-y-5"
// //           >

// //             <div>
// //               <label className="block text-sm font-medium mb-2">
// //                 Admin Email
// //               </label>

// //               <input
// //                 type="email"
// //                 name="email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 placeholder="admin@theyarnspot.com"
// //                 autoComplete="username"
// //                 className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium mb-2">
// //                 Password
// //               </label>

// //               <input
// //                 type="password"
// //                 name="password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 placeholder="Enter admin password"
// //                 autoComplete="current-password"
// //                 className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
// //               />
// //             </div>

// //             {error && (
// //               <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// //                 {error}
// //               </div>
// //             )}

// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="w-full rounded-full bg-black py-4 font-semibold text-white transition hover:bg-[#D4A017] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
// //             >
// //               {loading
// //                 ? "Signing In..."
// //                 : "Sign In →"}
// //             </button>

// //           </form>
// //         </div>

// //         <p className="mt-6 text-center text-xs text-gray-400">
// //           Admin access only
// //         </p>

// //       </div>
// //     </div>
// //   );
// // }





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/admin";

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

