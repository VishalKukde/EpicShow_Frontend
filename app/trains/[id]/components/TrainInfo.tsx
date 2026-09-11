"use client";

import { Train } from "@/types/Train";
import {
  CalendarDays,
  Clock3,
  Sparkles,
  Star,
  TrainFront,
  Users,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface TrainInfoProps {
  train: Train;
}

export default function TrainInfo({ train }: TrainInfoProps) {
  const waitlisted = train.availableSeats <= 0;

  return (
    <div className="space-y-6">
      {/* Primary Train Showcase Card */}
      <div className="no-gradient overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        {/* Luxury Banner (Solid rich dark slate tone in both themes for maximum contrast & premium prestige) */}
        <div className="no-gradient border-b border-slate-800 bg-slate-900 p-6 text-white dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
                  <TrainFront size={13} />
                  {train.trainType}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-xs font-bold text-slate-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  #{train.trainNumber}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-950/80 px-2.5 py-1 text-xs font-bold text-amber-300">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {train.rating}
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
                {train.trainName}
              </h1>

              {train.description && (
                <p className="max-w-2xl text-xs leading-relaxed text-slate-300 dark:text-zinc-400">
                  {train.description}
                </p>
              )}
            </div>

            {/* Starting Fare Pill */}
            <div className="no-gradient rounded-2xl border border-slate-800 bg-slate-800 px-5 py-3 text-right dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                Starting Fare
              </p>
              <p className="mt-0.5 text-2xl font-black text-cyan-400 sm:text-3xl">
                ₹{train.price.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                per passenger
              </p>
            </div>
          </div>
        </div>

        {/* Departure ➔ Duration ➔ Arrival Itinerary Board */}
        <div className="p-6 sm:p-8">
          <div className="no-gradient rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              {/* Departure */}
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                  Departure
                </p>
                <p className="mt-1 truncate text-lg font-black text-slate-900 dark:text-white sm:text-2xl">
                  {train.fromStation}
                </p>
                <p className="mt-1 font-mono text-base font-extrabold text-cyan-600 dark:text-cyan-400 sm:text-xl">
                  {train.departureTime}
                </p>
              </div>

              {/* Journey Duration Line */}
              <div className="flex min-w-28 flex-col items-center sm:min-w-36">
                <div className="flex w-full items-center gap-1 text-cyan-600 dark:text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-600 dark:bg-cyan-400" />
                  <span className="h-px flex-1 bg-cyan-600/40 dark:bg-cyan-400/40" />
                  <ArrowRight size={18} />
                  <span className="h-px flex-1 bg-cyan-600/40 dark:bg-cyan-400/40" />
                  <span className="h-2 w-2 rounded-full bg-cyan-600 dark:bg-cyan-400" />
                </div>
                <span className="no-gradient mt-2 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-bold text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  <Clock3 size={13} className="text-cyan-600 dark:text-cyan-400" />
                  {train.duration}
                </span>
              </div>

              {/* Arrival */}
              <div className="min-w-0 text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                  Arrival
                </p>
                <p className="mt-1 truncate text-lg font-black text-slate-900 dark:text-white sm:text-2xl">
                  {train.toStation}
                </p>
                <p className="mt-1 font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-xl">
                  {train.arrivalTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Highlights & Amenities (Only Required Data) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Availability & Operating Schedule */}
        <div className="no-gradient rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Schedule & Availability
            </h2>
          </div>

          <div className="space-y-4">
            {/* Berths Status */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
              <span className="text-xs text-slate-500 dark:text-zinc-400">Reservation Status</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  waitlisted
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300"
                    : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300"
                }`}
              >
                <Users size={12} />
                {waitlisted
                  ? `Waitlist (WL ${Number(train.waitlistCount || 0) + 1})`
                  : `${train.availableSeats} of ${train.totalSeats} Berths Available`}
              </span>
            </div>

            {/* Operating Days */}
            <div>
              <p className="mb-2 text-xs text-slate-500 dark:text-zinc-400">Operating Days</p>
              {train.operatingDays && train.operatingDays.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {train.operatingDays.map((day) => (
                    <span
                      key={day}
                      className="no-gradient rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-bold text-slate-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Operating daily across this route.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Onboard Amenities */}
        <div className="no-gradient rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Onboard Amenities
            </h2>
          </div>

          {train.amenities && train.amenities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {train.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="no-gradient rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200"
                >
                  {amenity}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Reserved seating, charging points, and comfort facilities included.
            </p>
          )}

          <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
            <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Verified Express Rail Network Partner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
