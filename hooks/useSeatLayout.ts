"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { SeatRow } from "@/types/Seat";
import { useAuth } from "@/context/AuthContext";

type BookingForSeatLayout = {
  venueId: string | null;
  item: { _id: string } | null;
  date: string | null;
  slot: string | null;
};

export function useSeatLayout(booking: BookingForSeatLayout) {
  const { user } = useAuth();
  const [seats, setSeats] = useState<SeatRow[]>([]);

  useEffect(() => {
    if (
      !booking?.venueId ||
      !booking?.item?._id ||
      !booking?.date ||
      !booking?.slot
    ) return;

    const fetchSeats = async () => {
      try {
        const movieId = booking.item?._id;
        const slot = booking.slot;
        if (!movieId || !slot) return;

        const layout = await apiFetch(
          `/seat/${booking.venueId}` +
          `?movieId=${movieId}` +
          `&showDate=${booking.date}` +
          `&showSlot=${encodeURIComponent(slot)}` +
          `&userId=${user?.id}`
        );

        setSeats(layout);
      } catch (err) {
        console.error("Failed to load seats", err);
      }
    };

    fetchSeats();
  }, [booking, user?.id]);

  return { seats, setSeats };
}
