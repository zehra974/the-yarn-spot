import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

const API_URL =
  "https://the-yarn-spot.vercel.app/api/orders";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH ORDERS

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(
        Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (err) {
      console.error(
        "Orders fetch error:",
        err
      );

      setError(
        err.message ||
          "Orders load nahi ho sake."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATE ORDER STATUS

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order"
        );
      }

      await fetchOrders();
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      alert(
        err.message ||
          "Order status update nahi ho saka."
      );
    }
  };

  // LOADING

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">
          Loading orders...
        </p>
      </div>
    );
  }

  // ERROR

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">
          {error}
        </p>

        <button
          onClick={fetchOrders}
          className="mt-4 rounded-full bg-black px-5 py-2 text-white transition hover:bg-[#D4A017] hover:text-black"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}

      <div className="mb-8">

        <p className="text-sm uppercase tracking-[3px] text-[#8B6914]">
          Admin Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Orders
        </h1>

        <p className="mt-2 text-gray-500">
          Manage customer orders and payment confirmation.
        </p>

      </div>

      {/* NO ORDERS */}

      {orders.length === 0 ? (

        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

          <p className="text-gray-500">
            No orders found.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {orders.map((order) => (

            <div
              key={order._id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >

              {/* TOP SECTION */}

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* ORDER ID */}

                <div>

                  <p className="text-sm text-gray-400">
                    Order ID
                  </p>

                  <p className="mt-1 break-all font-semibold">
                    #{order._id}
                  </p>

                </div>

                {/* STATUS */}

                <div>

                  <p className="mb-2 text-sm text-gray-400">
                    Order Status
                  </p>

                  <select
                    value={
                      order.status ||
                      "Pending Payment"
                    }
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                    className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#8B6914]"
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

              {/* CUSTOMER INFORMATION */}

              <div className="mt-6 border-t pt-6">

                <p className="text-sm text-gray-400">
                  Customer Information
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {order.customer?.fullName ||
                    "N/A"}
                </p>

                <div className="mt-2 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:gap-6">

                  <span>
                    Phone:{" "}
                    {order.customer?.phone ||
                      "N/A"}
                  </span>

                  <span>
                    City:{" "}
                    {order.customer?.city ||
                      "N/A"}
                  </span>

                  <span>
                    Email:{" "}
                    {order.customer?.email ||
                      "N/A"}
                  </span>

                </div>

                {/* ADDRESS */}

                <div className="mt-3">

                  <p className="text-xs text-gray-400">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {order.customer?.address ||
                      "N/A"}
                  </p>

                </div>

                {/* NOTES */}

                {order.customer?.notes && (
                  <div className="mt-3">

                    <p className="text-xs text-gray-400">
                      Order Notes
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {order.customer.notes}
                    </p>

                  </div>
                )}

              </div>

              {/* ORDER ITEMS */}

              <div className="mt-6 border-t pt-6">

                <p className="mb-3 text-sm text-gray-400">
                  Ordered Items
                </p>

                <div className="space-y-3">

                  {order.items?.length > 0 ? (

                    order.items.map(
                      (item, index) => (

                        <div
                          key={
                            item._id ||
                            index
                          }
                          className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >

                          <div>

                            <p className="font-semibold">
                              {item.name ||
                                "Unnamed Product"}
                            </p>

                            <p className="text-sm text-gray-500">
                              Quantity:{" "}
                              {item.quantity ||
                                1}
                            </p>

                            <p className="text-sm text-gray-500">
                              Price: Rs.{" "}
                              {Number(
                                item.price ||
                                  0
                              ).toLocaleString()}
                            </p>

                          </div>

                          <p className="font-semibold text-[#8B6914]">
                            Rs.{" "}
                            {Number(
                              (item.price ||
                                0) *
                                (item.quantity ||
                                  1)
                            ).toLocaleString()}
                          </p>

                        </div>

                      )
                    )

                  ) : (

                    <p className="text-sm text-gray-500">
                      No items found.
                    </p>

                  )}

                </div>

              </div>

              {/* PAYMENT INFORMATION */}

              <div className="mt-6 border-t pt-6">

                <p className="mb-4 text-sm text-gray-400">
                  Payment Information
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <div>

                    <p className="text-xs text-gray-400">
                      Payment Type
                    </p>

                    <p className="mt-1 font-semibold">
                      {order.paymentType ||
                        "Advance"}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      Payment Method
                    </p>

                    <p className="mt-1 font-semibold">
                      {order.paymentMethod ||
                        "N/A"}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      Paid Amount
                    </p>

                    <p className="mt-1 font-semibold text-[#8B6914]">
                      Rs.{" "}
                      {Number(
                        order.paidAmount ||
                          0
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      Remaining Amount
                    </p>

                    <p className="mt-1 font-semibold">
                      Rs.{" "}
                      {Number(
                        order.remainingAmount ||
                          0
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

              </div>

              {/* TOTAL + DETAILS */}

              <div className="mt-6 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm text-gray-400">
                    Total Amount
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#8B6914]">
                    Rs.{" "}
                    {Number(
                      order.totalAmount ||
                        0
                    ).toLocaleString()}
                  </p>

                </div>

                {/* VIEW DETAILS */}

                <Link
                  to={`/admin/orders/${order._id}`}
                  className="inline-block rounded-full bg-black px-5 py-2 text-center text-white transition hover:bg-[#D4A017] hover:text-black"
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