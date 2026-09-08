"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import PageTransition from "../components/PageTransition";
import CategoryHero from "../components/CategoryHero";
import TicketGrid from "../components/TicketGrid";
import { ArrowLeft, Check, Clock, Film, Filter, RotateCcw, Sparkles, X } from "lucide-react";
import { Movie } from "@/types/Movie";
import { apiFetch } from "@/lib/api";

type StatusFilter = "ALL" | "NOW" | "UPCOMING";

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("NOW");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function loadMovies() {
            try {
                setLoading(true);
                const data = await apiFetch("/movies", { publicRequest: true });
                const sorted = [...(Array.isArray(data) ? data : [])].sort((a, b) => {
                    const aTime = new Date(a.createdAt ?? a.updatedAt ?? 0).getTime();
                    const bTime = new Date(b.createdAt ?? b.updatedAt ?? 0).getTime();
                    return bTime - aTime;
                });
                setMovies(sorted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadMovies();
    }, []);

    // Lock scroll when filter modal is open
    useEffect(() => {
        if (isFilterModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isFilterModalOpen]);

    // Extract unique genres dynamically from fetched movies
    const availableGenres = useMemo(() => {
        const genreSet = new Set<string>();
        movies.forEach((m) => {
            if (Array.isArray(m.genre)) {
                m.genre.forEach((g) => genreSet.add(g));
            }
        });
        return Array.from(genreSet).sort();
    }, [movies]);

    // Filter movies by release status and multi-selected genres
    const filteredMovies = useMemo(() => {
        const nowTime = Date.now();
        return movies.filter((movie) => {
            const isUpcoming = movie.releaseDate
                ? new Date(movie.releaseDate).getTime() > nowTime
                : false;

            if (statusFilter === "NOW" && isUpcoming) return false;
            if (statusFilter === "UPCOMING" && !isUpcoming) return false;

            if (selectedGenres.length > 0) {
                if (!movie.genre || !movie.genre.some((g) => selectedGenres.includes(g))) {
                    return false;
                }
            }

            return true;
        });
    }, [movies, statusFilter, selectedGenres]);

    const activeFilterCount = selectedGenres.length;

    const toggleGenre = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const resetFilters = () => {
        setSelectedGenres([]);
    };

    return (
        <PageTransition>
            <div className="bg-background min-h-screen select-none pb-12">
                {/* 🎬 HERO */}
                <CategoryHero
                    title="Movies"
                    subtitle="Now showing & upcoming releases in theatres near you"
                />

                {/* ⬅ Top Action Bar: Back Button, Status Chips & Filter Button */}
                <div className="max-w-7xl mx-auto px-5 mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <button
                                onClick={() => router.replace("/")}
                                className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-700"
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>
                        </motion.div>

                        {/* Status Filter Chips right after Back Button */}
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex items-center gap-2 flex-wrap"
                        >
                            <button
                                type="button"
                                onClick={() => setStatusFilter("ALL")}
                                className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 shadow-sm ${statusFilter === "ALL"
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/20"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-700"
                                    }`}
                            >
                                <Sparkles size={14} />
                                <span>All Movies</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatusFilter("NOW")}
                                className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 shadow-sm ${statusFilter === "NOW"
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/20"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-700"
                                    }`}
                            >
                                <Film size={14} />
                                <span>Now Showing</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatusFilter("UPCOMING")}
                                className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 shadow-sm ${statusFilter === "UPCOMING"
                                    ? "bg-amber-500 text-white border-amber-500 shadow-amber-500/20"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-700"
                                    }`}
                            >
                                <Clock size={14} />
                                <span>Upcoming</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Filter Button */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            type="button"
                            onClick={() => setIsFilterModalOpen(true)}
                            className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 shadow-sm ${activeFilterCount > 0
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/20"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-700"
                                }`}
                        >
                            <Filter size={16} />
                            <span>Genre Filter</span>
                            {activeFilterCount > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* 🎞 MOVIE GRID */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <TicketGrid
                        loading={loading}
                        items={filteredMovies as Movie[]}
                    />
                </motion.div>

                {/* 🎛️ FILTER MODAL (Genre Only) */}
                <AnimatePresence>
                    {isFilterModalOpen && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm cursor-pointer"
                            onClick={() => setIsFilterModalOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl cursor-default space-y-6 dark:border-zinc-800 dark:bg-zinc-900"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Filter by Genre
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsFilterModalOpen(false)}
                                        className="cursor-pointer rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-gray-200"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Genres (Multi-Select) */}
                                {availableGenres.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                                                Select Genres
                                            </h4>
                                            {selectedGenres.length > 0 && (
                                                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                                    {selectedGenres.length} selected
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                            {availableGenres.map((genre) => {
                                                const isSelected = selectedGenres.includes(genre);
                                                return (
                                                    <button
                                                        key={genre}
                                                        type="button"
                                                        onClick={() => toggleGenre(genre)}
                                                        className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${isSelected
                                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300"
                                                            }`}
                                                    >
                                                        <span>{genre}</span>
                                                        {isSelected && <Check size={13} />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 text-center py-4">No genres available to filter.</p>
                                )}

                                {/* Footer Action Buttons */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-gray-200 transition-colors"
                                    >
                                        <RotateCcw size={14} />
                                        <span>Reset Genre</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsFilterModalOpen(false)}
                                        className="cursor-pointer px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-all"
                                    >
                                        Apply Filters ({filteredMovies.length})
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
}
