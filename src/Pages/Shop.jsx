import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import ProductCard from "../Components/ProductCard";
import { useCart } from "../Context/CartContext";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BACKEND_URL =
  "https://the-yarn-spot.vercel.app";

const PRODUCTS_API =
  `${BACKEND_URL}/api/products`;

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

export default function Shop() {
  const {
    addToCart,
    totalItems,
  } = useCart();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const shopRef =
    useRef(null);

  const handmadeImageRef =
    useRef(null);

  // FETCH PRODUCTS

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              PRODUCTS_API
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to fetch products"
            );
          }

          console.log(
            "Products from API:",
            data
          );

          setProducts(
            Array.isArray(data)
              ? data
              : Array.isArray(
                  data.products
                )
              ? data.products
              : []
          );
        } catch (err) {
          console.error(
            "Products fetch error:",
            err
          );

          setError(
            err.message ||
              "Products load nahi ho sake."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, []);

  // GSAP ANIMATIONS

  useEffect(() => {
    const ctx =
      gsap.context(() => {
        const heroTimeline =
          gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
          });

        heroTimeline
          .from(".shop-label", {
            opacity: 0,
            y: 30,
            duration: 0.6,
          })
          .from(
            ".shop-title-1",
            {
              opacity: 0,
              rotateX: -90,
              y: 80,
              transformOrigin:
                "bottom center",
              duration: 1,
            },
            "-=0.2"
          )
          .from(
            ".shop-title-2",
            {
              opacity: 0,
              rotateX: -90,
              y: 80,
              transformOrigin:
                "bottom center",
              duration: 1,
            },
            "-=0.6"
          )
          .from(
            ".shop-description",
            {
              opacity: 0,
              z: -100,
              y: 30,
              duration: 0.7,
            },
            "-=0.4"
          );

        gsap.from(
          ".handmade-image",
          {
            scrollTrigger: {
              trigger:
                ".handmade-section",
              start: "top 80%",
            },
            opacity: 0,
            rotateY: -25,
            x: -70,
            duration: 1,
            transformPerspective: 1000,
          }
        );

        gsap.from(
          ".handmade-content",
          {
            scrollTrigger: {
              trigger:
                ".handmade-section",
              start: "top 80%",
            },
            opacity: 0,
            rotateY: 20,
            x: 60,
            duration: 1,
            transformPerspective: 1000,
          }
        );

        gsap.from(
          ".products-heading",
          {
            scrollTrigger: {
              trigger:
                ".products-heading",
              start: "top 85%",
            },
            opacity: 0,
            rotateX: -35,
            y: 50,
            duration: 0.8,
            transformPerspective: 1000,
          }
        );

        if (products.length > 0) {
          gsap.from(
            ".shop-product-card",
            {
              scrollTrigger: {
                trigger:
                  ".shop-products-grid",
                start: "top 85%",
              },
              opacity: 0,
              rotateY: 35,
              rotateX: 8,
              y: 70,
              transformPerspective: 1200,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
            }
          );
        }

        gsap.from(
          ".shop-custom-order",
          {
            scrollTrigger: {
              trigger:
                ".shop-custom-order",
              start: "top 85%",
            },
            opacity: 0,
            scale: 0.85,
            rotateX: 12,
            y: 70,
            transformPerspective: 1200,
            duration: 1,
            ease: "back.out(1.2)",
          }
        );
      }, shopRef);

    return () =>
      ctx.revert();
  }, [products]);

  // MOUSE 3D TILT

  const handleMouseMove =
    (e) => {
      const card =
        handmadeImageRef.current;

      if (!card) return;

      const rect =
        card.getBoundingClientRect();

      const x =
        e.clientX -
        rect.left;

      const y =
        e.clientY -
        rect.top;

      const centerX =
        rect.width / 2;

      const centerY =
        rect.height / 2;

      const rotateY =
        ((x - centerX) /
          centerX) *
        8;

      const rotateX =
        ((centerY - y) /
          centerY) *
        8;

      gsap.to(card, {
        rotateY,
        rotateX,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

  const handleMouseLeave =
    () => {
      if (
        !handmadeImageRef.current
      ) {
        return;
      }

      gsap.to(
        handmadeImageRef.current,
        {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: "power3.out",
        }
      );
    };

  return (
    <div
      ref={shopRef}
      className="min-h-screen bg-[#F7F1E3] text-[#171717]"
    >

      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 flex items-center justify-between bg-black px-6 py-5 text-white shadow-lg md:px-16">

        <a
          href="/"
          className="text-xl font-bold tracking-[2px] text-[#D4A017] md:text-2xl"
        >
          THE YARN SPOT
        </a>

        <div className="hidden items-center gap-8 text-sm md:flex">

          <a
            href="/"
            className="text-white transition hover:text-[#D4A017]"
          >
            Home
          </a>

          <a
            href="/shop"
            className="text-[#D4A017]"
          >
            Shop
          </a>

          <a
            href="/about"
            className="text-white transition hover:text-[#D4A017]"
          >
            About
          </a>

        </div>

        <a
          href="/cart"
          className="rounded-full border border-[#D4A017] px-5 py-2 text-white transition duration-300 hover:-translate-y-1 hover:bg-[#D4A017] hover:text-black"
        >
          Cart ({totalItems})
        </a>

      </nav>

      {/* HERO */}

      <section className="relative overflow-hidden bg-black text-white">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#D4A017] opacity-20 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-16 md:py-32">

          <div className="max-w-3xl [perspective:1000px]">

            <p className="shop-label mb-5 text-sm uppercase tracking-[5px] text-[#D4A017]">
              Handmade Collection
            </p>

            <h1 className="mb-7 text-5xl font-bold leading-[1.05] md:text-7xl">

              <span className="shop-title-1 block">
                Find Something
              </span>

              <span className="shop-title-2 block text-[#D4A017]">
                Made With Love.
              </span>

            </h1>

            <p className="shop-description max-w-xl text-lg leading-8 text-gray-300">
              Explore our handmade crochet collection.
              Every piece is created slowly, carefully and
              with a little bit of love.
            </p>

          </div>

        </div>

      </section>

      {/* HANDMADE IMAGE */}

      <section className="handmade-section overflow-hidden px-6 py-20 md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-10 md:grid-cols-2">

            <div className="[perspective:1200px]">

              <div
                ref={handmadeImageRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="handmade-image relative cursor-pointer overflow-hidden rounded-[30px]"
              >

                <img
                  src="/images/Crochet maker.jpeg"
                  alt="Handmade Crochet Process"
                  className="h-[700px] w-full object-cover transition-transform duration-700 hover:scale-105"
                />

                <div className="absolute bottom-6 left-6 rounded-full bg-black/80 px-5 py-3 text-sm text-white backdrop-blur-md">
                  Handmade Process
                </div>

              </div>

            </div>

            <div className="handmade-content">

              <p className="mb-4 text-sm uppercase tracking-[4px] text-[#8B6914]">
                Made By Hand
              </p>

              <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
                Every Loop Has
                <br />
                A Story.
              </h2>

              <p className="mb-7 leading-8 text-gray-600">
                From the first loop to the final stitch,
                every crochet piece takes time, patience
                and creativity.
              </p>

              <div className="flex gap-8">

                <div>

                  <p className="text-3xl font-bold">
                    100%
                  </p>

                  <p className="text-sm text-gray-500">
                    Handmade
                  </p>

                </div>

                <div>

                  <p className="text-3xl font-bold">
                    Handmade
                  </p>

                  <p className="text-sm text-gray-500">
                    Made With Love
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTS */}

      <section className="bg-white px-6 py-20 md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="products-heading mb-12">

            <p className="mb-3 text-sm uppercase tracking-[4px] text-[#8B6914]">
              Shop Collection
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Our Crochet Pieces
            </h2>

          </div>

          {loading && (
            <div className="py-10 text-center">
              <p className="text-gray-500">
                Loading products...
              </p>
            </div>
          )}

          {!loading &&
            error && (
              <div className="py-10 text-center">
                <p className="text-red-500">
                  {error}
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-gray-500">
                  No products found.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="shop-products-grid grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">

                {products.map(
                  (product) => (

                    <div
                      key={product._id}
                      className="shop-product-card"
                    >

                      <ProductCard
                        product={product}
                        onAddToCart={addToCart}
                      />

                    </div>

                  )
                )}

              </div>
            )}

        </div>

      </section>

      {/* CUSTOM ORDER */}

      <section className="overflow-hidden bg-[#F7F1E3] px-6 py-20 md:px-16">

        <div className="mx-auto max-w-7xl [perspective:1200px]">

          <div className="shop-custom-order relative overflow-hidden rounded-[35px] bg-[#D4A017] px-8 py-16 md:px-16">

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-black/10" />

            <div className="relative max-w-2xl">

              <p className="mb-4 text-sm uppercase tracking-[4px]">
                Need Something Different?
              </p>

              <h2 className="mb-5 text-4xl font-bold md:text-5xl">
                Make It Your Own.
              </h2>

              <p className="mb-8 text-lg leading-8 text-black/70">
                Want a different colour, size or design?
                Tell us what you have in mind and let's
                create something special for you.
              </p>

              <a
                href="https://wa.me/923451335590"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-black px-7 py-4 text-white transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-black"
              >
                Customize on WhatsApp
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="bg-black px-6 py-12 text-white md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-8 md:flex-row">

            <div>

              <h2 className="text-2xl font-bold text-[#D4A017]">
                THE YARN SPOT
              </h2>

              <p className="mt-3 text-gray-400">
                Handmade crochet, made with love.
              </p>

            </div>

            <div className="flex gap-7 text-sm text-gray-400">

              <a
                href="/"
                className="transition hover:text-white"
              >
                Home
              </a>

              <a
                href="/shop"
                className="transition hover:text-white"
              >
                Shop
              </a>

              <a
                href="/about"
                className="transition hover:text-white"
              >
                About
              </a>

            </div>

          </div>

          <div className="mt-10 border-t border-gray-800 pt-6 text-sm text-gray-500">
            © 2026 The Yarn Spot. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

