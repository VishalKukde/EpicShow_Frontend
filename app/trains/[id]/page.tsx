"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PageTransition from "@/app/components/PageTransition";
import { apiFetch } from "@/lib/api";
import { Train } from "@/types/Train";
import { toast } from "@/lib/toast";
import { ArrowLeft, Minus, Plus, Shuffle } from "lucide-react";
import TrainLoader from "../components/TrainLoader";

// Lazy load components for code splitting
const TrainInfo = lazy(() => import("./components/TrainInfo"));

function LoadingSpinner() {
  return <TrainLoader compact />;
}

function getTomorrowDateString() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateRandomTrainSeats(totalSeats: number, passengerCount: number) {
  const maxSeat = Math.max(totalSeats, passengerCount);
  const picked = new Set<number>();

  while (picked.size < passengerCount) {
    picked.add(Math.floor(Math.random() * maxSeat) + 1);
  }

  return Array.from(picked)
    .sort((a, b) => a - b)
    .map((seat) => `T${seat.toString().padStart(3, "0")}`);
}

export default function TrainDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const journeyDate = searchParams.get("date") || getTomorrowDateString();
  const [train, setTrain] = useState<Train | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    async function loadTrain() {
      try {
        setLoading(true);
        const data = await apiFetch(`/trains/${id}?date=${journeyDate}`, { publicRequest: true });
        setTrain(data);
      } catch {
        setError("Failed to load train details");
        setTrain(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadTrain();
  }, [id, journeyDate]);

  useEffect(() => {
    if (train) {
      setTotalPrice(passengerCount * train.price);
    }
  }, [passengerCount, train]);

  const handleBooking = () => {
    if (!train) return;

    if (passengerCount < 1) {
      toast.warning("Please add at least one passenger");
      return;
    }

    if (journeyDate < getTomorrowDateString()) {
      toast.warning("Please select a journey date from tomorrow onward");
      return;
    }

    const seats = generateRandomTrainSeats(10, passengerCount);
    router.push(`/trains/${id}/passenger-details?seats=${seats.join(",")}&date=${journeyDate}`);
  };

  // Loading UI
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-20">
          <div className="mx-auto max-w-7xl px-5">
            <TrainLoader label="Loading train details..." />
          </div>
        </div>
      </PageTransition>
    );
  }

  // Error UI
  if (error && !train) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <p className="mb-4 text-xl font-bold text-red-600">{error}</p>
            <button
              onClick={() => router.push(`/trains?date=${journeyDate}`)}
              className="no-gradient rounded-xl bg-cyan-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-cyan-500"
            >
              Go Back to Trains
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!train) return null;

  return (
    <PageTransition>
      <div className="min-h-screen select-none bg-background">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 mt-14 flex items-center justify-between"
          >
            <button
              onClick={() => router.push(`/trains?date=${journeyDate}`)}
              className="no-gradient inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <ArrowLeft size={16} />
              Back to Trains
            </button>

            <div className="no-gradient hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                Journey Date:{" "}
                <strong className="font-bold text-slate-900 dark:text-white">{journeyDate}</strong>
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Suspense fallback={<LoadingSpinner />}>
                <TrainInfo train={train} />
              </Suspense>
            </div>

            {/* Right Column: Clean Luxury Reservation Console */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="sticky top-28 h-fit"
            >
              <div className="no-gradient overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                {/* Solid Luxury Dark Header */}
                <div className="no-gradient border-b border-slate-800 bg-slate-900 p-6 text-white dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-400">
                    Reservation Details
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                    Book Berths
                  </h2>
                </div>

                <div className="space-y-6 p-6">
                  {/* Journey Date & Status */}
                  <div className="no-gradient rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500 dark:text-zinc-400">
                        Journey Date
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {journeyDate}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500 dark:text-zinc-400">
                        Seat Status
                      </span>
                      <span
                        className={`font-bold ${
                          train.availableSeats > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-500"
                        }`}
                      >
                        {train.availableSeats > 0
                          ? `${train.availableSeats} Berths Available`
                          : `Waitlist (WL ${Number(train.waitlistCount || 0) + 1})`}
                      </span>
                    </div>
                  </div>

                  {/* Passenger Counter */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        Passengers
                      </label>
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                        Max 10 per booking
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPassengerCount((value) => Math.max(1, value - 1))}
                        disabled={passengerCount <= 1}
                        className="no-gradient inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-800 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        aria-label="Decrease passengers"
                      >
                        <Minus size={16} />
                      </button>

                      <div className="no-gradient flex h-11 flex-1 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-50 px-4 font-mono text-base font-bold text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-200">
                        {passengerCount} {passengerCount === 1 ? "Passenger" : "Passengers"}
                      </div>

                      <button
                        onClick={() => setPassengerCount((value) => Math.min(10, value + 1))}
                        disabled={passengerCount >= 10}
                        className="no-gradient inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-800 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        aria-label="Increase passengers"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="no-gradient mt-3 flex items-center gap-2 rounded-xl bg-slate-100 p-2.5 text-xs text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                      <Shuffle size={14} className="shrink-0 text-cyan-600 dark:text-cyan-400" />
                      <span>Berths auto-allotted on reservation.</span>
                    </div>
                  </div>

                  {/* Fare Breakdown */}
                  <div className="space-y-2.5 border-t border-slate-200 pt-4 dark:border-zinc-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-zinc-400">
                        Ticket Fare (₹{train.price.toLocaleString()} × {passengerCount})
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-zinc-400">
                        Reservation & IRCTC Fee
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        FREE
                      </span>
                    </div>

                    <div className="my-2 h-px bg-slate-200 dark:bg-zinc-800" />

                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white">
                          Total Amount
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                          All taxes included
                        </span>
                      </div>
                      <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Solid Primary Action Button (STRICTLY NO GRADIENTS) */}
                  <motion.button
                    onClick={handleBooking}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={passengerCount < 1}
                    className="no-gradient w-full cursor-pointer rounded-xl bg-cyan-600 py-3.5 font-bold text-white shadow-xs transition-colors duration-200 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-white"
                  >
                    Continue to Passenger Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
