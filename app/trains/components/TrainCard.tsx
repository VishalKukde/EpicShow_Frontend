"use client";

import { Train } from "@/types/Train";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, IndianRupee, Sofa, Sparkles, Star, TrainFront, Users } from "lucide-react";

interface TrainCardProps {
  train: Train;
  selectedDate: string;
}

export default function TrainCard({ train, selectedDate }: TrainCardProps) {
  const bookedSeats = Math.max(train.totalSeats - train.availableSeats, 0);
  const occupancy = train.totalSeats
    ? Math.min(100, Math.round((bookedSeats / train.totalSeats) * 100))
    : 0;
  const highlightedAmenity = train.amenities?.[0] ?? "Reserved coach";
  const waitlisted = train.availableSeats <= 0;

  return (
    <Link href={`/trains/${train._id}?date=${selectedDate}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_48px_-32px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-950">
        <div className="relative h-44 overflow-hidden bg-slate-200 sm:h-48">
          <Image
            src={train.imageUrl ?? "/dummy.webp"}
            alt={train.trainName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <TrainFront size={13} />
              {train.trainType}
            </span>
          </div>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-950 shadow-sm">
            <Star size={13} fill="currentColor" />
            {train.rating}
          </span>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-lg font-bold leading-tight text-white line-clamp-1">{train.trainName}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              #{train.trainNumber}
            </p>
          </div>
        </div>

        <div className="space-y-5 p-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-950 dark:text-slate-50">{train.fromStation}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{train.departureTime}</p>
            </div>
            <div className="flex min-w-20 flex-col items-center">
              <div className="flex w-full items-center gap-1 text-cyan-600">
                <span className="h-2 w-2 rounded-full bg-current" />
                <span className="h-px flex-1 bg-current/35" />
                <ArrowRight size={15} />
                <span className="h-px flex-1 bg-current/35" />
                <span className="h-2 w-2 rounded-full bg-current" />
              </div>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <Clock3 size={11} />
                {train.duration}
              </span>
            </div>
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-bold text-slate-950 dark:text-slate-50">{train.toStation}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{train.arrivalTime}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                <Users size={13} />
                {waitlisted ? `WL ${Number(train.waitlistCount || 0) + 1}` : `${train.availableSeats} seats left`}
              </span>
              <span className="font-semibold text-slate-400">
                {waitlisted ? "Waitlist open" : `${occupancy}% booked`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                style={{ width: `${occupancy}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-200">
              <Sparkles size={12} />
              {highlightedAmenity}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              <Sofa size={12} />
              Reserved
            </span>
          </div>

          <div className="flex items-end justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">From</p>
              <p className="mt-1 flex items-center text-2xl font-black text-slate-950 dark:text-slate-50">
                <IndianRupee size={18} />
                {train.price.toLocaleString()}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition group-hover:bg-cyan-600 dark:bg-white dark:text-slate-950 dark:group-hover:bg-cyan-300">
              Book
              <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
