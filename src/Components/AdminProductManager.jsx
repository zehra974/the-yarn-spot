import React, { useEffect, useState } from "react";

const API_URL = "/api/products";

export default function AdminProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "Crochet",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
      setError(error.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);

    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      category: "Crochet",
    });

    setSelectedImage(null);
    setImagePreview("");
    setEditingProduct(null);
  };

  // =====================================================
  // SUBMIT PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSubmitting(true);

      // -----------------------------------------------
      // CHECK ADMIN TOKEN
      // -----------------------------------------------

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin session expired. Please login again."
        );
      }

      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!form.name.trim()) {
        throw new Error("Product name is required.");
      }

      if (!form.price) {
        throw new Error("Product price is required.");
      }

      // Image is required only when creating
      if (!editingProduct && !selectedImage) {
        throw new Error("Product image is required.");
      }

      // -----------------------------------------------
      // FORM DATA
      // -----------------------------------------------

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("price", form.price);
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append(
        "category",
        form.category.trim() || "Crochet"
      );

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // -----------------------------------------------
      // URL + METHOD
      // -----------------------------------------------

      const url = editingProduct
        ? `${API_URL}/${editingProduct._id}`
        : API_URL;

      const method = editingProduct ? "PUT" : "POST";

      // -----------------------------------------------
      // REQUEST
      // -----------------------------------------------

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save product."
        );
      }

      // -----------------------------------------------
      // SUCCESS
      // -----------------------------------------------

      setSuccess(
        editingProduct
          ? "Product updated successfully!"
          : "Product created successfully!"
      );

      resetForm();

      await fetchProducts();
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);

      setError(
        error.message || "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "Crochet",
    });

    setSelectedImage(null);
    setImagePreview(product.image || "");

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      // -----------------------------------------------
      // CHECK ADMIN TOKEN
      // -----------------------------------------------

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin session expired. Please login again."
        );
      }

      // -----------------------------------------------
      // DELETE REQUEST
      // -----------------------------------------------

      const response = await fetch(
        `${API_URL}/${product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product."
        );
      }

      setSuccess(
        "Product deleted successfully!"
      );

      await fetchProducts();
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      setError(
        error.message || "Failed to delete product."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F7F1E3] px-4 py-8 md:px-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-black">
            Product Manager
          </h1>

          <p className="mt-1 text-gray-600">
            Add, edit and delete your products.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProducts}
          className="rounded-lg bg-black px-5 py-2.5 font-semibold text-white transition hover:bg-gray-800"
        >
          Refresh Products
        </button>
      </div>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      {/* =================================================
          PRODUCT FORM
      ================================================= */}

      <div className="mb-10 rounded-2xl bg-white p-6 shadow-md">

        <h2 className="mb-6 text-2xl font-bold text-black">
          {editingProduct
            ? "Edit Product"
            : "Add New Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <div>
            <label className="mb-2 block font-semibold text-gray-800">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* PRICE */}

          <div>
            <label className="mb-2 block font-semibold text-gray-800">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="mb-2 block font-semibold text-gray-800">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Crochet"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block font-semibold text-gray-800">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* IMAGE */}

          <div>
            <label className="mb-2 block font-semibold text-gray-800">
              Product Image
            </label>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              JPG, JPEG, PNG, WEBP or GIF. Maximum 5MB.
            </p>
          </div>

          {/* IMAGE PREVIEW */}

          {imagePreview && (
            <div className="mt-4">
              <p className="mb-2 font-semibold text-gray-800">
                Image Preview
              </p>

              <img
                src={imagePreview}
                alt="Product preview"
                className="h-48 w-48 rounded-xl border object-cover"
              />
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-3 pt-3">

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-400 px-6 py-3 font-semibold text-black transition hover:bg-gray-100"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">
            All Products
          </h2>

          <span className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
            {products.length} Products
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-lg text-gray-600">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <p className="text-lg text-gray-600">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-2xl bg-white shadow-md"
              >

                {/* IMAGE */}

                <div className="h-64 w-full bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>

                {/* CONTENT */}

                <div className="p-5">

                  <div className="mb-2 flex items-start justify-between gap-3">

                    <h3 className="text-lg font-bold text-black">
                      {product.name}
                    </h3>

                    <span className="whitespace-nowrap font-bold text-[#D4A017]">
                      PKR {product.price}
                    </span>
                  </div>

                  <p className="mb-3 text-sm text-gray-500">
                    {product.category}
                  </p>

                  <p className="mb-5 line-clamp-3 text-sm text-gray-600">
                    {product.description ||
                      "No description available."}
                  </p>

                  {/* ACTIONS */}

                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(product)
                      }
                      className="flex-1 rounded-lg bg-black px-4 py-2.5 font-semibold text-white transition hover:bg-gray-800"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(product)
                      }
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}