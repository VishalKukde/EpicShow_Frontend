"use client";

import { motion } from "framer-motion";
import MovieCard from "./MovieCard";

export type MovieRowItem = {
  id?: string;
  tmdbId?: number;
  title: string;
  imageUrl?: string | null;
  releaseDate?: string | null;
  description?: string | null;
  rating?: number | null;
  voteCount?: number | null;
};

interface MovieRowProps {
  title: string;
  movies: MovieRowItem[];
  showTitles?: boolean;
  showReleaseDate?: boolean;
  onMovieClick?: (movie: MovieRowItem) => void;
  showViewAll?: boolean;
}

export default function MovieRow({
  title,
  movies,
  showTitles = true,
  showReleaseDate = false,
  onMovieClick,
  showViewAll = true,
}: MovieRowProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative z-10 mx-auto mb-16 max-w-7xl sm:mb-24"
    >
      {/* HEADER */}
      <div className="mb-5 flex flex-col items-start gap-3 text-left">
        <h2 className="section-header text-2xl lg:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>

        {showViewAll && (
          <button className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">
            View all →
          </button>
        )}
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
              key={m.id ?? m.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              viewport={{ once: true }}
              className="min-w-[280px] sm:min-w-0"
              whileHover={{ y: -6 }}
            >
              <MovieCard
                title={m.title}
                imageUrl={m.imageUrl}
                showTitle={showTitles}
                releaseDate={m.releaseDate}
                showReleaseDate={showReleaseDate}
                onClick={onMovieClick ? () => onMovieClick(m) : undefined}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
