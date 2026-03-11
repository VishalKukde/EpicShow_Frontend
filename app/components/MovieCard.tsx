"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function MovieCard({ title }: { title: string }) {
  return (
    <motion.div
      className="group relative cursor-pointer bg-transparent"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {/* POSTER */}
      <div className="relative h-[260px] sm:h-[300px] lg:h-[320px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <Image
          src="/dummy.webp"
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 280px"
        />

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80" />

        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white text-sm font-semibold leading-tight line-clamp-2 drop-shadow">
            {title}
          </p>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/30 transition" />
      </div>

      {/* Subtitle */}
      <p className="mt-3 text-sm font-medium text-gray-900 truncate group-hover:text-gray-700 transition">
        {title}
      </p>
    </motion.div>
  );
}
