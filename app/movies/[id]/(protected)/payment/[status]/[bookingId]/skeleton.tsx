"use client";

import { Ticket, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export const PaymentSkeleton = () => {
    const mode = useThemeStore((s) => s.mode);

    return (
        <div
            className={`relative h-screen w-full max-h-screen overflow-hidden flex flex-col items-center justify-center p-4 select-none transition-colors duration-300 ${mode === "dark"
                    ? "bg-zinc-950 text-zinc-100 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-950/30 via-zinc-950 to-zinc-950"
                    : "bg-slate-50 text-slate-900 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-50/60 via-slate-50 to-amber-50/40"
                }`}
        >
            {/* Background Decorative Glows */}
            <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-600/15 blur-[130px]" />
            <div className="pointer-events-none absolute bottom-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-amber-500/10 blur-[120px]" />

            <div className="w-full max-w-md relative my-auto text-center">
                <div
                    className={`relative rounded-3xl border p-8 backdrop-blur-2xl shadow-2xl transition-all ${mode === "dark"
                            ? "border-zinc-800/80 bg-zinc-900/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            : "border-white/80 bg-white/95 shadow-[0_15px_40px_rgba(15,23,42,0.06)]"
                        }`}
                >
                    {/* Animated Ticket Icon */}
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                        <div className="absolute inset-0 rounded-2xl bg-indigo-600/20 animate-ping" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/40 bg-indigo-600/10 text-indigo-500 shadow-md">
                            <Ticket className="h-8 w-8 animate-pulse" />
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${mode === "dark"
                                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                                : "border-indigo-500/30 bg-indigo-50 text-indigo-600"
                            }`}>
                            <Sparkles className="h-3.5 w-3.5 animate-spin" />
                            Finalizing Order
                        </span>

                        <h2 className={`text-xl font-extrabold tracking-tight ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                            Getting Booking Details...
                        </h2>

                        <p className={`text-xs leading-relaxed max-w-xs mx-auto ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                            Please wait a moment while we verify your payment and fetch your booking pass.
                        </p>
                    </div>

                    {/* Animated Loader bar */}
                    <div className="mt-6 overflow-hidden rounded-full bg-indigo-500/10 h-1.5 w-full">
                        <div className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full animate-pulse" style={{ width: "85%" }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
