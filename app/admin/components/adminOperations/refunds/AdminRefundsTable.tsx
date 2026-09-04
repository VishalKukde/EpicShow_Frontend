"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { X, Search, Filter, RefreshCw, DollarSign, Clock, AlertCircle, RotateCcw, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import AdminFilterModal from "../../shared/AdminFilterModal";

type RefundRow = {
    _id: string;
    orderId: string;
    paymentId: string;
    bookingId: string;
    userName: string;
    userEmail: string;
    bookingStatus: "cancelled" | "pending" | "paid" | "failed" | "expired" | "unknown";
    totalAmount: number;
    paymentStatus: "paid" | "failed" | "refunded" | "refund_initiated";
    paymentMethod: string;
    ticketCount: number;
    createdDate: string;
    bookingType?: string;
    bookingTitle?: string;
    bookingVenue?: string;
    bookingDate?: string;
    bookingSlot?: string;
    seatIds?: string[];
    coupon?: string;
    couponDiscount?: number;
    rewardPointsRedeemed?: number;
    rewardDiscount?: number;
    refundId?: string;
    currency?: string;
};

type RefundsResponse = {
    data: RefundRow[];
    filters: { methods: string[] };
    stats: {
        totalOrders: number;
        totalRevenue: number;
        ticketsSold: number;
        refundInitiatedOrders: number;
    };
    pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean };
};

function formatDecimalCurrency(val: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(val || 0);
}

function formatInteger(val: number) {
    return new Intl.NumberFormat("en-IN").format(Math.floor(val || 0));
}

function formatDate(value: string) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function methodLabel(value: string) {
    if (!value) return "Wallet";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function statusLabel(value: string) {
    if (!value) return "Unknown";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function ModernRefundKpiCard({
    accent,
    icon,
    label,
    sublabel,
    value,
}: {
    accent: string;
    icon: ReactNode;
    label: string;
    sublabel: string;
    value: string;
}) {
    return (
        <div
            className="admin-kpi-card select-none"
            style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 16,
                padding: "14px 16px",
                minHeight: 104,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 10px 28px rgba(15,13,26,.035)",
                transition: "all 0.2s ease",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                    style={{
                        color: "var(--admin-text-muted)",
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                    }}
                >
                    {label}
                </span>
                <div
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        background: `${accent}18`,
                        color: accent,
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    {icon}
                </div>
            </div>

            <div>
                <p
                    style={{
                        margin: "4px 0 0",
                        color: "var(--admin-text)",
                        fontSize: 20,
                        fontWeight: 900,
                        letterSpacing: "-.03em",
                        lineHeight: 1.1,
                    }}
                >
                    {value}
                </p>
                <p
                    style={{
                        margin: "3px 0 0",
                        color: "var(--admin-text-muted)",
                        fontSize: 10.5,
                        fontWeight: 600,
                    }}
                >
                    {sublabel}
                </p>
            </div>
        </div>
    );
}

export default function AdminRefundsTable() {
    const [rows, setRows] = useState<RefundRow[]>([]);
    const [stats, setStats] = useState<RefundsResponse["stats"] | null>(null);
    const [methods, setMethods] = useState<string[]>([]);
    const [method, setMethod] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<RefundsResponse["pagination"] | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<RefundRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [refundingId, setRefundingId] = useState("");
    const [error, setError] = useState("");

    const query = useMemo(() => {
        const params = new URLSearchParams({ page: String(page), limit: "10", status: "refund_initiated", bookingStatus: "cancelled" });
        if (method) params.set("method", method);
        return params.toString();
    }, [method, page]);

    const loadRefunds = useCallback(() => {
        setLoading(true);
        setError("");

        apiFetch(`/admin/orders?${query}`, { notifyOnError: false })
            .then((payload: RefundsResponse) => {
                setRows(payload.data || []);
                setStats(payload.stats || null);
                setMethods(payload.filters?.methods || []);
                setPagination(payload.pagination || null);
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Failed to load refundable bookings"))
            .finally(() => setLoading(false));
    }, [query]);

    useEffect(() => {
        const timer = window.setTimeout(loadRefunds, 0);
        return () => window.clearTimeout(timer);
    }, [loadRefunds]);

    const filteredRows = useMemo(() => {
        if (!search.trim()) return rows;
        const term = search.toLowerCase().trim();
        return rows.filter((r) =>
            (r.userName && r.userName.toLowerCase().includes(term)) ||
            (r.userEmail && r.userEmail.toLowerCase().includes(term)) ||
            (r.bookingId && r.bookingId.toLowerCase().includes(term)) ||
            (r.orderId && r.orderId.toLowerCase().includes(term)) ||
            (r.paymentId && r.paymentId.toLowerCase().includes(term))
        );
    }, [rows, search]);

    const updateMethod = (value: string) => {
        setMethod(value);
        setPage(1);
    };

    const clearFilters = () => {
        setMethod("");
        setSearch("");
        setPage(1);
    };

    const refundOrder = async (row: RefundRow) => {
        if (row.paymentStatus !== "refund_initiated") return;
        setRefundingId(row._id);
        setError("");

        try {
            await apiFetch(`/admin/orders/${row._id}/refund`, {
                method: "PATCH",
                notifyOnError: false,
            });
            setSelectedRow(null);
            loadRefunds();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to refund booking");
        } finally {
            setRefundingId("");
        }
    };

    return (
        <section style={{ display: "grid", gap: 16, paddingBottom: 32 }} className="select-none">
            {/* Top Summary Badge */}
            <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-black text-amber-600 dark:text-amber-400 backdrop-blur-md">
                    <Clock size={13} strokeWidth={2.5} />
                    <span>Pending Refund Queue: {formatInteger(stats?.totalOrders || filteredRows.length || 0)}</span>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <ModernRefundKpiCard
                    label="Refundable Bookings"
                    value={formatInteger(stats?.totalOrders || 0)}
                    sublabel="Cancelled bookings awaiting refund"
                    accent="#6C63FF"
                    icon={<RefreshCw size={16} />}
                />
                <ModernRefundKpiCard
                    label="Refundable Amount"
                    value={formatDecimalCurrency(stats?.totalRevenue || 0)}
                    sublabel="Total capital pending disbursement"
                    accent="#EF4444"
                    icon={<DollarSign size={16} />}
                />
                <ModernRefundKpiCard
                    label="Pending Queue Items"
                    value={formatInteger(stats?.refundInitiatedOrders || stats?.totalOrders || 0)}
                    sublabel="High priority action items"
                    accent="#F59E0B"
                    icon={<Clock size={16} />}
                />
            </div>

            {/* Refunds Table Container */}
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
                        <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 15, fontWeight: 800 }}>Refund Execution Queue</p>
                        <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 500 }}>
                            Review cancelled bookings eligible for instant refund settlement.
                        </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* Search Input */}
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <Search size={14} style={{ position: "absolute", left: 12, color: "var(--admin-text-secondary)", pointerEvents: "none" }} />
                            <input
                                type="text"
                                placeholder="Search booking ID, user..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
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
                            Filters {method ? "(1)" : ""}
                        </button>
                    </div>
                </div>

                {error && <div style={{ padding: "12px 18px", color: "#EF4444", background: "rgba(239, 68, 68, 0.12)", borderBottom: "1px solid rgba(239, 68, 68, 0.25)", fontSize: 13, fontWeight: 800 }}>{error}</div>}

                {/* Scrollable Table Content Body */}
                <div style={{ maxHeight: 400, overflowY: "auto", position: "relative" }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, tableLayout: "auto" }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                            <tr style={{ background: "var(--admin-surface)", backdropFilter: "blur(8px)" }}>
                                {["Booking ID", "User (Name/Email)", "Status", "Refund Amount", "Payment Method", "Booked On", "Actions"].map((head) => (
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
                                <tr key={index}><td colSpan={7} style={{ padding: 18, borderBottom: "1px solid var(--admin-border)" }}><div style={{ height: 16, borderRadius: 999, background: "var(--admin-soft)", opacity: 0.6 }} /></td></tr>
                            ))}
                            {!loading && filteredRows.length === 0 && (
                                <tr><td colSpan={7} style={{ padding: 38, color: "var(--admin-text-secondary)", textAlign: "center", fontWeight: 700 }}>No cancelled bookings waiting for refund.</td></tr>
                            )}
                            {!loading && filteredRows.map((row) => {
                                const displayId = row.bookingId || row.orderId || row.paymentId || row._id;
                                return (
                                    <tr key={row._id} style={{ background: "transparent" }}>
                                        <td style={{ ...cellStyle, maxWidth: 130 }}>
                                            <strong
                                                title={displayId}
                                                style={{
                                                    color: "#6C63FF",
                                                    fontSize: 12,
                                                    display: "block",
                                                    maxWidth: 120,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {displayId}
                                            </strong>
                                        </td>
                                        <td style={cellStyle}>
                                            <strong style={{ color: "var(--admin-text)", fontSize: 13 }}>{row.userName || "Guest User"}</strong>
                                            <div style={{ color: "var(--admin-text-secondary)", fontSize: 11.5, marginTop: 1 }}>{row.userEmail || "No email"}</div>
                                        </td>
                                        <td style={cellStyle}>
                                            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-black uppercase text-amber-500">
                                                {statusLabel(row.bookingStatus)}
                                            </span>
                                        </td>
                                        <td style={cellStyle}>
                                            <strong style={{ color: "#EF4444", fontSize: 13 }}>{formatDecimalCurrency(row.totalAmount || 0)}</strong>
                                        </td>
                                        <td style={cellStyle}>{methodLabel(row.paymentMethod)}</td>
                                        <td style={cellStyle}>{formatDate(row.createdDate)}</td>
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
                    <span style={{ color: "var(--admin-text-secondary)", fontSize: 13 }}>Showing page {pagination?.page || page} of {pagination?.totalPages || 1} • {pagination?.total || 0} records</span>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(value - 1, 1))} style={pageButtonStyle(page <= 1 || loading)}>Previous</button>
                        <button disabled={!pagination?.hasMore || loading} onClick={() => setPage((value) => value + 1)} style={pageButtonStyle(!pagination?.hasMore || loading)}>Next</button>
                    </div>
                </div>
            </div>

            {/* Refund Inspection & Execution Modal */}
            {selectedRow && (
                <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-md cursor-pointer select-none" onClick={() => setSelectedRow(null)}>
                    <div
                        className="flex max-h-[min(85vh,700px)] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white cursor-default select-none"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Header */}
                        <div
                            className="shrink-0 flex items-start justify-between gap-4 px-6 py-4 text-white border-b border-slate-700/40 bg-slate-900"
                        >
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-200 backdrop-blur-md">
                                    <AlertCircle size={12} className="text-amber-400" />
                                    Refund Execution Review
                                </span>
                                <p className="mt-1.5 text-xl font-black leading-tight text-white m-0">
                                    {selectedRow.bookingTitle || selectedRow.bookingId || "Refundable Booking"}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-slate-300 m-0">
                                    Booking ID: {selectedRow.bookingId || "-"} • Order ID: {selectedRow.orderId || "-"}
                                </p>
                            </div>
                            <button
                                aria-label="Close refund details"
                                onClick={() => setSelectedRow(null)}
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
                            >
                                <X size={15} strokeWidth={2.4} />
                            </button>
                        </div>

                        {/* Modal Content Body */}
                        <div className="grid gap-3.5 overflow-auto p-5">
                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                <Metric label="Refundable Amount" value={formatDecimalCurrency(selectedRow.totalAmount || 0)} tone="rose" />
                                <Metric label="Booking Status" value={statusLabel(selectedRow.bookingStatus)} />
                                <Metric label="Payment Status" value={statusLabel(selectedRow.paymentStatus)} />
                                <Metric label="Tickets Count" value={formatInteger(selectedRow.ticketCount || 0)} />
                            </div>

                            <Section title="Customer Specification">
                                <Detail label="Customer Name" value={selectedRow.userName || "Guest User"} />
                                <Detail label="Email Address" value={selectedRow.userEmail || "No email"} />
                            </Section>

                            <Section title="Booking Details">
                                <Detail label="Category Type" value={selectedRow.bookingType || "-"} />
                                <Detail label="Event Title" value={selectedRow.bookingTitle || "-"} />
                                <Detail label="Venue Location" value={selectedRow.bookingVenue || "-"} />
                                <Detail label="Date / Slot" value={[selectedRow.bookingDate, selectedRow.bookingSlot].filter(Boolean).join(" at ") || "-"} />
                                <Detail label="Booked On" value={formatDate(selectedRow.createdDate)} />
                                <Detail label="Coupon Code" value={selectedRow.coupon || "-"} />
                            </Section>

                            <Section title="Payment Specifications">
                                <Detail label="Order ID" value={selectedRow.orderId || selectedRow._id} />
                                <Detail label="Payment ID" value={selectedRow.paymentId || "-"} />
                                <Detail label="Payment Method" value={methodLabel(selectedRow.paymentMethod)} />
                                <Detail label="Currency" value={selectedRow.currency || "INR"} />
                                <Detail label="Refund ID" value={selectedRow.refundId || "-"} />
                                <Detail label="Savings Discount" value={formatDecimalCurrency((selectedRow.couponDiscount || 0) + (selectedRow.rewardDiscount || 0))} />
                            </Section>

                            <SeatPanel seats={selectedRow.seatIds || []} />
                        </div>

                        {/* Footer Execution Action Bar */}
                        <div className="shrink-0 flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900/80">
                            <span className="text-[11px] font-bold text-slate-400">
                                Action will immediately update wallet balance & refund status.
                            </span>
                            <div className="flex items-center gap-2.5">
                                <button
                                    onClick={() => setSelectedRow(null)}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={refundingId === selectedRow._id || selectedRow.paymentStatus !== "refund_initiated"}
                                    onClick={() => refundOrder(selectedRow)}
                                    className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 active:scale-95 disabled:opacity-60 cursor-pointer"
                                >
                                    <RotateCcw size={13} strokeWidth={2.4} />
                                    <span>{refundingId === selectedRow._id ? "Refunding..." : "Process Refund"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {filtersOpen && (
                <AdminFilterModal
                    title="Filter refunds"
                    subtitle="Click a payment chip to update the refund table immediately."
                    onClear={clearFilters}
                    onClose={() => setFiltersOpen(false)}
                    sections={[
                        {
                            title: "Payment method",
                            value: method,
                            allLabel: "All methods",
                            options: methods.map((item) => ({ value: item, label: methodLabel(item) })),
                            onSelect: updateMethod,
                        },
                    ]}
                />
            )}
        </section>
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

function Metric({ label, value, tone }: { label: string; value: string; tone?: "rose" }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-500 dark:text-slate-400">{label}</p>
            <p className={`mt-1 text-[15px] font-black m-0 ${tone === "rose" ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`} style={{ overflowWrap: "anywhere" }}>
                {value}
            </p>
        </div>
    );
}

function SeatPanel({ seats }: { seats: string[] }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 m-0">Seats Allocated</p>
            <div className="flex flex-wrap gap-1.5">
                {seats.length ? seats.map((seat) => (
                    <span key={seat} className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-black text-amber-600 dark:text-amber-400">{seat}</span>
                )) : <span className="text-xs font-bold text-slate-500 dark:text-slate-400">No seat data available</span>}
            </div>
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-xs font-extrabold text-slate-800 dark:text-slate-200 m-0" style={{ overflowWrap: "anywhere" }}>{value || "-"}</p>
        </div>
    );
}

const cellStyle: React.CSSProperties = {
    padding: "12px 14px",
    borderBottom: "1px solid var(--admin-border)",
    color: "var(--admin-text)",
    fontSize: 12,
    verticalAlign: "middle",
};

function pageButtonStyle(disabled: boolean): React.CSSProperties {
    return {
        border: "1px solid var(--admin-border)",
        background: disabled ? "var(--admin-soft-solid)" : "var(--admin-surface)",
        color: disabled ? "var(--admin-text-muted)" : "var(--admin-text)",
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
    };
}
