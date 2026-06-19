"use client";

import { Train } from "@/types/Train";
import { AlertCircle, ArrowRight, CalendarDays, Clock3, Route, ShieldCheck, Sparkles, Star, TrainFront, Users } from "lucide-react";

interface TrainInfoProps {
  train: Train;
}

export default function TrainInfo({ train }: TrainInfoProps) {
  const bookedSeats = Math.max(train.totalSeats - train.availableSeats, 0);
  const occupancy = train.totalSeats
    ? Math.min(100, Math.round((bookedSeats / train.totalSeats) * 100))
    : 0;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_48px_-36px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-950">
        <div className="relative bg-slate-950 p-6 text-white dark:bg-white dark:text-slate-950">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] dark:border-slate-950/10 dark:bg-slate-950/5">
                <TrainFront size={14} />
                {train.trainType}
              </p>
              <h2 className="text-3xl font-black sm:text-4xl">{train.trainName}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 dark:text-slate-600">
                {train.description || "A curated rail route with simple booking, reserved seats, and transparent fare details."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur dark:border-slate-950/10 dark:bg-slate-950/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-60">Starts at</p>
              <p className="mt-1 text-3xl font-black">₹{train.price.toLocaleString()}</p>
              <p className="text-xs opacity-60">per passenger</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Departure</p>
              <p className="mt-1 truncate text-xl font-black text-slate-950 dark:text-slate-50">{train.fromStation}</p>
              <p className="mt-1 text-sm font-semibold text-cyan-700 dark:text-cyan-300">{train.departureTime}</p>
            </div>
            <div className="flex min-w-24 flex-col items-center">
              <div className="flex w-full items-center gap-1 text-cyan-600">
                <span className="h-2.5 w-2.5 rounded-full bg-current" />
                <span className="h-px flex-1 bg-current/40" />
                <ArrowRight size={18} />
                <span className="h-px flex-1 bg-current/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-current" />
              </div>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                <Clock3 size={13} />
                {train.duration}
              </span>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Arrival</p>
              <p className="mt-1 truncate text-xl font-black text-slate-950 dark:text-slate-50">{train.toStation}</p>
              <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{train.arrivalTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
              <Route size={20} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Route</p>
              <p className="font-bold text-slate-950 dark:text-slate-50">{train.trainNumber}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Users size={20} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Seats</p>
              <p className="font-bold text-slate-950 dark:text-slate-50">{train.availableSeats}/{train.totalSeats}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              <Star size={20} fill="currentColor" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Rating</p>
              <p className="font-bold text-slate-950 dark:text-slate-50">{train.rating}/5.0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">Coach Availability</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{occupancy}% of seats are currently booked</p>
          </div>
          <ShieldCheck className="text-emerald-600" size={24} />
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            style={{ width: `${occupancy}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-cyan-600" />
          <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">Amenities</h3>
        </div>
        {train.amenities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {train.amenities.map((amenity) => (
              <span key={amenity} className="rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-900 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-200">
                {amenity}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">Standard reserved seating is available for this train.</p>
        )}
      </div>

      {train.operatingDays?.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-cyan-600" />
            <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">Runs On</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {train.operatingDays.map((day) => (
              <span key={day} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {day}
              </span>
            ))}
          </div>
        </div>
      )}

      {train.availableSeats < 50 && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/40">
          <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-bold text-amber-900 dark:text-amber-200">Limited Availability</p>
            <p className="text-sm text-amber-800 dark:text-amber-300">Only {train.availableSeats} seats left. Book now to secure your journey.</p>
          </div>
        </div>
      )}
    </div>
  );
}
