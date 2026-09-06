// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { SignUpButton, UserButton, useUser } from "@clerk/react";
// import { useCart } from "../Context/CartContext";

// export default function Navbar() {
//   const { totalItems } = useCart();
//   const { isSignedIn } = useUser();

//   // Admin login check
//   const [isAdmin, setIsAdmin] = useState(
//     !!localStorage.getItem("adminToken")
//   );

//   useEffect(() => {
//     const checkAdmin = () => {
//       setIsAdmin(!!localStorage.getItem("adminToken"));
//     };

//     checkAdmin();

//     window.addEventListener("adminLogin", checkAdmin);
//     window.addEventListener("adminLogout", checkAdmin);

//     return () => {
//       window.removeEventListener("adminLogin", checkAdmin);
//       window.removeEventListener("adminLogout", checkAdmin);
//     };
//   }, []);

//   return (
//     <nav className="flex items-center justify-between px-6 md:px-16 py-3 bg-black text-white">

//       {/* LOGO */}
//       <Link to="/" className="flex items-center">
//         <img
//           src="/images/Logo.png"
//           alt="The Yarn Spot"
//           className="w-16 h-16 object-contain rounded-full"
//         />
//       </Link>

//       {/* NAVIGATION */}
//       <div className="hidden md:flex gap-8 text-sm">

//         <Link
//           to="/"
//           className="text-[#D4A017] transition duration-300"
//         >
//           Home
//         </Link>

//         <Link
//           to="/shop"
//           className="text-white hover:text-[#D4A017] transition duration-300"
//         >
//           Shop
//         </Link>

//         <Link
//           to="/about"
//           className="text-white hover:text-[#D4A017] transition duration-300"
//         >
//           About
//         </Link>

//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex items-center gap-3">

//         {/* ADMIN-ONLY LINK */}
//         {isAdmin && (
//           <Link
//             to="/admin"
//             className="text-white hover:text-[#D4A017] transition duration-300 flex items-center gap-1.5 text-sm"
//             title="Admin Dashboard"
//           >
//             {/* Dashboard Icon */}
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <rect x="3" y="3" width="7" height="7" rx="1" />
//               <rect x="14" y="3" width="7" height="7" rx="1" />
//               <rect x="3" y="14" width="7" height="7" rx="1" />
//               <rect x="14" y="14" width="7" height="7" rx="1" />
//             </svg>

//             Admin
//           </Link>
//         )}

//         {/* CART */}
//         <Link
//           to="/cart"
//           className="border border-[#D4A017] bg-transparent text-white px-4 py-2 rounded-full hover:bg-[#D4A017] hover:text-black hover:-translate-y-1 transition duration-300 flex items-center gap-2"
//           title="Shopping Cart"
//         >
//           {/* Cart Icon */}
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="18"
//             height="18"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <circle cx="9" cy="20" r="1" />
//             <circle cx="20" cy="20" r="1" />
//             <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
//           </svg>

//           <span>{totalItems}</span>
//         </Link>

//         {/* CUSTOMER AUTHENTICATION */}
//         {!isSignedIn ? (
//           <SignUpButton mode="modal">
//             <button
//               type="button"
//               className="bg-[#D4A017] text-black px-5 py-2 rounded-full font-medium hover:bg-white hover:-translate-y-1 transition duration-300"
//             >
//               Get Started
//             </button>
//           </SignUpButton>
//         ) : (
//           <UserButton />
//         )}

//       </div>

//     </nav>
//   );
// }




import React from "react";
import { Link } from "react-router-dom";
import { SignUpButton, UserButton, useUser } from "@clerk/react";
import { useCart } from "../Context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { isSignedIn } = useUser();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-3 bg-black text-white">

      {/* LOGO */}
      <Link to="/" className="flex items-center">
        <img
          src="/images/Logo.png"
          alt="The Yarn Spot"
          className="w-16 h-16 object-contain rounded-full"
        />
      </Link>

      {/* NAVIGATION */}
      <div className="hidden md:flex gap-8 text-sm">

        <Link
          to="/"
          className="text-[#D4A017] transition duration-300"
        >
          Home
        </Link>

        <Link
          to="/shop"
          className="text-white hover:text-[#D4A017] transition duration-300"
        >
          Shop
        </Link>

        <Link
          to="/about"
          className="text-white hover:text-[#D4A017] transition duration-300"
        >
          About
        </Link>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* CART */}
        <Link
          to="/cart"
          className="border border-[#D4A017] bg-transparent text-white px-4 py-2 rounded-full hover:bg-[#D4A017] hover:text-black hover:-translate-y-1 transition duration-300 flex items-center gap-2"
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

        {/* ADMIN OPTION */}
        <Link
          to="/admin-login"
          className="border border-[#D4A017] bg-transparent text-white px-4 py-2 rounded-full hover:bg-[#D4A017] hover:text-black hover:-translate-y-1 transition duration-300"
          title="Admin Login"
        >
          Admin
        </Link>

        {/* CUSTOMER AUTHENTICATION */}
        {!isSignedIn ? (
          <SignUpButton mode="modal">
            <button
              type="button"
              className="bg-[#D4A017] text-black px-5 py-2 rounded-full font-medium hover:bg-white hover:-translate-y-1 transition duration-300"
            >
              Get Started
            </button>
          </SignUpButton>
        ) : (
          <UserButton />
        )}

      </div>

    </nav>
  );
}
