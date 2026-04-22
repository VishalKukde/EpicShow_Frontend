"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingList from "./BookingList";
import { apiFetch } from "@/lib/api";
import type { Booking } from "@/types/Booking";
import { useThemeStore } from "@/store/themeStore";

const PAGE_SIZE = 6;

type BookingWithShow = Booking & {
  show: { name: string; imageUrl: string };
};

type BookingApiResponse = {
  data?: BookingWithShow[];
  pagination?: {
    hasMore?: boolean;
  };
};

export default function BookingSection({
  apiEndpoint,
  title,
}: {
  apiEndpoint: string;
  title: string;
}) {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [bookings, setBookings] = useState<BookingWithShow[]>([]);
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";

  const fetchBookings = useCallback(
    async (nextPage: number, append: boolean) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setBookings([]);
        }

        const separator = apiEndpoint.includes("?") ? "&" : "?";
        const endpoint = `${apiEndpoint}${separator}page=${nextPage}&limit=${PAGE_SIZE}`;
        const res = (await apiFetch(endpoint, { method: "GET" })) as BookingApiResponse;
        const nextChunk = Array.isArray(res.data) ? res.data : [];

        setBookings((prev) => (append ? [...prev, ...nextChunk] : nextChunk));
        setPage(nextPage);

        if (typeof res.pagination?.hasMore === "boolean") {
          setHasMore(res.pagination.hasMore);
        } else {
          setHasMore(nextChunk.length === PAGE_SIZE);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Failed to load bookings:", message);
        if (!append) {
          setBookings([]);
        }
        setHasMore(false);
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [apiEndpoint],
  );

  useEffect(() => {
    void fetchBookings(1, false);
  }, [fetchBookings]);

  const handleLoadMore = () => {
    if (loading || loadingMore || !hasMore) {
      return;
    }
    void fetchBookings(page + 1, true);
  };

  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35 }}
        className="flex h-full min-h-0 flex-col pt-5 lg:pt-6"
      >
        <div
          className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.8rem] border shadow-sm ${
            dark
              ? "border-zinc-700 bg-zinc-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className={`shrink-0 flex flex-col gap-3 border-b px-4 py-4 sm:px-4 ${dark ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${dark ? "text-zinc-500" : "text-gray-500"}`}>
                  Booking Collection
                </p>
                <h2 className={`mt-1 text-xl font-semibold tracking-tight ${dark ? "text-zinc-100" : "text-gray-900"}`}>
                  {title}
                </h2>
              </div>
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${
                  dark
                    ? "bg-zinc-800 text-zinc-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {loadingMore ? "Loading bookings" : `Total ${bookings.length} bookings`}
              </span>
            </div>
          </div>

          <BookingList
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            filteredBookings={bookings}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
