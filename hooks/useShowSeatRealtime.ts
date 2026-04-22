"use client";

import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useAuth } from "@/context/AuthContext";
import { showSocket } from "@/lib/showSocket";
import { toast } from "@/lib/toast";
import type { Seat, SeatRow, SeatStatus } from "@/types/Seat";

type BookingForRealtime = {
  item?: { _id?: string } | null;
  venueId?: string | null;
  date?: string | null;
  slot?: string | null;
};

type SeatSetter = Dispatch<SetStateAction<SeatRow[]>>;

type BookingStoreApi = {
  getState: () => {
    setExpireAt?: (time: string | null) => void;
  };
};

type SeatRealtimePayload = {
  showId?: string;
  seatIds?: string[];
  userId?: string;
  expireAt?: string;
  reason?: string;
  bookingId?: string;
};

const normalizeSeatIds = (seatIds?: string[]) =>
  Array.isArray(seatIds)
    ? seatIds.map((seatId) => String(seatId).trim()).filter(Boolean)
    : [];

const hasSelection = (rows: SeatRow[]) =>
  rows.some((row) => row.seats.some((seat) => seat.status === "selected"));

export function useShowSeatRealtime(
  booking: BookingForRealtime,
  setSeats: SeatSetter,
  store: BookingStoreApi
) {
  const { user } = useAuth();

  useEffect(() => {
    const itemId = booking?.item?._id;
    const cinemaId = booking?.venueId;
    const showDate = booking?.date;
    const showSlot = booking?.slot;

    if (!itemId || !cinemaId || !showDate || !showSlot) {
      return;
    }

    const joinCurrentShow = () => {
      showSocket.emit("show:join", {
        itemId,
        cinemaId,
        showDate,
        showSlot,
      });
    };

    const applyLockedState = (payload: SeatRealtimePayload) => {
      const seatIds = normalizeSeatIds(payload.seatIds);
      if (seatIds.length === 0) return;

      const isCurrentUser = Boolean(user?.id && payload.userId === user.id);
      const nextStatus: SeatStatus = isCurrentUser ? "selected" : "locked";

      setSeats((previousSeats) =>
        previousSeats.map((row): SeatRow => ({
          ...row,
          seats: row.seats.map((seat): Seat => {
            if (!seatIds.includes(seat.id) || seat.status === "sold") {
              return seat;
            }

            return {
              ...seat,
              status: nextStatus,
            };
          }),
        }))
      );

      if (isCurrentUser && payload.expireAt) {
        store.getState().setExpireAt?.(payload.expireAt);
      }
    };

    const applyUnlockedState = (payload: SeatRealtimePayload) => {
      const seatIds = normalizeSeatIds(payload.seatIds);
      if (seatIds.length === 0) return;

      let releasedSelectedSeat = false;

      setSeats((previousSeats) => {
        const nextSeats: SeatRow[] = previousSeats.map((row): SeatRow => ({
          ...row,
          seats: row.seats.map((seat): Seat => {
            if (!seatIds.includes(seat.id) || seat.status === "sold") {
              return seat;
            }

            if (seat.status === "selected") {
              releasedSelectedSeat = true;
            }

            return {
              ...seat,
              status: "available",
            };
          }),
        }));

        if (releasedSelectedSeat && !hasSelection(nextSeats)) {
          queueMicrotask(() => {
            store.getState().setExpireAt?.(null);
          });
        }

        return nextSeats;
      });

      if (releasedSelectedSeat && payload.reason === "expired") {
        toast.warning("Your seat hold expired.");
      }
    };

    const applyBookedState = (payload: SeatRealtimePayload) => {
      const seatIds = normalizeSeatIds(payload.seatIds);
      if (seatIds.length === 0) return;

      let displacedSelectedSeat = false;

      setSeats((previousSeats) => {
        const nextSeats: SeatRow[] = previousSeats.map((row): SeatRow => ({
          ...row,
          seats: row.seats.map((seat): Seat => {
            if (!seatIds.includes(seat.id)) {
              return seat;
            }

            if (seat.status === "selected") {
              displacedSelectedSeat = true;
            }

            return {
              ...seat,
              status: "sold",
            };
          }),
        }));

        if (displacedSelectedSeat && !hasSelection(nextSeats)) {
          queueMicrotask(() => {
            store.getState().setExpireAt?.(null);
          });
        }

        return nextSeats;
      });

      if (displacedSelectedSeat && payload.userId !== user?.id) {
        toast.warning("One of your seats was booked by another user.");
      }
    };

    showSocket.on("connect", joinCurrentShow);
    showSocket.on("seat_locked", applyLockedState);
    showSocket.on("seat_unlocked", applyUnlockedState);
    showSocket.on("seat_booked", applyBookedState);

    if (!showSocket.connected) {
      showSocket.connect();
    } else {
      joinCurrentShow();
    }

    return () => {
      showSocket.emit("show:leave", {
        itemId,
        cinemaId,
        showDate,
        showSlot,
      });
      showSocket.off("connect", joinCurrentShow);
      showSocket.off("seat_locked", applyLockedState);
      showSocket.off("seat_unlocked", applyUnlockedState);
      showSocket.off("seat_booked", applyBookedState);
      showSocket.disconnect();
    };
  }, [booking?.date, booking?.item?._id, booking?.slot, booking?.venueId, setSeats, store, user?.id]);
}
