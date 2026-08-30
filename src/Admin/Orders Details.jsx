import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

const API_URL =
  "https://the-yarn-spot.vercel.app/api/orders";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH SINGLE ORDER
  // ==========================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/${id}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Order not found"
          );
        }

        const fetchedOrder =
          data.order || data;

        setOrder(fetchedOrder);

      } catch (err) {
        console.error(
          "Order details error:",
          err
        );

        setError(
          err.message ||
            "Order details load nahi ho sake."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">
          Loading order details...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="p-8">

        <p className="text-red-500">
          {error}
        </p>

        <Link
          to="/admin/orders"
          className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-white transition hover:bg-[#D4A017] hover:text-black"
        >
          Back to Orders
        </Link>

      </div>
    );
  }

  // ==========================================
  // NO ORDER
  // ==========================================

  if (!order) {
    return (
      <div className="p-8">

        <p className="text-gray-500">
          Order not found.
        </p>

        <Link
          to="/admin/orders"
          className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-white transition hover:bg-[#D4A017] hover:text-black"
        >
          Back to Orders
        </Link>

      </div>
    );
  }

  const customer =
    order.customer || {};

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <p className="text-sm uppercase tracking-[3px] text-[#8B6914]">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Order Details
          </h1>

        </div>

        <Link
          to="/admin/orders"
          className="rounded-full bg-black px-5 py-2 text-center text-white transition hover:bg-[#D4A017] hover:text-black"
        >
          Back to Orders
        </Link>

      </div>

      {/* ORDER INFORMATION */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">

        <div className="grid gap-6 md:grid-cols-2">

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

            <p className="text-sm text-gray-400">
              Status
            </p>

            <span className="mt-1 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
              {order.status ||
                "Pending Payment"}
            </span>

          </div>

        </div>

        {/* CUSTOMER INFORMATION */}

        <div className="mt-8 border-t pt-6">

          <h2 className="mb-5 text-xl font-bold">
            Customer Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <p className="text-sm text-gray-400">
                Name
              </p>

              <p className="mt-1 font-medium">
                {customer.fullName ||
                  "N/A"}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-400">
                Email
              </p>

              <p className="mt-1 break-all font-medium">
                {customer.email ||
                  "N/A"}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-400">
                Phone
              </p>

              <p className="mt-1 font-medium">
                {customer.phone ||
                  "N/A"}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-400">
                City
              </p>

              <p className="mt-1 font-medium">
                {customer.city ||
                  "N/A"}
              </p>

            </div>

            <div className="md:col-span-2">

              <p className="text-sm text-gray-400">
                Delivery Address
              </p>

              <p className="mt-1 font-medium">
                {customer.address ||
                  "N/A"}
              </p>

            </div>

            {customer.notes && (
              <div className="md:col-span-2">

                <p className="text-sm text-gray-400">
                  Order Notes
                </p>

                <p className="mt-1 font-medium">
                  {customer.notes}
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ORDERED PRODUCTS */}

        <div className="mt-8 border-t pt-6">

          <h2 className="mb-5 text-xl font-bold">
            Ordered Products
          </h2>

          {items.length > 0 ? (

            <div className="space-y-4">

              {items.map(
                (item, index) => {

                  const quantity =
                    Number(
                      item.quantity || 1
                    );

                  const price =
                    Number(
                      item.price || 0
                    );

                  const itemTotal =
                    price * quantity;

                  return (
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

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity:{" "}
                          {quantity}
                        </p>

                        <p className="text-sm text-gray-500">
                          Price: Rs.{" "}
                          {price.toLocaleString()}
                        </p>

                      </div>

                      <p className="font-semibold text-[#8B6914]">
                        Rs.{" "}
                        {itemTotal.toLocaleString()}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <p className="text-gray-500">
              No products found in this order.
            </p>

          )}

        </div>

        {/* PAYMENT INFORMATION */}

        <div className="mt-8 border-t pt-6">

          <h2 className="mb-5 text-xl font-bold">
            Payment Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div>

              <p className="text-sm text-gray-400">
                Payment Type
              </p>

              <p className="mt-1 font-semibold">
                {order.paymentType ||
                  "Advance"}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-400">
                Payment Method
              </p>

              <p className="mt-1 font-semibold">
                {order.paymentMethod ||
                  "N/A"}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-400">
                Paid Amount
              </p>

              <p className="mt-1 font-semibold text-[#8B6914]">
                Rs.{" "}
                {Number(
                  order.paidAmount || 0
                ).toLocaleString()}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-400">
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

        {/* TOTAL */}

        <div className="mt-8 flex items-center justify-between border-t pt-6">

          <p className="text-xl font-bold">
            Total
          </p>

          <p className="text-xl font-bold text-[#8B6914]">
            Rs.{" "}
            {Number(
              order.totalAmount || 0
            ).toLocaleString()}
          </p>

        </div>

      </div>

    </div>
  );
}