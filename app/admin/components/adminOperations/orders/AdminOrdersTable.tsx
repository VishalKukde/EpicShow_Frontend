"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { X, Search, Filter, CheckCircle2, DollarSign, AlertTriangle, RefreshCw, Clock, ShoppingBag } from "lucide-react";
import { apiFetch } from "@/lib/api";
import AdminFilterModal from "../../shared/AdminFilterModal";

type OrderRow = {
    _id: string;
    orderId: string;
    paymentId: string;
    bookingId: string;
    userName: string;
    userEmail: string;
    totalAmount: number;
    paymentStatus: "paid" | "failed" | "refunded" | "refund_initiated";
    paymentMethod: string;
    ticketCount: number;
    createdDate: string;
    bookingStatus?: string;
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

type OrdersResponse = {
    data: OrderRow[];
    filters: { statuses: string[]; methods: string[] };
    stats: {
        totalOrders: number;
        totalRevenue: number;
        failedOrders: number;
        refundedOrders: number;
        ticketsSold: number;
        refundInitiatedOrders: number;
        paidOrders?: number;
    };
    pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean };
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
    paid: { bg: "rgba(16, 185, 129, 0.14)", text: "#10B981", border: "rgba(16, 185, 129, 0.28)", label: "PAID" },
    failed: { bg: "rgba(239, 68, 68, 0.14)", text: "#EF4444", border: "rgba(239, 68, 68, 0.28)", label: "FAILED" },
    refunded: { bg: "rgba(99, 102, 241, 0.14)", text: "#818CF8", border: "rgba(99, 102, 241, 0.28)", label: "REFUNDED" },
    refund_initiated: { bg: "rgba(245, 158, 11, 0.14)", text: "#F59E0B", border: "rgba(245, 158, 11, 0.28)", label: "REFUND INITIATED" },
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

function ModernOrdersKpiCard({
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

export default function AdminOrdersTable() {
    const [rows, setRows] = useState<OrderRow[]>([]);
    const [stats, setStats] = useState<OrdersResponse["stats"] | null>(null);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [methods, setMethods] = useState<string[]>([]);
    const [status, setStatus] = useState("");
    const [method, setMethod] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<OrdersResponse["pagination"] | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<OrderRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const query = useMemo(() => {
        const params = new URLSearchParams({ page: String(page), limit: "10" });
        if (status) params.set("status", status);
        if (method) params.set("method", method);
        return params.toString();
    }, [method, page, status]);

    const loadOrders = useCallback(() => {
        setLoading(true);
        setError("");

        apiFetch(`/admin/orders?${query}`, { notifyOnError: false })
            .then((payload: OrdersResponse) => {
                setRows(payload.data || []);
                setStats(payload.stats || null);
                setStatuses(payload.filters?.statuses || []);
                setMethods(payload.filters?.methods || []);
                setPagination(payload.pagination || null);
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
            .finally(() => setLoading(false));
    }, [query]);

    useEffect(() => {
        const timer = window.setTimeout(loadOrders, 0);
        return () => window.clearTimeout(timer);
    }, [loadOrders]);

    const filteredRows = useMemo(() => {
        if (!search.trim()) return rows;
        const term = search.toLowerCase().trim();
        return rows.filter((r) =>
            (r.userName && r.userName.toLowerCase().includes(term)) ||
            (r.userEmail && r.userEmail.toLowerCase().includes(term)) ||
            (r.orderId && r.orderId.toLowerCase().includes(term)) ||
            (r.paymentId && r.paymentId.toLowerCase().includes(term)) ||
            (r._id && r._id.toLowerCase().includes(term))
        );
    }, [rows, search]);

    const activeFilterCount = [status, method].filter(Boolean).length;
    const updateStatus = (value: string) => {
        setStatus(value);
        setPage(1);
    };
    const updateMethod = (value: string) => {
        setMethod(value);
        setPage(1);
    };
    const clearFilters = () => {
        setStatus("");
        setMethod("");
        setSearch("");
        setPage(1);
    };

    // Calculate paid bookings count
    const paidBookingsCount = useMemo(() => {
        if (stats?.paidOrders !== undefined) return stats.paidOrders;
        if (!stats) return 0;
        const total = stats.totalOrders || 0;
        const failed = stats.failedOrders || 0;
        const refunded = stats.refundedOrders || 0;
        const refInit = stats.refundInitiatedOrders || 0;
        return Math.max(0, total - (failed + refunded + refInit));
    }, [stats]);

    return (
        <section style={{ display: "grid", gap: 16, paddingBottom: 6 }} className="select-none">
            {/* Top Summary Chip above KPI Cards */}
            <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-1 text-xs font-black text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
                    <ShoppingBag size={13} strokeWidth={2.5} />
                    <span>Total Processed Orders: {formatInteger(stats?.totalOrders || 0)}</span>
                </div>
            </div>

            {/* KPI Cards Grid (Total Orders replaced with Total Paid Bookings) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
                <ModernOrdersKpiCard
                    label="Total Revenue"
                    value={formatDecimalCurrency(stats?.totalRevenue || 0)}
                    sublabel="Gross processed volume"
                    accent="#6366F1"
                    icon={<DollarSign size={16} />}
                />
                <ModernOrdersKpiCard
                    label="Total Paid Bookings"
                    value={formatInteger(paidBookingsCount)}
                    sublabel="Successfully settled orders"
                    accent="#10B981"
                    icon={<CheckCircle2 size={16} />}
                />
                <ModernOrdersKpiCard
                    label="Failed Payments"
                    value={formatInteger(stats?.failedOrders || 0)}
                    sublabel="Unsuccessful checkout attempts"
                    accent="#EF4444"
                    icon={<AlertTriangle size={16} />}
                />
                <ModernOrdersKpiCard
                    label="Refunded Orders"
                    value={formatInteger(stats?.refundedOrders || 0)}
                    sublabel="Completed return transactions"
                    accent="#818CF8"
                    icon={<RefreshCw size={16} />}
                />
                <ModernOrdersKpiCard
                    label="Refund Initiated"
                    value={formatInteger(stats?.refundInitiatedOrders || 0)}
                    sublabel="Pending refund processing"
                    accent="#F59E0B"
                    icon={<Clock size={16} />}
                />
            </div>

            {/* Orders Table Container (Fixed Card Shell with Internal Sticky Header & Body Scroll) */}
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
                        <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 15, fontWeight: 800 }}>Orders Management Table</p>
                        <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 500 }}>Comprehensive order history, payment status filters, & customer breakdowns.</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* Search Input */}
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <Search size={14} style={{ position: "absolute", left: 12, color: "var(--admin-text-secondary)", pointerEvents: "none" }} />
                            <input
                                type="text"
                                placeholder="Search username, order ID..."
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
                            Filters {activeFilterCount ? `(${activeFilterCount})` : ""}
                        </button>
                    </div>
                </div>

                {error && <div style={{ padding: "12px 18px", color: "#EF4444", background: "rgba(239, 68, 68, 0.12)", borderBottom: "1px solid rgba(239, 68, 68, 0.25)", fontSize: 13, fontWeight: 800 }}>{error}</div>}

                {/* Scrollable Table Content Body (Header is Sticky Fixed, Rows Scroll Internally) */}
                <div style={{ maxHeight: 400, overflowY: "auto", position: "relative" }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, tableLayout: "auto" }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                            <tr style={{ background: "var(--admin-surface)", backdropFilter: "blur(8px)" }}>
                                {["Order ID", "User (name/email)", "Total Amount", "Payment Status", "Payment Method", "Created Date", "Actions"].map((head) => (
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
                                <tr><td colSpan={7} style={{ padding: 38, color: "var(--admin-text-secondary)", textAlign: "center", fontWeight: 700 }}>No orders found for the selected filters.</td></tr>
                            )}
                            {!loading && filteredRows.map((row) => {
                                const colors = STATUS_COLORS[row.paymentStatus] || STATUS_COLORS.failed;
                                const displayId = row.orderId || row.paymentId || row._id;
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
                                        <td style={cellStyle}><strong style={{ color: "var(--admin-text)", fontSize: 13 }}>{row.userName || "Guest User"}</strong><div style={{ color: "var(--admin-text-secondary)", fontSize: 11.5, marginTop: 2 }}>{row.userEmail || "No email"}</div></td>
                                        <td style={cellStyle}><strong style={{ color: "#10B981", fontSize: 13 }}>{formatDecimalCurrency(row.totalAmount || 0)}</strong></td>
                                        <td style={cellStyle}><span style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 900 }}>{colors.label}</span></td>
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

            {/* Order Details View Modal */}
            {selectedRow && (
                <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-md cursor-pointer select-none" onClick={() => setSelectedRow(null)}>
                    <div
                        className="flex max-h-[min(85vh,700px)] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white cursor-default select-none"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Header section */}
                        <div
                            className="shrink-0 flex items-start justify-between gap-4 px-6 py-4.5 text-white border-b border-slate-700/40 bg-slate-900"
                        >
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-sky-200 backdrop-blur-md">
                                    Payment Inspection
                                </span>
                                <p className="mt-1.5 text-xl font-black leading-tight text-white m-0">
                                    {selectedRow.orderId || selectedRow.paymentId || selectedRow._id}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-slate-300 m-0">
                                    {selectedRow.bookingTitle || selectedRow.bookingId || "Booking details"}
                                </p>
                            </div>
                            <button
                                aria-label="Close order details"
                                onClick={() => setSelectedRow(null)}
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
                            >
                                <X size={15} strokeWidth={2.4} />
                            </button>
                        </div>

                        {/* Modal Content Body */}
                        <div className="grid gap-4 overflow-auto p-5">
                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                <Metric label="Payment Status" value={STATUS_COLORS[selectedRow.paymentStatus]?.label || selectedRow.paymentStatus} />
                                <Metric label="Amount" value={formatDecimalCurrency(selectedRow.totalAmount || 0)} />
                                <Metric label="Ticket Count" value={formatInteger(selectedRow.ticketCount || 0)} />
                                <Metric label="Payment Method" value={methodLabel(selectedRow.paymentMethod)} />
                            </div>

                            <Section title="Customer Information">
                                <Detail label="Customer Name" value={selectedRow.userName || "Guest User"} />
                                <Detail label="Email Address" value={selectedRow.userEmail || "No email"} />
                            </Section>

                            <Section title="Booking Details">
                                <Detail label="Booking ID" value={selectedRow.bookingId || "-"} />
                                <Detail label="Booking Type" value={selectedRow.bookingType || "-"} />
                                <Detail label="Event Title" value={selectedRow.bookingTitle || "-"} />
                                <Detail label="Venue Location" value={selectedRow.bookingVenue || "-"} />
                                <Detail label="Date / Slot" value={[selectedRow.bookingDate, selectedRow.bookingSlot].filter(Boolean).join(" at ") || "-"} />
                                <Detail label="Booking Status" value={selectedRow.bookingStatus || "-"} />
                            </Section>

                            <Section title="Payment Specifications">
                                <Detail label="Payment ID" value={selectedRow.paymentId || "-"} />
                                <Detail label="Order ID" value={selectedRow.orderId || "-"} />
                                <Detail label="Currency" value={selectedRow.currency || "INR"} />
                                <Detail label="Refund ID" value={selectedRow.refundId || "-"} />
                                <Detail label="Coupon Applied" value={selectedRow.coupon || "-"} />
                                <Detail label="Total Savings" value={formatDecimalCurrency((selectedRow.couponDiscount || 0) + (selectedRow.rewardDiscount || 0))} />
                            </Section>

                            <SeatPanel seats={selectedRow.seatIds || []} />
                        </div>
                    </div>
                </div>
            )}

            {filtersOpen && (
                <AdminFilterModal
                    title="Filter orders"
                    subtitle="Click a chip to update the order table immediately."
                    onClear={clearFilters}
                    onClose={() => setFiltersOpen(false)}
                    sections={[
                        {
                            title: "Payment status",
                            value: status,
                            allLabel: "All statuses",
                            options: statuses.map((item) => ({ value: item, label: item.replaceAll("_", " ").toUpperCase() })),
                            onSelect: updateStatus,
                        },
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

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-[15px] font-black text-slate-900 dark:text-white m-0" style={{ overflowWrap: "anywhere" }}>{value}</p>
        </div>
    );
}

function SeatPanel({ seats }: { seats: string[] }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 m-0">Seats Allocation</p>
            <div className="flex flex-wrap gap-1.5">
                {seats.length ? seats.map((seat) => (
                    <span key={seat} className="rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-[11px] font-black text-purple-600 dark:text-purple-300">{seat}</span>
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
