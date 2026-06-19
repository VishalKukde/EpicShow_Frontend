"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CalendarClock, TrainFront, UserRoundCheck, UsersRound } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { SavedTrainPassenger } from "@/types/Train";

export default function SavedPassengersPage() {
  const [passengers, setPassengers] = useState<SavedTrainPassenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPassengers() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch("/trains/passengers", {
          notifyOnError: false,
        });

        if (!active) return;
        setPassengers(Array.isArray(data?.passengers) ? data.passengers : []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load saved passengers");
        setPassengers([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPassengers();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const adults = passengers.filter((passenger) => passenger.age >= 18).length;
    return {
      total: passengers.length,
      adults,
      minors: passengers.length - adults,
    };
  }, [passengers]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-4 sm:px-6 lg:px-0">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="bg-slate-950 p-6 text-white dark:bg-white dark:text-slate-950">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] opacity-70">
            <TrainFront size={15} />
            Train profile
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">Saved Passengers</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 opacity-70">
                Reuse passenger details during train checkout. These saved passengers are private to your account.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right dark:border-slate-950/10 dark:bg-slate-950/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Saved</p>
              <p className="text-3xl font-black">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="grid border-t border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-3">
          <Stat icon={UsersRound} label="Passengers" value={stats.total} tone="cyan" />
          <Stat icon={UserRoundCheck} label="Adults" value={stats.adults} tone="emerald" />
          <Stat icon={CalendarClock} label="Minors" value={stats.minors} tone="amber" />
        </div>
      </motion.section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-slate-50">Passenger List</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              These appear inside train passenger forms for faster booking.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : passengers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {passengers.map((passenger, index) => (
              <motion.div
                key={passenger._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                    <UserRoundCheck size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950 dark:text-slate-50">{passenger.name}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {passenger.age} years | {passenger.gender}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
            <UserRoundCheck className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-base font-black text-slate-950 dark:text-slate-50">No saved passengers yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Add passenger details during train booking and they will appear here for your next journey.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  tone: "cyan" | "emerald" | "amber";
}) {
  const toneClass = {
    cyan: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-300",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300",
  }[tone];

  return (
    <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 dark:border-slate-800 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${toneClass}`}>
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xl font-black text-slate-950 dark:text-slate-50">{value}</p>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
