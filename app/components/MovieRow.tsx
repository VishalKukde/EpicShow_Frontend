"use client";

import { motion } from "framer-motion";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: string[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative z-10 mx-auto mb-16 max-w-7xl sm:mb-24"
    >
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl lg:text-2xl font-semibold tracking-tight text-gray-900">
          {title}
        </h2>

        <button className="text-sm text-gray-500 hover:text-gray-900 transition">
          View all →
        </button>
      </div>

      {/* SCROLL CONTAINER */}
      <div className="relative min-h-[200px] sm:min-h-0">
        <motion.div
          className="
            flex gap-5 overflow-x-auto overflow-y-hidden
            sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
            sm:overflow-visible
            no-scrollbar
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {movies.map((m, i) => (
            <motion.div
              key={m}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              viewport={{ once: true }}
              className="min-w-[280px] sm:min-w-0"
              whileHover={{ y: -6 }}
            >
              <MovieCard title={m} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
