"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UpcomingMovieCard from "./UpcomingMovieCard";
import UpcomingMovieModal from "./UpcomingMovieModal";
import type { MovieRowItem } from "./MovieRow";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";

interface UpcomingMovieRowProps {
    title?: string;
    movies: MovieRowItem[];
    limit?: number;
    showViewAll?: boolean;
    viewAllHref?: string;
    onViewAll?: () => void;
}

export default function UpcomingMovieRow({
    title = "Upcoming Movies",
    movies,
    limit = 5,
    showViewAll = true,
    viewAllHref = "/movies",
    onViewAll,
}: UpcomingMovieRowProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const [selectedMovie, setSelectedMovie] = useState<MovieRowItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewAll = () => {
        if (onViewAll) {
            onViewAll();
        } else if (viewAllHref) {
            router.push(viewAllHref);
        }
    };

    useEffect(() => {
        if (!user) {
            setWishlistIds(new Set());
            return;
        }

        let active = true;
        apiFetch("/getwishlist", { method: "GET", notifyOnError: false })
            .then((res) => {
                if (!active) return;
                const list = Array.isArray(res?.data) ? res.data : [];
                const ids = new Set<string>(
                    list.map((m: { _id?: string; id?: string }) => String(m._id || m.id))
                );
                setWishlistIds(ids);
            })
            .catch(() => {
                if (active) setWishlistIds(new Set());
            });

        return () => {
            active = false;
        };
    }, [user]);

    const handleToggleWishlist = async (movieId: string) => {
        if (!user) {
            toast.error("Please log in to add movies to your favorites.", "Login Required");
            return;
        }

        const isCurrentlyWishlisted = wishlistIds.has(movieId);
        const updated = new Set(wishlistIds);

        if (isCurrentlyWishlisted) {
            updated.delete(movieId);
        } else {
            updated.add(movieId);
        }
        setWishlistIds(updated);

        try {
            const res = await apiFetch("/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movieId }),
            });

            if (res?.action === "added") {
                toast.success("Added to your favorites!", "Saved");
            } else if (res?.action === "removed") {
                toast.info("Removed from your favorites.", "Updated");
            }
        } catch {
            // Rollback on error
            setWishlistIds(wishlistIds);
            toast.error("Failed to update favorites. Please try again.");
        }
    };

    const displayedMovies = typeof limit === "number" && limit > 0 ? movies.slice(0, limit) : movies;

    if (!displayedMovies || displayedMovies.length === 0) return null;

    return (
        <>
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 mx-auto mb-16 max-w-7xl sm:mb-24"
            >
                {/* Header */}
                <div className="mb-6 flex items-end justify-between gap-3 text-left">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                                Releasing Soon
                            </span>
                        </div>
                        <h2 className="section-header text-2xl font-semibold tracking-tight text-slate-900 dark:text-white lg:text-3xl">
                            {title}
                        </h2>
                    </div>

                    {showViewAll && (
                        <button
                            type="button"
                            onClick={handleViewAll}
                            className="group cursor-pointer inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:text-white shadow-xs backdrop-blur-sm hover:shadow-sm shrink-0"
                        >
                            View all
                            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </button>
                    )}
                </div>

                {/* Movies Grid */}
                <div className="relative min-h-[220px]">
                    <motion.div
                        className="
              flex gap-5 overflow-x-auto overflow-y-hidden pb-4
              sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
              sm:overflow-visible sm:pb-0
              no-scrollbar
            "
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
                        {displayedMovies.map((m, i) => {
                            const movieId = String(m.id || m.tmdbId || m.title);
                            const isWishlisted = wishlistIds.has(movieId);

                            return (
                                <motion.div
                                    key={movieId}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="min-w-[240px] max-w-[280px] snap-start sm:min-w-0 sm:max-w-[280px]"
                                >
                                    <UpcomingMovieCard
                                        movie={m}
                                        isWishlisted={isWishlisted}
                                        onToggleWishlist={handleToggleWishlist}
                                        onClick={() => {
                                            setSelectedMovie(m);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </motion.section>

            {/* Modal detail */}
            <UpcomingMovieModal
                open={isModalOpen}
                movie={selectedMovie}
                isWishlisted={
                    selectedMovie
                        ? wishlistIds.has(String(selectedMovie.id || selectedMovie.tmdbId || selectedMovie.title))
                        : false
                }
                onToggleWishlist={handleToggleWishlist}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedMovie(null);
                }}
            />
        </>
    );
}
