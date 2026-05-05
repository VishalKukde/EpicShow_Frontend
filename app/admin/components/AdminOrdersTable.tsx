"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import AdminFilterModal from "./shared/AdminFilterModal";

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
  };
  pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean };
};

const STATUS_COLORS = {
  paid: { bg: "var(--admin-success-bg)", text: "#166534", label: "PAID" },
  failed: { bg: "#FEE2E2", text: "#991B1B", label: "FAILED" },
  refunded: { bg: "#E0E7FF", text: "#3730A3", label: "REFUNDED" },
  "refund_initiated": { bg: "#FDE68A", text: "#92400E", label: "REFUND INITIATED" },
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const compact = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });

function formatCurrency(value: number) {
  return currency.format(value || 0);
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

function StatPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="admin-stat-pill" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 14, padding: "13px 15px", boxShadow: "0 10px 28px rgba(15,13,26,.035)" }}>
      <div style={{ width: 28, height: 28, borderRadius: 10, background: `${accent}18`, display: "grid", placeItems: "center", marginBottom: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: 999, background: accent }} />
      </div>
      <p style={{ margin: 0, color: "var(--admin-text-muted)", fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "3px 0 0", color: "var(--admin-text)", fontSize: 18, fontWeight: 800, letterSpacing: "-.04em" }}>{value}</p>
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
    setPage(1);
  };

  return (
    <section style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12 }}>
        <StatPill label="Total Orders" value={compact.format(stats?.totalOrders || 0)} accent="#6C63FF" />
        <StatPill label="Revenue" value={formatCurrency(stats?.totalRevenue || 0)} accent="#10B981" />
        <StatPill label="Tickets Sold" value={compact.format(stats?.ticketsSold || 0)} accent="#0EA5E9" />
        <StatPill label="Failed Payments" value={compact.format(stats?.failedOrders || 0)} accent="#EF4444" />
        <StatPill label="Refunded Orders" value={compact.format(stats?.refundedOrders || 0)} accent="#F59E0B" />
        <StatPill label="Refund Initiated" value={compact.format(stats?.refundInitiatedOrders || 0)} accent="#FDE68A" />
      </div>

      <div className="admin-table-shell" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 18px 50px rgba(15,13,26,.07)", backdropFilter: "blur(16px)" }}>
        <div style={{ padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--admin-border)" }}>
          <div>
            <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 14, fontWeight: 800 }}>Orders</p>
            <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12 }}>Sticky header, payment filters, order details, and 10 records per page.</p>
          </div>
          <button onClick={() => setFiltersOpen(true)} style={{ border: "1px solid rgba(99, 102, 241, 0.35)", background: "rgba(99, 102, 241, 0.12)", color: "#4F46E5", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
            Filters {activeFilterCount ? `(${activeFilterCount})` : ""}
          </button>
        </div>

        {error && <div style={{ padding: "12px 18px", color: "var(--auth-error-text)", background: "var(--auth-error-bg)", borderBottom: "1px solid var(--auth-error-border)", fontSize: 13, fontWeight: 800 }}>{error}</div>}

        <div style={{ maxHeight: 540, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 5 }}>
              <tr style={{ background: "#0F0D1A" }}>
                {["Order ID", "User (name/email)", "Total Amount", "Payment Status", "Payment Method", "No. of Tickets", "Created Date", "Actions"].map((head) => (
                  <th key={head} style={{ padding: "11px 13px", color: "var(--admin-text-muted)", fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", whiteSpace: "nowrap" }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 6 }, (_, index) => (
                <tr key={index}><td colSpan={8} style={{ padding: 18, borderBottom: "1px solid var(--admin-border)" }}><div style={{ height: 16, borderRadius: 999, background: "var(--admin-border)" }} /></td></tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 38, color: "var(--admin-text-secondary)", textAlign: "center", fontWeight: 700 }}>No orders found for the selected filters.</td></tr>
              )}
              {!loading && rows.map((row) => {
                const colors = STATUS_COLORS[row.paymentStatus] || STATUS_COLORS.failed;
                return (
                  <tr key={row._id} style={{ background: "var(--admin-surface)" }}>
                    <td style={cellStyle}><strong style={{ color: "#4F46E5" }}>{row.orderId || row.paymentId || row._id}</strong></td>
                    <td style={cellStyle}><strong style={{ color: "var(--admin-text)" }}>{row.userName || "Guest User"}</strong><div style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>{row.userEmail || "No email"}</div></td>
                    <td style={cellStyle}><strong>{formatCurrency(row.totalAmount || 0)}</strong></td>
                    <td style={cellStyle}><span style={{ background: colors.bg, color: colors.text, borderRadius: 999, padding: "5px 10px", fontSize: 12, fontWeight: 900 }}>{colors.label}</span></td>
                    <td style={cellStyle}>{methodLabel(row.paymentMethod)}</td>
                    <td style={cellStyle}>{row.ticketCount || 0}</td>
                    <td style={cellStyle}>{formatDate(row.createdDate)}</td>
                    <td style={cellStyle}><button onClick={() => setSelectedRow(row)} style={actionButtonStyle(false)}>View</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--admin-border)", background: "var(--admin-surface)" }}>
          <span style={{ color: "var(--admin-text-secondary)", fontSize: 13 }}>Showing page {pagination?.page || page} of {pagination?.totalPages || 1} • {pagination?.total || 0} records</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(value - 1, 1))} style={pageButtonStyle(page <= 1 || loading)}>Previous</button>
            <button disabled={!pagination?.hasMore || loading} onClick={() => setPage((value) => value + 1)} style={pageButtonStyle(!pagination?.hasMore || loading)}>Next</button>
          </div>
        </div>
      </div>

      {selectedRow && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/55 p-4 backdrop-blur-md" onClick={() => setSelectedRow(null)}>
          <div className="flex max-h-[min(82vh,700px)] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,.30)]" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header flex items-start justify-between gap-4 px-5 py-4 text-white">
              <div>
                <p className="m-0 text-[10px] font-black uppercase tracking-[.08em] text-sky-200">Payment inspection</p>
                <p className="mt-1 text-xl font-black leading-tight text-white">{selectedRow.orderId || selectedRow.paymentId || selectedRow._id}</p>
                <p className="mt-1.5 text-xs font-semibold text-slate-300">{selectedRow.bookingTitle || selectedRow.bookingId || "Booking details"}</p>
              </div>
              <button aria-label="Close order details" onClick={() => setSelectedRow(null)} className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20">
                <X size={15} strokeWidth={2.4} />
              </button>
            </div>
            <div className="grid gap-3.5 overflow-auto p-5">
              <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                <Metric label="Payment" value={STATUS_COLORS[selectedRow.paymentStatus]?.label || selectedRow.paymentStatus} />
                <Metric label="Amount" value={formatCurrency(selectedRow.totalAmount || 0)} />
                <Metric label="Tickets" value={String(selectedRow.ticketCount || 0)} />
                <Metric label="Method" value={methodLabel(selectedRow.paymentMethod)} />
              </div>

              <Section title="Customer">
                <Detail label="Name" value={selectedRow.userName || "Guest User"} />
                <Detail label="Email" value={selectedRow.userEmail || "No email"} />
              </Section>

              <Section title="Booking">
                <Detail label="Booking ID" value={selectedRow.bookingId || "-"} />
                <Detail label="Type" value={selectedRow.bookingType || "-"} />
                <Detail label="Title" value={selectedRow.bookingTitle || "-"} />
                <Detail label="Venue" value={selectedRow.bookingVenue || "-"} />
                <Detail label="Date / Slot" value={[selectedRow.bookingDate, selectedRow.bookingSlot].filter(Boolean).join(" at ") || "-"} />
                <Detail label="Booking Status" value={selectedRow.bookingStatus || "-"} />
              </Section>

              <Section title="Payment">
                <Detail label="Payment ID" value={selectedRow.paymentId || "-"} />
                <Detail label="Order ID" value={selectedRow.orderId || "-"} />
                <Detail label="Currency" value={selectedRow.currency || "INR"} />
                <Detail label="Refund ID" value={selectedRow.refundId || "-"} />
                <Detail label="Coupon" value={selectedRow.coupon || "-"} />
                <Detail label="Savings" value={formatCurrency((selectedRow.couponDiscount || 0) + (selectedRow.rewardDiscount || 0))} />
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
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <p className="mb-2.5 text-xs font-black text-slate-900">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-500">{label}</p>
      <p className="mt-1 text-[15px] font-black text-slate-900" style={{ overflowWrap: "anywhere" }}>{value}</p>
    </div>
  );
}

function SeatPanel({ seats }: { seats: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
      <p className="mb-2.5 text-xs font-black text-slate-900">Seats</p>
      <div className="flex flex-wrap gap-1.5">
        {seats.length ? seats.map((seat) => (
          <span key={seat} className="rounded-full border border-blue-100 bg-white px-2.5 py-1 text-[11px] font-black text-blue-700">{seat}</span>
        )) : <span className="text-xs font-bold text-slate-500">No seat data available</span>}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-400">{label}</p>
      <p className="mt-1 text-xs font-extrabold text-slate-900" style={{ overflowWrap: "anywhere" }}>{value || "-"}</p>
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  padding: "11px 13px",
  borderBottom: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
  fontSize: 12,
  verticalAlign: "middle",
};

function actionButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    border: "none",
    background: disabled ? "var(--admin-border)" : "rgba(99, 102, 241, 0.14)",
    color: disabled ? "var(--admin-text-muted)" : "#4F46E5",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function pageButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    border: "1px solid var(--admin-border)",
    background: disabled ? "var(--admin-soft-solid)" : "var(--admin-surface)",
    color: disabled ? "var(--admin-text-muted)" : "var(--admin-text)",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
