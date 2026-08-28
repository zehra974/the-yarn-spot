import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "▦",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "📦",
    },
    {
      name: "Products",
      path: "/shop",
      icon: "🧶",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-black text-white fixed left-0 top-0 flex flex-col">
      
      {/* LOGO */}
      <div className="px-7 py-8 border-b border-gray-800">
        <Link to="/admin">
          <h1 className="text-xl font-bold tracking-[2px] text-[#D4A017]">
            THE YARN SPOT
          </h1>

          <p className="text-xs text-gray-500 mt-2 tracking-wider">
            ADMIN PANEL
          </p>
        </Link>
      </div>


      {/* MENU */}
      <nav className="flex-1 px-4 py-8 space-y-3">

        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-5 py-4 rounded-xl transition ${
              location.pathname === item.path
                ? "bg-[#D4A017] text-black font-semibold"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>
          </Link>
        ))}

      </nav>


      {/* BACK TO WEBSITE */}
      <div className="p-5 border-t border-gray-800">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-[#D4A017] transition"
        >
          ← Back to Website
        </Link>
      </div>

    </aside>
  );
}