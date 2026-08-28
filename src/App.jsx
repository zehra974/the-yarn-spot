import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Context/CartContext";

import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import About from "./Pages/About";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";

import AdminDashboard from "./Admin/AdminDashboard";
import Orders from "./Admin/Orders";
import OrdersDetails from "./Admin/Orders Details";
import AdminLogin from "./Admin/AdminLogin";
import AdminProductManager from "./Components/AdminProductManager";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>

          {/* =========================
              WEBSITE ROUTES
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* =========================
              ADMIN LOGIN
          ========================= */}

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          {/* =========================
              ADMIN ROUTES
          ========================= */}

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/orders"
            element={<Orders />}
          />

          <Route
            path="/admin/products"
            element={<AdminProductManager />}
          />

          <Route
            path="/admin/orders/:id"
            element={<OrdersDetails />}
          />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;