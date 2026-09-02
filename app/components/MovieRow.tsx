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
  genre?: string[] | null;
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
      <div className="mb-6 flex items-end justify-between gap-3 text-left">
        <div className="flex flex-col items-start gap-2">

          <h2 className="section-header text-2xl font-semibold tracking-tight text-slate-900 dark:text-white lg:text-2xl">
            {title}
          </h2>
        </div>

        {showViewAll && (
          <button className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:text-white">
            View all
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>

      <div className="relative min-h-[200px] sm:min-h-0">
        <motion.div
          className="
            flex gap-4 overflow-x-auto overflow-y-hidden pb-2
            sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
            sm:overflow-visible sm:pb-0
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
              className="min-w-[220px] snap-start sm:min-w-0"
              whileHover={{ y: -8 }}
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
