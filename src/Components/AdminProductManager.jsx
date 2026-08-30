import React, { useEffect, useState } from "react";

const API_URL = "https://the-yarn-spot.vercel.app/api/products";

const BACKEND_URL = "https://the-yarn-spot.vercel.app";

const initialForm = {
  name: "",
  price: "",
  description: "",
  category: "Crochet",
};

export default function AdminProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(initialForm);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // IMAGE URL HELPER
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "/images/placeholder.png";
    }

    // Already a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    // Backend image path
    if (image.startsWith("/")) {
      return `${BACKEND_URL}${image}`;
    }

    return `${BACKEND_URL}/${image}`;
  };

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Products API did not return valid JSON."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load products."
        );
      }

      // Handle array response
      if (Array.isArray(data)) {
        setProducts(data);
        return;
      }

      // Handle { products: [] } response
      if (Array.isArray(data?.products)) {
        setProducts(data.products);
        return;
      }

      // Handle { data: [] } response
      if (Array.isArray(data?.data)) {
        setProducts(data.data);
        return;
      }

      setProducts([]);
    } catch (err) {
      console.error("PRODUCT FETCH ERROR:", err);

      setProducts([]);

      setError(
        err?.message ||
          "Products load nahi ho sake."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Basic image validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Optional size protection: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    // Revoke old blob URL if necessary
    setImagePreview((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return previewUrl;
    });
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(initialForm);
    setSelectedImage(null);
    setImagePreview("");
    setEditingProduct(null);
    setError("");
  };

  // =====================================================
  // ADD / UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      // Validate name
      if (!form.name.trim()) {
        throw new Error(
          "Product name is required."
        );
      }

      // Validate price
      if (
        form.price === "" ||
        Number.isNaN(Number(form.price)) ||
        Number(form.price) < 0
      ) {
        throw new Error(
          "Please enter a valid price."
        );
      }

      // New product needs image
      if (!editingProduct && !selectedImage) {
        throw new Error(
          "Please select a product image."
        );
      }

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "price",
        String(Number(form.price))
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "category",
        form.category.trim() || "Crochet"
      );

      if (selectedImage) {
        formData.append(
          "image",
          selectedImage
        );
      }

      let url = API_URL;
      let method = "POST";

      if (editingProduct?._id) {
        url = `${API_URL}/${editingProduct._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        if (!response.ok) {
          throw new Error(
            text || "Server returned an invalid response."
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Something went wrong while saving the product."
        );
      }

      if (editingProduct) {
        setSuccess(
          "Product updated successfully!"
        );
      } else {
        setSuccess(
          "Product added successfully!"
        );
      }

      resetForm();

      await fetchProducts();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "PRODUCT SUBMIT ERROR:",
        err
      );

      setError(
        err?.message ||
          "Product save nahi ho saka."
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
      name: product?.name || "",

      price:
        product?.price !== undefined &&
        product?.price !== null
          ? String(product.price)
          : "",

      description:
        product?.description || "",

      category:
        product?.category || "Crochet",
    });

    setSelectedImage(null);

    setImagePreview(
      product?.image
        ? getImageUrl(product.image)
        : ""
    );

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
      `Are you sure you want to delete "${product?.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${product._id}`,
        {
          method: "DELETE",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete product."
        );
      }

      setProducts((previousProducts) =>
        previousProducts.filter(
          (item) =>
            item._id !== product._id
        )
      );

      setSuccess(
        "Product deleted successfully!"
      );

      if (
        editingProduct?._id ===
        product._id
      ) {
        resetForm();
      }

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "PRODUCT DELETE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Product delete nahi ho saka."
      );
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F7F1E3] px-5 py-8 text-[#171717] md:px-10 md:py-12">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="mb-3 text-xs uppercase tracking-[4px] text-[#8B6914]">
              Store Management
            </p>

            <h1 className="text-4xl font-bold md:text-6xl">
              Product Manager
            </h1>

            <p className="mt-3 max-w-xl text-gray-500">
              Add, edit, update prices and manage
              your crochet products.
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-full border border-black px-5 py-3 text-center text-sm font-medium transition hover:bg-black hover:text-white"
          >
            ← Back to Dashboard
          </a>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div className="mb-6 rounded-2xl bg-green-100 px-5 py-4 text-sm font-medium text-green-700">
            ✓ {success}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-2xl bg-red-100 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        <section className="mb-10 rounded-[30px] bg-white p-6 shadow-sm md:p-8">

          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-xs uppercase tracking-[3px] text-[#8B6914]">
                Product Details
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {editingProduct
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>
            </div>

            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm transition hover:bg-black hover:text-white"
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-2"
          >

            {/* PRODUCT NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Tulip Crochet Keychain"
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017]"
              />
            </div>

            {/* PRICE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Price (Rs.) *
              </label>

              <input
                type="number"
                name="price"
                min="0"
                step="1"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 600"
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017]"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Keychains"
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017]"
              />
            </div>

            {/* IMAGE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-2xl border border-dashed border-gray-300 bg-[#F7F1E3]/50 px-5 py-4 text-sm"
              />

              {editingProduct && (
                <p className="mt-2 text-xs text-gray-400">
                  Leave empty if you don't want
                  to change the current image.
                </p>
              )}
            </div>

            {/* DESCRIPTION */}

            <div className="lg:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Write something about this product..."
                className="w-full resize-none rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#D4A017]"
              />

            </div>

            {/* IMAGE PREVIEW */}

            {imagePreview && (
              <div className="lg:col-span-2">

                <p className="mb-3 text-sm font-medium">
                  Image Preview
                </p>

                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="h-52 w-52 rounded-3xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/placeholder.png";
                  }}
                />

              </div>
            )}

            {/* SUBMIT BUTTON */}

            <div className="lg:col-span-2">

              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#D4A017] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>

            </div>

          </form>

        </section>

        {/* =================================================
            PRODUCT LIST
        ================================================= */}

        <section className="rounded-[30px] bg-white p-6 shadow-sm md:p-8">

          <div className="mb-7 flex items-center justify-between gap-4">

            <div>
              <p className="text-xs uppercase tracking-[3px] text-[#8B6914]">
                Your Collection
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                All Products
              </h2>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="rounded-full border border-gray-200 px-5 py-2.5 text-sm transition hover:bg-black hover:text-white disabled:opacity-50"
            >
              ↻ Refresh
            </button>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="py-16 text-center text-gray-500">
              Loading products...
            </div>
          )}

          {/* ERROR + NO PRODUCTS */}

          {!loading &&
            error &&
            products.length === 0 && (
              <div className="py-16 text-center">

                <div className="text-4xl">
                  ⚠️
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  Unable to load products
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Please check the API connection
                  and try again.
                </p>

                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-5 rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
                >
                  Try Again
                </button>

              </div>
            )}

          {/* NO PRODUCTS */}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="py-16 text-center">

                <div className="text-4xl">
                  🧶
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  No products yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Add your first crochet product above.
                </p>

              </div>
            )}

          {/* PRODUCTS */}

          {!loading &&
            products.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {products.map((product) => (
                  <div
                    key={
                      product._id ||
                      product.id ||
                      product.name
                    }
                    className="overflow-hidden rounded-[25px] border border-gray-100 bg-[#F7F1E3]/40"
                  >

                    {/* IMAGE */}

                    <div className="relative">

                      <img
                        src={getImageUrl(
                          product.image
                        )}
                        alt={
                          product.name ||
                          "Product"
                        }
                        className="h-64 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/placeholder.png";
                        }}
                      />

                      <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm">
                        {product.category ||
                          "Crochet"}
                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="p-5">

                      <h3 className="text-lg font-bold">
                        {product.name ||
                          "Unnamed Product"}
                      </h3>

                      <p className="mt-2 text-xl font-bold text-[#8B6914]">
                        Rs.{" "}
                        {Number(
                          product.price || 0
                        ).toLocaleString()}
                      </p>

                      {product.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                          {product.description}
                        </p>
                      )}

                      {/* ACTIONS */}

                      <div className="mt-5 flex gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(product)
                          }
                          className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-[#D4A017] hover:text-black"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product)
                          }
                          className="rounded-full border border-red-200 px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

        </section>

      </div>

    </div>
  );
}
