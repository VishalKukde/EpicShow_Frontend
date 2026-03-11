"use client";
import { apiFetch } from "@/lib/api";
import { SeatRow } from "@/types/Seat";
import { useBookingStore } from "@/store/bookingStore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";

type BookingForSeatActions = {
    item: { _id: string } | null;
    venueId: string | null;
    date: string | null;
    slot: string | null;
};

type SeatSetter = Dispatch<SetStateAction<SeatRow[]>>;

export function useSeatActions(
    seats: SeatRow[],
    setSeats: SeatSetter,
    booking: BookingForSeatActions,
) {

    const router = useRouter();
    const { user, loading } = useAuth();
    const toggleSeat = async (rowIndex: number, seatIndex: number) => {

        // 🔐 AUTH CHECK FIRST
        if (loading) return;

        if (!user) {
            router.push(`/login?redirect=${window.location.pathname}`);
            return;
        }
        if (!booking.item?._id || !booking.venueId || !booking.date || !booking.slot) {
            alert("Please select cinema, date and slot first");
            return;
        }

        const seat = seats[rowIndex].seats[seatIndex];
        if (seat.status === "sold") return;

        const isUnlocking = seat.status === "selected";

        const selectedCount = seats
            .flatMap(r => r.seats)
            .filter(s => s.status === "selected").length;

        if (!isUnlocking && selectedCount >= 2) {
            alert("Max 2 seats allowed");
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

            // 🟢 If locking → start timer
            if (!isUnlocking && res.expireAt) {
                useBookingStore.getState().setExpireAt(res.expireAt);
            }

            if (isUnlocking) {
                const updatedSelectedCount = selectedCount - 1;

                if (updatedSelectedCount === 0) {
                    useBookingStore.getState().setExpireAt(null);
                }
            }

        } catch (err: unknown) {

            // 💥 3️⃣ ROLLBACK IF FAILED
            setSeats(previousSeats);

            const errorWithStatus = err as { status?: number };
            if (errorWithStatus?.status === 409) {
                alert("Seat already locked by someone else");
            } else {
                alert("Seat action failed");
            }
        }
    };

    return { toggleSeat };
}



// this will only accept array of seat 
// and called when "change of seat/date" it instantly unlock seats
export const unlockAllSeatsForCurrentShow = async (
    setSeats: SeatSetter,
) => {
    const booking = useBookingStore.getState();
    const seatIds = booking.seats.map(s => s.id);

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
            seatId: seatIds
        })
    });

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
    useBookingStore.setState({
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
