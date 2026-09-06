import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Context/CartContext";

import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import About from "./Pages/About";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";

import ProtectedRoute from "./Admin/ProtectedRoute";
import AdminDashboard from "./Admin/AdminDashboard";
import Orders from "./Admin/Orders";
import OrdersDetails from "./Admin/Orders Details";
import AdminLogin from "./Admin/AdminLogin";
import AdminProductManager from "./Components/AdminProductManager";
import ResetPassword from "./Admin/ResetPassword";

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
          
          <Route
  path="/admin/reset-password"
  element={<ResetPassword />}
/>

  {/* ADMIN LOGIN */}
<Route
  path="/admin-login"
  element={<AdminLogin />}
/>

{/* PROTECTED ADMIN DASHBOARD */}
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

{/* PROTECTED ADMIN ORDERS */}
<Route
  path="/admin/orders"
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  }
/>

{/* PROTECTED ADMIN PRODUCTS */}
<Route
  path="/admin/products"
  element={
    <ProtectedRoute>
      <AdminProductManager />
    </ProtectedRoute>
  }
/>

{/* PROTECTED ORDER DETAILS */}
<Route
  path="/admin/orders/:id"
  element={
    <ProtectedRoute>
      <OrdersDetails />
    </ProtectedRoute>
  }
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