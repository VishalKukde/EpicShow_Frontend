"use client";

import { Movie } from "@/types/Movie";
import Image from "next/image";
import Link from "next/link";

interface TicketCardProps {
movie: Movie;
}

export default function TicketCard({
movie
}: TicketCardProps) {
    return (
        <Link href={`/movies/${movie._id}`} >
            <div className="group cursor-pointer">
                {/* Poster */}
                <div
                    className="relative h-[280px] sm:h-[300px] lg:h-[300px] rounded-2xl overflow-hidden bg-gray-200 transition-all duration-300 ease-out lg:group-hover:scale-[1.05] lg:group-hover:shadow-lg">
                    <Image
                        src={movie.imageUrl ?? "/dummy.webp"}
                        alt={movie.name}
                        fill
                        sizes="(max-width: 640px) 50vw,
                 (max-width: 1024px) 33vw,
                 20vw"
                        className="object-cover"
                        priority={false}
                    />
                </div>

                {/* Info */}
                <div className="mt-2 sm:mt-2 lg:mt-5 space-y-1">
                    {/* Movie title */}
                    <p className="text-sm sm:text-base font-medium text-gray-900 leading-snug line-clamp-2">
                        {movie.name}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <span>{movie.runtimeMinutes} Mins</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span>{movie.language}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span className="text-gray-600 font-medium">⭐ {movie.rating}</span>
                    </div>
                </div>
            </div>
        </Link>

    );
}
