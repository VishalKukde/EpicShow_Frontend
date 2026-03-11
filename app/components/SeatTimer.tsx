"use client";

import { useBookingStore } from "@/store/bookingStore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SeatTimer() {
    const [timeLeft, setTimeLeft] = useState(0);
    const router = useRouter();
    const expireAt = useBookingStore(state => state.expireAt);
    
    // 🔥 Prevent multiple unlock calls
    const expiredRef = useRef(false);

    useEffect(() => {
        if (!expireAt) return;

        const updateTimer = () => {
            const diff = new Date(expireAt).getTime() - Date.now();

            if (diff <= 0 && !expiredRef.current) {
                expiredRef.current = true;
                useBookingStore.getState().resetBooking();
                router.push("/movies");
                return;
            }
            setTimeLeft(Math.max(diff, 0));
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [expireAt, router]);


    if (!expireAt) return null;

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return (
        <div className="fixed flex justify-center select-none">
            <div
                className={`
      flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm border
      bg-white transition-all duration-500
      ${timeLeft > 60000
                        ? "text-green-600 border-green-200"
                        : timeLeft > 30000
                            ? "text-orange-500 border-orange-200"
                            : "text-red-600 border-red-200 animate-pulse"}
    `}
            >
                <span className="text-sm font-medium tracking-wide">
                    Complete booking in
                </span>

                <span className="text-lg font-semibold tabular-nums">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                </span>
            </div>
        </div>

    );
}
