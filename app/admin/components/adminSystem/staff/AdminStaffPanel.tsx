"use client";

import { useState, useMemo } from "react";
import {
    ShieldCheck,
    UserPlus,
    Lock,
    Smartphone,
    KeyRound,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Search,
    MoreVertical,
    History,
    X,
    Mail,
    User,
    BadgeCheck,
    RefreshCcw,
} from "lucide-react";

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
    status: "Active" | "Suspended";
};

export type AuditLog = {
    id: string;
    actor: string;
    action: string;
    target: string;
    timestamp: string;
    severity: "info" | "warning" | "critical";
};

const INITIAL_STAFF: StaffMember[] = [
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
    {
        id: "STF-105",
        name: "Rohan Kapoor",
        email: "rohan.k@epicshow.in",
        role: "Operations Manager",
        department: "Operations",
        mfaStatus: "Enforced (Authenticator App)",
        permissions: ["Movie Catalog", "Sports Management"],
        lastActive: "2 days ago",
        ipAddress: "182.72.90.10 (IN)",
        status: "Suspended",
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
    const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Invite Staff Modal State
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [newStaffName, setNewStaffName] = useState("");
    const [newStaffEmail, setNewStaffEmail] = useState("");
    const [newStaffRole, setNewStaffRole] = useState<StaffMember["role"]>("Support Operator");
    const [inviteSuccessMsg, setInviteSuccessMsg] = useState("");

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
    const mfaEnforcedCount = staff.filter((s) => s.mfaStatus.startsWith("Enforced")).length;
    const mfaRate = staff.length ? Math.round((mfaEnforcedCount / staff.length) * 100) : 0;

    // Toggle Staff Status
    const toggleStaffStatus = (id: string) => {
        setStaff((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: s.status === "Active" ? "Suspended" : "Active" } : s))
        );
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
                                MFA Enforced
                            </span>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-semibold m-0">
                            Manage team access privileges, enforce multi-factor authentication, and monitor security audit logs.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setInviteModalOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95"
                >
                    <UserPlus size={16} />
                    <span>Invite Staff Member</span>
                </button>
            </div>

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
                        <span className="text-xs font-bold uppercase tracking-wider">Security Threats (24h)</span>
                        <Lock size={18} className="text-rose-500" />
                    </div>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        0 <span className="text-xs font-semibold text-emerald-500">Clean</span>
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-400 m-0">Zero compromised accounts</p>
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
                                <th className="py-3.5 px-4">Role & Department</th>
                                <th className="py-3.5 px-4">MFA Security</th>
                                <th className="py-3.5 px-4">Assigned Modules</th>
                                <th className="py-3.5 px-4">Last Activity</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                            {filteredStaff.map((s) => (
                                <tr key={s.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600/10 text-indigo-500 font-extrabold text-sm">
                                                {s.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span style={{ color: "var(--admin-text)" }} className="font-extrabold block">
                                                    {s.name}
                                                </span>
                                                <span style={{ color: "var(--admin-text-secondary)" }} className="text-[11px] font-medium block">
                                                    {s.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <span className="inline-block rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black text-indigo-500 uppercase mb-0.5">
                                            {s.role}
                                        </span>
                                        <p style={{ color: "var(--admin-text-secondary)" }} className="text-[11px] font-semibold m-0">
                                            {s.department}
                                        </p>
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

                                    <td className="py-3.5 px-4 max-w-[200px]">
                                        <div className="flex flex-wrap gap-1">
                                            {s.permissions.map((perm, i) => (
                                                <span
                                                    key={i}
                                                    className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                                                >
                                                    {perm}
                                                </span>
                                            ))}
                                        </div>
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
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-rose-500 uppercase">
                                                Suspended
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            onClick={() => toggleStaffStatus(s.id)}
                                            className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition active:scale-95 ${s.status === "Active"
                                                ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                                }`}
                                        >
                                            {s.status === "Active" ? "Suspend" : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
        </div>
    );
}
