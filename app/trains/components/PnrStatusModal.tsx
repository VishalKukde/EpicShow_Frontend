"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BadgeCheck,
    Calendar,
    Clock3,
    CreditCard,
    Hash,
    IndianRupee,
    MapPin,
    Search,
    Ticket,
    TrainFront,
    User,
    Users,
    X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";

type PassengerDetail = {
    name?: string;
    age?: number;
    gender?: string;
    seatNumber?: string;
};

type TrainInfo = {
    _id?: string;
    trainName?: string;
    trainNumber?: string;
    fromStation?: string;
    toStation?: string;
    departureTime?: string;
    arrivalTime?: string;
};

type TrainPnrBooking = {
    _id?: string;
    pnr?: string;
    trainId?: TrainInfo | string;
    userId?: string;
    seats?: string[];
    passengerDetails?: PassengerDetail[];
    totalPrice?: number;
    baseAmount?: number;
    taxAmount?: number;
    bookingDate?: string;
    journeyDate?: string;
    status?: string;
    seatStatus?: string;
    confirmedSeatCount?: number;
    waitlistNumbers?: number[];
    razorpayOrderId?: string | null;
    payment?: {
        transactionId?: string | null;
        amount?: number;
        method?: string;
        status?: string;
        orderId?: string;
        currency?: string;
    };
    cancellationDetails?: {
        cancelledAt?: string;
        refundAmount?: number;
        refundStatus?: string;
    };
    createdAt?: string;
    updatedAt?: string;
};

interface PnrStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PnrStatusModal({ isOpen, onClose }: PnrStatusModalProps) {
    const [pnr, setPnr] = useState("");
    const [booking, setBooking] = useState<TrainPnrBooking | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const train = useMemo(() => {
        return typeof booking?.trainId === "object" && booking.trainId ? booking.trainId : null;
    }, [booking]);

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextPnr = pnr.trim().toUpperCase();

        if (!nextPnr) {
            toast.warning("Please enter a PNR number.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setBooking(null);
            const result = (await apiFetch(`/trains/booking/pnr/${encodeURIComponent(nextPnr)}`, {
                publicRequest: true,
                notifyOnError: false,
            })) as TrainPnrBooking;
            setBooking(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unable to find this PNR.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 p-5 text-white dark:border-slate-800 dark:bg-white dark:text-slate-950">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="h-5 w-5 text-cyan-400 dark:text-cyan-600" />
                                <div>
                                    <h3 className="text-lg font-bold">Check Train PNR Status</h3>
                                    <p className="text-xs text-slate-300 dark:text-slate-600">
                                        Enter your PNR to instantly view journey & passenger status
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white dark:text-slate-600 dark:hover:bg-slate-200 dark:hover:text-slate-950 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
                            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={pnr}
                                        onChange={(event) => setPnr(event.target.value.toUpperCase())}
                                        placeholder="Enter 10-digit PNR number"
                                        className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 font-mono text-xs font-bold uppercase tracking-wide text-slate-950 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-cyan-700"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-6 text-xs font-bold text-white shadow-md transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Search className="h-4 w-4" />
                                    {loading ? "Searching..." : "Search PNR"}
                                </button>
                            </form>

                            {loading && (
                                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
                                    <p className="text-xs font-semibold text-slate-500">Fetching live PNR details...</p>
                                </div>
                            )}

                            {!loading && error && (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                                    {error}
                                </div>
                            )}

                            {!loading && booking && (
                                <div className="space-y-6">
                                    {/* PNR Banner */}
                                    <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-4 dark:border-cyan-900/40 dark:from-cyan-950/40 dark:to-slate-900 flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                                                PNR Number
                                            </p>
                                            <p className="font-mono text-xl font-black tracking-wide text-slate-950 dark:text-white">
                                                {booking.pnr || "-"}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="rounded-full bg-cyan-600/10 px-3 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                                                {formatStatus(booking.status)}
                                            </span>
                                            <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                {formatSeatStatus(booking)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Grid details */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Panel title="Journey Summary" icon={TrainFront}>
                                            <Detail label="Train" value={formatTrainName(train)} icon={TrainFront} />
                                            <Detail label="From → To" value={`${train?.fromStation || "-"} → ${train?.toStation || "-"}`} icon={MapPin} />
                                            <Detail label="Journey Date" value={formatDate(booking.journeyDate)} icon={Calendar} />
                                            <Detail label="Departure / Arrival" value={`${train?.departureTime || "-"} / ${train?.arrivalTime || "-"}`} icon={Clock3} />
                                        </Panel>

                                        <Panel title="Fare & Payment" icon={CreditCard}>
                                            <Detail label="Total Amount" value={formatMoney(booking.totalPrice)} icon={IndianRupee} />
                                            <Detail label="Payment Status" value={formatStatus(booking.payment?.status)} icon={BadgeCheck} />
                                            <Detail label="Payment Method" value={booking.payment?.method?.toUpperCase()} icon={CreditCard} />
                                            <Detail label="Transaction ID" value={booking.payment?.transactionId || "-"} icon={Hash} />
                                        </Panel>
                                    </div>

                                    {/* Passenger details */}
                                    <Panel title="Passengers" icon={Users}>
                                        <div className="grid gap-2.5 sm:grid-cols-2">
                                            {(booking.passengerDetails || []).map((passenger, index) => (
                                                <div
                                                    key={`${passenger.seatNumber || "seat"}-${index}`}
                                                    className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs dark:border-slate-800 dark:bg-slate-900"
                                                >
                                                    <p className="font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                                                        <User size={13} className="text-cyan-600" />
                                                        {passenger.name || `Passenger ${index + 1}`}
                                                    </p>
                                                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                        Age: {passenger.age || "-"} | Gender: {passenger.gender || "-"} | Seat: {passenger.seatNumber || "-"}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </Panel>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function Panel({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: typeof TrainFront;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-950">
            <h4 className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <Icon className="h-3.5 w-3.5 text-cyan-600" />
                {title}
            </h4>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function Detail({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value?: string | number | null;
    icon: typeof TrainFront;
}) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-slate-800/80 dark:bg-slate-900/60">
            <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <Icon className="h-3 w-3" />
                {label}
            </p>
            <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                {value || "-"}
            </p>
        </div>
    );
}

function formatTrainName(train: TrainInfo | null) {
    if (!train) return "-";
    return train.trainName
        ? `${train.trainName}${train.trainNumber ? ` #${train.trainNumber}` : ""}`
        : train.trainNumber || "-";
}

function formatStatus(value?: string | null) {
    if (!value) return "-";
    return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSeatStatus(booking: TrainPnrBooking) {
    if (!booking.seatStatus) return "-";
    const label = formatStatus(booking.seatStatus);
    if (!booking.waitlistNumbers?.length) return label;
    return `${label} (${booking.waitlistNumbers.map((number) => `WL${number}`).join(", ")})`;
}

function formatDate(value?: string | null) {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatMoney(value?: number | null) {
    if (typeof value !== "number") return "-";
    return `₹${value.toFixed(2)}`;
}
