"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import QuickAction from "./QuickAction";
import { Movie } from "@/types/Movie";
import { Backlight } from "@/app/components/Backlight";

type IMovieCardProps = {
    movie: Movie;
    onOpenAskAi?: () => void;
};

const MovieCard = ({ movie, onOpenAskAi }: IMovieCardProps) => {
    const fallbackPoster = "/dummy.webp";
    const posterSrc = movie.imageUrl ?? fallbackPoster;

    const reviewCount = Number(movie.total_reviews ?? 0);
    const averageRating = Number(movie.avg_rating ?? 0);
    const hasAudienceRating = reviewCount > 0;

    return (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
        >
            <div
                className="
                    relative overflow-hidden
                    rounded-2xl
                    border border-gray-200/70
                    p-4 sm:p-5
                    shadow-sm
                    backdrop-blur-xl
                "
            >
                <div
                    className="
                        relative z-10
                        flex flex-col
                        gap-4

                        sm:flex-row
                        sm:gap-6
                    "
                >
                    {/* Poster */}
                    <div className="flex justify-center sm:block">
                        {/* <Backlight className=""> */}
                            <div
                                className="
                                    relative
                                    h-[180px] w-[125px]
                                    flex-shrink-0
                                    overflow-hidden
                                    rounded-xl

                                    sm:h-[190px] sm:w-[130px]
                                    md:h-[200px] md:w-[140px]

                                    bg-gray-100
                                    shadow-lg
                                    ring-1 ring-black/5

                                    dark:bg-zinc-900
                                    dark:ring-white/10
                                "
                            >
                                <Image
                                    src={posterSrc}
                                    alt={movie.name}
                                    fill
                                    sizes="(max-width: 640px) 125px, 140px"
                                    className="object-cover"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLImageElement
                                        ).src = fallbackPoster;
                                    }}
                                />
                            </div>
                        {/* </Backlight> */}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                        {/* Title + Rating */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <h1
                                    className="
                                        truncate
                                        text-xl
                                        font-semibold
                                        tracking-tight
                                        text-gray-950

                                        sm:text-2xl
                                        dark:text-white
                                    "
                                >
                                    {movie.name}
                                </h1>

                                {/* Meta */}
                                <div
                                    className="
                                        mt-2
                                        flex flex-wrap
                                        items-center
                                        gap-x-2 gap-y-1
                                        text-xs
                                        text-gray-500

                                        dark:text-zinc-400
                                    "
                                >
                                    <span>{movie.runtimeMinutes} mins</span>

                                    <span className="h-1 w-1 rounded-full bg-gray-400" />

                                    <span>{movie.language}</span>

                                    {hasAudienceRating && (
                                        <>
                                            <span className="h-1 w-1 rounded-full bg-gray-400" />

                                            <span className="font-medium text-amber-600 dark:text-amber-400">
                                                Audience {averageRating.toFixed(1)}/5
                                            </span>

                                            <span>
                                                ({reviewCount})
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Rating */}
                            <div
                                className="
                                    flex-shrink-0
                                    rounded-xl
                                    bg-gray-100
                                    px-2.5 py-1.5
                                    text-sm
                                    font-semibold
                                    text-gray-800

                                    dark:bg-white/[0.06]
                                    dark:text-white
                                "
                            >
                                ⭐ {movie.rating}
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {movie.genre.map((genre) => (
                                <span
                                    key={genre}
                                    className="
                                        rounded-lg
                                        bg-gray-100
                                        px-2.5 py-1
                                        text-[11px]
                                        font-medium
                                        text-gray-600
                                        border border-gray-200

                                        dark:bg-white/[0.06]
                                        dark:text-zinc-300
                                    "
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Description */}
                        <p
                            className="
                                mt-3
                                max-w-3xl
                                text-sm
                                leading-6
                                text-gray-600

                                line-clamp-2

                                dark:text-zinc-400
                            "
                        >
                            {movie.description}
                        </p>

                        {/* Action */}
                        <div className="mt-4">
                            <QuickAction
                                movieTitle={movie.name}
                                releaseDate={movie.releaseDate}
                                movieId={movie._id}
                                reviewCount={reviewCount}
                                onOpenAskAi={onOpenAskAi}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default MovieCard;

