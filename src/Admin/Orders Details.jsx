import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/api/orders/${id}`
        );

        if (!response.ok) {
          throw new Error("Order not found");
        }

        const data = await response.json();

        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Order details load nahi ho sake.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">
          Loading order details...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">
          {error}
        </p>

        <Link
          to="/admin/orders"
          className="inline-block mt-4 px-5 py-2 rounded-full bg-black text-white hover:bg-[#D4A017] hover:text-black transition"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  // No order
  if (!order) {
    return (
      <div className="p-8">
        <p className="text-gray-500">
          Order not found.
        </p>

        <Link
          to="/admin/orders"
          className="inline-block mt-4 px-5 py-2 rounded-full bg-black text-white hover:bg-[#D4A017] hover:text-black transition"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <p className="text-sm uppercase tracking-[3px] text-[#8B6914]">
            Admin Dashboard
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Order Details
          </h1>
        </div>

        <Link
          to="/admin/orders"
          className="px-5 py-2 rounded-full bg-black text-white hover:bg-[#D4A017] hover:text-black transition"
        >
          ← Back
        </Link>

      </div>


      {/* ORDER INFO */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        <div className="grid md:grid-cols-2 gap-6">

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
            <p className="text-sm text-gray-400">
              Status
            </p>

            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
              {order.status || "Pending"}
            </span>
          </div>

        </div>


        {/* CUSTOMER INFORMATION */}
        <div className="border-t mt-8 pt-6">

          <h2 className="text-xl font-bold mb-5">
            Customer Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* NAME */}
            <div>
              <p className="text-sm text-gray-400">
                Name
              </p>

              <p className="font-medium mt-1">
                {order.customerName || "N/A"}
              </p>
            </div>


            {/* EMAIL */}
            <div>
              <p className="text-sm text-gray-400">
                Email
              </p>

              <p className="font-medium mt-1">
                {order.email || "N/A"}
              </p>
            </div>


            {/* PHONE */}
            <div>
              <p className="text-sm text-gray-400">
                Phone
              </p>

              <p className="font-medium mt-1">
                {order.phone || "N/A"}
              </p>
            </div>

          </div>

        </div>


        {/* PRODUCTS */}
        <div className="border-t mt-8 pt-6">

          <h2 className="text-xl font-bold mb-5">
            Ordered Products
          </h2>

          {order.products && order.products.length > 0 ? (

            <div className="space-y-4">

              {order.products.map((item, index) => (

                <div
                  key={item._id || index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 rounded-xl p-4"
                >

                  {/* PRODUCT INFO */}
                  <div>

                    <p className="font-semibold">
                      {item.name || "Unnamed Product"}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity || 1}
                    </p>

                    <p className="text-sm text-gray-500">
                      Price: Rs.{" "}
                      {Number(item.price || 0).toLocaleString()}
                    </p>

                  </div>


                  {/* PRODUCT TOTAL */}
                  <p className="font-semibold">
                    Rs.{" "}
                    {Number(
                      (item.price || 0) * (item.quantity || 1)
                    ).toLocaleString()}
                  </p>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-gray-500">
              No products found in this order.
            </p>

          )}

        </div>


        {/* TOTAL */}
        <div className="border-t mt-8 pt-6 flex items-center justify-between">

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