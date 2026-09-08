"use client";

import { Train } from "@/types/Train";
import Link from "next/link";
import { ArrowRight, Clock3, IndianRupee, Star, TrainFront, Users } from "lucide-react";

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
    <Link href={`/trains/${train._id}?date=${selectedDate}`} className="group block h-full select-none">
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-500/40">
        {/* Header Block: Train Type, Rating, Train Name & Number */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-cyan-800 dark:border-cyan-900/60 dark:bg-cyan-950/60 dark:text-cyan-300">
                <TrainFront size={13} className="text-cyan-600 dark:text-cyan-400" />
                {train.trainType}
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500">
                #{train.trainNumber}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/80 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {train.rating}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-extrabold text-slate-950 transition-colors group-hover:text-cyan-600 dark:text-slate-50 dark:group-hover:text-cyan-400 line-clamp-1">
              {train.trainName}
            </h3>

            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border ${waitlisted
              ? "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50"
              : "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
              }`}>
              <Users size={12} />
              {waitlisted ? `WL ${Number(train.waitlistCount || 0) + 1}` : `${train.availableSeats} Available`}
            </span>
          </div>

          {/* Departure → Duration → Arrival Timeline */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-900 dark:bg-slate-900/50">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Departure</p>
                <p className="mt-0.5 truncate text-sm font-bold text-slate-900 dark:text-slate-100">{train.fromStation}</p>
                <p className="mt-0.5 text-xs font-mono font-extrabold text-cyan-700 dark:text-cyan-400">{train.departureTime}</p>
              </div>

              <div className="flex min-w-20 flex-col items-center">
                <div className="flex w-full items-center gap-1 text-cyan-600 dark:text-cyan-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="h-px flex-1 bg-current/40" />
                  <ArrowRight size={14} />
                  <span className="h-px flex-1 bg-current/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <Clock3 size={11} />
                  {train.duration}
                </span>
              </div>

              <div className="min-w-0 text-right">
                <p className="truncate text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Arrival</p>
                <p className="mt-0.5 truncate text-sm font-bold text-slate-900 dark:text-slate-100">{train.toStation}</p>
                <p className="mt-0.5 text-xs font-mono font-extrabold text-cyan-700 dark:text-cyan-400">{train.arrivalTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer: Fare & Book Action */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-slate-800/80">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fare starting at</p>
            <p className="mt-0.5 flex items-center text-xl font-black text-slate-950 dark:text-white">
              <IndianRupee size={16} />
              {train.price.toLocaleString()}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-cyan-600 dark:bg-white dark:text-slate-950 dark:group-hover:bg-cyan-400 dark:group-hover:text-slate-950">
            Book Ticket
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
