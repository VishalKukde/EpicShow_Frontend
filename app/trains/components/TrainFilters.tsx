"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Filter, Search, SlidersHorizontal, X } from "lucide-react";

interface TrainFiltersProps {
  onFilterChange: (filters: TrainFilterOptions) => void;
  trainTypes: string[];
}

export interface TrainFilterOptions {
  search: string;
  trainType?: string;
  priceRange: [number, number];
  minRating?: number;
  sortBy?: "price-low" | "price-high" | "rating" | "duration";
}

export default function TrainFilters({
  onFilterChange,
  trainTypes,
}: TrainFiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "rating" | "duration">("price-low");
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback(() => {
    onFilterChange({
      search,
      trainType: selectedType,
      priceRange,
      minRating,
      sortBy,
    });
  }, [search, selectedType, priceRange, minRating, sortBy, onFilterChange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedType(undefined);
    setPriceRange([0, 10000]);
    setMinRating(undefined);
    setSortBy("price-low");
  };

  // Trigger filter change when any value changes
  useEffect(() => {
    const timer = setTimeout(handleFilterChange, 300);
    return () => clearTimeout(timer);
  }, [search, selectedType, priceRange, minRating, sortBy, handleFilterChange]);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-[0_22px_44px_-34px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-950/90"
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input
              type="text"
              placeholder="Search by train, station, or train number"
              value={search}
              onChange={handleSearch}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-cyan-700 dark:focus:bg-slate-950 dark:focus:ring-cyan-950/50"
            />
          </label>

          <label className="relative block">
            <ArrowDownUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "price-low" | "price-high" | "rating" | "duration")
              }
              className="h-12 w-full min-w-48 appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-9 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-50 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-700 dark:focus:ring-cyan-950/50 cursor-pointer"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="duration">Fastest Duration</option>
            </select>
          </label>

          {/* <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:border-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <SlidersHorizontal size={17} />
            Refine
          </button> */}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap items-center gap-2"
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 cursor-pointer"
        >
          <Filter size={16} />
          Filters
        </button>

        {(search || selectedType || minRating || priceRange[0] > 0 || priceRange[1] < 10000) && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 cursor-pointer"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </motion.div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80"
        >
          {trainTypes.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">Train Type</h4>
              <div className="flex gap-2 flex-wrap">
                {trainTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? undefined : type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      selectedType === type
                        ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </h4>
            <div className="flex gap-3">
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])
                }
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-cyan-600 dark:bg-slate-800"
              />
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])
                }
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-cyan-600 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">Minimum Rating</h4>
            <div className="flex gap-2">
              {[3, 3.5, 4, 4.5, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(minRating === rating ? undefined : rating)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    minRating === rating
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800"
                  }`}
                >
                  ⭐ {rating}+
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
