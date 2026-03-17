"use client";

import { useBookingStore } from "@/store/bookingStore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SeatTimerProps = {
    variant?: "floating" | "navbar";
    className?: string;
};

export default function SeatTimer({ variant = "floating", className }: SeatTimerProps) {
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

    const urgency =
        timeLeft > 60000
            ? { text: "text-emerald-500", border: "border-emerald-200", pulse: "" }
            : timeLeft > 30000
                ? { text: "text-amber-500", border: "border-amber-200", pulse: "" }
                : { text: "text-red-500", border: "border-red-200", pulse: "animate-pulse" };

    const pillBase =
        variant === "navbar"
            ? "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
            : "flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm border bg-white transition-all duration-500";

    const containerClass =
        variant === "navbar" ? "flex items-center justify-center select-none" : "fixed flex justify-center select-none";

    const pillStyle =
        variant === "navbar"
            ? {
                borderColor: "var(--hero-header-btn-border)",
                background: "var(--hero-header-btn-bg)",
                backdropFilter: "blur(12px)",
                boxShadow: "var(--hero-header-btn-shadow)",
            }
            : undefined;

    return (
        <div className={`${containerClass} ${className ?? ""}`}>
            <div
                className={`${pillBase} ${urgency.border} ${variant === "floating" ? `${urgency.text} ${urgency.pulse}` : ""}`}
                style={pillStyle}
            >
                <span
                    className={variant === "navbar" ? "text-[11px] font-medium tracking-wide" : "text-sm font-medium tracking-wide"}
                    style={variant === "navbar" ? { color: "var(--hero-header-btn-text)" } : undefined}
                >
                    {variant === "navbar" ? "Seat hold" : "Complete booking in"}
                </span>

                <span
                    className={`${variant === "navbar" ? "text-sm font-semibold tabular-nums" : "text-lg font-semibold tabular-nums"} ${urgency.text} ${urgency.pulse}`}
                >
                    {minutes}:{seconds.toString().padStart(2, "0")}
                </span>
            </div>
        </div>

    );
}
