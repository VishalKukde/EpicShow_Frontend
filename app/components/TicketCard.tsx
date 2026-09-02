"use client";

import { Movie } from "@/types/Movie";
import Image from "next/image";
import Link from "next/link";

interface TicketCardProps {
  movie: Movie;
}

export default function TicketCard({ movie }: TicketCardProps) {
  return (
    <Link href={`/movies/${movie._id}`} className="group block">
      <div className="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_26px_55px_rgba(15,23,42,0.12)]">
        <div className="relative overflow-hidden rounded-[20px]">
          <div className="relative h-[290px] sm:h-[300px] lg:h-[330px] overflow-hidden">
            <Image
              src={movie.imageUrl ?? "/dummy.webp"}
              alt={movie.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              priority={false}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

            <div className="absolute left-3 top-3 flex items-center gap-2">
              <span className="rounded-full border border-white/30 bg-white/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                Now
              </span>
            </div>

            <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/20 px-2 py-1 text-[10px] font-semibold text-amber-100 backdrop-blur-sm">
              <span>★</span>
              <span>{movie.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
