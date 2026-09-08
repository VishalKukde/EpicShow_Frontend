"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownUp, Check, Search, SlidersHorizontal, X } from "lucide-react";

interface TrainFiltersProps {
  onFilterChange: (filters: TrainFilterOptions) => void;
  trainTypes: string[];
  pnrButton?: React.ReactNode;
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
  pnrButton,
}: TrainFiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "rating" | "duration">("price-low");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const activeFiltersCount =
    (selectedType ? 1 : 0) +
    (minRating ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    (sortBy !== "price-low" ? 1 : 0);

  const handleFilterChange = useCallback(() => {
    onFilterChange({
      search,
      trainType: selectedType,
      priceRange,
      minRating,
      sortBy,
    });
  }, [search, selectedType, priceRange, minRating, sortBy, onFilterChange]);

  const clearFilters = () => {
    setSearch("");
    setSelectedType(undefined);
    setPriceRange([0, 10000]);
    setMinRating(undefined);
    setSortBy("price-low");
  };

  useEffect(() => {
    const timer = setTimeout(handleFilterChange, 300);
    return () => clearTimeout(timer);
  }, [search, selectedType, priceRange, minRating, sortBy, handleFilterChange]);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 ml-auto">
      {/* Small Search Bar on the extreme right group */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <input
          type="text"
          placeholder="Search train, station..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-full border border-slate-200 bg-slate-50/80 pl-8 pr-7 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-cyan-600"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Shifted Get PNR Status Button */}
      {pnrButton}

      {/* Filter Modal Trigger Button */}
      <button
        onClick={() => setIsFilterModalOpen(true)}
        className="relative inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <SlidersHorizontal size={14} className="text-cyan-600 dark:text-cyan-400" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-600 text-[10px] font-bold text-white">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 text-xs font-medium text-rose-600 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <X size={12} />
          <span>Reset</span>
        </button>
      )}

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-cyan-600 dark:text-cyan-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Train Search Filters
                  </h3>
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content Options */}
              <div className="max-h-[65vh] overflow-y-auto py-5 space-y-6 pr-1">
                {/* Price Sort & Other Sorting */}
                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ArrowDownUp size={14} />
                    Sort Options
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Price: Low to High", value: "price-low" },
                      { label: "Price: High to Low", value: "price-high" },
                      { label: "Top Rated", value: "rating" },
                      { label: "Fastest Duration", value: "duration" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as any)}
                        className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${sortBy === option.value
                          ? "border-cyan-600 bg-cyan-50 text-cyan-700 dark:border-cyan-500 dark:bg-cyan-950/60 dark:text-cyan-300 shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && <Check size={14} className="text-cyan-600 dark:text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Train Type / Class Filter */}
                {trainTypes.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Train Type & Class
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedType(undefined)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${!selectedType
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300"
                          }`}
                      >
                        All Types
                      </button>
                      {trainTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(selectedType === type ? undefined : type)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedType === type
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Price Range
                    </h4>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
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
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-cyan-600 dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Minimum Rating
                  </h4>
                  <div className="flex gap-2">
                    {[3, 3.5, 4, 4.5, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(minRating === rating ? undefined : rating)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${minRating === rating
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300"
                          }`}
                      >
                        ⭐ {rating}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Reset all
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="rounded-full bg-cyan-600 px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-cyan-500 transition-all cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
