"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Search, Filter, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import AdminFilterModal from "../shared/AdminFilterModal";

export type BookingType = "movies" | "events" | "sports" | "plays" | "gaming" | "trains";

export type BookingRow = {
    _id: string;
    userName?: string;
    userEmail?: string;
    title?: string;
    theater?: string;
    bookingTime?: string;
    createdAt?: string;
    date?: string;
    slot?: string;
    schedule?: { date?: string; time?: string };
    venue?: { name?: string };
    showType?: string;
    sportType?: string;
    league?: string;
    teams?: { teamA?: string; teamB?: string; label?: string };
    ticketCount?: number;
    saleAmount?: number;
    amount?: number;
    status: "confirmed" | "pending" | "cancelled" | "refunded" | string;
    seatIds?: string[];
    coupon?: string;
    couponDiscount?: number;
    rewardPointsRedeemed?: number;
    rewardDiscount?: number;
    paymentId?: string;
    razorpayOrderId?: string;
};

export type BookingPagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
};

export type BookingResponse = {
    data: BookingRow[];
    filters: {
        statuses: string[];
        theaters: string[];
    };
    pagination: BookingPagination;
};

const TYPE_LABELS: Record<BookingType, string> = {
    movies: "Movie",
    events: "Event",
    sports: "Sport",
    plays: "Play",
    gaming: "Gaming & Esports",
    trains: "Transit & Trains",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    confirmed: { bg: "rgba(16, 185, 129, 0.14)", text: "#10B981", border: "rgba(16, 185, 129, 0.28)" },
    pending: { bg: "rgba(245, 158, 11, 0.14)", text: "#F59E0B", border: "rgba(245, 158, 11, 0.28)" },
    cancelled: { bg: "rgba(239, 68, 68, 0.14)", text: "#EF4444", border: "rgba(239, 68, 68, 0.28)" },
    refunded: { bg: "rgba(99, 102, 241, 0.14)", text: "#818CF8", border: "rgba(99, 102, 241, 0.28)" },
};

function formatCurrency(val: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(val || 0);
}

function formatDate(val?: string) {
    if (!val) return "—";
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(val));
}

function titleCase(str?: string) {
    if (!str) return "-";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const cellStyle: CSSProperties = {
    padding: "12px 14px",
    borderBottom: "1px solid var(--admin-border)",
    color: "var(--admin-text)",
    fontSize: 12,
    verticalAlign: "middle",
};

export default function AdminBookingTable({ type }: { type: BookingType }) {
    const [rows, setRows] = useState<BookingRow[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [theaters, setTheaters] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<BookingPagination | null>(null);
    const [status, setStatus] = useState("");
    const [time, setTime] = useState("");
    const [theater, setTheater] = useState("");
    const [search, setSearch] = useState("");
    const [selectedRow, setSelectedRow] = useState<BookingRow | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const query = useMemo(() => {
        const params = new URLSearchParams({ page: String(page), limit: "10" });
        if (status) params.set("status", status);
        if (time) params.set("time", time);
        if (theater) params.set("theater", theater);
        return params.toString();
    }, [page, status, theater, time]);

    useEffect(() => {
        let active = true;

        async function loadBookings() {
            setLoading(true);
            setError("");

            try {
                const payload = (await apiFetch(`/admin/bookings/${type}?${query}`, {
                    notifyOnError: false,
                })) as BookingResponse;

                if (!active) return;
                setRows(payload.data || []);
                setStatuses(payload.filters?.statuses || []);
                setTheaters(payload.filters?.theaters || []);
                setPagination(payload.pagination || null);
            } catch (err) {
                if (!active) return;
                setError(err instanceof Error ? err.message : "Failed to load bookings");
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadBookings();

        return () => {
            active = false;
        };
    }, [query, type]);

    const filteredRows = useMemo(() => {
        if (!search.trim()) return rows;
        const term = search.toLowerCase().trim();
        return rows.filter(
            (r) =>
                (r.userName && r.userName.toLowerCase().includes(term)) ||
                (r.title && r.title.toLowerCase().includes(term)) ||
                (r.theater && r.theater.toLowerCase().includes(term)) ||
                (r._id && r._id.toLowerCase().includes(term))
        );
    }, [rows, search]);

    const activeFilterCount = [status, time, theater].filter(Boolean).length;
    const label = TYPE_LABELS[type] || "Booking";

    const updateStatus = (value: string) => {
        setStatus(value);
        setPage(1);
    };

    const updateTheater = (value: string) => {
        setTheater(value);
        setPage(1);
    };

    const clearFilters = () => {
        setStatus("");
        setTime("");
        setTheater("");
        setSearch("");
        setPage(1);
    };

    return (
        <section style={{ display: "grid", gap: 16, paddingBottom: 32 }} className="select-none">
            {/* Table Shell Container */}
            <div
                className="admin-table-shell"
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow: "0 18px 50px rgba(15,13,26,.07)",
                    backdropFilter: "blur(16px)",
                }}
            >
                {/* Table Controls Header */}
                <div
                    style={{
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        borderBottom: "1px solid var(--admin-border)",
                        background: "var(--admin-soft)",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 15, fontWeight: 800 }}>
                            {label} Bookings Table
                        </p>
                        <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 500 }}>
                            Real-time booking records, tickets, payment status & customer details.
                        </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* Search Input */}
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <Search size={14} style={{ position: "absolute", left: 12, color: "var(--admin-text-secondary)", pointerEvents: "none" }} />
                            <input
                                type="text"
                                placeholder="Search username, title..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                style={{
                                    background: "var(--admin-soft-solid)",
                                    border: "1px solid var(--admin-border)",
                                    borderRadius: 10,
                                    padding: "8px 12px 8px 34px",
                                    color: "var(--admin-text)",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    width: 220,
                                    outline: "none",
                                }}
                            />
                        </div>

                        {/* Filter Trigger Button */}
                        <button
                            onClick={() => setFiltersOpen(true)}
                            style={{
                                border: "none",
                                background: "#6C63FF",
                                color: "#FFFFFF",
                                borderRadius: 10,
                                padding: "8px 16px",
                                fontSize: 12,
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow: "0 4px 14px rgba(108, 99, 255, 0.35)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                            className="cursor-pointer select-none"
                        >
                            <Filter size={13} strokeWidth={2.5} />
                            Filters {activeFilterCount ? `(${activeFilterCount})` : ""}
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={{ padding: "12px 18px", color: "#EF4444", background: "rgba(239, 68, 68, 0.12)", borderBottom: "1px solid rgba(239, 68, 68, 0.25)", fontSize: 13, fontWeight: 800 }}>
                        {error}
                    </div>
                )}

                {/* Scrollable Table Body */}
                <div style={{ maxHeight: 400, overflowY: "auto", position: "relative" }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                            <tr style={{ background: "var(--admin-surface)", backdropFilter: "blur(8px)" }}>
                                {["Title / Show Name", "Customer", "Booking Status", "Booking Time", "Theater / Venue", "Actions"].map((head) => (
                                    <th
                                        key={head}
                                        style={{
                                            padding: "12px 14px",
                                            color: "var(--admin-text-secondary)",
                                            fontSize: 11,
                                            fontWeight: 800,
                                            letterSpacing: ".06em",
                                            textTransform: "uppercase",
                                            textAlign: "left",
                                            whiteSpace: "nowrap",
                                            borderBottom: "1px solid var(--admin-border)",
                                            background: "var(--admin-surface)",
                                        }}
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && Array.from({ length: 6 }, (_, index) => (
                                <tr key={index}>
                                    <td colSpan={6} style={{ padding: 18, borderBottom: "1px solid var(--admin-border)" }}>
                                        <div style={{ height: 16, borderRadius: 999, background: "var(--admin-soft)", opacity: 0.6 }} />
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredRows.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: 38, color: "var(--admin-text-secondary)", textAlign: "center", fontWeight: 700 }}>
                                        No bookings found matching search criteria.
                                    </td>
                                </tr>
                            )}
                            {!loading &&
                                filteredRows.map((row) => {
                                    const colors = STATUS_COLORS[row.status] || {
                                        bg: "rgba(148, 163, 184, 0.14)",
                                        text: "#94A3B8",
                                        border: "rgba(148, 163, 184, 0.28)",
                                    };

                                    return (
                                        <tr key={row._id} style={{ background: "transparent" }}>
                                            <td style={cellStyle}>
                                                <strong style={{ color: "var(--admin-text)", fontSize: 13, display: "block" }}>{row.title || "-"}</strong>
                                                <div style={{ color: "var(--admin-text-secondary)", fontSize: 11.5, marginTop: 2 }}>
                                                    {row.ticketCount || 0} tickets • <span style={{ color: "#10B981", fontWeight: 700 }}>{formatCurrency(row.saleAmount || row.amount || 0)}</span>
                                                </div>
                                            </td>
                                            <td style={cellStyle}>
                                                <strong style={{ color: "var(--admin-text)", fontSize: 13, display: "block" }}>{row.userName || "Guest User"}</strong>
                                                <div style={{ color: "var(--admin-text-secondary)", fontSize: 11.5, marginTop: 1 }}>{row.userEmail || "No email"}</div>
                                            </td>
                                            <td style={cellStyle}>
                                                <span
                                                    style={{
                                                        background: colors.bg,
                                                        color: colors.text,
                                                        border: `1px solid ${colors.border}`,
                                                        borderRadius: 999,
                                                        padding: "4px 10px",
                                                        fontSize: 11,
                                                        fontWeight: 900,
                                                        textTransform: "uppercase",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 5,
                                                    }}
                                                >
                                                    <span style={{ width: 5, height: 5, borderRadius: 999, background: colors.text }} />
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td style={cellStyle}>{formatDate(row.bookingTime || row.createdAt)}</td>
                                            <td style={cellStyle}>{row.theater || row.venue?.name || "Venue TBD"}</td>
                                            <td style={cellStyle}>
                                                <button
                                                    onClick={() => setSelectedRow(row)}
                                                    style={{
                                                        border: "none",
                                                        background: "#6366F1",
                                                        color: "#FFFFFF",
                                                        borderRadius: 8,
                                                        padding: "7px 14px",
                                                        fontSize: 11.5,
                                                        fontWeight: 800,
                                                        cursor: "pointer",
                                                        boxShadow: "0 2px 10px rgba(99, 102, 241, 0.35)",
                                                    }}
                                                    className="cursor-pointer select-none"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination Bar */}
                <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--admin-border)", background: "var(--admin-surface)" }}>
                    <span style={{ color: "var(--admin-text-secondary)", fontSize: 13 }}>
                        Showing page {pagination?.page || page} of {pagination?.totalPages || 1} • {pagination?.total || 0} records
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((value) => Math.max(value - 1, 1))}
                            style={{
                                border: "1px solid var(--admin-border)",
                                background: page <= 1 || loading ? "var(--admin-soft-solid)" : "var(--admin-surface)",
                                color: page <= 1 || loading ? "var(--admin-text-muted)" : "var(--admin-text)",
                                borderRadius: 8,
                                padding: "6px 12px",
                                fontSize: 12,
                                fontWeight: 800,
                                cursor: page <= 1 || loading ? "not-allowed" : "pointer",
                            }}
                        >
                            Previous
                        </button>
                        <button
                            disabled={!pagination?.hasMore || loading}
                            onClick={() => setPage((value) => value + 1)}
                            style={{
                                border: "1px solid var(--admin-border)",
                                background: !pagination?.hasMore || loading ? "var(--admin-soft-solid)" : "var(--admin-surface)",
                                color: !pagination?.hasMore || loading ? "var(--admin-text-muted)" : "var(--admin-text)",
                                borderRadius: 8,
                                padding: "6px 12px",
                                fontSize: 12,
                                fontWeight: 800,
                                cursor: !pagination?.hasMore || loading ? "not-allowed" : "pointer",
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Booking Details View Modal */}
            {selectedRow && <BookingDetailsModal row={selectedRow} onClose={() => setSelectedRow(null)} />}

            {/* Filter Options Modal */}
            {filtersOpen && (
                <AdminFilterModal
                    title={`Filter ${label.toLowerCase()} bookings`}
                    subtitle="Click chips to filter by status and theater."
                    onClear={clearFilters}
                    onClose={() => setFiltersOpen(false)}
                    sections={[
                        {
                            title: "Booking Status",
                            value: status,
                            allLabel: "All statuses",
                            options: statuses.map((item) => ({ value: item, label: titleCase(item) })),
                            onSelect: updateStatus,
                        },
                        {
                            title: "Theater / Venue",
                            value: theater,
                            allLabel: "All venues",
                            options: theaters.map((item) => ({ value: item, label: item })),
                            onSelect: updateTheater,
                        },
                    ]}
                />
            )}
        </section>
    );
}

function BookingDetailsModal({ row, onClose }: { row: BookingRow; onClose: () => void }) {
    const seats = Array.isArray(row.seatIds) ? row.seatIds : [];
    const discountTotal = (row.couponDiscount || 0) + (row.rewardDiscount || 0);
    const schedule = [row.date || row.schedule?.date, row.slot || row.schedule?.time].filter(Boolean).join(" at ");
    const venue = row.theater || row.venue?.name || "Venue TBD";

    return (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-md cursor-pointer select-none" onClick={onClose}>
            <div
                className="flex max-h-[min(85vh,700px)] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white cursor-default select-none"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="shrink-0 flex items-start justify-between gap-4 px-6 py-4.5 text-white border-b border-slate-700/40 bg-slate-900">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-200">
                            {row.showType || row.sportType || "Booking"}
                        </span>
                        <p className="mt-1 text-xl font-black leading-tight text-white m-0">{row.title || "Booking Details"}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-300 m-0">Booking ID: {row._id}</p>
                    </div>
                    <button
                        aria-label="Close booking details"
                        onClick={onClose}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
                    >
                        <X size={15} strokeWidth={2.4} />
                    </button>
                </div>

                <div className="grid gap-4 overflow-auto p-5">
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <Metric label="Status" value={titleCase(row.status || "-")} />
                        <Metric label="Tickets" value={String(row.ticketCount || seats.length || 0)} />
                        <Metric label="Sale Amount" value={formatCurrency(row.saleAmount || row.amount || 0)} />
                        <Metric label="Discount" value={formatCurrency(discountTotal)} />
                    </div>

                    <Section title="Customer Information">
                        <Detail label="Name" value={row.userName || "Guest User"} />
                        <Detail label="Email" value={row.userEmail || "No email"} />
                    </Section>

                    <Section title="Show Specifications">
                        <Detail label="Venue" value={venue} />
                        <Detail label="Schedule" value={schedule || formatDate(row.bookingTime)} />
                        <Detail label="Booked On" value={formatDate(row.bookingTime || row.createdAt || "")} />
                        <Detail label="Type" value={row.showType || row.sportType || "-"} />
                        <Detail label="League" value={row.league || "-"} />
                        <Detail label="Teams" value={row.teams?.label || [row.teams?.teamA, row.teams?.teamB].filter(Boolean).join(" vs ") || "-"} />
                    </Section>

                    <Section title="Payment & Rewards">
                        <Detail label="Payment ID" value={row.paymentId || "-"} />
                        <Detail label="Razorpay Order ID" value={row.razorpayOrderId || "-"} />
                        <Detail label="Gross Amount" value={formatCurrency(row.amount || row.saleAmount || 0)} />
                        <Detail label="Coupon Code" value={row.coupon || "-"} />
                        <Detail label="Coupon Discount" value={formatCurrency(row.couponDiscount || 0)} />
                        <Detail label="Reward Points Used" value={String(row.rewardPointsRedeemed || 0)} />
                    </Section>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                        <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 m-0">Seat Allocation</p>
                        <div className="flex flex-wrap gap-1.5">
                            {seats.length ? (
                                seats.map((seat) => (
                                    <span key={seat} className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-black text-emerald-600 dark:text-emerald-300">
                                        {seat}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">No seat data available</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 m-0">{title}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-[15px] font-black text-slate-900 dark:text-white m-0" style={{ overflowWrap: "anywhere" }}>
                {value}
            </p>
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-xs font-extrabold text-slate-800 dark:text-slate-200 m-0" style={{ overflowWrap: "anywhere" }}>
                {value || "-"}
            </p>
        </div>
    );
}
