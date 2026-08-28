import React, { useEffect, useRef } from "react";
import TextType from "../Components/TextType";

export default function About() {
  const journey = [
    {
      number: "01",
      title: "October 2025",
      text: "The Yarn Spot began with a simple love for crochet and the dream of building something of my own.",
    },
    {
      number: "02",
      title: "Learning & Growing",
      text: "From tangled yarns and uneven stitches to learning new patterns, every mistake became a lesson.",
    },
    {
      number: "03",
      title: "Today",
      text: "From tiny keychains and flowers to bags, bouquets and customized pieces, the journey keeps growing.",
    },
  ];

  const creations = [
    {
      icon: "🧶",
      title: "Keychains",
      text: "Small handmade pieces created to carry a little happiness with you.",
    },
    {
      icon: "🌼",
      title: "Flowers",
      text: "Crochet flowers that stay beautiful and last much longer than fresh ones.",
    },
    {
      icon: "👜",
      title: "Bags",
      text: "Handmade crochet bags designed with creativity, care and personality.",
    },
    {
      icon: "✨",
      title: "Customized",
      text: "Special handmade designs created according to your colours and ideas.",
    },
  ];

  const values = [
    {
      icon: "🧶",
      title: "Handmade",
      text: "Every piece is carefully made by hand instead of being mass produced.",
    },
    {
      icon: "♡",
      title: "Made With Love",
      text: "Patience, creativity and personal attention go into every creation.",
    },
    {
      icon: "✦",
      title: "Made For You",
      text: "Custom colours, designs and ideas can be discussed directly with us.",
    },
  ];

  const process = [
    {
      number: "01",
      title: "Choose",
      text: "Pick your favourite handmade piece from our collection.",
    },
    {
      number: "02",
      title: "Create",
      text: "Your crochet piece is carefully handmade with attention to detail.",
    },
    {
      number: "03",
      title: "Prepare",
      text: "We carefully check and prepare your order for delivery.",
    },
    {
      number: "04",
      title: "Deliver",
      text: "Your handmade piece makes its way to you with love.",
    },
  ];

  /* =========================
     3D CARD TILT
  ========================= */

  const handleTilt = (e) => {
    const card = e.currentTarget;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
    `;
  };

  const resetTilt = (e) => {
    e.currentTarget.style.transform = `
      perspective(900px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;
  };

  /* =========================
     IMAGE 3D TILT
  ========================= */

  const handleImageMove = (e) => {
    const container = e.currentTarget;

    const rect = container.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x - rect.width / 2) / rect.width) * 7;
    const rotateX = ((y - rect.height / 2) / rect.height) * -7;

    container.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.015)
    `;
  };

  const resetImage = (e) => {
    e.currentTarget.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#F7F1E3] text-[#171717]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/95 text-white backdrop-blur-lg">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-16">

          <a
            href="/"
            className="group flex items-center"
          >
            <span className="text-xl font-bold tracking-[2px] text-[#D4A017] transition-all duration-500 group-hover:tracking-[4px] md:text-2xl">
              THE YARN SPOT
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm md:flex">

            <a
              href="/"
              className="text-white transition duration-300 hover:text-[#D4A017]"
            >
              Home
            </a>

            <a
              href="/shop"
              className="text-white transition duration-300 hover:text-[#D4A017]"
            >
              Shop
            </a>

            <a
              href="/about"
              className="font-medium text-[#D4A017]"
            >
              About
            </a>

          </div>

          <a
            href="/cart"
            className="group relative overflow-hidden rounded-full border border-[#D4A017] px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-[#D4A017] hover:text-black md:px-5"
          >
            <span className="relative z-10">
              🛒 Cart
            </span>
          </a>

        </div>

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate overflow-hidden bg-black text-white">

        {/* GOLD GLOW */}

        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#D4A017]/20 blur-[130px]" />

        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#D4A017]/10 blur-[130px]" />

        {/* LUXURY RINGS */}

        <div className="luxury-ring absolute right-[-100px] top-[80px] hidden h-[420px] w-[420px] rounded-full border border-[#D4A017]/20 lg:block" />

        <div className="luxury-ring-two absolute right-[30px] top-[145px] hidden h-[270px] w-[270px] rounded-full border border-[#D4A017]/10 lg:block" />

        {/* SMALL FLOATING DOTS */}

        <div className="floating-dot absolute right-[27%] top-[28%] hidden h-2 w-2 rounded-full bg-[#D4A017] lg:block" />

        <div className="floating-dot-two absolute right-[12%] bottom-[25%] hidden h-1.5 w-1.5 rounded-full bg-[#D4A017]/70 lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-28 md:px-16 md:py-36">

          <div className="max-w-5xl">

            <div className="mb-7 flex items-center gap-3">

              <span className="h-[1px] w-12 bg-[#D4A017]" />

              <p className="uppercase tracking-[5px] text-[#D4A017] text-sm">
                Our Story
              </p>

            </div>

            {/* TEXT TYPE */}

            <h1 className="text-5xl font-bold leading-[1.05] md:text-7xl lg:text-8xl">

              <TextType
                text={[
                  "One Stitch At A Time.",
                  "One Dream At A Time.",
                ]}
                typingSpeed={65}
                deletingSpeed={35}
                pauseDuration={1100}
                initialDelay={200}
                showCursor
                cursorCharacter="|"
                cursorClassName="text-[#D4A017]"
              />

            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-300">
              A small handmade crochet business built with patience,
              creativity, mistakes, lessons and a whole lot of love.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <a
                href="/shop"
                className="luxury-button group relative overflow-hidden rounded-full bg-[#D4A017] px-7 py-4 font-medium text-black"
              >
                <span className="relative z-10">
                  Explore Collection →
                </span>
              </a>

              <a
                href="#story"
                className="rounded-full border border-white/30 px-7 py-4 font-medium text-white transition-all duration-300 hover:border-[#D4A017] hover:text-[#D4A017]"
              >
                Read Our Story
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section
        id="story"
        className="px-6 py-24 md:px-16"
      >

        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">

          {/* IMAGE */}

          <div
            className="story-image relative transition-transform duration-200 ease-out"
            onMouseMove={handleImageMove}
            onMouseLeave={resetImage}
          >

            <div className="absolute -inset-4 rounded-[40px] border border-[#D4A017]/70 rotate-2" />

            <div className="relative overflow-hidden rounded-[35px]">

              <img
                src="https://i.pinimg.com/736x/ea/06/80/ea06807ffd3bc8d5d959c1abb174e3ab.jpg"
                alt="Handmade crochet"
                className="h-[550px] w-full object-cover transition duration-700 hover:scale-105"
              />

              {/* IMAGE LIGHT */}

              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 opacity-0 transition duration-500 hover:opacity-100" />

            </div>

            {/* FLOATING YEAR CARD */}

            <div className="absolute -bottom-8 -right-3 rounded-2xl border border-[#D4A017]/20 bg-black px-6 py-5 text-white shadow-2xl transition-all duration-500 hover:-translate-y-2 md:-right-8">

              <p className="text-3xl font-bold text-[#D4A017]">
                2025
              </p>

              <p className="mt-1 text-sm text-gray-300">
                The Journey Started
              </p>

            </div>

          </div>


          {/* STORY CONTENT */}

          <div>

            <p className="mb-4 uppercase tracking-[4px] text-[#8B6914] text-sm">
              How It Started
            </p>

            <h2 className="mb-8 text-4xl font-bold leading-tight md:text-6xl">

              From A Little Dream

              <br />

              <span className="gold-text">
                To A Growing Brand.
              </span>

            </h2>

            <div className="space-y-5 leading-8 text-gray-600">

              <p>
                The Yarn Spot started with a simple love for crochet
                and a little dream of turning handmade creations into
                something of my own.
              </p>

              <p>
                I started this small business in{" "}
                <span className="font-semibold text-[#8B6914]">
                  October 2025
                </span>
                , not knowing where it would take me.
              </p>

              <p>
                In the beginning, crochet wasn't always easy.
                There were tangled yarns, uneven stitches, projects
                that didn't turn out the way I imagined and many
                moments of learning along the way.
              </p>

              <p>
                Learning new patterns, finding the right materials,
                managing orders, taking pictures and creating content
                became part of the journey.
              </p>

              <p>
                Slowly, those little struggles became lessons.
                Every finished piece gave me more confidence and
                every order reminded me why I started.
              </p>

              <p>
                From tiny keychains and flowers to bags, hair
                accessories, bouquets and customized pieces,
                <span className="font-semibold text-black">
                  {" "}The Yarn Spot has grown one stitch at a time.
                </span>
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          JOURNEY
      ===================================================== */}

      <section className="bg-white px-6 py-24 md:px-16">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto mb-16 max-w-2xl text-center">

            <p className="mb-4 uppercase tracking-[4px] text-[#8B6914] text-sm">
              The Journey
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Growing One Stitch At A Time.
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Every stage of The Yarn Spot has brought a new lesson,
              a new challenge and a new reason to keep creating.
            </p>

          </div>


          <div className="grid gap-7 md:grid-cols-3">

            {journey.map((item) => (

              <div
                key={item.number}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                className="luxury-card group relative overflow-hidden rounded-3xl border border-transparent bg-[#F7F1E3] p-8"
              >

                {/* GOLD CORNER */}

                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[50px] border-l border-b border-[#D4A017]/20 transition-all duration-500 group-hover:h-28 group-hover:w-28" />

                <div className="absolute -right-5 -top-8 text-[120px] font-bold text-black/[0.03]">
                  {item.number}
                </div>

                <span className="relative text-5xl font-bold text-[#D4A017]">
                  {item.number}
                </span>

                <h3 className="relative mb-4 mt-7 text-xl font-bold">
                  {item.title}
                </h3>

                <p className="relative leading-7 text-gray-600">
                  {item.text}
                </p>

                <div className="mt-7 h-[1px] w-0 bg-[#D4A017] transition-all duration-500 group-hover:w-16" />

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          THE MAKER
      ===================================================== */}

      <section className="relative overflow-hidden bg-black px-6 py-28 text-white md:px-16">

        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D4A017]/10 blur-[120px]" />

        {/* ROTATING RING */}

        <div className="slow-ring absolute left-1/2 top-1/2 hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4A017]/10 md:block" />

        <div className="relative mx-auto max-w-4xl text-center">

          <p className="mb-5 uppercase tracking-[4px] text-[#D4A017] text-sm">
            Meet The Maker
          </p>

          <div className="maker-icon mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4A017]/50 text-4xl">
            🧶
          </div>

          <h2 className="mb-8 text-4xl font-bold md:text-6xl">

            A Student With A

            <br />

            <span className="text-[#D4A017]">
              Passion For Creating.
            </span>

          </h2>

          <p className="mx-auto max-w-3xl leading-8 text-gray-400">
            Behind The Yarn Spot is a student building a small
            handmade business alongside her studies. From creating
            products to taking pictures, managing orders and creating
            content, much of the journey is handled personally with
            care and dedication.
          </p>

        </div>

      </section>


      {/* =====================================================
          WHAT WE CREATE
      ===================================================== */}

      <section className="px-6 py-24 md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="mb-16 text-center">

            <p className="mb-4 uppercase tracking-[4px] text-[#8B6914] text-sm">
              What We Create
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Made For Little Moments.
            </h2>

          </div>


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {creations.map((item) => (

              <div
                key={item.title}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                className="luxury-card group rounded-3xl bg-white p-8 text-center shadow-sm"
              >

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7F1E3] text-3xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg">
                  {item.icon}
                </div>

                <h3 className="mb-3 text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm leading-6 text-gray-600">
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="bg-[#111111] px-6 py-24 text-white md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="mb-16 text-center">

            <p className="mb-4 uppercase tracking-[4px] text-[#D4A017] text-sm">
              What We Believe
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Made With Intention.
            </h2>

          </div>


          <div className="grid gap-6 md:grid-cols-3">

            {values.map((item) => (

              <div
                key={item.title}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                className="luxury-card group rounded-3xl border border-white/10 p-8"
              >

                <div className="mb-6 text-4xl text-[#D4A017] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  {item.icon}
                </div>

                <h3 className="mb-4 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="leading-7 text-gray-400">
                  {item.text}
                </p>

                <div className="mt-7 h-[1px] w-0 bg-[#D4A017] transition-all duration-500 group-hover:w-20" />

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="bg-white px-6 py-24 md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="mb-14">

            <p className="mb-4 uppercase tracking-[4px] text-[#8B6914] text-sm">
              The Process
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              From Yarn To You.
            </h2>

          </div>


          <div className="relative grid gap-6 md:grid-cols-4">

            {/* CONNECTING LINE */}

            <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-[#D4A017]/20 md:block" />

            {process.map((item) => (

              <div
                key={item.number}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                className="luxury-card group relative rounded-3xl bg-[#F7F1E3] p-7"
              >

                <span className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-bold text-[#D4A017] transition-all duration-300 group-hover:bg-[#D4A017] group-hover:text-black group-hover:scale-110">
                  {item.number}
                </span>

                <h3 className="mt-6 text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CUSTOM CTA
      ===================================================== */}

      <section className="px-6 py-24 md:px-16">

        <div className="cta-box relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#D4A017] px-8 py-20 text-center md:px-16">

          <div className="cta-ring absolute -left-20 -top-20 h-64 w-64 rounded-full border-[35px] border-black/10" />

          <div className="cta-ring-two absolute -bottom-28 -right-20 h-72 w-72 rounded-full border-[40px] border-black/10" />

          <div className="relative">

            <p className="mb-4 uppercase tracking-[4px] text-sm">
              Have An Idea?
            </p>

            <h2 className="mb-6 text-4xl font-bold md:text-6xl">

              Let's Make Something

              <br />

              Special Together.

            </h2>

            <p className="mx-auto mb-9 max-w-2xl text-lg leading-8 text-black/70">
              Want a custom colour, size or design?
              Send us a message and let's talk about creating
              something especially for you.
            </p>

            <a
              href="https://wa.me/923451335590"
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-button inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 font-medium text-white"
            >
              Chat On WhatsApp
              <span>→</span>
            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-black px-6 py-12 text-white md:px-16">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">

            <div>

              <h2 className="text-2xl font-bold tracking-[2px] text-[#D4A017]">
                THE YARN SPOT
              </h2>

              <p className="mt-3 text-gray-400">
                Handmade crochet, made with love.
              </p>

            </div>


            <div className="flex flex-wrap gap-7 text-sm text-gray-400">

              <a
                href="/"
                className="transition hover:text-[#D4A017]"
              >
                Home
              </a>

              <a
                href="/shop"
                className="transition hover:text-[#D4A017]"
              >
                Shop
              </a>

              <a
                href="/about"
                className="transition hover:text-[#D4A017]"
              >
                About
              </a>

              <a
                href="https://www.instagram.com/_.theyarnspot._?igsi=Mjl2YzA5ODY4czRr"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#D4A017]"
              >
                Instagram
              </a>

            </div>

          </div>


          <div className="mt-10 flex flex-col gap-3 border-t border-gray-800 pt-6 text-sm text-gray-500 md:flex-row md:justify-between">

            <p>
              © 2026 The Yarn Spot. All rights reserved.
            </p>

            <p>
              Handmade with ♡
            </p>

          </div>

        </div>

      </footer>


      {/* =====================================================
          LUXURY ANIMATION CSS
      ===================================================== */}

      <style>{`

        /* =========================
           HERO RINGS
        ========================= */

        .luxury-ring {
          animation: luxuryRotate 18s linear infinite;
        }

        .luxury-ring-two {
          animation: luxuryRotateReverse 12s linear infinite;
        }

        @keyframes luxuryRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes luxuryRotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }


        /* =========================
           FLOATING DOTS
        ========================= */

        .floating-dot {
          animation: floatingDot 3s ease-in-out infinite;
        }

        .floating-dot-two {
          animation: floatingDot 4s ease-in-out infinite reverse;
        }

        @keyframes floatingDot {

          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.5;
          }

          50% {
            transform: translateY(-18px);
            opacity: 1;
          }

        }


        /* =========================
           TEXT GOLD SHINE
        ========================= */

        .gold-text {
          background: linear-gradient(
            110deg,
            #8B6914 20%,
            #D4A017 40%,
            #fff1a8 50%,
            #D4A017 60%,
            #8B6914 80%
          );

          background-size: 200% auto;

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;

          animation: goldShine 5s linear infinite;
        }

        @keyframes goldShine {

          0% {
            background-position: 200% center;
          }

          100% {
            background-position: -200% center;
          }

        }


        /* =========================
           LUXURY CARDS
        ========================= */

        .luxury-card {
          transform-style: preserve-3d;
          transition:
            transform 180ms ease-out,
            box-shadow 400ms ease,
            border-color 400ms ease;
          will-change: transform;
        }

        .luxury-card:hover {
          box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.10);
        }


        /* =========================
           STORY IMAGE
        ========================= */

        .story-image {
          transform-style: preserve-3d;
          will-change: transform;
        }


        /* =========================
           MAKER RING
        ========================= */

        .slow-ring {
          animation: slowRing 25s linear infinite;
        }

        @keyframes slowRing {

          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }

        }


        /* =========================
           MAKER ICON
        ========================= */

        .maker-icon {
          animation: makerFloat 3s ease-in-out infinite;
        }

        @keyframes makerFloat {

          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-7px);
          }

        }


        /* =========================
           CTA RINGS
        ========================= */

        .cta-ring {
          animation: ctaFloat 7s ease-in-out infinite;
        }

        .cta-ring-two {
          animation: ctaFloatReverse 9s ease-in-out infinite;
        }

        @keyframes ctaFloat {

          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }

          50% {
            transform: translate(15px, 12px) rotate(8deg);
          }

        }

        @keyframes ctaFloatReverse {

          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }

          50% {
            transform: translate(-15px, -10px) rotate(-8deg);
          }

        }


        /* =========================
           LUXURY BUTTON
        ========================= */

        .luxury-button {
          position: relative;
          transform: translateZ(0);
          transition:
            transform 300ms ease,
            box-shadow 300ms ease;
        }

        .luxury-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 80%;
          height: 100%;

          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.45),
            transparent
          );

          transform: skewX(-20deg);

          transition: left 700ms ease;
        }

        .luxury-button:hover::before {
          left: 140%;
        }

        .luxury-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 15px 35px rgba(212, 160, 23, 0.25);
        }


        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 768px) {

          .luxury-card {
            transform: none !important;
          }

          .story-image {
            transform: none !important;
          }

        }


        /* =========================
           REDUCE MOTION
        ========================= */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

        }

      `}</style>

    </div>
  );
}