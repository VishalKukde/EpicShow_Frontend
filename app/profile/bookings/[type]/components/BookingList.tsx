import { AnimatePresence, motion } from "framer-motion";
import BookingCard from "./BookingCard";
import type { Booking } from "@/types/Booking";
import { CalendarFold, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

type BookingListItem = Booking & {
  show: {
    name: string;
    imageUrl: string;
  };
};

type BookingListProps = {
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  filteredBookings: BookingListItem[];
};

export default function BookingList({
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  filteredBookings,
}: BookingListProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-track-transparent sm:px-5 sm:py-6">
      {loading ? (
        <SkeletonList />
      ) : filteredBookings.length === 0 ? (
        <EmptyState dark={dark} />
      ) : (
        <motion.div
          layout
          className="mx-auto grid max-w-[1600px] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.96 }}
                transition={{
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.03,
                }}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.18 },
                }}
                className="group h-full"
              >
                <BookingCard
                  booking={booking}
                  title={booking.show.name}
                  posterUrl={booking.show.imageUrl}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredBookings.length > 0 && (
        <div className="mx-auto mt-8 flex w-full max-w-[1600px] flex-col items-center justify-center pb-4">
          {hasMore && !loadingMore ? (
            <button
              type="button"
              onClick={onLoadMore}
              className={`inline-flex min-h-11 items-center justify-center rounded-2xl border px-6 py-2.5 text-sm font-semibold shadow-sm transition ${
                dark
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              Load More
            </button>
          ) : null}

          {loadingMore ? (
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm ${
              dark ? "bg-zinc-900/90 text-zinc-200" : "bg-white/90 text-gray-700"
            }`}>
              <span className={`h-4 w-4 animate-spin rounded-full border-2 ${
                dark
                  ? "border-zinc-600 border-t-zinc-200"
                  : "border-gray-300 border-t-gray-700"
              }`} />
              Loading more bookings...
            </div>
          ) : null}

          {!hasMore && !loadingMore ? (
            <p className={`text-sm font-medium ${dark ? "text-zinc-400" : "text-gray-500"}`}>
              No more bookings found
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-[1.7rem] border border-gray-100 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="h-44 bg-gray-200 dark:bg-zinc-800" />

          <div className="space-y-4 p-4">
            <div className="space-y-2.5">
              <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-zinc-800" />
              <div className="h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-zinc-800" />
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-zinc-800" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="space-y-2 rounded-[1.15rem] border border-gray-100 bg-gray-50/80 p-3 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-zinc-700" />
                  <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-zinc-700" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-dashed border-gray-200 pt-4 dark:border-zinc-700">
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-full bg-gray-200 dark:bg-zinc-700" />
                <div className="h-7 w-24 rounded-full bg-gray-200 dark:bg-zinc-700" />
              </div>
              <div className="h-10 w-24 rounded-xl bg-gray-200 dark:bg-zinc-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ dark }: { dark: boolean }) {
  return (
    <div className="flex min-h-[18rem] items-center justify-center">
      <div className="max-w-md text-center">
        <div
          className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
            dark ? "bg-zinc-800 text-zinc-200" : "bg-gray-100 text-gray-700"
          }`}
        >
          <CalendarFold className="h-6 w-6" />
        </div>
        <h3 className={`mt-4 text-xl font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
          No bookings found
        </h3>
        <p className={`mt-2 text-sm leading-6 ${dark ? "text-zinc-400" : "text-gray-500"}`}>
          Your booking cards will appear here once you start reserving tickets across movies, sports, events, or gaming.
        </p>
        <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
          dark ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-600"
        }`}>
          <Sparkles className="h-3.5 w-3.5" />
          Fresh, cleaner booking history
        </div>
      </div>
    </div>
  );
}
