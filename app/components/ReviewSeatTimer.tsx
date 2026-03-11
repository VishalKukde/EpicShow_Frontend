"use client";

import { useBookingStore } from "@/store/bookingStore";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewSeatTimer() {
  const expireAt = useBookingStore(state => state.expireAt);
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
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

  // Dynamic color
return (
  <div className="flex select-none">
    <div
      className={`
        flex flex-col items-center justify-center
        px-4 py-2 rounded-xl border
        shadow-sm transition-all duration-500
        ${mode === "dark" ? "bg-slate-900" : "bg-white"}
        ${timeLeft > 60000
          ? mode === "dark" ? "border-emerald-700/60" : "border-emerald-200"
          : timeLeft > 30000
          ? mode === "dark" ? "border-amber-700/60" : "border-amber-200"
          : mode === "dark" ? "border-rose-700/60" : "border-rose-200"}
      `}
    >
      <span className={`text-xs uppercase tracking-wide ${mode === "dark" ? "text-slate-500" : "text-gray-400"}`}>
        Time Left
      </span>

      <span
        className={`
          text-lg font-semibold tabular-nums tracking-tight transition-colors duration-500
          ${timeLeft > 60000
            ? "text-emerald-600"
            : timeLeft > 30000
            ? "text-amber-600"
            : "text-rose-600 animate-pulse"}
        `}
      >
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  </div>
);
}
