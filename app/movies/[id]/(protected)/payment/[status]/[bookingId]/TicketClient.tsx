"use client";

import Link from "next/link";
import CopyButton from "../../components/CopyButton";
import DownloadTicketButton from "../../components/DownloadTicketButton";
import { Home, ShieldCheck, Ticket as TicketIcon, Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import AutoRedirect from "../../components/AutoRedirect";
import ResetStores from "../../components/ResetStore";
import type { Booking } from "@/types/Booking";
import type { Payment } from "@/types/Payment";
import type { Movie } from "@/types/Movie";
import TicketShareButton from "@/components/TicketShareButton";
import { useThemeStore } from "@/store/themeStore";

interface TicketClientProps {
    id: string;
    status: string;
    bookingId: string;
    booking: Booking | null;
    payment: Payment | null;
    movie: Movie | null;
}

export default function TicketClient({ id, status, booking, payment, movie }: TicketClientProps) {
    const mode = useThemeStore((s) => s.mode);

    const themeMap = {
        success: {
            glow: "from-emerald-500/20 via-teal-500/10 to-transparent",
            accentBorder: mode === "dark" ? "border-emerald-500/40" : "border-emerald-500/50",
            accentBg: mode === "dark" ? "bg-emerald-500/10" : "bg-emerald-500/15",
            badgeText: mode === "dark" ? "text-emerald-400" : "text-emerald-600",
            statusRing: mode === "dark" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-emerald-500/40 bg-emerald-50 text-emerald-700",
            title: "Booking Confirmed!",
            subtitle: "Your tickets have been successfully booked & issued.",
        },
        failed: {
            glow: "from-rose-500/20 via-red-500/10 to-transparent",
            accentBorder: mode === "dark" ? "border-rose-500/40" : "border-rose-500/50",
            accentBg: mode === "dark" ? "bg-rose-500/10" : "bg-rose-500/15",
            badgeText: mode === "dark" ? "text-rose-400" : "text-rose-600",
            statusRing: mode === "dark" ? "border-rose-500/30 bg-rose-500/10 text-rose-400" : "border-rose-500/40 bg-rose-50 text-rose-700",
            title: "Payment Failed",
            subtitle: "Your transaction was not successful. Please try again.",
        },
        cancelled: {
            glow: "from-amber-500/20 via-orange-500/10 to-transparent",
            accentBorder: mode === "dark" ? "border-amber-500/40" : "border-amber-500/50",
            accentBg: mode === "dark" ? "bg-amber-500/10" : "bg-amber-500/15",
            badgeText: mode === "dark" ? "text-amber-400" : "text-amber-600",
            statusRing: mode === "dark" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-amber-500/40 bg-amber-50 text-amber-700",
            title: "Booking Cancelled",
            subtitle: "This booking request was cancelled.",
        },
    };

    const theme = themeMap[status as keyof typeof themeMap] || themeMap.failed;

    return (
        <>
            <ResetStores />
            <div className={`relative h-screen w-full max-h-screen overflow-hidden flex flex-col items-center justify-center p-3 sm:p-4 select-none transition-colors duration-300 ${mode === "dark"
                    ? "bg-zinc-950 text-zinc-100 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-950/30 via-zinc-950 to-zinc-950"
                    : "bg-slate-50 text-slate-900 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-50/60 via-slate-50 to-amber-50/40"
                }`}>
                {/* Background Decorative Glows */}
                <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-600/10 blur-[130px]" />
                <div className={`pointer-events-none absolute bottom-1/4 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full blur-[120px] ${status === "success" ? "bg-emerald-500/10" : "bg-rose-500/10"}`} />

                <div className="w-full max-w-2xl relative my-auto">
                    <AutoRedirect seconds={20} />

                    {/* Luxury Ticket Card Container */}
                    <div className={`relative rounded-3xl border backdrop-blur-xl shadow-xl overflow-hidden transition-all ${mode === "dark"
                            ? "border-zinc-800/80 bg-zinc-900/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            : "border-white/80 bg-white/95 shadow-[0_15px_40px_rgba(15,23,42,0.06)]"
                        }`}>
                        {/* Top Status Gradient Strip */}
                        <div className={`h-1.5 w-full bg-linear-to-r ${theme.glow}`} />

                        {/* Side Ticket Stub Cutouts */}
                        <div className={`pointer-events-none absolute top-1/2 -left-4 -translate-y-1/2 h-8 w-8 rounded-full border shadow-inner z-20 ${mode === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"
                            }`} />
                        <div className={`pointer-events-none absolute top-1/2 -right-4 -translate-y-1/2 h-8 w-8 rounded-full border shadow-inner z-20 ${mode === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"
                            }`} />

                        {/* Header Section */}
                        <div className={`p-4 sm:p-5 border-b border-dashed ${mode === "dark" ? "border-zinc-800/80" : "border-slate-200"}`}>
                            <div className="flex flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className={`relative flex items-center justify-center h-12 w-12 rounded-2xl border ${theme.accentBorder} ${theme.accentBg} backdrop-blur-md shadow-xs shrink-0`}>
                                        <AnimatedCheck status={status} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.statusRing}`}>
                                                <Sparkles className="h-3 w-3" /> {status === "success" ? "Verified Ticket Pass" : "Payment Notice"}
                                            </span>
                                        </div>
                                        <h1 className={`mt-0.5 text-lg sm:text-xl font-black tracking-tight truncate ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                                            {theme.title}
                                        </h1>
                                        <p className={`text-xs truncate ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                                            {theme.subtitle}
                                        </p>
                                    </div>
                                </div>

                                {booking && (
                                    <div className="flex flex-col items-end shrink-0">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                                            Paid Amount
                                        </span>
                                        <span className="text-lg sm:text-xl font-black text-amber-500">
                                            ₹{booking.amount}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Movie Preview Header Card */}
                        {movie && (
                            <div className={`mx-4 mt-3.5 p-3 rounded-xl border flex items-center gap-3 ${mode === "dark" ? "border-zinc-800 bg-zinc-950/50" : "border-slate-200/80 bg-slate-50/80"
                                }`}>
                                {movie?.imageUrl ? (
                                    <img
                                        src={movie.imageUrl}
                                        alt={movie?.name || "Movie"}
                                        className="h-11 w-8 sm:h-12 sm:w-9 rounded-lg object-cover shadow-xs shrink-0 border border-zinc-700/30"
                                    />
                                ) : (
                                    <div className="flex h-11 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-lg font-bold text-indigo-400 shrink-0">
                                        🎬
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <h3 className={`text-sm sm:text-base font-extrabold truncate ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                                        {movie.name}
                                    </h3>
                                    <div className={`mt-0.5 flex flex-wrap items-center gap-2 text-xs ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                                        {movie.language && (
                                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${mode === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-slate-200 text-slate-700"
                                                }`}>
                                                {movie.language}
                                            </span>
                                        )}
                                        {movie.genre && (
                                            <span className="truncate text-xs">
                                                {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ticket Details Grid */}
                        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                            {/* Booking Column */}
                            {booking && (
                                <div className={`space-y-2 rounded-xl border p-3 ${mode === "dark" ? "border-zinc-800/60 bg-zinc-950/40" : "border-slate-200 bg-slate-50/60"
                                    }`}>
                                    <SectionTitle title="Booking Details" mode={mode} icon={<TicketIcon className="h-3.5 w-3.5 text-indigo-500" />} />

                                    <div className={`flex items-center justify-between py-1 border-b ${mode === "dark" ? "border-zinc-800/40 text-zinc-400" : "border-slate-200 text-slate-600"}`}>
                                        <span>Booking ID</span>
                                        <div className={`flex items-center gap-1 font-mono font-bold ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                                            <span className="truncate max-w-[120px] sm:max-w-[140px]">{booking._id}</span>
                                            <CopyButton value={booking._id} />
                                        </div>
                                    </div>

                                    <Row label="Venue" mode={mode} icon={<MapPin className="h-3.5 w-3.5 text-zinc-400" />} value={booking.cinemaId || "Main Theater"} />
                                    <Row label="Date" mode={mode} icon={<Calendar className="h-3.5 w-3.5 text-zinc-400" />} value={booking.date} />
                                    <Row label="Show Time" mode={mode} icon={<Clock className="h-3.5 w-3.5 text-zinc-400" />} value={booking.slot} />
                                    <div className="flex items-center justify-between py-0.5">
                                        <span className={mode === "dark" ? "text-zinc-400" : "text-slate-600"}>Seats</span>
                                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs font-bold text-indigo-500 border border-indigo-500/30">
                                            {booking.seatIds?.join(", ")}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Payment Column */}
                            {payment && (
                                <div className={`space-y-2 rounded-xl border p-3 ${mode === "dark" ? "border-zinc-800/60 bg-zinc-950/40" : "border-slate-200 bg-slate-50/60"
                                    }`}>
                                    <SectionTitle title="Payment Details" mode={mode} icon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />} />

                                    <div className={`flex items-center justify-between py-1 border-b ${mode === "dark" ? "border-zinc-800/40 text-zinc-400" : "border-slate-200 text-slate-600"}`}>
                                        <span>Payment ID</span>
                                        <div className={`flex items-center gap-1 font-mono font-bold ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                                            <span className="truncate max-w-[120px] sm:max-w-[140px]">{payment.paymentId}</span>
                                            <CopyButton value={payment.paymentId} />
                                        </div>
                                    </div>

                                    <Row label="Method" mode={mode} value={formatMethod(payment.method)} />
                                    <div className="flex items-center justify-between py-0.5">
                                        <span className={mode === "dark" ? "text-zinc-400" : "text-slate-600"}>Status</span>
                                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold border ${payment.status === "success"
                                                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-500"
                                                : "border-rose-500/30 bg-rose-500/15 text-rose-500"
                                            }`}>
                                            {capitalize(payment.status)}
                                        </span>
                                    </div>
                                    <Row
                                        label="Timestamp"
                                        mode={mode}
                                        value={new Date(payment.createdAt).toLocaleString("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Bottom Guarantee Banner */}
                        <div className={`px-4 py-2.5 flex items-center justify-between text-[11px] border-t ${mode === "dark" ? "border-zinc-800/40 text-zinc-500" : "border-slate-200 text-slate-500"
                            }`}>
                            <span className="inline-flex items-center gap-1">
                                🔒 256-Bit Encrypted Ticket Verification
                            </span>
                            <span>EpicShow Pass</span>
                        </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="mt-3.5 flex flex-wrap items-center justify-end gap-2.5">
                        <DownloadTicketButton booking={booking!} payment={payment!} />

                        {booking && (
                            <TicketShareButton
                                movieTitle={movie?.name}
                                movieId={id}
                                bookingId={booking._id}
                                cinemaId={booking.cinemaId}
                                date={booking.date}
                                slot={booking.slot}
                                seatIds={booking.seatIds}
                                amount={booking.amount}
                                status={booking.status}
                                posterUrl={movie?.imageUrl}
                            />
                        )}

                        <Link
                            href="/"
                            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${mode === "dark"
                                    ? "border-zinc-700 bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700"
                                    : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
                                }`}
                        >
                            <Home className="h-3.5 w-3.5 text-indigo-500" />
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ---------- Sub-components & Helpers ---------- */

const Row = ({
    label,
    value,
    icon,
    mode,
}: {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    mode: string;
}) => (
    <div className={`flex items-center justify-between py-0.5 ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
        <span className="flex items-center gap-1.5">{icon} {label}</span>
        <span className={`font-semibold text-right ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{value}</span>
    </div>
);

const SectionTitle = ({ title, icon, mode }: { title: string; icon?: React.ReactNode; mode: string }) => (
    <div className={`flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider pb-1 ${mode === "dark" ? "text-zinc-300" : "text-slate-700"
        }`}>
        {icon} {title}
    </div>
);

const formatMethod = (method?: string) => {
    if (!method) return "—";

    const map: Record<string, string> = {
        upi: "Instant UPI",
        card: "Credit / Debit Card",
        netbanking: "Net Banking",
        wallet: "Epic Wallet",
    };

    return map[method] || method;
};

const capitalize = (value?: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "—";

const AnimatedCheck = ({ status }: { status: string }) => {
    const color =
        status === "success"
            ? "text-emerald-500"
            : status === "failed"
                ? "text-rose-500"
                : "text-amber-500";

    return (
        <svg className={`w-7 h-7 ${color}`} viewBox="0 0 52 52">
            <circle
                className="animated-circle"
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
            />
            {status === "success" && (
                <path
                    className="animated-path"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 27l7 7 16-16"
                />
            )}
            {status === "failed" && (
                <path
                    className="animated-path"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 16 36 36 M36 16 16 36"
                />
            )}
            {status === "cancelled" && (
                <path
                    className="animated-path"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M26 14v16 M26 36h.01"
                />
            )}
        </svg>
    );
};
