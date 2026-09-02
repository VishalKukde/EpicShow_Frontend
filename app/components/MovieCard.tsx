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
      className="group relative cursor-pointer"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 group-hover:border-slate-300 group-hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-[0_18px_45px_rgba(2,6,23,0.35)]">
        <div className="relative h-[360px] overflow-hidden sm:h-[300px] lg:h-[330px]">
          <Image
            src={imageUrl || "/dummy.webp"}
            alt={title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 280px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent opacity-90" />

          {formattedDate && (
            <div className="absolute left-3 top-3 rounded-full border border-white/40 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-sm">
              {formattedDate}
            </div>
          )}

          {/* <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="rounded-2xl border border-white/15 bg-black/15 px-3 py-2 backdrop-blur-sm transition duration-300 group-hover:bg-black/25">
              {showTitle ? (
                <p className="text-sm font-semibold leading-snug text-white drop-shadow-sm">{title}</p>
              ) : (
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Now showing</p>
              )}
            </div>
          </div> */}
        </div>
      </div>

      {showTitle && (
        <p className="mt-3 line-clamp-1 text-sm font-medium text-slate-900 transition group-hover:text-slate-700 dark:text-slate-100 dark:group-hover:text-white">
          {title}
        </p>
      )}
    </motion.div>
  );
}
