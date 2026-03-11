import { AnimatePresence, motion } from "framer-motion";
import BookingCard from "./BookingCard";
import type { Booking } from "@/types/Booking";

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
  // console.log("filteredBookings", filteredBookings);
  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto p-3 sm:p-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
      {loading ? (
        <SkeletonList />
      ) : filteredBookings.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          layout
          className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8"
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
                className="group"
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
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              Load More
            </button>
          ) : null}

          {loadingMore ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:bg-zinc-900/90 dark:text-zinc-200">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-zinc-600 dark:border-t-zinc-200" />
              Loading more bookings...
            </div>
          ) : null}

          {!hasMore && !loadingMore ? (
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
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
    <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse"
        >
          {/* Poster */}
          <div className="relative h-40 w-full bg-gray-200 sm:h-48" />

          {/* Content */}
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            {/* Title */}
            <div className="h-6 w-4/5 bg-gray-200 rounded-lg mb-3" />

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-4 text-center border-y border-gray-100 py-3 mb-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="h-3 w-1/2 mx-auto bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded" />
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mb-auto">
              <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 sm:mt-5 sm:pt-5">
              <div className="space-y-1">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-8 w-24 bg-gray-200 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-lg bg-gray-200" />
                <div className="w-24 h-10 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-10">
      <p className="text-gray-500 font-medium">No bookings found</p>
      {/* <p className="text-sm text-gray-400 mt-1">Try adjusting filters</p> */}
    </div>
  );
}
