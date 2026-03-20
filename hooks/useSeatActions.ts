"use client";
import { apiFetch } from "@/lib/api";
import { SeatRow } from "@/types/Seat";
import { useBookingStore } from "@/store/bookingStore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "@/lib/toast";

type BookingForSeatActions = {
    item: { _id: string } | null;
    venueId: string | null;
    date: string | null;
    slot: string | null;
};

type SeatSetter = Dispatch<SetStateAction<SeatRow[]>>;

type BookingStoreApi = {
    getState: () => {
        item?: { _id?: string } | null;
        venueId?: string | null;
        date?: string | null;
        slot?: string | null;
        seats?: { id: string }[];
        setExpireAt?: (time: string | null) => void;
    };
    setState: (partial: Record<string, unknown>) => void;
};

export function useSeatActions(
    seats: SeatRow[],
    setSeats: SeatSetter,
    booking: BookingForSeatActions,
    store: BookingStoreApi = useBookingStore,
) {

    const router = useRouter();
    const { user, loading } = useAuth();
    const toggleSeat = async (rowIndex: number, seatIndex: number) => {

        // 🔐 AUTH CHECK FIRST
        if (loading) return;

        if (!user) {
            toast.warning("Login required to select seats.");
            // router.push(`/login?redirect=${window.location.pathname}`);
            return;
        }
        if (!booking.item?._id || !booking.venueId || !booking.date || !booking.slot) {
            toast.warning("Please select venue, date, and slot first.");
            return;
        }

        const seat = seats[rowIndex].seats[seatIndex];
        if (seat.status === "sold" || seat.status === "locked") return;

        const isUnlocking = seat.status === "selected";

        const selectedCount = seats
            .flatMap(r => r.seats)
            .filter(s => s.status === "selected").length;

        if (!isUnlocking && selectedCount >= 2) {
            toast.warning("Max 2 seats allowed.");
            return;
        }

        // 🔥 1️⃣ SAVE PREVIOUS STATE (for rollback)
        const previousSeats = JSON.parse(JSON.stringify(seats));

        // 🔥 2️⃣ OPTIMISTIC UPDATE
        setSeats((prev: SeatRow[]) =>
            prev.map((row, r) =>
                r !== rowIndex
                    ? row
                    : {
                        ...row,
                        seats: row.seats.map((s, i) =>
                            i === seatIndex
                                ? {
                                    ...s,
                                    status: isUnlocking ? "available" : "selected"
                                }
                                : s
                        )
                    }
            )
        );

        try {
            const endpoint = isUnlocking ? "/seat/unlock" : "/seat/lock";

            const res = await apiFetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    movieId: booking.item._id,
                    cinemaId: booking.venueId,
                    showDate: booking.date,
                    showSlot: booking.slot,
                    seatId: isUnlocking ? [seat.id] : seat.id,
                    userId: user.id
                })
            });

        if (!isUnlocking && res.expireAt) {
            store.getState().setExpireAt?.(res.expireAt);
        }

        if (isUnlocking) {
            const updatedSelectedCount = selectedCount - 1;

            if (updatedSelectedCount === 0) {
                store.getState().setExpireAt?.(null);
            }
        }

        } catch (err: unknown) {

            // 💥 3️⃣ ROLLBACK IF FAILED
            setSeats(previousSeats);

            const errorWithStatus = err as { status?: number };
            if (errorWithStatus?.status === 409) {
                toast.warning("Seat already locked by someone else.");
            } else {
                toast.error("Seat action failed.");
            }
        }
    };

    return { toggleSeat };
}



// this will only accept array of seat 
// and called when "change of seat/date" it instantly unlock seats
export const unlockAllSeatsForCurrentShow = async (
    setSeats: SeatSetter,
    userId?: string | null,
    store: BookingStoreApi = useBookingStore,
) => {
    const booking = store.getState();
    const seatIds = booking.seats?.map(s => s.id) ?? [];

    const canUnlock =
        userId &&
        booking.item?._id &&
        booking.venueId &&
        booking.date &&
        booking.slot &&
        seatIds.length > 0;

    if (canUnlock) {
        try {
            await apiFetch("/seat/unlock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    movieId: booking.item?._id,
                    cinemaId: booking.venueId,
                    showDate: booking.date,
                    showSlot: booking.slot,
                    seatId: seatIds,
                    userId
                })
            });
        } catch {
            // Ignore unlock errors to avoid blocking navigation.
        }
    }

    // ✅ Clear UI seat layout
    setSeats((prev) =>
        prev.map((row) => ({
            ...row,
            seats: row.seats.map((seat) =>
                seat.status === "selected"
                    ? { ...seat, status: "available" }
                    : seat
            )
        }))
    );


    // ✅ Reset booking store show + seats
    store.setState({
        venueId: null,
        venue: null,
        date: null,
        slot: null,
        seats: [],
        totalPrice: 0,
        appliedCoupon: null,
        expireAt: null
    });
};
