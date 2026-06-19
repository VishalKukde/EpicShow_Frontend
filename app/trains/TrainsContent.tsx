"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import PageTransition from "../components/PageTransition";
import CategoryHero from "../components/CategoryHero";
import TrainGrid from "./components/TrainGrid";
import TrainFilters, { TrainFilterOptions } from "./components/TrainFilters";
import { ArrowLeft, SearchCheck } from "lucide-react";
import { Train } from "@/types/Train";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";

function getTomorrowDateString() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TrainsContent() {
  const searchParams = useSearchParams();
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTomorrowDateString());
  useEffect(() => {
    const queryDate = searchParams.get("date");

    if (queryDate && queryDate >= getTomorrowDateString()) {
      setSelectedDate(queryDate);
    }
  }, [searchParams]);

  const [filters, setFilters] = useState<TrainFilterOptions>({
    search: "",
    priceRange: [0, 10000],
    sortBy: "price-low",
  });
  const router = useRouter();

  useEffect(() => {
    async function loadTrains() {
      try {
        setLoading(true);
        const data = await apiFetch(`/trains?date=${selectedDate}`, { publicRequest: true });
        setTrains(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load trains");
        setTrains([]);
      } finally {
        setLoading(false);
      }
    }

    loadTrains();
  }, [selectedDate]);

  // Filter and sort trains
  const filteredTrains = useMemo(() => {
    let result = [...trains];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (train) =>
          train.trainName.toLowerCase().includes(searchLower) ||
          train.trainNumber.toLowerCase().includes(searchLower) ||
          train.fromStation.toLowerCase().includes(searchLower) ||
          train.toStation.toLowerCase().includes(searchLower)
      );
    }

    // Train type filter
    if (filters.trainType) {
      result = result.filter((train) => train.trainType === filters.trainType);
    }

    // Price filter
    result = result.filter(
      (train) =>
        train.price >= filters.priceRange[0] &&
        train.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.minRating) {
      result = result.filter((train) => train.rating >= filters.minRating!);
    }

    // Sorting
    if (filters.sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "duration") {
      result.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    }

    return result;
  }, [trains, filters]);

  // Get unique train types for filter options
  const trainTypes = useMemo(() => {
    return Array.from(new Set(trains.map((t) => t.trainType))).sort();
  }, [trains]);

  return (
    <PageTransition>
      <div className="min-h-screen select-none bg-background">
        <CategoryHero
          title="Trains"
          subtitle="Fast routes, premium seats, and simple railway booking"
        />

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mb-6 flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.replace("/")}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <button
              onClick={() => router.push("/trains/pnrstatus")}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm transition-all duration-200 hover:bg-cyan-100 hover:text-cyan-900 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-950"
            >
              <SearchCheck size={16} />
              Get PNR Status
            </button>
            <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold normal-case tracking-normal text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              Journey Date
              <input
                type="date"
                min={getTomorrowDateString()}
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value || getTomorrowDateString())}
                className="bg-transparent text-sm font-bold outline-none"
              />
            </label>

          </div>
        </motion.div>

        {/* <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="mx-auto mb-6 grid max-w-7xl gap-3 px-5 sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                <Route size={18} />
              </span>
              <div>
                <p className="text-xl font-bold text-slate-950 dark:text-slate-50">{trains.length}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Routes available</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <IndianRupee size={18} />
              </span>
              <div>
                <p className="text-xl font-bold text-slate-950 dark:text-slate-50">
                  {lowestFare ? `₹${lowestFare.toLocaleString()}` : "₹0"}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Lowest fare today</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <Gauge size={18} />
              </span>
              <div>
                <p className="text-xl font-bold text-slate-950 dark:text-slate-50">{trainTypes.length}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Train classes</p>
              </div>
            </div>
          </div>
        </motion.section> */}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6"
        >
          <TrainFilters
            onFilterChange={setFilters}
            trainTypes={trainTypes}
          />
        </motion.section>

        {/* 📊 Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mx-auto mb-6 flex max-w-7xl items-center justify-between px-5"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-950 dark:text-slate-50">{filteredTrains.length}</span> curated routes
          </p>

        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <TrainGrid
            loading={loading}
            items={filteredTrains}
            selectedDate={selectedDate}
          />
        </motion.div>
      </div>
    </PageTransition>

  );
}

// Helper function to parse duration string
function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return hours * 60 + minutes;
}
