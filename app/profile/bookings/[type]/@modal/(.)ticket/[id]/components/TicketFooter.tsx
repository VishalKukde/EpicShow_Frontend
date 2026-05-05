"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { apiFetch } from "@/lib/api";
import TicketShareButton from "@/components/TicketShareButton";
import { BOOKING_STATUS } from "@/constants/Constants";
import { toast } from "@/lib/toast";

type TicketFooterProps = {
  showName?: string;
  bookingId: string;
  bookingStatus: string;
  movieId?: string;
  cinemaId?: string;
  date?: string;
  slot?: string;
  seatIds?: string[];
  amount?: number;
  posterUrl?: string;
};

export default function TicketFooter({
  showName,
  bookingId,
  bookingStatus,
  movieId,
  cinemaId,
  date,
  slot,
  seatIds,
  amount,
  posterUrl,
}: TicketFooterProps) {
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCancelModal(false);
      }
    };

    if (showCancelModal) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [showCancelModal]);

  const handleCancelConfirm = async () => {
    try {
      setLoading(true);
      await apiFetch(`/cancel/${bookingId}`, { method: "PATCH" });
      toast.success("Ticket cancelled successfully. Refreshing details...");
      window.setTimeout(() => window.location.reload(), 650);
    } catch {
      toast.error("Unable to cancel ticket right now. Please try again.");
    } finally {
      setLoading(false);
      setShowCancelModal(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3">
        <div className="flex items-center gap-2">
          {bookingStatus === BOOKING_STATUS.CANCELLED ? (
            <button
              disabled
              className="h-9 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 cursor-not-allowed sm:h-10 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              Cancelled
            </button>
          ) : bookingStatus === BOOKING_STATUS.UPCOMING ? (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={loading}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:rounded-xl sm:px-4 sm:text-sm cursor-pointer"
            >
              {loading ? "Cancelling..." : "Cancel Ticket"}
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button className="h-9 rounded-lg bg-gray-900 px-3 text-xs font-medium text-white shadow-sm transition hover:bg-black cursor-pointer sm:h-10 sm:rounded-xl sm:px-4 sm:text-sm">
            Download Ticket
          </button>

          <TicketShareButton
            iconOnly
            movieTitle={showName}
            movieId={movieId}
            bookingId={bookingId}
            cinemaId={cinemaId}
            date={date}
            slot={slot}
            seatIds={seatIds}
            amount={amount}
            status={bookingStatus}
            posterUrl={posterUrl}
          />
        </div>
      </div>

      {showCancelModal &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowCancelModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 animate-in zoom-in-95 duration-200 sm:rounded-3xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <AlertTriangle size={24} />
                </div>

                <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                  Cancel Booking?
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                  Are you sure you want to cancel this ticket? This action cannot
                  be undone.
                </p>

                <div className="mt-6 flex w-full gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                  >
                    Keep Ticket
                  </button>

                  <button
                    onClick={handleCancelConfirm}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-red-600 py-2.5 font-medium text-white shadow-sm transition hover:bg-red-700 cursor-pointer disabled:opacity-70"
                  >
                    {loading ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
