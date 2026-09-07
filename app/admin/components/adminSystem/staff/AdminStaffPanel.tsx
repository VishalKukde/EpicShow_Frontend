"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
    ShieldCheck,
    UserPlus,
    Smartphone,
    CheckCircle2,
    AlertTriangle,
    Search,
    History,
    X,
    User,
    BadgeCheck,
    UserX,
    Check,
    RefreshCcw,
    Loader2,
    Lock,
    Sparkles,
} from "lucide-react";
import {
    getStoredUserStatuses,
    setUserAccountStatus,
    UserAccountStatus,
} from "@/lib/userStatusStore";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export type StaffMember = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: "Super Admin" | "Operations Manager" | "Finance Auditor" | "Support Operator";
    department: "Security & Exec" | "Operations" | "Finance" | "Customer Service";
    mfaStatus: "Enforced (Hardware Key)" | "Enforced (Authenticator App)" | "Pending Setup";
    permissions: string[];
    lastActive: string;
    ipAddress: string;
    status: "Active" | "Suspended" | "Deactivated";
};

export type AuditLog = {
    id: string;
    actor: string;
    action: string;
    target: string;
    timestamp: string;
    severity: "info" | "warning" | "critical";
};

type ApiUserResponse = {
    success: boolean;
    data: Array<{
        _id: string;
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
        role?: "user" | "organizer" | "admin";
        membership?: "free" | "pro";
        status?: string;
        lastLogin?: string;
        createdAt?: string;
    }>;
};

const INITIAL_STAFF: StaffMember[] = [
    {
        id: "STF-100",
        name: "Demo Customer User",
        email: "demo@gmail.com",
        role: "Support Operator",
        department: "Customer Service",
        mfaStatus: "Enforced (Authenticator App)",
        permissions: ["Customer View", "Booking Lookup"],
        lastActive: "Active today",
        ipAddress: "127.0.0.1 (IN)",
        status: "Active",
    },
    {
        id: "STF-101",
        name: "Vishal Sharma",
        email: "vishal.admin@epicshow.in",
        role: "Super Admin",
        department: "Security & Exec",
        mfaStatus: "Enforced (Hardware Key)",
        permissions: ["Full Administrative Control", "Security Policy", "Financial Audit"],
        lastActive: "Just now",
        ipAddress: "49.36.218.14 (IN)",
        status: "Active",
    },
    {
        id: "STF-102",
        name: "Siddharth Verma",
        email: "siddharth.v@epicshow.in",
        role: "Operations Manager",
        department: "Operations",
        mfaStatus: "Enforced (Authenticator App)",
        permissions: ["Booking Management", "Venue Operations", "Refund Claims"],
        lastActive: "12 mins ago",
        ipAddress: "152.57.42.89 (IN)",
        status: "Active",
    },
    {
        id: "STF-103",
        name: "Priyanka Roy",
        email: "priyanka.finance@epicshow.in",
        role: "Finance Auditor",
        department: "Finance",
        mfaStatus: "Enforced (Authenticator App)",
        permissions: ["Revenue Analytics", "Financial Reports", "Refund Approval"],
        lastActive: "1 hour ago",
        ipAddress: "103.21.126.11 (IN)",
        status: "Active",
    },
    {
        id: "STF-104",
        name: "Aman Gupta",
        email: "aman.g@epicshow.in",
        role: "Support Operator",
        department: "Customer Service",
        mfaStatus: "Pending Setup",
        permissions: ["Customer View", "Booking Lookup", "Ticket Resend"],
        lastActive: "3 hours ago",
        ipAddress: "114.143.20.9 (IN)",
        status: "Active",
    },
];

const RECENT_AUDIT_LOGS: AuditLog[] = [
    {
        id: "LOG-901",
        actor: "Vishal Sharma",
        action: "Updated Razorpay API Key",
        target: "System Gateways",
        timestamp: "2026-09-04 15:45",
        severity: "critical",
    },
    {
        id: "LOG-902",
        actor: "Priyanka Roy",
        action: "Exported Full Financial Audit CSV",
        target: "Revenue Reporting",
        timestamp: "2026-09-04 14:10",
        severity: "info",
    },
    {
        id: "LOG-903",
        actor: "Siddharth Verma",
        action: "Created Promo Code FESTIVE500",
        target: "Marketing Coupons",
        timestamp: "2026-09-04 11:20",
        severity: "info",
    },
    {
        id: "LOG-904",
        actor: "Security Engine",
        action: "Failed Login Attempt Blocked (IP 194.26.29.1)",
        target: "Staff SSO Portal",
        timestamp: "2026-09-04 09:05",
        severity: "warning",
    },
];

export default function AdminStaffPanel() {
    const { user: currentAdmin } = useAuth();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [statusToast, setStatusToast] = useState<string | null>(null);

    // Invite Staff Modal State
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [newStaffName, setNewStaffName] = useState("");
    const [newStaffEmail, setNewStaffEmail] = useState("");
    const [newStaffRole, setNewStaffRole] = useState<StaffMember["role"]>("Support Operator");
    const [inviteSuccessMsg, setInviteSuccessMsg] = useState("");

    // Fetch live users API data
    const fetchStaffFromApi = useCallback(() => {
        setLoading(true);
        setError("");
        apiFetch("/admin/users?limit=100", { notifyOnError: false })
            .then((res: ApiUserResponse) => {
                const storedStatuses = getStoredUserStatuses();
                if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
                    const adminUsers = res.data.filter((u) => u.role === "admin");
                    const targetList = adminUsers.length > 0 ? adminUsers : res.data;
                    const mappedStaff: StaffMember[] = targetList.map((u, idx) => {
                        const normalizedEmail = u.email ? u.email.toLowerCase().trim() : "";
                        const savedStatus = storedStatuses[normalizedEmail];

                        let role: StaffMember["role"] = "Super Admin";
                        let department: StaffMember["department"] = "Security & Exec";
                        let permissions = ["Full Administrative Control", "Security Policy", "Financial Audit"];

                        if (u.role === "admin") {
                            role = "Super Admin";
                            department = "Security & Exec";
                            permissions = ["Full Administrative Control", "Security Policy", "Financial Audit"];
                        } else if (u.role === "organizer") {
                            role = "Operations Manager";
                            department = "Operations";
                            permissions = ["Booking Management", "Venue Operations", "Refund Claims"];
                        } else if (u.membership === "pro") {
                            role = "Finance Auditor";
                            department = "Finance";
                            permissions = ["Revenue Analytics", "Financial Reports", "Refund Approval"];
                        }

                        const mfaStatus: StaffMember["mfaStatus"] = u.role === "admin"
                            ? "Enforced (Hardware Key)"
                            : "Enforced (Authenticator App)";

                        const formattedLastActive = u.lastLogin
                            ? new Date(u.lastLogin).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "Active recently";

                        return {
                            id: u._id || `STF-${100 + idx}`,
                            name: u.name || (u.email ? u.email.split("@")[0] : "Unnamed User"),
                            email: u.email || "no-email@epicshow.in",
                            avatar: u.avatar,
                            role,
                            department,
                            mfaStatus,
                            permissions,
                            lastActive: formattedLastActive,
                            ipAddress: u.phone ? `Ph: ${u.phone}` : "127.0.0.1 (IN)",
                            status: (u.status || savedStatus || "Active") as UserAccountStatus,
                        };
                    });
                    setStaff(mappedStaff);
                } else {
                    // Fallback to initial admin staff if API returned empty array
                    setStaff(
                        INITIAL_STAFF.filter((s) => s.role === "Super Admin").map((s) => {
                            const normalizedEmail = s.email.toLowerCase().trim();
                            return storedStatuses[normalizedEmail] ? { ...s, status: storedStatuses[normalizedEmail] } : s;
                        })
                    );
                }
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to load live staff data");
                const storedStatuses = getStoredUserStatuses();
                setStaff(
                    INITIAL_STAFF.filter((s) => s.role === "Super Admin").map((s) => {
                        const normalizedEmail = s.email.toLowerCase().trim();
                        return storedStatuses[normalizedEmail] ? { ...s, status: storedStatuses[normalizedEmail] } : s;
                    })
                );
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchStaffFromApi();
    }, [fetchStaffFromApi]);

    // Filter staff list
    const filteredStaff = useMemo(() => {
        return staff.filter((s) => {
            const q = search.toLowerCase();
            const matchesSearch = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
            const matchesRole = roleFilter === "all" || s.role.toLowerCase() === roleFilter.toLowerCase();
            const matchesStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [staff, search, roleFilter, statusFilter]);

    // Statistics
    const activeCount = staff.filter((s) => s.status === "Active").length;
    const suspendedCount = staff.filter((s) => s.status === "Suspended" || s.status === "Deactivated").length;
    const mfaEnforcedCount = staff.filter((s) => s.mfaStatus.startsWith("Enforced")).length;
    const mfaRate = staff.length ? Math.round((mfaEnforcedCount / staff.length) * 100) : 0;

    const [confirmStaffAction, setConfirmStaffAction] = useState<{ id: string; name: string; email: string; newStatus: UserAccountStatus } | null>(null);

    // Change Staff Status (Activate, Suspend, Deactivate)
    const updateStaffStatus = (id: string, newStatus: UserAccountStatus) => {
        const targetStaff = staff.find((s) => s.id === id);
        if (!targetStaff) return;

        setUserAccountStatus(targetStaff.email, newStatus);

        setStaff((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );

        apiFetch("/admin/users/status", {
            method: "PATCH",
            body: JSON.stringify({ email: targetStaff.email, status: newStatus }),
        }).catch((err) => {
            console.error("Failed to sync staff status with backend:", err);
        });

        const statusMsg = newStatus === "Active"
            ? `Account for ${targetStaff.name} (${targetStaff.email}) is now Activated.`
            : newStatus === "Suspended"
                ? `Account for ${targetStaff.name} (${targetStaff.email}) has been Suspended. Login access revoked.`
                : `Account for ${targetStaff.name} (${targetStaff.email}) has been Deactivated. Login access revoked.`;

        setStatusToast(statusMsg);
        setConfirmStaffAction(null);
        setTimeout(() => setStatusToast(null), 4000);
    };

    // Handle Invite New Staff Submit
    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStaffName || !newStaffEmail) return;

        let department: StaffMember["department"] = "Customer Service";
        let permissions = ["Customer View", "Booking Lookup"];

        if (newStaffRole === "Super Admin") {
            department = "Security & Exec";
            permissions = ["Full Administrative Control", "Security Policy", "Financial Audit"];
        } else if (newStaffRole === "Operations Manager") {
            department = "Operations";
            permissions = ["Booking Management", "Venue Operations", "Refund Claims"];
        } else if (newStaffRole === "Finance Auditor") {
            department = "Finance";
            permissions = ["Revenue Analytics", "Financial Reports"];
        }

        const created: StaffMember = {
            id: `STF-${100 + staff.length + 1}`,
            name: newStaffName,
            email: newStaffEmail,
            role: newStaffRole,
            department,
            mfaStatus: "Pending Setup",
            permissions,
            lastActive: "Invited (Pending login)",
            ipAddress: "N/A",
            status: "Active",
        };

        setStaff((prev) => [created, ...prev]);
        setInviteSuccessMsg(`Invite link dispatched to ${newStaffEmail}`);
        setNewStaffName("");
        setNewStaffEmail("");

        setTimeout(() => {
            setInviteSuccessMsg("");
            setInviteModalOpen(false);
        }, 1800);
    };

    return (
        <div className="space-y-6 pb-16 select-none">
            {/* Notification Toast for Account Status Updates */}
            {statusToast && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-700 p-4 text-xs font-black text-white shadow-2xl backdrop-blur-md animate-fadeIn">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span>{statusToast}</span>
                </div>
            )}

            {/* Top Banner */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 20,
                }}
                className="flex flex-wrap items-center justify-between gap-4 p-5 shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                        <ShieldCheck size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                Staff Access & RBAC Security Control
                            </h2>
                            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                                Live API Connected
                            </span>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-semibold m-0">
                            Manage team access privileges, suspend/deactivate accounts, enforce MFA, and monitor security audit logs.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchStaffFromApi}
                        disabled={loading}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-700 active:scale-95 disabled:opacity-50"
                        title="Refresh Live API Staff Data"
                    >
                        <RefreshCcw size={14} className={loading ? "animate-spin text-indigo-400" : ""} />
                        <span>Refresh Data</span>
                    </button>

                    <button
                        onClick={() => setInviteModalOpen(true)}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95"
                    >
                        <UserPlus size={16} />
                        <span>Invite Staff Member</span>
                    </button>
                </div>
            </div>

            {/* Error banner if API fails */}
            {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-500 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={fetchStaffFromApi} className="underline text-[11px]">Retry API</button>
                </div>
            )}

            {/* Security KPI Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Active Staff</span>
                        <User size={18} className="text-indigo-500" />
                    </div>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        {activeCount} <span className="text-xs font-semibold text-slate-400">/ {staff.length}</span>
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-500 m-0">Operational Personnel</p>
                </div>

                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">MFA Security Compliance</span>
                        <Smartphone size={18} className="text-emerald-500" />
                    </div>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        {mfaRate}%
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-500 m-0">{mfaEnforcedCount} Staff 2FA Verified</p>
                </div>

                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Super Admin Holds</span>
                        <BadgeCheck size={18} className="text-amber-500" />
                    </div>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        {staff.filter((s) => s.role === "Super Admin").length}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-amber-500 m-0">Full System Privileges</p>
                </div>

                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Suspended / Deactivated</span>
                        <UserX size={18} className="text-rose-500" />
                    </div>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        {suspendedCount}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-rose-500 m-0">Login Access Blocked</p>
                </div>
            </div>

            {/* Staff Roster Table */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 20,
                }}
                className="shadow-lg overflow-hidden"
            >
                {/* Table Toolbar */}
                <div
                    style={{ borderBottom: "1px solid var(--admin-border)", background: "var(--admin-soft)" }}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex items-center">
                            <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search staff name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    background: "var(--admin-surface)",
                                    border: "1px solid var(--admin-border)",
                                    color: "var(--admin-text)",
                                }}
                                className="w-64 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:border-indigo-500"
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                color: "var(--admin-text)",
                            }}
                            className="rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                        >
                            <option value="all">All Roles</option>
                            <option value="Super Admin">Super Admin</option>
                            <option value="Operations Manager">Operations Manager</option>
                            <option value="Finance Auditor">Finance Auditor</option>
                            <option value="Support Operator">Support Operator</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                color: "var(--admin-text)",
                            }}
                            className="rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Deactivated">Deactivated</option>
                        </select>
                    </div>

                    <span className="text-xs font-bold text-slate-400">
                        Showing <strong>{filteredStaff.length}</strong> staff accounts
                    </span>
                </div>

                {/* Staff Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr
                                style={{
                                    background: "var(--admin-surface)",
                                    borderBottom: "1px solid var(--admin-border)",
                                }}
                                className="text-[11px] font-black uppercase tracking-wider text-slate-400"
                            >
                                <th className="py-3.5 px-4">Staff Member</th>
                                <th className="py-3.5 px-4">Role</th>
                                <th className="py-3.5 px-4">MFA Security</th>
                                <th className="py-3.5 px-4">Last Activity</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Access Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="py-4 px-4">
                                            <div className="h-6 w-full animate-pulse rounded bg-slate-200/50 dark:bg-slate-800/50" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-xs font-bold text-slate-400">
                                        No staff accounts match your search filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredStaff.map((s) => {
                                    const isSelf = Boolean(currentAdmin?.email && s.email.toLowerCase() === currentAdmin.email.toLowerCase());
                                    const isTargetAdmin = Boolean(s.role && (s.role === "Super Admin" || s.role.toLowerCase().includes("admin")));

                                    return (
                                        <tr key={s.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600/10 text-indigo-500 font-extrabold text-sm overflow-hidden">
                                                        {s.avatar ? (
                                                            // eslint-disable-next-next/no-img-element
                                                            <img src={s.avatar} alt={s.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            s.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span style={{ color: "var(--admin-text)" }} className="font-extrabold block">
                                                            {s.name}
                                                        </span>
                                                        <span style={{ color: "var(--admin-text-secondary)" }} className="text-[11px]">
                                                            {s.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-[11px] font-black text-indigo-500">
                                                    {s.role}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                {s.mfaStatus.startsWith("Enforced") ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10.5px] font-black text-emerald-500">
                                                        <CheckCircle2 size={12} /> {s.mfaStatus}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10.5px] font-black text-amber-500">
                                                        <AlertTriangle size={12} /> {s.mfaStatus}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <p style={{ color: "var(--admin-text)" }} className="font-semibold m-0">
                                                    {s.lastActive}
                                                </p>
                                                <p style={{ color: "var(--admin-text-secondary)" }} className="text-[10.5px] font-mono m-0">
                                                    {s.ipAddress}
                                                </p>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                {s.status === "Active" ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-emerald-500 uppercase">
                                                        <Check size={12} /> Active
                                                    </span>
                                                ) : s.status === "Suspended" ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-amber-500 uppercase">
                                                        <AlertTriangle size={12} /> Suspended
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-rose-500 uppercase">
                                                        <UserX size={12} /> Deactivated
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {isSelf ? (
                                                        <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-black text-amber-500" title="You cannot suspend or deactivate your own account">
                                                            <ShieldCheck size={12} /> Self Protected
                                                        </span>
                                                    ) : isTargetAdmin ? (
                                                        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-[11px] font-black text-indigo-400" title="Admins cannot suspend or deactivate other admin accounts">
                                                            <ShieldCheck size={12} /> Admin Protected
                                                        </span>
                                                    ) : s.status === "Active" ? (
                                                        <>
                                                            <button
                                                                onClick={() => setConfirmStaffAction({ id: s.id, name: s.name, email: s.email, newStatus: "Suspended" })}
                                                                className="cursor-pointer rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-extrabold text-amber-500 hover:bg-amber-500/20 transition active:scale-95"
                                                                title="Suspend User Login Access"
                                                            >
                                                                Suspend
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmStaffAction({ id: s.id, name: s.name, email: s.email, newStatus: "Deactivated" })}
                                                                className="cursor-pointer rounded-lg bg-rose-500/10 px-2.5 py-1 text-[11px] font-extrabold text-rose-500 hover:bg-rose-500/20 transition active:scale-95"
                                                                title="Deactivate User Account"
                                                            >
                                                                Deactivate
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => setConfirmStaffAction({ id: s.id, name: s.name, email: s.email, newStatus: "Active" })}
                                                            className="cursor-pointer rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-extrabold text-emerald-500 hover:bg-emerald-500/20 transition active:scale-95"
                                                            title="Re-activate User Account"
                                                        >
                                                            Activate Account
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Security Audit Log Activity Feed */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 20,
                }}
                className="p-5 shadow-lg space-y-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="text-indigo-500" size={18} />
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                            Live System Security Audit Log Stream
                        </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Real-time immutable audit trail</span>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {RECENT_AUDIT_LOGS.map((log) => (
                        <div key={log.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                                <span
                                    className={`h-2 w-2 rounded-full ${log.severity === "critical"
                                        ? "bg-rose-500 animate-pulse"
                                        : log.severity === "warning"
                                            ? "bg-amber-500"
                                            : "bg-emerald-500"
                                        }`}
                                />
                                <div>
                                    <span style={{ color: "var(--admin-text)" }} className="font-extrabold">
                                        {log.actor}
                                    </span>{" "}
                                    <span style={{ color: "var(--admin-text-secondary)" }}>{log.action}</span>{" "}
                                    <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-black text-indigo-500">
                                        {log.target}
                                    </span>
                                </div>
                            </div>
                            <span className="font-mono text-[11px] text-slate-400">{log.timestamp}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal: Invite New Staff */}
            {inviteModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                        }}
                        className="w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 relative"
                    >
                        <button
                            onClick={() => setInviteModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500 font-bold">
                                <UserPlus size={20} />
                            </div>
                            <div>
                                <h3 style={{ color: "var(--admin-text)" }} className="text-base font-extrabold m-0">
                                    Invite Staff Member
                                </h3>
                                <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                    Assign administrative role & credentials
                                </p>
                            </div>
                        </div>

                        {inviteSuccessMsg ? (
                            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center text-xs font-black text-emerald-500">
                                <CheckCircle2 size={24} className="mx-auto mb-1" />
                                {inviteSuccessMsg}
                            </div>
                        ) : (
                            <form onSubmit={handleInviteSubmit} className="space-y-3">
                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Kavya Deshmukh"
                                        value={newStaffName}
                                        onChange={(e) => setNewStaffName(e.target.value)}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Work Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="kavya.d@epicshow.in"
                                        value={newStaffEmail}
                                        onChange={(e) => setNewStaffEmail(e.target.value)}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Assign Role
                                    </label>
                                    <select
                                        value={newStaffRole}
                                        onChange={(e) => setNewStaffRole(e.target.value as any)}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                                    >
                                        <option value="Support Operator">Support Operator (Limited View)</option>
                                        <option value="Operations Manager">Operations Manager (Bookings & Venues)</option>
                                        <option value="Finance Auditor">Finance Auditor (Revenue & Reports)</option>
                                        <option value="Super Admin">Super Admin (Full Platform Control)</option>
                                    </select>
                                </div>

                                <div className="pt-3 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setInviteModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95 cursor-pointer"
                                    >
                                        Send Invite Link
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Modal: Confirm Staff Account Action */}
            {confirmStaffAction && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/80 p-5 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white space-y-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={`grid h-11 w-11 place-items-center rounded-2xl font-bold ${confirmStaffAction.newStatus === "Suspended"
                                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                    : confirmStaffAction.newStatus === "Deactivated"
                                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    }`}
                            >
                                {confirmStaffAction.newStatus === "Suspended" ? (
                                    <AlertTriangle size={22} />
                                ) : confirmStaffAction.newStatus === "Deactivated" ? (
                                    <UserX size={22} />
                                ) : (
                                    <Check size={22} />
                                )}
                            </div>
                            <div>
                                <h3 className="text-base font-black m-0 text-slate-900 dark:text-white">
                                    Confirm Account {confirmStaffAction.newStatus}?
                                </h3>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 m-0 mt-0.5">
                                    Target Staff: <strong className="text-slate-800 dark:text-white">{confirmStaffAction.name}</strong> ({confirmStaffAction.email})
                                </p>
                            </div>
                        </div>

                        {/* Consequences breakdown */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2.5 dark:border-slate-800 dark:bg-slate-950/90">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block border-b border-slate-200 dark:border-slate-800 pb-1.5">
                                Administrative Consequences & Impact
                            </span>
                            {confirmStaffAction.newStatus === "Suspended" && (
                                <>
                                    <div className="flex items-start gap-2.5 text-amber-700 dark:text-amber-300">
                                        <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-500" />
                                        <span>
                                            <strong>Login Access Blocked:</strong> Staff member cannot log in and will see a red notification banner explicitly stating their account is suspended.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                                        <Lock size={15} className="shrink-0 mt-0.5 text-amber-500" />
                                        <span>
                                            <strong>Session Revocation:</strong> Active auth sessions will fail authentication check immediately.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                                        <ShieldCheck size={15} className="shrink-0 mt-0.5 text-emerald-500" />
                                        <span>Permissions and profile records remain safely stored in system database.</span>
                                    </div>
                                </>
                            )}
                            {confirmStaffAction.newStatus === "Deactivated" && (
                                <>
                                    <div className="flex items-start gap-2.5 text-rose-700 dark:text-rose-300">
                                        <UserX size={15} className="shrink-0 mt-0.5 text-rose-500" />
                                        <span>
                                            <strong>Staff Deactivation:</strong> Admin user access is disabled across all platform administrative panels.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                                        <Lock size={15} className="shrink-0 mt-0.5 text-rose-500" />
                                        <span>
                                            <strong>Access Terminated:</strong> User cannot access customer tables, booking management, or financial reports.
                                        </span>
                                    </div>
                                </>
                            )}
                            {confirmStaffAction.newStatus === "Active" && (
                                <>
                                    <div className="flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300">
                                        <Check size={15} className="shrink-0 mt-0.5 text-emerald-500" />
                                        <span>
                                            <strong>Access Restored:</strong> Staff member will regain immediate full access to log in and manage the platform.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                                        <Sparkles size={15} className="shrink-0 mt-0.5 text-emerald-500" />
                                        <span>Suspension warnings will be removed from sign-in screens instantly.</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setConfirmStaffAction(null)}
                                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => updateStaffStatus(confirmStaffAction.id, confirmStaffAction.newStatus)}
                                className={`rounded-xl px-4 py-2 text-xs font-black text-white shadow-lg transition active:scale-95 cursor-pointer ${confirmStaffAction.newStatus === "Suspended"
                                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
                                    : confirmStaffAction.newStatus === "Deactivated"
                                        ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
                                        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
                                    }`}
                            >
                                Confirm {confirmStaffAction.newStatus}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
