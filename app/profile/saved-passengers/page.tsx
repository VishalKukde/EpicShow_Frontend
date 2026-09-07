"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CalendarClock, TrainFront, UserRoundCheck, UsersRound } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useThemeStore } from "@/store/themeStore";
import type { SavedTrainPassenger } from "@/types/Train";

export default function SavedPassengersPage() {
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const isDark = mode === "dark";
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
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-2 sm:px-6 lg:px-0 select-none">
      {/* Admin-Style Top Toolbar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 pt-1 border-b pb-4 ${isDark ? "border-zinc-800" : "border-slate-200"}`}>
        <div>
          <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? "text-zinc-50" : "text-slate-900"} dark:text-white`}>
            Saved Passengers
          </h1>
          <p className={`text-xs font-medium mt-0.5 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
            Reuse passenger details during train checkout. Private to your account.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${isDark
              ? "border border-zinc-700/60 bg-[#18181b] text-zinc-300"
              : "bg-slate-100 text-slate-700"
              }`}
          >
            {stats.total} {stats.total === 1 ? "passenger" : "passengers"} saved
          </span>

          <button
            type="button"
            onClick={() => router.push("/trains")}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-sm ${isDark
              ? "border border-zinc-700/70 bg-[#18181b] text-zinc-100 hover:bg-zinc-800"
              : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
          >
            <TrainFront className="h-3.5 w-3.5" />
            <span>Book Train</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${isDark
            ? "border-rose-900/60 bg-rose-950/40 text-rose-300"
            : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <section
        className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${isDark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          } dark:bg-[#18181b] dark:border-zinc-800`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-950"} dark:text-white`}>Passenger List</h2>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"} dark:text-zinc-400`}>
              These appear inside train passenger forms for faster booking.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`h-28 animate-pulse rounded-2xl border ${isDark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-slate-100"
                  } dark:bg-[#18181b] dark:border-zinc-800`}
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
                className={`rounded-2xl border p-4 ${isDark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-slate-50/80"
                  } dark:bg-[#18181b] dark:border-zinc-800`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isDark ? "bg-cyan-950/60 text-cyan-300" : "bg-cyan-50 text-cyan-700"
                      }`}
                  >
                    <UserRoundCheck size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className={`truncate font-black ${isDark ? "text-slate-50" : "text-slate-950"}`}>
                      {passenger.name}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {passenger.age} years | {passenger.gender}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className={`rounded-2xl border border-dashed px-5 py-12 text-center ${isDark ? "border-zinc-700/60 bg-[#18181b]" : "border-slate-300 bg-slate-50"
              } dark:bg-[#18181b] dark:border-zinc-800`}
          >
            <UserRoundCheck className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className={`mt-3 text-base font-black ${isDark ? "text-slate-50" : "text-slate-950"}`}>
              No saved passengers yet
            </h3>
            <p className={`mx-auto mt-2 max-w-md text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
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
  isDark,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  tone: "cyan" | "emerald" | "amber";
  isDark?: boolean;
}) {
  const toneClass = {
    cyan: isDark ? "bg-cyan-950/60 text-cyan-300" : "text-cyan-600 bg-cyan-50",
    emerald: isDark ? "bg-emerald-950/60 text-emerald-300" : "text-emerald-600 bg-emerald-50",
    amber: isDark ? "bg-amber-950/60 text-amber-300" : "text-amber-600 bg-amber-50",
  }[tone];

  return (
    <div
      className={`flex items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${isDark ? "border-zinc-800" : "border-slate-200"
        }`}
    >
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${toneClass}`}>
        <Icon size={18} />
      </span>
      <div>
        <p className={`text-xl font-black ${isDark ? "text-white" : "text-slate-950"}`}>{value}</p>
        <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
      </div>
    </div>
  );
}
