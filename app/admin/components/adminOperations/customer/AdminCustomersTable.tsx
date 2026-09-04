"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { X, Search, Filter, Users, ShieldCheck, Award, Wallet, Mail, Phone, Clock, Calendar, Sparkles, CheckCircle2, UserCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import AdminFilterModal from "../../shared/AdminFilterModal";

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

function formatDate(value?: string) {
    if (!value) return "—";
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

function ModernCustomerKpiCard({
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
        <section style={{ display: "grid", gap: 16, paddingBottom: 32 }} className="select-none">
            {/* Summary Badge above KPI Grid */}
            <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-1 text-xs font-black text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
                    <Users size={13} strokeWidth={2.5} />
                    <span>Total Registered Customers: {formatInteger(stats?.totalUsers || 0)}</span>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <ModernCustomerKpiCard
                    label="Total Customers"
                    value={formatInteger(stats?.totalUsers || 0)}
                    sublabel="Active platform user accounts"
                    accent="#6C63FF"
                    icon={<Users size={16} />}
                />
                <ModernCustomerKpiCard
                    label="Pro Members"
                    value={formatInteger(stats?.proMembers || 0)}
                    sublabel="VIP tier subscribers"
                    accent="#10B981"
                    icon={<Award size={16} />}
                />
                <ModernCustomerKpiCard
                    label="System Admins"
                    value={formatInteger(stats?.admins || 0)}
                    sublabel="Privileged administrative accounts"
                    accent="#0EA5E9"
                    icon={<ShieldCheck size={16} />}
                />
                <ModernCustomerKpiCard
                    label="Total Wallet Balance"
                    value={formatDecimalCurrency(stats?.walletBalance || 0)}
                    sublabel="Combined user funds deposited"
                    accent="#F59E0B"
                    icon={<Wallet size={16} />}
                />
            </div>

            {/* Customers Table Shell */}
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
                        <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 15, fontWeight: 800 }}>Customers Directory</p>
                        <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 500 }}>
                            Search customer profiles, wallet balances, reward point ranks, & security preferences.
                        </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* Search Bar */}
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <Search size={14} style={{ position: "absolute", left: 12, color: "var(--admin-text-secondary)", pointerEvents: "none" }} />
                            <input
                                type="text"
                                placeholder="Search name, email, phone..."
                                value={search}
                                onChange={(e) => updateSearch(e.target.value)}
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

                {/* Scrollable Table Content Body */}
                <div style={{ maxHeight: 400, overflowY: "auto", position: "relative" }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                            <tr style={{ background: "var(--admin-surface)", backdropFilter: "blur(8px)" }}>
                                {["Customer", "Phone", "Role", "Membership", "Wallet Balance", "Rewards", "Last Login", "Actions"].map((head) => (
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
                                <tr key={index}><td colSpan={8} style={{ padding: 18, borderBottom: "1px solid var(--admin-border)" }}><div style={{ height: 16, borderRadius: 999, background: "var(--admin-soft)", opacity: 0.6 }} /></td></tr>
                            ))}
                            {!loading && rows.length === 0 && (
                                <tr><td colSpan={8} style={{ padding: 38, color: "var(--admin-text-secondary)", textAlign: "center", fontWeight: 700 }}>No customers found matching search criteria.</td></tr>
                            )}
                            {!loading && rows.map((row) => (
                                <tr key={row._id} style={{ background: "transparent" }}>
                                    <td style={cellStyle}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div
                                                style={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 10,
                                                    background: row.avatar ? `url(${row.avatar}) center/cover` : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                                                    color: "#FFFFFF",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    fontSize: 12,
                                                    fontWeight: 900,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {!row.avatar && initials(row.name)}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <strong style={{ color: "var(--admin-text)", fontSize: 13, display: "block" }}>{row.name || "Unnamed User"}</strong>
                                                <div style={{ color: "var(--admin-text-secondary)", fontSize: 11.5, marginTop: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: 180 }} title={row.email}>
                                                    {row.email || "No email"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={cellStyle}>{row.phone || "—"}</td>
                                    <td style={cellStyle}><StatusBadge value={titleCase(row.role)} tone={row.role === "admin" ? "blue" : "slate"} /></td>
                                    <td style={cellStyle}><StatusBadge value={titleCase(row.membership)} tone={row.membership === "pro" ? "green" : "slate"} /></td>
                                    <td style={cellStyle}><strong style={{ color: "#10B981", fontSize: 13 }}>{formatDecimalCurrency(row.walletBalance || 0)}</strong></td>
                                    <td style={cellStyle}><span className="font-extrabold text-purple-600 dark:text-purple-400">{formatInteger(row.rewardPoints || 0)} PTS</span></td>
                                    <td style={cellStyle}>{formatDate(row.lastLogin)}</td>
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
                            ))}
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

            {/* Customer Profile Modal */}
            {selectedRow && <CustomerModal row={selectedRow} onClose={() => setSelectedRow(null)} />}

            {filtersOpen && (
                <AdminFilterModal
                    title="Filter customers"
                    subtitle="Click chips to filter by user role and membership."
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
        <div
            className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-md cursor-pointer select-none"
            onClick={onClose}
        >
            <div
                className="flex max-h-[min(85vh,680px)] w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white cursor-default select-none"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Luxury Fixed Header Header */}
                <div
                    className="shrink-0 flex items-start justify-between gap-4 px-6 py-4 text-white border-b border-slate-700/40 bg-slate-900"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="relative rounded-xl p-[2px] bg-indigo-600">
                            {row.avatar ? (
                                // eslint-disable-next-next/no-img-element
                                <img src={row.avatar} alt={row.name} className="h-11 w-11 rounded-[10px] object-cover" />
                            ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-slate-900 text-sm font-black text-white">
                                    {initials(row.name)}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="m-0 text-lg font-black text-white">{row.name || "Unnamed User"}</h3>
                                <span className="rounded border border-indigo-400/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-indigo-200">
                                    {titleCase(row.role)}
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs font-semibold text-slate-300 m-0">{row.email || "No email"}</p>
                        </div>
                    </div>
                    <button
                        aria-label="Close customer details"
                        onClick={onClose}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
                    >
                        <X size={15} strokeWidth={2.4} />
                    </button>
                </div>

                {/* Modal Body Grid */}
                <div className="grid gap-3.5 overflow-auto p-5">
                    {/* Highlights Banner */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/30">
                            <span className="text-[9.5px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Wallet Balance</span>
                            <p className="mt-1 text-xl font-black text-slate-900 dark:text-white m-0">{formatDecimalCurrency(row.walletBalance || 0)}</p>
                            <p className="mt-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 m-0">Instant checkout ready</p>
                        </div>

                        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3 dark:border-purple-900/40 dark:bg-purple-950/30">
                            <span className="text-[9.5px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">Reward Points</span>
                            <p className="mt-1 text-xl font-black text-slate-900 dark:text-white m-0">
                                {formatInteger(row.rewardPoints || 0)} <span className="text-xs font-extrabold text-purple-500">PTS</span>
                            </p>
                            <p className="mt-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 m-0">Loyalty tier: {titleCase(row.membership)}</p>
                        </div>
                    </div>

                    {/* Account Profile Specifications */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/40">
                        <div className="mb-2.5 flex items-center gap-1.5">
                            <UserCheck size={13} className="text-indigo-500" />
                            <h4 className="m-0 text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Account Specifications</h4>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            <LuxuryTile icon={<Mail size={12} />} label="Email Address" value={row.email} />
                            <LuxuryTile icon={<Phone size={12} />} label="Phone Number" value={row.phone || "Not linked"} />
                            <LuxuryTile icon={<ShieldCheck size={12} />} label="Role" value={titleCase(row.role)} />
                            <LuxuryTile icon={<Award size={12} />} label="Membership" value={titleCase(row.membership)} />
                            <LuxuryTile icon={<Clock size={12} />} label="Last Activity" value={formatDate(row.lastLogin)} />
                            <LuxuryTile icon={<Calendar size={12} />} label="Created On" value={formatDate(row.createdAt)} />
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/40">
                        <div className="mb-2.5 flex items-center gap-1.5">
                            <Sparkles size={13} className="text-emerald-500" />
                            <h4 className="m-0 text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">System Preferences</h4>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <LuxuryTile icon={<Sparkles size={12} />} label="Dark Mode" value={boolLabel(row.preferences?.darkMode)} />
                            <LuxuryTile icon={<Sparkles size={12} />} label="Notifications" value={boolLabel(row.preferences?.notifications)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LuxuryTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                {icon}
                <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
            </div>
            <p className="mt-0.5 text-[11.5px] font-extrabold text-slate-900 dark:text-slate-100 m-0" style={{ overflowWrap: "anywhere" }}>
                {value || "-"}
            </p>
        </div>
    );
}

function StatusBadge({ value, tone }: { value: string; tone: "blue" | "green" | "slate" }) {
    const bg = tone === "blue" ? "rgba(59, 130, 246, 0.14)" : tone === "green" ? "rgba(16, 185, 129, 0.14)" : "rgba(148, 163, 184, 0.14)";
    const color = tone === "blue" ? "#3B82F6" : tone === "green" ? "#10B981" : "var(--admin-text-secondary)";
    const border = tone === "blue" ? "rgba(59, 130, 246, 0.28)" : tone === "green" ? "rgba(16, 185, 129, 0.28)" : "var(--admin-border)";
    return (
        <span style={{ background: bg, color: color, border: `1px solid ${border}`, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 900 }}>
            {value}
        </span>
    );
}

function initials(name: string) {
    return (name || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
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
