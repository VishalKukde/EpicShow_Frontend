"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Heart, Lock } from "lucide-react";
import type { MovieRowItem } from "./MovieRow";

type UpcomingMovieCardProps = {
    movie: MovieRowItem;
    isWishlisted?: boolean;
    onToggleWishlist?: (movieId: string) => void;
    onClick?: () => void;
};

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
};

function calculateTimeLeft(targetDateStr?: string | null): TimeLeft {
    if (!targetDateStr) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
    }
    const target = new Date(targetDateStr).getTime();
    if (Number.isNaN(target)) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
    }
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPast: false };
}

function formatDate(value?: string | null) {
    if (!value) return "Coming Soon";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function extractTwoPosterColors(imageUrl: string): Promise<{ dark: string; light: string } | null> {
    return new Promise((resolve) => {
        if (!imageUrl) return resolve(null);
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = 32;
                canvas.height = 32;
                const ctx = canvas.getContext("2d");
                if (!ctx) return resolve(null);
                ctx.drawImage(img, 0, 0, 32, 32);

                // Color 1: Top half
                const topData = ctx.getImageData(0, 0, 32, 16).data;
                let r1 = 0, g1 = 0, b1 = 0, c1 = 0;
                for (let i = 0; i < topData.length; i += 16) {
                    r1 += topData[i];
                    g1 += topData[i + 1];
                    b1 += topData[i + 2];
                    c1++;
                }
                r1 = Math.round(r1 / c1);
                g1 = Math.round(g1 / c1);
                b1 = Math.round(b1 / c1);

                // Color 2: Bottom half
                const bottomData = ctx.getImageData(0, 16, 32, 16).data;
                let r2 = 0, g2 = 0, b2 = 0, c2 = 0;
                for (let i = 0; i < bottomData.length; i += 16) {
                    r2 += bottomData[i];
                    g2 += bottomData[i + 1];
                    b2 += bottomData[i + 2];
                    c2++;
                }
                r2 = Math.round(r2 / c2);
                g2 = Math.round(g2 / c2);
                b2 = Math.round(b2 / c2);

                const dark1 = `rgba(${Math.round(r1 * 0.4)}, ${Math.round(g1 * 0.4)}, ${Math.round(b1 * 0.4)}, 0.95)`;
                const dark2 = `rgba(${Math.round(r2 * 0.25)}, ${Math.round(g2 * 0.25)}, ${Math.round(b2 * 0.25)}, 0.98)`;
                const darkGradient = `linear-gradient(135deg, ${dark1} 0%, ${dark2} 100%)`;

                const lr1 = Math.round(255 - (255 - r1) * 0.45);
                const lg1 = Math.round(255 - (255 - g1) * 0.45);
                const lb1 = Math.round(255 - (255 - b1) * 0.45);

                const lr2 = Math.round(255 - (255 - r2) * 0.45);
                const lg2 = Math.round(255 - (255 - g2) * 0.45);
                const lb2 = Math.round(255 - (255 - b2) * 0.45);

                const lightGradient = `linear-gradient(135deg, rgb(${lr1}, ${lg1}, ${lb1}) 0%, rgb(${lr2}, ${lg2}, ${lb2}) 100%)`;

                resolve({ dark: darkGradient, light: lightGradient });
            } catch {
                resolve(null);
            }
        };
        img.onerror = () => resolve(null);
    });
}

export default function UpcomingMovieCard({
    movie,
    isWishlisted = false,
    onToggleWishlist,
    onClick,
}: UpcomingMovieCardProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
        calculateTimeLeft(movie.releaseDate)
    );
    const [isDark, setIsDark] = useState(true);
    const [extractedGradients, setExtractedGradients] = useState<{ dark: string; light: string } | null>(null);

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!movie.releaseDate) return;
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(movie.releaseDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [movie.releaseDate]);

    useEffect(() => {
        if (!movie.imageUrl) return;
        extractTwoPosterColors(movie.imageUrl).then((grads) => {
            setExtractedGradients(grads);
        });
    }, [movie.imageUrl]);

    const movieId = movie.id || (movie.tmdbId ? String(movie.tmdbId) : null);
    const formattedDate = formatDate(movie.releaseDate);

    const handleHeartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (movieId && onToggleWishlist) {
            onToggleWishlist(movieId);
        }
    };

    const activeGradient = extractedGradients
        ? isDark
            ? extractedGradients.dark
            : extractedGradients.light
        : undefined;

    return (
        <motion.div
            className="group relative cursor-pointer select-none"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClick}
        >
            <div
                style={activeGradient ? { background: activeGradient } : undefined}
                className={`relative overflow-hidden rounded-[24px] border shadow-md transition-all duration-300 group-hover:shadow-xl ${activeGradient
                    ? isDark
                        ? "border-slate-700/60"
                        : "border-slate-200 bg-white/95 text-slate-900"
                    : "border-slate-200/80 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:group-hover:border-indigo-500/40"
                    }`}
            >
                {/* Poster Container */}
                <div className="relative h-[340px] w-full overflow-hidden sm:h-[310px] lg:h-[340px]">
                    <Image
                        src={movie.imageUrl || "/dummy.webp"}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 240px, 280px"
                    />

                    {/* Top Row: Tickets Open Soon Badge + Heart Button */}
                    <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-slate-950/75 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-md shadow-sm">
                            <Lock className="h-3 w-3 text-amber-400" />
                            Tickets Open Soon
                        </span>

                        <button
                            type="button"
                            onClick={handleHeartClick}
                            title={isWishlisted ? "Remove from Favorites" : "Add to Favorites"}
                            aria-label={isWishlisted ? "Remove from Favorites" : "Add to Favorites"}
                            className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 cursor-pointer ${isWishlisted
                                ? "border-rose-500/50 bg-rose-500/20 text-rose-500 shadow-lg shadow-rose-500/20 scale-105"
                                : "border-white/25 bg-black/40 text-white hover:border-rose-400 hover:bg-black/60 hover:text-rose-400"
                                }`}
                        >
                            <Heart
                                className={`h-4 w-4 transition-transform duration-300 ${isWishlisted ? "fill-rose-500 scale-110" : ""
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
