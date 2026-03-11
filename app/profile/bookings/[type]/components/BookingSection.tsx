"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingList from "./BookingList";
import { apiFetch } from "@/lib/api";
import type { Booking } from "@/types/Booking";

const PAGE_SIZE = 8;

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
}: {
  apiEndpoint: string;
}) {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [bookings, setBookings] = useState<BookingWithShow[]>([]);

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
    // <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm relative">
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.35 }}
        // className="px-6 py-6"
      >
        <BookingList
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          filteredBookings={bookings}
        />
      </motion.div>
    </AnimatePresence>
    // </div>
  );
}
