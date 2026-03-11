import { motion } from 'framer-motion'
import React from 'react'
import Image from "next/image";
import QuickAction from './QuickAction'
import { Movie } from '@/types/Movie';
import { useThemeStore } from '@/store/themeStore';

type IMovieCardProps = {
    movie: Movie;
}
const MovieCard = ({ movie }: IMovieCardProps) => {
    const fallbackPoster = "./dummy.webp";
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="p-2">
            <div className="relative flex flex-col sm:flex-row gap-6 sm:gap-8">
                {/* Poster */}
                <div className="
  relative 
  h-[140px] w-[95px] 
  sm:h-[170px] sm:w-[120px] 
  md:h-[200px] md:w-[140px] 
  rounded-2xl 
  overflow-hidden 
  bg-gray-200 
  flex-shrink-0 
  shadow-md
">
                    <Image
                        src={movie.imageUrl ?? fallbackPoster}
                        alt={movie.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackPoster;
                        }}
                    />
                </div>


                {/* Info */}
                <div className="flex-1 space-y-5">
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight">
                        {movie.name}
                    </h1>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span>{movie.runtimeMinutes} mins</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span>{movie.language}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span className="font-medium text-gray-800">⭐ {movie.rating}</span>
                    </div>

                    {/* 🎭 Genres */}
                    <div className="flex flex-wrap gap-2">
                        {movie.genre.map((genre) => (
                            <span
                                key={genre}
                                className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 max-w-2xl leading-relaxed line-clamp-3">
                        {movie.description}
                    </p>


                    <QuickAction />
                </div>
            </div>
        </motion.section>
    )
}

export default MovieCard