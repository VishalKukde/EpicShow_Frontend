"use client";

import { useEffect, useState } from "react";
import SeatsQuickAction from "./components/SeatsQuickAction";
import ScreenIndicator from "./components/ScreenIndicator";
import Seats from "./components/Seats";
import { Seat } from "@/types/Seat";
import PageTransition from "@/app/components/PageTransition";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import { useSeatLayout } from "@/hooks/useSeatLayout";
import { useSeatActions } from "@/hooks/useSeatActions";
import { useShowSeatRealtime } from "@/hooks/useShowSeatRealtime";
import { toast } from "@/lib/toast";
import { useAuth } from "@/context/AuthContext";
import { getTicketLimit } from "@/lib/proPerks";
import type { MovieSeatPreference } from "@/types/Auth";
import Loadable from "next/dist/shared/lib/loadable.shared-runtime";
import { useThemeStore } from "@/store/themeStore";

const movieSeatRecommendation: Record<MovieSeatPreference, { label: string; rows: string }> = {
  front: { label: "Front", rows: "A-D" },
  middle: { label: "Middle", rows: "E-G" },
  back: { label: "Back", rows: "H-J" },
};

export default function SeatLayout() {
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  // ✅ FIXED TYPE
  const [scale] = useState(1.9);
  const [hoverSeat, setHoverSeat] = useState<Seat | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const setSelectedSeats = useBookingStore((state) => state.setSeats);
  const { user } = useAuth();
  const ticketLimit = getTicketLimit(user?.membership);
  const preferredMovieSeat = user?.preferences?.seat?.movieSeat ?? "middle";
  const recommendedZone = movieSeatRecommendation[preferredMovieSeat];

  const booking = useBookingStore();
  const { seats, setSeats } = useSeatLayout(booking);
  const { toggleSeat } = useSeatActions(seats, setSeats, booking);
  useShowSeatRealtime(booking, setSeats, useBookingStore);

  const selectedSeats: Seat[] = seats
    .flatMap(row => row.seats)
    .filter(seat => seat.status === "selected");

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const isSmall = window.matchMedia("(max-width: 639px)").matches;
      if (isSmall) {
        root.style.setProperty("--app-toast-top", "1rem");
        root.style.setProperty("--app-toast-timer", "3000");
        root.style.removeProperty("--app-toast-bottom");
      } else {
        root.style.removeProperty("--app-toast-top");
        root.style.removeProperty("--app-toast-timer");
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      root.style.removeProperty("--app-toast-top");
      root.style.removeProperty("--app-toast-timer");
    };
  }, []);

  const goToReviewBooking = () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one seat before continuing.");
      return;
    }
    if (selectedSeats.length > ticketLimit) {
      toast.warning(`You can select a maximum of ${ticketLimit} seats.`);
      return;
    }

    setSelectedSeats(selectedSeats, totalPrice);
    router.push(`/movies/${booking.item?._id}/review`);
  };

  return (
    <PageTransition>

      <div className="relative bg-background sm:px-28 pt-18 pb-20 select-none">

        {/* 🎬 Screen */}
        <ScreenIndicator />

{/* Loader */}
{seats.length ===  0 ? (
  <div className="h-135 flex flex-col items-center justify-center py-16 ">
    <div className="h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />

    <p
      className={`mt-4 text-base font-semibold ${
        mode === "dark" ? "text-zinc-100" : "text-slate-900"
      }`}
    >
      Please wait
    </p>

    <p
      className={`mt-1 text-sm ${
        mode === "dark" ? "text-zinc-400" : "text-slate-500"
      }`}
    >
      Loading seat layout...
    </p>
  </div>
) : (
  /* 🪑 Seats */
  <Seats
    seats={seats}
    scale={scale}
    recommendedSeatZone={preferredMovieSeat}
    toggleSeat={toggleSeat}
    setHoverSeat={setHoverSeat}
    setMousePos={setMousePos}
  />
)}

        {/* 🧠 Hover tooltip */}
        {hoverSeat && (
          <div
            className="fixed z-50 pointer-events-none hidden md:block"
            style={{
              left: mousePos.x,
              top: mousePos.y
            }}
          >
            <div className="px-2.5 py-1.5 rounded-md bg-black text-white text-[10px] shadow-lg whitespace-nowrap">
              {hoverSeat.id} • ₹{hoverSeat.price}
            </div>
          </div>
        )}

        {/* 💳 Checkout bar */}
        <SeatsQuickAction
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          goToReviewBooking={goToReviewBooking}
        />

      </div>

    </PageTransition>
  );
}
