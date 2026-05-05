"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import AdminFilterModal from "./shared/AdminFilterModal";

type CustomerRow = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  membership: "free" | "pro";
  walletBalance: number;
  preferences?: {
    darkMode?: boolean;
    notifications?: boolean;
  };
  rewardPoints: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
};

type CustomersResponse = {
  data: CustomerRow[];
  filters: { roles: string[]; memberships: string[] };
  stats: {
    totalUsers: number;
    admins: number;
    proMembers: number;
    walletBalance: number;
  };
  pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean };
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

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function titleCase(value?: string) {
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function boolLabel(value?: boolean) {
  return value ? "Enabled" : "Disabled";
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

export default function AdminCustomersTable() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [stats, setStats] = useState<CustomersResponse["stats"] | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [memberships, setMemberships] = useState<string[]>([]);
  const [role, setRole] = useState("");
  const [membership, setMembership] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<CustomersResponse["pagination"] | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CustomerRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (role) params.set("role", role);
    if (membership) params.set("membership", membership);
    if (search.trim()) params.set("search", search.trim());
    return params.toString();
  }, [membership, page, role, search]);

  const loadCustomers = useCallback(() => {
    setLoading(true);
    setError("");

    apiFetch(`/admin/users?${query}`, { notifyOnError: false })
      .then((payload: CustomersResponse) => {
        setRows(payload.data || []);
        setStats(payload.stats || null);
        setRoles(payload.filters?.roles || []);
        setMemberships(payload.filters?.memberships || []);
        setPagination(payload.pagination || null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load customers"))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(loadCustomers, 0);
    return () => window.clearTimeout(timer);
  }, [loadCustomers]);

  const activeFilterCount = [role, membership, search.trim()].filter(Boolean).length;
  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const updateRole = (value: string) => {
    setRole(value);
    setPage(1);
  };
  const updateMembership = (value: string) => {
    setMembership(value);
    setPage(1);
  };
  const clearFilters = () => {
    setSearch("");
    setRole("");
    setMembership("");
    setPage(1);
  };

  return (
    <section style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <StatPill label="Customers" value={compact.format(stats?.totalUsers || 0)} accent="#6C63FF" />
        <StatPill label="Admins" value={compact.format(stats?.admins || 0)} accent="#0EA5E9" />
        <StatPill label="Pro Members" value={compact.format(stats?.proMembers || 0)} accent="#10B981" />
        <StatPill label="Wallet Balance" value={formatCurrency(stats?.walletBalance || 0)} accent="#F59E0B" />
      </div>

      <div className="admin-table-shell" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 18px 50px rgba(15,13,26,.07)", backdropFilter: "blur(16px)" }}>
        <div style={{ padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--admin-border)" }}>
          <div>
            <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 14, fontWeight: 800 }}>Customers</p>
            <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12 }}>Click a row or use View to inspect the complete customer profile.</p>
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
                {["Customer", "Phone", "Role", "Membership", "Wallet", "Rewards", "Last Login", "Actions"].map((head) => (
                  <th key={head} style={{ padding: "11px 13px", color: "var(--admin-text-muted)", fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", whiteSpace: "nowrap" }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 6 }, (_, index) => (
                <tr key={index}><td colSpan={8} style={{ padding: 18, borderBottom: "1px solid var(--admin-border)" }}><div style={{ height: 16, borderRadius: 999, background: "var(--admin-border)" }} /></td></tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 38, color: "var(--admin-text-secondary)", textAlign: "center", fontWeight: 700 }}>No customers found.</td></tr>
              )}
              {!loading && rows.map((row) => (
                <tr key={row._id} onClick={() => setSelectedRow(row)} style={{ background: "var(--admin-surface)", cursor: "pointer" }}>
                  <td style={cellStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 999, background: row.avatar ? `url(${row.avatar}) center/cover` : "rgba(99, 102, 241, 0.14)", color: "#4F46E5", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 900 }}>{!row.avatar && initials(row.name)}</span>
                      <span><strong style={{ color: "var(--admin-text)" }}>{row.name || "Unnamed User"}</strong><div style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>{row.email || "No email"}</div></span>
                    </div>
                  </td>
                  <td style={cellStyle}>{row.phone || "-"}</td>
                  <td style={cellStyle}><StatusBadge value={titleCase(row.role)} tone={row.role === "admin" ? "blue" : "slate"} /></td>
                  <td style={cellStyle}><StatusBadge value={titleCase(row.membership)} tone={row.membership === "pro" ? "green" : "slate"} /></td>
                  <td style={cellStyle}><strong>{formatCurrency(row.walletBalance || 0)}</strong></td>
                  <td style={cellStyle}>{row.rewardPoints || 0}</td>
                  <td style={cellStyle}>{formatDate(row.lastLogin)}</td>
                  <td style={cellStyle}><button onClick={(event) => { event.stopPropagation(); setSelectedRow(row); }} style={actionButtonStyle}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--admin-border)", background: "var(--admin-surface)" }}>
          <span style={{ color: "var(--admin-text-secondary)", fontSize: 13 }}>Showing page {pagination?.page || page} of {pagination?.totalPages || 1} - {pagination?.total || 0} records</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(value - 1, 1))} style={pageButtonStyle(page <= 1 || loading)}>Previous</button>
            <button disabled={!pagination?.hasMore || loading} onClick={() => setPage((value) => value + 1)} style={pageButtonStyle(!pagination?.hasMore || loading)}>Next</button>
          </div>
        </div>
      </div>

      {selectedRow && <CustomerModal row={selectedRow} onClose={() => setSelectedRow(null)} />}

      {filtersOpen && (
        <AdminFilterModal
          title="Filter customers"
          subtitle="Search or click chips to update the customer table immediately."
          search={{
            label: "Search",
            value: search,
            placeholder: "Name, email, or phone",
            onChange: updateSearch,
          }}
          onClear={clearFilters}
          onClose={() => setFiltersOpen(false)}
          sections={[
            {
              title: "Role",
              value: role,
              allLabel: "All roles",
              options: roles.map((item) => ({ value: item, label: titleCase(item) })),
              onSelect: updateRole,
            },
            {
              title: "Membership",
              value: membership,
              allLabel: "All memberships",
              options: memberships.map((item) => ({ value: item, label: titleCase(item) })),
              onSelect: updateMembership,
            },
          ]}
        />
      )}
    </section>
  );
}

function CustomerModal({ row, onClose }: { row: CustomerRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="max-h-[min(82vh,680px)] w-full max-w-[680px] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,.26)]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-10 w-10 place-items-center rounded-full bg-indigo-50 text-xs font-black text-indigo-600"
              style={row.avatar ? { background: `url(${row.avatar}) center/cover` } : undefined}
            >
              {!row.avatar && initials(row.name)}
            </span>
            <div>
              <p className="m-0 text-base font-black text-slate-900">{row.name || "Customer Details"}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{row.email || "No email"}</p>
            </div>
          </div>
          <button aria-label="Close customer details" onClick={onClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200">
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <Detail label="User ID" value={row._id} />
          <Detail label="Name" value={row.name || "-"} />
          <Detail label="Email" value={row.email || "-"} />
          <Detail label="Phone" value={row.phone || "-"} />
          <Detail label="Avatar" value={row.avatar || "-"} />
          <Detail label="Role" value={titleCase(row.role)} />
          <Detail label="Membership" value={titleCase(row.membership)} />
          <Detail label="Wallet Balance" value={formatCurrency(row.walletBalance || 0)} />
          <Detail label="Reward Points" value={String(row.rewardPoints || 0)} />
          <Detail label="Dark Mode" value={boolLabel(row.preferences?.darkMode)} />
          <Detail label="Notifications" value={boolLabel(row.preferences?.notifications)} />
          <Detail label="Last Login" value={formatDate(row.lastLogin)} />
          <Detail label="Created At" value={formatDate(row.createdAt)} />
          <Detail label="Updated At" value={formatDate(row.updatedAt)} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-400">{label}</p>
      <p className="mt-1 text-xs font-extrabold text-slate-900" style={{ overflowWrap: "anywhere" }}>{value}</p>
    </div>
  );
}

function StatusBadge({ value, tone }: { value: string; tone: "blue" | "green" | "slate" }) {
  const color = tone === "blue" ? ["#DBEAFE", "#1D4ED8"] : tone === "green" ? ["var(--admin-success-bg)", "#166534"] : ["var(--admin-border)", "var(--admin-text-secondary)"];
  return <span style={{ background: color[0], color: color[1], borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 900 }}>{value}</span>;
}

function initials(name: string) {
  return (name || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

const cellStyle: React.CSSProperties = {
  padding: "11px 13px",
  borderBottom: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
  fontSize: 12,
  verticalAlign: "middle",
};

const actionButtonStyle: React.CSSProperties = {
  border: "none",
  background: "rgba(99, 102, 241, 0.14)",
  color: "#4F46E5",
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
};

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
