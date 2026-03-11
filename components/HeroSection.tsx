"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const posters = ["/dummy.webp", "/dummy.webp", "/dummy.webp", "/dummy.webp"];

export default function CinematicHeroSpotlight() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-gray-900 px-6 pt-32 pb-16 border-b-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center max-w-3xl"
      >
        <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6">
          Book your next
          <br />
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            cinematic experience
          </span>
        </h1>

        <p className="text-gray-500 mb-10 max-w-xl mx-auto">
          Discover trending movies, explore showtimes, and reserve seats — all
          through a beautifully simple experience.
        </p>

        {/* 🔍 Hero Search Bar */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl flex items-center px-4 py-3 gap-3 max-w-xl mx-auto">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            placeholder="Search movies, cinemas, shows..."
            className="w-full bg-transparent outline-none text-sm"
          />

          <button className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:opacity-90 transition">
            Search
          </button>
        </div>

        {/* CTA chips */}
        <div className="flex gap-3 justify-center mt-6 flex-wrap">
          <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm shadow-sm">
            Trending now
          </span>
          <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm shadow-sm">
            Top rated
          </span>
          <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm shadow-sm">
            Coming soon
          </span>
        </div>
      </motion.div>

      {/* 🎞 Floating Posters */}
      <div className="absolute inset-0 pointer-events-none hidden xl:block">
        {posters.map((src, i) => {
          const isLeft = i < 2;

          return (
            <motion.div
              key={i}
              className={`absolute w-[140px] h-[200px]
          ${i === 0 && "top-36 left-12 rotate-[-6deg]"}
          ${i === 1 && "bottom-20 left-20 rotate-[4deg]"}
          ${i === 2 && "top-36 right-16 rotate-[6deg]"}
          ${i === 3 && "bottom-20 right-12 rotate-[10deg]"}
        `}

              initial={{ opacity: 0, x: isLeft ? -120 : 120, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: i * 0.15 },
                x: { duration: 0.7, ease: "easeOut", delay: i * 0.15 },
                y: { repeat: Infinity, duration: 7 + i, ease: "easeInOut" },
              }}
            >
              <Image
                src={src}
                alt="poster"
                fill
                className="rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] object-cover"
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
