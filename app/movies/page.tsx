"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PageTransition from "../components/PageTransition";
import CategoryHero from "../components/CategoryHero";
import TicketGrid from "../components/TicketGrid";
import { ArrowLeft } from "lucide-react";
import { Movie } from "@/types/Movie";
import { apiFetch } from "@/lib/api";

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

useEffect(() => {
  async function loadMovies() {
    try {
      setLoading(true);
      const data = await apiFetch("/movies", { publicRequest: true });
      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadMovies();
}, []);

    return (
        <PageTransition>
            <div className="bg-background min-h-screen select-none">
                {/* 🎬 HERO */}
                <CategoryHero
                    title="Movies"
                    subtitle="Now showing in theatres near you"
                />

                {/* ⬅ Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-7xl mx-auto px-5 mb-6"
                >

                    <button
                        onClick={() => router.replace("/")}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 sm:px-4 sm:py-2">
                        <ArrowLeft size={16} />
                        Back
                    </button>

                </motion.div>

                {/* ⭐ Filters / Highlights */}
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="max-w-7xl mx-auto px-5 mb-14"
                >
                    <div className="flex gap-3 flex-wrap text-sm">
                        {["Trending", "Now Showing", "IMAX", "4DX", "Top Rated"].map(
                            (tag) => (
                                <button
                                    key={tag}
                                    className="
                    px-4 py-2 rounded-full
                    bg-white
                    border border-gray-200
                    text-gray-700
                    hover:bg-gray-100
                    transition
                  "
                                >
                                    {tag}
                                </button>
                            )
                        )}
                    </div>
                </motion.section>

                {/* 🎞 MOVIE GRID */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <TicketGrid
                        loading={loading}
                        items={movies as Movie[]}
                    />
                </motion.div>
            </div>
        </PageTransition>
    );
}
