"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PageTransition from "@/app/components/PageTransition";
import { apiFetch } from "@/lib/api";
import { Train } from "@/types/Train";
import { toast } from "@/lib/toast";
import { ArrowLeft, ArrowRight, Minus, Plus, Shuffle } from "lucide-react";
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
          <div className="max-w-7xl mx-auto px-5">
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
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button
              onClick={() => router.push(`/trains?date=${journeyDate}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
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
            className="mb-6 mt-14 overflow-hidden rounded-2xl "
          >
            <div className="flex flex-col gap-4 p-0 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => router.push(`/trains?date=${journeyDate}`)}
                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <TrainInfo train={train} />
              </Suspense>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="sticky top-28 h-fit"
            >
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_48px_-34px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-950">
                <div className="bg-slate-950 p-6 text-white dark:bg-white dark:text-slate-950">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] opacity-70">Booking Summary</p>
                  <h3 className="mt-2 text-2xl font-black">Confirm your ride</h3>
                </div>

                <div className="space-y-6 p-6">
                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">From</p>
                      <p className="font-bold text-slate-950 dark:text-slate-50">{train.fromStation}</p>
                    </div>
                    <ArrowRight size={18} className="mt-4 text-cyan-600" />
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-slate-500">To</p>
                      <p className="font-bold text-slate-950 dark:text-slate-50">{train.toStation}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
	                  <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
	                    Passengers: <span className="font-bold text-slate-950 dark:text-slate-50">{passengerCount}</span>
	                  </p>
                    <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                      Journey Date: <span className="font-bold text-slate-950 dark:text-slate-50">{journeyDate}</span>
                    </p>
                    <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                      Availability:{" "}
                      <span className="font-bold text-slate-950 dark:text-slate-50">
                        {train.availableSeats > 0
                          ? `${train.availableSeats} seats available`
                          : `WL ${Number(train.waitlistCount || 0) + 1}`}
                      </span>
                    </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPassengerCount((value) => Math.max(1, value - 1))}
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                      aria-label="Decrease passengers"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="flex h-10 min-w-16 items-center justify-center rounded-xl bg-cyan-50 px-4 font-bold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-200">
                      {passengerCount}
                    </div>
                    <button
	                      onClick={() => setPassengerCount((value) => Math.min(10, value + 1))}
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                      aria-label="Increase passengers"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-cyan-50 p-3 text-xs text-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-200">
                    <Shuffle size={16} className="mt-0.5 shrink-0" />
                    Seats are auto-allotted randomly after you continue.
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Base Price</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">₹{train.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Passengers</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">×{passengerCount}</span>
                  </div>
                  <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Total</span>
                    <span className="text-3xl font-black text-cyan-600 dark:text-cyan-300">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={handleBooking}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
	                  disabled={passengerCount < 1}
                  className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-slate-950 to-cyan-700 py-3 font-bold text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 dark:from-white dark:to-cyan-300 dark:text-slate-950"
                >
                  Continue to Passenger Details
                </motion.button>

                <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3 dark:border-cyan-900/70 dark:bg-cyan-950/40">
                  <p className="text-xs text-cyan-900 dark:text-cyan-200">
                    Complete passenger details on the next step. Seat numbers will already be auto-allotted.
                  </p>
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
