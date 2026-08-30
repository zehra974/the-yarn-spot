import React, { useEffect, useMemo, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

const STATUS_OPTIONS = [
  "Pending Payment",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending Payment":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    case "Confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200";

    case "Processing":
      return "bg-purple-100 text-purple-800 border-purple-200";

    case "Shipped":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";

    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200";

    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";

    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    text: "",
  });

  // =========================================================
  // AUTH CHECK
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.replace("/admin-login");
      return;
    }

    fetchOrders();
  }, []);

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  const fetchOrders = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.replace("/admin-login");
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.replace("/admin-login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin orders error:", err);

      setError(
        "Orders load nahi ho rahe. Make sure your backend server is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // TOAST
  // =========================================================

  const showToast = (text, type = "success") => {
    setToast({
      show: true,
      type,
      text,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "",
        text: "",
      });
    }, 3000);
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.replace("/admin-login");
        return;
      }

      const response = await fetch(`${API_URL}/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.replace("/admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order status"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((previous) => ({
          ...previous,
          status: newStatus,
        }));
      }

      showToast("Order status updated successfully.");
    } catch (err) {
      console.error("Status update error:", err);

      showToast(err.message || "Status update failed.", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredOrders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return orders.filter((order) => {
      const customer = order.customer || {};

      const matchesSearch =
        !searchValue ||
        customer.fullName?.toLowerCase().includes(searchValue) ||
        customer.phone?.toLowerCase().includes(searchValue) ||
        customer.city?.toLowerCase().includes(searchValue) ||
        order._id?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // =========================================================
  // DASHBOARD STATS
  // =========================================================

  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const pending = orders.filter(
      (order) => order.status === "Pending Payment"
    ).length;

    const confirmed = orders.filter(
      (order) => order.status === "Confirmed"
    ).length;

    const processing = orders.filter(
      (order) => order.status === "Processing"
    ).length;

    const shipped = orders.filter(
      (order) => order.status === "Shipped"
    ).length;

    const delivered = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    const cancelled = orders.filter(
      (order) => order.status === "Cancelled"
    ).length;

    const revenue = orders
      .filter((order) => order.status !== "Cancelled")
      .reduce(
        (total, order) =>
          total + Number(order.totalAmount || 0),
        0
      );

    return {
      totalOrders,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      revenue,
    };
  }, [orders]);

  // =========================================================
  // WHATSAPP
  // =========================================================

  const openWhatsApp = (phone, customerName) => {
    if (!phone) return;

    let cleanPhone = String(phone).replace(/\D/g, "");

    if (cleanPhone.startsWith("0")) {
      cleanPhone = `92${cleanPhone.substring(1)}`;
    }

    const message = encodeURIComponent(
      `Assalamualaikum ${
        customerName || ""
      }! This is The Yarn Spot regarding your order.`
    );

    window.open(
      `https://wa.me/${cleanPhone}?text=${message}`,
      "_blank"
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.replace("/admin-login");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F1E3] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-black/10 border-t-[#D4A017] animate-spin" />

          <p className="text-sm text-gray-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F7F1E3] text-[#171717]">

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast.show && (
        <div
          className={`fixed right-5 top-5 z-[100] max-w-sm rounded-2xl px-5 py-4 text-sm font-medium shadow-2xl ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-black text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {toast.type === "error" ? "!" : "✓"}
            </span>

            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/95 px-6 py-4 text-white shadow-xl backdrop-blur-xl md:px-10">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">

          {/* BRAND */}

          <a
            href="/"
            className="text-lg font-bold tracking-[2px] text-[#D4A017] md:text-2xl"
          >
            THE YARN SPOT
          </a>

          {/* NAV LINKS */}

          <div className="hidden items-center gap-4 text-sm lg:flex">

            <a
              href="/"
              className="text-gray-400 transition hover:text-[#D4A017]"
            >
              Website
            </a>

            <a
              href="/shop"
              className="text-gray-400 transition hover:text-[#D4A017]"
            >
              Shop
            </a>

            <span className="rounded-full bg-[#D4A017]/10 px-4 py-2 text-[#D4A017]">
              Admin
            </span>

            {/* MANAGE PRODUCTS */}

            <a
              href="/admin-products"
              className="rounded-full bg-[#D4A017] px-4 py-2 font-semibold text-black transition hover:bg-white"
            >
              Manage Products
            </a>

          </div>

          {/* MOBILE MANAGE PRODUCTS */}

          <div className="flex items-center gap-2">

            <a
              href="/admin-products"
              className="rounded-full bg-[#D4A017] px-4 py-2 text-xs font-semibold text-black transition hover:bg-white sm:text-sm lg:hidden"
            >
              Products
            </a>

            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-full border border-[#D4A017]/50 px-4 py-2 text-sm transition hover:bg-[#D4A017] hover:text-black disabled:opacity-50"
            >
              <span className={refreshing ? "animate-spin" : ""}>
                ↻
              </span>

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

          </div>

        </div>

      </nav>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] px-5 py-8 md:px-10 md:py-12">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>

            <p className="mb-3 text-xs uppercase tracking-[4px] text-[#8B6914]">
              Store Management
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Dashboard
            </h1>

            <p className="mt-3 max-w-xl text-gray-500">
              Manage your handmade orders, track progress
              and keep everything organised.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            {/* MANAGE PRODUCTS BUTTON */}

            <a
              href="/admin-products"
              className="rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#D4A017] hover:text-black"
            >
              🧶 Manage Products
            </a>

            {/* TODAY */}

            <div className="rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-sm">

              <p className="text-xs uppercase tracking-[2px] text-gray-400">
                Today
              </p>

              <p className="mt-1 font-semibold">
                {new Date().toLocaleDateString(
                  "en-PK",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  }
                )}
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            STATS
        =================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="group rounded-3xl bg-black p-6 text-white shadow-xl transition duration-300 hover:-translate-y-1">

            <div className="mb-7 flex items-center justify-between">

              <span className="text-xs uppercase tracking-[2px] text-gray-400">
                Total Orders
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4A017] text-black">
                #
              </span>

            </div>

            <p className="text-4xl font-bold">
              {stats.totalOrders}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              All orders received
            </p>

          </div>

          {/* PENDING */}

          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="mb-7 flex items-center justify-between">

              <span className="text-xs uppercase tracking-[2px] text-gray-400">
                Pending
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                !
              </span>

            </div>

            <p className="text-4xl font-bold">
              {stats.pending}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Need attention
            </p>

          </div>

          {/* DELIVERED */}

          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="mb-7 flex items-center justify-between">

              <span className="text-xs uppercase tracking-[2px] text-gray-400">
                Delivered
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                ✓
              </span>

            </div>

            <p className="text-4xl font-bold">
              {stats.delivered}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Successfully completed
            </p>

          </div>

          {/* REVENUE */}

          <div className="rounded-3xl border border-[#D4A017]/30 bg-[#D4A017] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="mb-7 flex items-center justify-between">

              <span className="text-xs uppercase tracking-[2px] text-black/60">
                Revenue
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-[#D4A017]">
                Rs
              </span>

            </div>

            <p className="text-3xl font-bold">
              Rs. {stats.revenue.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-black/60">
              Excluding cancelled orders
            </p>

          </div>

        </div>

        {/* ===================================================
            SECONDARY STATS
        =================================================== */}

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">

          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs text-gray-400">
              Confirmed
            </p>

            <p className="mt-2 text-2xl font-bold">
              {stats.confirmed}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs text-gray-400">
              Processing
            </p>

            <p className="mt-2 text-2xl font-bold">
              {stats.processing}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs text-gray-400">
              Shipped
            </p>

            <p className="mt-2 text-2xl font-bold">
              {stats.shipped}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs text-gray-400">
              Cancelled
            </p>

            <p className="mt-2 text-2xl font-bold">
              {stats.cancelled}
            </p>
          </div>

        </div>

        {/* ===================================================
            ORDERS
        =================================================== */}

        <section className="mt-10 rounded-[30px] bg-white p-5 shadow-sm md:p-7">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

            <div>

              <p className="text-xs uppercase tracking-[3px] text-[#8B6914]">
                Order Management
              </p>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Recent Orders
              </h2>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search customer..."
                  className="w-full rounded-full border border-gray-200 bg-[#F7F1E3]/40 py-3 pl-10 pr-5 text-sm outline-none transition focus:border-[#D4A017] sm:w-64"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-[#D4A017]"
              >

                <option value="All">
                  All Status
                </option>

                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}

              </select>

            </div>

          </div>

          <div className="mt-7 flex items-center justify-between border-b border-gray-100 pb-4">

            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-black">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-black">
                {orders.length}
              </span>{" "}
              orders
            </p>

            {(search || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="text-sm font-medium text-[#8B6914] hover:underline"
              >
                Clear filters
              </button>
            )}

          </div>

          {error && (
            <div className="my-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
              {error}
            </div>
          )}

          {!error && filteredOrders.length === 0 && (
            <div className="py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F1E3] text-2xl">
                🧶
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No orders found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filter.
              </p>

            </div>
          )}

          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          {filteredOrders.length > 0 && (
            <div className="mt-5 hidden overflow-x-auto lg:block">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="border-b border-gray-100 text-left">

                    <th className="px-4 py-4 text-xs uppercase tracking-[2px] text-gray-400">
                      Order
                    </th>

                    <th className="px-4 py-4 text-xs uppercase tracking-[2px] text-gray-400">
                      Customer
                    </th>

                    <th className="px-4 py-4 text-xs uppercase tracking-[2px] text-gray-400">
                      Items
                    </th>

                    <th className="px-4 py-4 text-xs uppercase tracking-[2px] text-gray-400">
                      Total
                    </th>

                    <th className="px-4 py-4 text-xs uppercase tracking-[2px] text-gray-400">
                      Status
                    </th>

                    <th className="px-4 py-4 text-xs uppercase tracking-[2px] text-gray-400">
                      Date
                    </th>

                    <th className="px-4 py-4 text-xs uppercase tracking-[2px] text-gray-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredOrders.map((order) => {

                    const customer = order.customer || {};

                    const itemCount =
                      order.items?.reduce(
                        (total, item) =>
                          total +
                          Number(item.quantity || 0),
                        0
                      ) || 0;

                    return (
                      <tr
                        key={order._id}
                        className="group border-b border-gray-100 transition hover:bg-[#F7F1E3]/40"
                      >

                        <td className="px-4 py-5">

                          <p className="font-mono text-xs font-semibold">
                            #
                            {order._id
                              ?.slice(-6)
                              .toUpperCase()}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {formatTime(order.createdAt)}
                          </p>

                        </td>

                        <td className="px-4 py-5">

                          <p className="font-semibold">
                            {customer.fullName || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {customer.phone || "—"}
                          </p>

                        </td>

                        <td className="px-4 py-5">

                          <p className="font-medium">
                            {itemCount}{" "}
                            {itemCount === 1 ? "item" : "items"}
                          </p>

                          <p className="mt-1 max-w-[180px] truncate text-xs text-gray-400">
                            {order.items
                              ?.map((item) => item.name)
                              .join(", ")}
                          </p>

                        </td>

                        <td className="px-4 py-5">

                          <p className="font-bold">
                            Rs.{" "}
                            {Number(
                              order.totalAmount || 0
                            ).toLocaleString()}
                          </p>

                        </td>

                        <td className="px-4 py-5">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                        </td>

                        <td className="px-4 py-5">

                          <p className="text-sm">
                            {formatDate(order.createdAt)}
                          </p>

                        </td>

                        <td className="px-4 py-5">

                          <button
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-[#D4A017] hover:text-black"
                          >
                            View Order
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          {filteredOrders.length > 0 && (
            <div className="mt-5 space-y-4 lg:hidden">

              {filteredOrders.map((order) => {

                const customer = order.customer || {};

                const itemCount =
                  order.items?.reduce(
                    (total, item) =>
                      total +
                      Number(item.quantity || 0),
                    0
                  ) || 0;

                return (
                  <div
                    key={order._id}
                    className="rounded-2xl border border-gray-100 p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="font-mono text-xs font-bold">
                          #
                          {order._id
                            ?.slice(-6)
                            .toUpperCase()}
                        </p>

                        <h3 className="mt-2 font-bold">
                          {customer.fullName || "Unknown"}
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          {customer.phone || "—"}
                        </p>

                      </div>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-[10px] font-medium ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">

                      <div>

                        <p className="text-xs text-gray-400">
                          Items
                        </p>

                        <p className="mt-1 font-semibold">
                          {itemCount}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 font-semibold">
                          Rs.{" "}
                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                    <div className="mt-5 flex items-center justify-between">

                      <p className="text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>

                      <button
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="rounded-full bg-black px-5 py-2.5 text-xs font-medium text-white"
                      >
                        View Order
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </main>

      {/* =====================================================
          ORDER MODAL
      ===================================================== */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-[#F7F1E3] shadow-2xl"
          >

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 bg-black px-6 py-6 text-white md:px-8">

              <div className="flex items-start justify-between gap-5">

                <div>

                  <p className="text-xs uppercase tracking-[3px] text-[#D4A017]">
                    Order Details
                  </p>

                  <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                    #
                    {selectedOrder._id
                      ?.slice(-6)
                      .toUpperCase()}
                  </h2>

                  <p className="mt-2 text-xs text-gray-400">
                    Placed{" "}
                    {formatDate(selectedOrder.createdAt)}{" "}
                    at{" "}
                    {formatTime(selectedOrder.createdAt)}
                  </p>

                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-xl transition hover:bg-white hover:text-black"
                >
                  ×
                </button>

              </div>

            </div>

            {/* MODAL CONTENT */}

            <div className="space-y-5 p-5 md:p-8">

              {/* CUSTOMER */}

              <div className="rounded-3xl bg-white p-6">

                <div className="mb-5 flex items-center justify-between">

                  <div>

                    <p className="text-xs uppercase tracking-[2px] text-[#8B6914]">
                      Customer
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      {selectedOrder.customer?.fullName ||
                        "Unknown"}
                    </h3>

                  </div>

                  <button
                    onClick={() =>
                      openWhatsApp(
                        selectedOrder.customer?.phone,
                        selectedOrder.customer?.fullName
                      )
                    }
                    className="rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                  >
                    WhatsApp
                  </button>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <p className="mt-1 font-medium">
                      {selectedOrder.customer?.phone || "—"}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      City
                    </p>

                    <p className="mt-1 font-medium">
                      {selectedOrder.customer?.city || "—"}
                    </p>

                  </div>

                  <div className="sm:col-span-2">

                    <p className="text-xs text-gray-400">
                      Delivery Address
                    </p>

                    <p className="mt-1 leading-6">
                      {selectedOrder.customer?.address || "—"}
                    </p>

                  </div>

                  {selectedOrder.customer?.notes && (
                    <div className="sm:col-span-2">

                      <p className="text-xs text-gray-400">
                        Order Notes
                      </p>

                      <p className="mt-1 rounded-xl bg-[#F7F1E3] p-4 text-sm leading-6">
                        {selectedOrder.customer.notes}
                      </p>

                    </div>
                  )}

                </div>

              </div>

              {/* PRODUCTS */}

              <div className="rounded-3xl bg-white p-6">

                <p className="text-xs uppercase tracking-[2px] text-[#8B6914]">
                  Order Items
                </p>

                <div className="mt-5 space-y-4">

                  {selectedOrder.items?.map(
                    (item, index) => (
                      <div
                        key={item._id || index}
                        className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >

                        <img
                          src={
                            item.image ||
                            "/images/placeholder.png"
                          }
                          alt={item.name}
                          className="h-20 w-20 rounded-2xl object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/placeholder.png";
                          }}
                        />

                        <div className="flex min-w-0 flex-1 flex-col justify-center">

                          <h4 className="font-semibold">
                            {item.name}
                          </h4>

                          <p className="mt-1 text-sm text-gray-400">
                            Rs.{" "}
                            {Number(
                              item.price || 0
                            ).toLocaleString()}{" "}
                            × {item.quantity}
                          </p>

                        </div>

                        <div className="flex items-center">

                          <p className="font-bold">
                            Rs.{" "}
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 0)
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

                <div className="mt-6 border-t border-gray-100 pt-5">

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-[#8B6914]">
                      Rs.{" "}
                      {Number(
                        selectedOrder.totalAmount || 0
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

              {/* STATUS */}

              <div className="rounded-3xl bg-black p-6 text-white">

                <p className="text-xs uppercase tracking-[2px] text-[#D4A017]">
                  Order Status
                </p>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-sm text-gray-400">
                      Current status
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {selectedOrder.status}
                    </p>

                  </div>

                  <select
                    value={selectedOrder.status}
                    disabled={updatingStatus}
                    onChange={(e) =>
                      updateStatus(
                        selectedOrder._id,
                        e.target.value
                      )
                    }
                    className="rounded-full border border-white/20 bg-white px-5 py-3 text-sm font-medium text-black outline-none focus:border-[#D4A017] disabled:opacity-50"
                  >

                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}

                  </select>

                </div>

                {/* STATUS PROGRESS */}

                <div className="mt-8">

                  <div className="flex items-center justify-between">

                    {[
                      "Confirmed",
                      "Processing",
                      "Shipped",
                      "Delivered",
                    ].map((status, index) => {

                      const statusOrder = [
                        "Confirmed",
                        "Processing",
                        "Shipped",
                        "Delivered",
                      ];

                      const currentIndex =
                        statusOrder.indexOf(
                          selectedOrder.status
                        );

                      const active =
                        currentIndex >= index &&
                        selectedOrder.status !==
                          "Cancelled";

                      return (
                        <React.Fragment key={status}>

                          <div className="flex flex-col items-center">

                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                active
                                  ? "bg-[#D4A017] text-black"
                                  : "bg-white/10 text-gray-500"
                              }`}
                            >
                              {active ? "✓" : index + 1}
                            </div>

                            <span
                              className={`mt-2 hidden text-[10px] sm:block ${
                                active
                                  ? "text-white"
                                  : "text-gray-500"
                              }`}
                            >
                              {status}
                            </span>

                          </div>

                          {index < 3 && (
                            <div
                              className={`mx-2 h-px flex-1 ${
                                currentIndex > index &&
                                selectedOrder.status !==
                                  "Cancelled"
                                  ? "bg-[#D4A017]"
                                  : "bg-white/10"
                              }`}
                            />
                          )}

                        </React.Fragment>
                      );
                    })}

                  </div>

                </div>

              </div>

              {selectedOrder.status === "Cancelled" && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                  This order has been cancelled.
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

