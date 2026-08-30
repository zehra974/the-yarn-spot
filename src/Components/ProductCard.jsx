
import React from "react";

const BACKEND_URL =
  "https://the-yarn-spot.vercel.app";

export default function ProductCard({
  product,
  onAddToCart, 
}) {
  const getImageUrl = (image) => {
    if (!image) {
      return "/images/placeholder.png";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `${BACKEND_URL}${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `${BACKEND_URL}/${image}`;
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `/${image}`;
  };

  const imageUrl =
    getImageUrl(product?.image);

  return (
    <div className="group">

      <div className="relative overflow-hidden rounded-[25px] bg-[#F7F1E3]">

        <img
          src={imageUrl}
          alt={
            product?.name ||
            "Crochet Product"
          }
          className="h-[380px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "/images/placeholder.png";
          }}
        />

        <button
          type="button"
          onClick={() =>
            onAddToCart(product)
          }
          className="
            absolute
            bottom-5
            right-5
            z-10
            flex
            h-12
            w-12
            cursor-pointer
            items-center
            justify-center
            rounded-full
            bg-black
            text-xl
            text-white
            shadow-lg
            transition
            duration-300
            hover:-translate-y-1
            hover:bg-[#D4A017]
            hover:text-black
          "
          aria-label={`Add ${
            product?.name ||
            "product"
          } to cart`}
        >
          +
        </button>

      </div>

      <div className="mt-5">

        <h3 className="text-lg font-semibold">
          {product?.name ||
            "Unnamed Product"}
        </h3>

        {product?.category && (
          <p className="mt-1 text-xs uppercase tracking-[2px] text-gray-400">
            {product.category}
          </p>
        )}

        <p className="mt-2 font-medium text-[#8B6914]">
          Rs.{" "}
          {Number(
            product?.price || 0
          ).toLocaleString()}
        </p>

        {product?.stock !==
          undefined && (
          <p
            className={`mt-1 text-xs ${
              Number(product.stock) > 0
                ? "text-gray-400"
                : "text-red-500"
            }`}
          >
            {Number(product.stock) > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>
        )}

      </div>

    </div>
  );
}

