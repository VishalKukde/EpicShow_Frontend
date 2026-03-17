"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type MovieCardProps = {
  title: string;
  imageUrl?: string | null;
  showTitle?: boolean;
  releaseDate?: string | null;
  showReleaseDate?: boolean;
  onClick?: () => void;
};

function formatDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MovieCard({
  title,
  imageUrl,
  showTitle = true,
  releaseDate,
  showReleaseDate = false,
  onClick,
}: MovieCardProps) {
  const formattedDate = showReleaseDate ? formatDate(releaseDate) : null;
  return (
    <motion.div
      className="group relative cursor-pointer bg-transparent"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
    >
      {/* POSTER */}
      <div className="relative h-[440px] sm:h-[300px] lg:h-[320px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <Image
          src={imageUrl || "/dummy.webp"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 280px"
        />

        {formattedDate && (
          <div className="absolute top-3 left-3 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-sm">
            {formattedDate}
          </div>
        )}

        {showTitle && (
          <>
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80" />

            {/* Title overlay */}
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white text-sm font-semibold leading-tight line-clamp-2 drop-shadow">
                {title}
              </p>
            </div>
          </>
        )}

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/30 transition" />
      </div>

      {showTitle && (
        <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-slate-700 dark:group-hover:text-white transition">
          {title}
        </p>
      )}
    </motion.div>
  );
}
