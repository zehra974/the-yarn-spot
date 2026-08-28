import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // FETCH ORDERS
  // ===============================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8000/api/orders"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError("Orders load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===============================
  // UPDATE ORDER STATUS
  // ===============================
  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      // Refresh orders
      await fetchOrders();

    } catch (err) {
      console.error("Status update error:", err);

      alert(
        err.message ||
          "Order status update nahi ho saka."
      );
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">
          Loading orders...
        </p>
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================
  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">
          {error}
        </p>

        <button
          onClick={fetchOrders}
          className="mt-4 px-5 py-2 rounded-full bg-black text-white hover:bg-[#D4A017] hover:text-black transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">

      {/* ===============================
          HEADER
      =============================== */}
      <div className="mb-8">

        <p className="text-sm uppercase tracking-[3px] text-[#8B6914]">
          Admin Dashboard
        </p>

        <h1 className="text-4xl font-bold mt-2">
          Orders
        </h1>

        <p className="text-gray-500 mt-2">
          Manage customer orders and payment confirmation.
        </p>

      </div>


      {/* ===============================
          NO ORDERS
      =============================== */}
      {orders.length === 0 ? (

        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border">

          <p className="text-gray-500">
            No orders found.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border p-6"
            >

              {/* ===============================
                  TOP SECTION
              =============================== */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                {/* ORDER ID */}
                <div>

                  <p className="text-sm text-gray-400">
                    Order ID
                  </p>

                  <p className="font-semibold mt-1 break-all">
                    #{order._id}
                  </p>

                </div>


                {/* STATUS */}
                <div>

                  <p className="text-sm text-gray-400 mb-2">
                    Order Status
                  </p>

                  <select
                    value={
                      order.status || "Pending Payment"
                    }
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#8B6914] cursor-pointer"
                  >

                    <option value="Pending Payment">
                      Pending Payment
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

              </div>


              {/* ===============================
                  CUSTOMER INFORMATION
              =============================== */}
              <div className="border-t mt-6 pt-6">

                <p className="text-sm text-gray-400">
                  Customer Information
                </p>


                {/* NAME */}
                <p className="font-semibold mt-2 text-lg">
                  {order.customer?.fullName || "N/A"}
                </p>


                {/* PHONE + CITY */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2 text-sm text-gray-500">

                  <span>
                    📱 {order.customer?.phone || "N/A"}
                  </span>

                  <span>
                    📍 {order.customer?.city || "N/A"}
                  </span>

                </div>


                {/* ADDRESS */}
                <div className="mt-3">

                  <p className="text-xs text-gray-400">
                    Delivery Address
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {order.customer?.address || "N/A"}
                  </p>

                </div>


                {/* NOTES */}
                {order.customer?.notes && (
                  <div className="mt-3">

                    <p className="text-xs text-gray-400">
                      Order Notes
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {order.customer.notes}
                    </p>

                  </div>
                )}

              </div>


              {/* ===============================
                  ORDER ITEMS
              =============================== */}
              <div className="border-t mt-6 pt-6">

                <p className="text-sm text-gray-400 mb-3">
                  Ordered Items
                </p>

                <div className="space-y-3">

                  {order.items?.map(
                    (item, index) => (

                      <div
                        key={
                          item._id || index
                        }
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 rounded-xl p-4"
                      >

                        <div>

                          <p className="font-semibold">
                            {item.name ||
                              "Unnamed Product"}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity:{" "}
                            {item.quantity || 1}
                          </p>

                        </div>


                        <p className="font-semibold text-[#8B6914]">

                          Rs.{" "}

                          {Number(
                            (item.price || 0) *
                              (item.quantity || 1)
                          ).toLocaleString()}

                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* ===============================
                  TOTAL + DETAILS
              =============================== */}
              <div className="border-t mt-6 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                {/* TOTAL */}
                <div>

                  <p className="text-sm text-gray-400">
                    Total Amount
                  </p>

                  <p className="text-xl font-bold text-[#8B6914] mt-1">

                    Rs.{" "}

                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString()}

                  </p>

                </div>


                {/* VIEW DETAILS */}
                <Link
                  to={`/admin/orders/${order._id}`}
                  className="inline-block text-center px-5 py-2 rounded-full bg-black text-white hover:bg-[#D4A017] hover:text-black transition"
                >
                  View Details
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}