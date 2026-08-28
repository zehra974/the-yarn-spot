import React, { useEffect, useRef } from "react";
import { useCart } from "../Context/CartContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 13,
    name: "Crochet Daisy Cardigan",
    price: 5000,
    image: "/images/cardigan .jpeg",
  },
  {
    id: 14,
    name: "Crochet Baby Beanie and Shoes Set",
    price: 1500,
    image: "/images/beanie and shoe set.jpeg",
  },
  {
    id: 15,
    name: "Viral Summer Donut Bag",
    price: 4000,
    image: "/images/summer donus bag - Copy.jpeg",
  },
];

export default function Home() {
  const { addToCart, totalItems } = useCart();
  const homeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // HERO ANIMATION
      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      heroTimeline
        .from(".hero-label", {
          opacity: 0,
          y: 20,
          duration: 0.4,
        })
        .from(
          ".hero-line-1",
          {
            opacity: 0,
            y: 50,
            duration: 0.6,
          },
          "-=0.2"
        )
        .from(
          ".hero-line-2",
          {
            opacity: 0,
            y: 50,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
          },
          "-=0.3"
        )
        .from(
          ".hero-buttons",
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
          },
          "-=0.3"
        )
        .from(
          ".hero-image",
          {
            opacity: 0,
            scale: 0.95,
            duration: 0.7,
          },
          "-=0.5"
        );

      // HERO IMAGE FLOAT
      gsap.to(".hero-image", {
        y: -8,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // FEATURED HEADING
      gsap.from(".featured-heading", {
        scrollTrigger: {
          trigger: ".featured-heading",
          start: "top 95%",
        },
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power2.out",
      });

      // PRODUCT CARDS — FAST INSTANT REVEAL
      gsap.from(".home-product-card", {
        scrollTrigger: {
          trigger: ".home-products-grid",
          start: "top 100%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 10,
        duration: 0.2,
        stagger: 0,
        ease: "power1.out",
      });

      // WHY CROCHET
      gsap.from(".why-content", {
        scrollTrigger: {
          trigger: ".why-section",
          start: "top 90%",
        },
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: "power2.out",
      });

      // CUSTOM ORDER
      gsap.from(".custom-box", {
        scrollTrigger: {
          trigger: ".custom-box",
          start: "top 95%",
        },
        opacity: 0,
        y: 25,
        duration: 0.5,
        ease: "power2.out",
      });

      // ABOUT IMAGE
      gsap.from(".about-image", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 90%",
        },
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: "power2.out",
      });

      // ABOUT TEXT
      gsap.from(".about-text", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 90%",
        },
        opacity: 0,
        x: 30,
        duration: 0.6,
        ease: "power2.out",
      });

      // SOCIAL
      gsap.from(".social-content", {
        scrollTrigger: {
          trigger: ".social-section",
          start: "top 95%",
        },
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power2.out",
      });

    }, homeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={homeRef}
      className="min-h-screen bg-[#F7F1E3] text-[#171717]"
    >

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-3 bg-black text-white">

        <a href="/" className="flex items-center">
          <img
            src="/images/Logo.png"
            alt="The Yarn Spot"
            className="w-16 h-16 object-contain rounded-full"
          />
        </a>

        <div className="hidden md:flex gap-8 text-sm">

          <a
            href="/"
            className="text-[#D4A017] transition duration-300"
          >
            Home
          </a>

          <a
            href="/shop"
            className="text-white hover:text-[#D4A017] transition duration-300"
          >
            Shop
          </a>

          <a
            href="/about"
            className="text-white hover:text-[#D4A017] transition duration-300"
          >
            About
          </a>

        </div>

        <a
          href="/cart"
          className="border border-[#D4A017] bg-transparent text-white px-4 py-2 rounded-full hover:bg-[#D4A017] hover:text-black hover:-translate-y-1 transition duration-300"
        >
          🛒 Cart ({totalItems})
        </a>

      </nav>


      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 min-h-[600px] items-center px-6 md:px-16 py-16 gap-12 overflow-hidden">

        <div>

          <p className="hero-label uppercase tracking-[4px] text-sm text-[#8B6914] mb-5">
            Handmade With Love
          </p>

          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">

            <span className="hero-line-1 block">
              Little Things,
            </span>

            <span className="hero-line-2 block text-[#B8860B]">
              Made With Yarn.
            </span>

          </h2>

          <p className="hero-description text-gray-700 max-w-lg text-lg leading-8 mb-8">
            Beautiful handmade crochet pieces created with patience,
            creativity and lots of love.
          </p>

          <div className="hero-buttons flex flex-wrap gap-4">

            <a
              href="/shop"
              className="inline-block bg-black text-white px-7 py-4 rounded-full font-medium hover:bg-[#D4A017] hover:text-black hover:-translate-y-1 transition-all duration-300"
            >
              Shop Collection
            </a>

            <a
              href="https://wa.me/923451335590"
              className="inline-block border border-black bg-transparent text-black px-7 py-4 rounded-full font-medium hover:bg-black hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              WhatsApp Us
            </a>

          </div>

        </div>


        {/* HERO IMAGE */}
        <div className="hero-image relative">

          <div className="absolute -inset-4 border border-[#D4A017] rounded-[40px] rotate-3"></div>

          <img
            src="/images/crochet rose flower.jpeg"
            alt="Handmade Crochet"
            className="relative w-full h-[500px] object-cover rounded-[40px]"
          />

        </div>

      </section>


      {/* FEATURED PRODUCTS */}
      <section className="px-6 md:px-16 py-20 bg-white">

        <div className="featured-heading flex justify-between items-end mb-12">

          <div>

            <p className="uppercase tracking-[3px] text-sm text-[#8B6914] mb-3">
              Our Collection
            </p>

            <h2 className="text-4xl font-bold">
              Featured Crochet
            </h2>

          </div>

          <a
            href="/shop"
            className="hidden md:block text-black hover:text-[#D4A017] underline underline-offset-4 transition duration-300"
          >
            View All
          </a>

        </div>


        {/* FAST REVEAL PRODUCT CARDS */}
        <div className="home-products-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {products.map((product) => (

            <div
              key={product.id}
              className="home-product-card group hover:-translate-y-2 transition duration-300"
            >

              <div className="overflow-hidden rounded-2xl bg-[#F7F1E3]">

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[350px] object-cover group-hover:scale-105 transition duration-500"
                />

              </div>

              <div className="flex justify-between items-center mt-5 gap-4">

                <div>

                  <h3 className="font-semibold text-lg">
                    {product.name}
                  </h3>

                  <p className="text-[#8B6914] mt-1">
                    Rs. {product.price.toLocaleString()}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="shrink-0 bg-black text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#D4A017] hover:text-black hover:rotate-90 transition duration-300"
                >
                  +
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* WHY HANDMADE */}
      <section className="why-section px-6 md:px-16 py-24 bg-black text-white">

        <div className="why-content max-w-4xl mx-auto text-center">

          <p className="uppercase tracking-[4px] text-[#D4A017] text-sm mb-5">
            Why Crochet?
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mb-7">
            Made Slowly.
            <br />
            Made Meaningfully.
          </h2>

          <p className="text-gray-300 leading-8 max-w-2xl mx-auto">
            Every piece is handmade with care, making each creation
            slightly different and truly special. We believe handmade
            products carry a little more warmth and personality.
          </p>

        </div>

      </section>


      {/* CUSTOM ORDER */}
      <section className="px-6 md:px-16 py-20">

        <div className="custom-box bg-[#D4A017] rounded-[35px] p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8">

          <div>

            <p className="uppercase tracking-[3px] text-sm mb-3">
              Made For You
            </p>

            <h2 className="text-4xl font-bold mb-4">
              Want Something Custom?
            </h2>

            <p className="max-w-xl">
              Have a different colour, size or design in mind?
              Tell us what you are looking for and we'll discuss it
              with you on WhatsApp.
            </p>

          </div>

          <a
            href="https://wa.me/923451335590"
            className="bg-black text-white px-8 py-4 rounded-full whitespace-nowrap hover:bg-white hover:text-black hover:-translate-y-1 transition duration-300"
          >
            Chat on WhatsApp
          </a>

        </div>

      </section>


      {/* ABOUT MAKER */}
      <section className="about-section grid md:grid-cols-2 gap-12 px-6 md:px-16 py-20 bg-white items-center overflow-hidden">

        <div className="about-image">

          <img
            src="https://i.pinimg.com/1200x/59/1a/bd/591abdd37e5653d699d0ee337d8cd6d4.jpg"
            alt="Crochet maker"
            className="w-full h-[450px] object-cover rounded-3xl"
          />

        </div>

        <div className="about-text">

          <p className="uppercase tracking-[3px] text-sm text-[#8B6914] mb-4">
            Our Story
          </p>

          <h2 className="text-4xl font-bold mb-6">
            A Small Idea,
            <br />
            Stitched Into Something Special.
          </h2>

          <p className="text-gray-600 leading-8 mb-6">
            What started as a creative hobby slowly became a small
            handmade business. Every product is created with care,
            balancing creativity with a passion for crochet.
          </p>

          <a
            href="/about"
            className="text-black hover:text-[#D4A017] font-semibold underline underline-offset-4 transition duration-300"
          >
            Read Our Story →
          </a>

        </div>

      </section>


      {/* SOCIAL */}
      <section className="social-section text-center px-6 py-24">

        <div className="social-content">

          <p className="uppercase tracking-[3px] text-sm text-[#8B6914] mb-4">
            Stay Connected
          </p>

          <h2 className="text-4xl font-bold mb-5">
            Follow Our Handmade Journey
          </h2>

          <p className="text-gray-600 mb-8">
            See our latest crochet creations and behind-the-scenes work.
          </p>

          <div className="flex flex-wrap justify-center gap-4">

            <a
              href="https://www.instagram.com/_.theyarnspot._?igsi=Mjl2YzA5ODY4czRr"
              className="bg-black text-white px-7 py-3 rounded-full hover:bg-[#D4A017] hover:text-black hover:-translate-y-1 transition duration-300"
            >
              Instagram
            </a>

            <a
              href="https://wa.me/923451335590"
              className="border border-black bg-transparent text-black px-7 py-3 rounded-full hover:bg-black hover:text-white hover:-translate-y-1 transition duration-300"
            >
              WhatsApp
            </a>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-black text-white px-6 md:px-16 py-10">

        <div className="flex flex-col md:flex-row justify-between gap-6">

          <div>

            <h2 className="text-xl font-bold text-[#D4A017]">
              THE YARN SPOT
            </h2>

            <p className="text-gray-400 mt-2">
              Handmade crochet, made with love.
            </p>

          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-400">

            <a
              href="/shop"
              className="hover:text-[#D4A017] transition duration-300"
            >
              Shop
            </a>

            <a
              href="/about"
              className="hover:text-[#D4A017] transition duration-300"
            >
              About
            </a>

            <a
              href="https://www.instagram.com/_.theyarnspot._?igsi=Mjl2YzA5ODY4czRr"
              className="hover:text-[#D4A017] transition duration-300"
            >
              Instagram
            </a>

            <a
              href="https://wa.me/923451335590"
              className="hover:text-[#D4A017] transition duration-300"
            >
              WhatsApp
            </a>

          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-500">
          © 2026 The Yarn Spot. All rights reserved.
        </div>

      </footer>

    </div>
  );
}