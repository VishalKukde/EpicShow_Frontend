"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
    Search,
    Plus,
    CheckCircle2,
    Clock,
    XCircle,
    Trash2,
    X,
    TicketPercent,
    UserPlus,
    Users,
    Check,
    Loader2,
    RefreshCw,
    Sparkles,
    ShieldCheck,
    Send,
    AlertTriangle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";

export type Coupon = {
    _id?: string;
    id: string;
    code: string;
    title?: string;
    description: string;
    discountType: "percentage" | "fixed" | "PERCENT" | "FLAT";
    discountValue?: number;
    value?: number;
    maxDiscount?: number | null;
    minOrderAmount?: number;
    minAmount?: number;
    applicableCategory?: string;
    applicableBookingTypes?: string[];
    usedCount: number;
    allocatedCount?: number;
    maxUsageLimit?: number;
    usageLimit?: number;
    startDate?: string;
    expiryDate?: string;
    validTill?: string;
    status: "active" | "scheduled" | "expired";
};

export type UserForAllocation = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    membership: "free" | "pro";
    role: "user" | "admin";
    avatar?: string;
};

export default function AdminCouponsPanel() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [stats, setStats] = useState({
        activeCount: 0,
        totalRedemptions: 0,
        totalAllocations: 0,
        totalCoupons: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formCode, setFormCode] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formType, setFormType] = useState<"percentage" | "fixed">("percentage");
    const [formVal, setFormVal] = useState<number>(20);
    const [formMax, setFormMax] = useState<number | string>(100);
    const [formMinOrder, setFormMinOrder] = useState<number>(300);
    const [formCategory, setFormCategory] = useState("Movies");
    const [formLimit, setFormLimit] = useState<number>(1000);
    const [formExpiry, setFormExpiry] = useState("2026-10-31");

    // Allocate Modal State
    const [allocatingCoupon, setAllocatingCoupon] = useState<Coupon | null>(null);
    const [registeredUsers, setRegisteredUsers] = useState<UserForAllocation[]>([]);
    const [alreadyAllocatedUserIds, setAlreadyAllocatedUserIds] = useState<Set<string>>(new Set());
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [loadingAllocUsers, setLoadingAllocUsers] = useState(false);
    const [submittingAlloc, setSubmittingAlloc] = useState(false);
    const [allocSearch, setAllocSearch] = useState("");
    const [allocFilter, setAllocFilter] = useState<"all" | "pro" | "free">("all");

    // Confirmation Modal State (Activate / Deactivate / Delete)
    const [confirmAction, setConfirmAction] = useState<{
        coupon: Coupon;
        action: "activate" | "deactivate" | "delete";
    } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Load Coupons from Backend
    const loadCoupons = useCallback(async (showIndicator = false) => {
        if (showIndicator) setRefreshing(true);
        try {
            const data = await apiFetch("/admin/coupons", { notifyOnError: false });
            if (data?.success && Array.isArray(data.coupons)) {
                // Normalize coupon fields
                const normalized: Coupon[] = data.coupons.map((c: any) => ({
                    ...c,
                    id: String(c.id || c._id),
                    code: String(c.code).toUpperCase(),
                    description: c.description || c.title || "",
                    discountType:
                        c.discountType === "PERCENT" || c.discountType === "percentage"
                            ? "percentage"
                            : "fixed",
                    discountValue: Number(c.value ?? c.discountValue ?? 0),
                    maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : undefined,
                    minOrderAmount: Number(c.minAmount ?? c.minOrderAmount ?? 0),
                    applicableCategory: c.categoryTitle || c.applicableCategory || "All Categories",
                    allocatedCount: Number(c.allocatedCount || 0),
                    usedCount: Number(c.usedCount || 0),
                    maxUsageLimit: Number(c.usageLimit ?? c.maxUsageLimit ?? 1000),
                    expiryDate: c.validTill
                        ? new Date(c.validTill).toISOString().slice(0, 10)
                        : c.expiryDate || "2026-12-31",
                    status: c.status || "active",
                }));

                setCoupons(normalized);
                if (data.stats) {
                    setStats(data.stats);
                }
            } else {
                setCoupons([]);
            }
        } catch {
            setCoupons([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadCoupons();
    }, [loadCoupons]);

    const filteredCoupons = useMemo(() => {
        return coupons.filter((c) => {
            const matchesSearch =
                c.code.toLowerCase().includes(search.toLowerCase().trim()) ||
                c.description.toLowerCase().includes(search.toLowerCase().trim());
            const matchesStatus = statusFilter === "all" || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [coupons, search, statusFilter]);

    const activeCount = useMemo(() => {
        return stats.activeCount || coupons.filter((c) => c.status === "active").length;
    }, [stats.activeCount, coupons]);

    const totalRedemptions = useMemo(() => {
        return stats.totalRedemptions || coupons.reduce((acc, c) => acc + c.usedCount, 0);
    }, [stats.totalRedemptions, coupons]);

    const totalAllocations = useMemo(() => {
        return stats.totalAllocations || coupons.reduce((acc, c) => acc + (c.allocatedCount || 0), 0);
    }, [stats.totalAllocations, coupons]);

    const requestToggleStatus = (coupon: Coupon) => {
        const action = coupon.status === "active" ? "deactivate" : "activate";
        setConfirmAction({ coupon, action });
    };

    const requestDeleteCoupon = (coupon: Coupon) => {
        setConfirmAction({ coupon, action: "delete" });
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;
        const { coupon, action } = confirmAction;

        setActionLoading(true);
        try {
            if (action === "delete") {
                const prev = [...coupons];
                setCoupons((p) => p.filter((c) => c.id !== coupon.id));

                try {
                    await apiFetch(`/admin/coupons/${coupon.id}`, {
                        method: "DELETE",
                        notifyOnError: false,
                    });
                    toast.success(`Coupon ${coupon.code} deleted successfully`);
                    loadCoupons();
                } catch (err: any) {
                    setCoupons(prev);
                    toast.error(err?.message || "Failed to delete coupon");
                }
            } else {
                const nextStatus = action === "activate" ? "active" : "expired";
                const prevStatus = coupon.status;

                // Optimistic UI update
                setCoupons((prev) =>
                    prev.map((c) => (c.id === coupon.id ? { ...c, status: nextStatus } : c))
                );

                try {
                    await apiFetch(`/admin/coupons/${coupon.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ status: nextStatus }),
                        notifyOnError: false,
                    });
                    toast.success(
                        action === "activate"
                            ? `Coupon ${coupon.code} activated successfully`
                            : `Coupon ${coupon.code} deactivated successfully`
                    );
                    loadCoupons();
                } catch (err: any) {
                    // Revert on error
                    setCoupons((prev) =>
                        prev.map((c) => (c.id === coupon.id ? { ...c, status: prevStatus } : c))
                    );
                    toast.error(err?.message || `Failed to ${action} coupon`);
                }
            }
            setConfirmAction(null);
        } finally {
            setActionLoading(false);
        }
    };

    const openCreateModal = () => {
        setFormCode("");
        setFormDesc("");
        setFormType("percentage");
        setFormVal(20);
        setFormMax(100);
        setFormMinOrder(300);
        setFormCategory("Movies");
        setFormLimit(1000);
        const d = new Date();
        d.setMonth(d.getMonth() + 3);
        setFormExpiry(d.toISOString().slice(0, 10));
        setIsModalOpen(true);
    };

    const handleSaveCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = formCode.toUpperCase().trim();
        if (!code) {
            toast.error("Please enter a valid coupon code");
            return;
        }

        const numVal = Number(formVal);
        if (!numVal || numVal <= 0) {
            toast.error("Please enter a valid discount value greater than 0");
            return;
        }

        if (formType === "percentage" && numVal > 100) {
            toast.error("Percentage discount cannot exceed 100%");
            return;
        }

        let resolvedValidTill: string;
        try {
            if (formExpiry) {
                const parsed = new Date(`${formExpiry}T23:59:59.000Z`);
                if (!isNaN(parsed.getTime())) {
                    resolvedValidTill = parsed.toISOString();
                } else {
                    const fallback = new Date();
                    fallback.setMonth(fallback.getMonth() + 3);
                    resolvedValidTill = fallback.toISOString();
                }
            } else {
                const fallback = new Date();
                fallback.setMonth(fallback.getMonth() + 3);
                resolvedValidTill = fallback.toISOString();
            }
        } catch {
            const fallback = new Date();
            fallback.setMonth(fallback.getMonth() + 3);
            resolvedValidTill = fallback.toISOString();
        }

        const maxDisc =
            formType === "percentage" && formMax !== "" && Number(formMax) > 0
                ? Number(formMax)
                : null;

        setSaving(true);
        try {
            const payload = {
                code,
                title: formDesc.trim() || `${code} Promo Offer`,
                description:
                    formDesc.trim() ||
                    `${numVal}${formType === "percentage" ? "% OFF" : " ₹ OFF"} Special Discount`,
                discountType: formType === "percentage" ? "PERCENT" : "FLAT",
                value: numVal,
                maxDiscount: maxDisc,
                minAmount: Number(formMinOrder || 0),
                applicableCategory: formCategory,
                usageLimit: Number(formLimit || 1000),
                validTill: resolvedValidTill,
            };

            const res = await apiFetch("/admin/coupons", {
                method: "POST",
                body: JSON.stringify(payload),
                notifyOnError: false,
            });

            if (res?.success) {
                toast.success(`Coupon ${code} created successfully`);
                setIsModalOpen(false);
                if (res.coupon) {
                    const newCoupon: Coupon = {
                        ...res.coupon,
                        id: String(res.coupon.id || res.coupon._id),
                        code: String(res.coupon.code).toUpperCase(),
                        description: res.coupon.description || res.coupon.title || "",
                        discountType:
                            res.coupon.discountType === "PERCENT" || res.coupon.discountType === "percentage"
                                ? "percentage"
                                : "fixed",
                        discountValue: Number(res.coupon.value ?? numVal),
                        maxDiscount: res.coupon.maxDiscount ? Number(res.coupon.maxDiscount) : undefined,
                        minOrderAmount: Number(res.coupon.minAmount ?? 0),
                        applicableCategory: res.coupon.categoryTitle || res.coupon.applicableCategory || "All Categories",
                        allocatedCount: 0,
                        usedCount: 0,
                        maxUsageLimit: Number(res.coupon.usageLimit ?? 1000),
                        expiryDate: res.coupon.validTill
                            ? new Date(res.coupon.validTill).toISOString().slice(0, 10)
                            : formExpiry,
                        status: res.coupon.status || "active",
                    };
                    setCoupons((prev) => [newCoupon, ...prev.filter((c) => c.id !== newCoupon.id)]);
                }
                loadCoupons();
            } else {
                toast.error(res?.message || "Failed to create coupon");
            }
        } catch (err: any) {
            toast.error(err?.message || "Failed to create coupon");
        } finally {
            setSaving(false);
        }
    };

    // Allocate Modal Handlers
    const openAllocateModal = async (coupon: Coupon) => {
        setAllocatingCoupon(coupon);
        setLoadingAllocUsers(true);
        setSelectedUserIds(new Set());
        setAllocSearch("");
        setAllocFilter("all");

        try {
            const [allocRes, usersRes] = await Promise.all([
                apiFetch(`/admin/coupons/${coupon.id}/allocations`, { notifyOnError: false }),
                apiFetch("/admin/coupons-users?limit=150", { notifyOnError: false }),
            ]);

            const allocatedSet = new Set<string>();
            if (allocRes?.success && Array.isArray(allocRes.allocatedUserIds)) {
                allocRes.allocatedUserIds.forEach((uid: string) => allocatedSet.add(String(uid)));
            }
            setAlreadyAllocatedUserIds(allocatedSet);

            if (usersRes?.success && Array.isArray(usersRes.users)) {
                setRegisteredUsers(usersRes.users);
            } else {
                setRegisteredUsers([]);
            }
        } catch {
            setRegisteredUsers([]);
            toast.error("Failed to load users for allocation");
        } finally {
            setLoadingAllocUsers(false);
        }
    };

    const toggleSelectUser = (userId: string) => {
        if (alreadyAllocatedUserIds.has(userId)) return;

        setSelectedUserIds((prev) => {
            const next = new Set(prev);
            if (next.has(userId)) {
                next.delete(userId);
            } else {
                next.add(userId);
            }
            return next;
        });
    };

    const selectAllAvailable = () => {
        const available = registeredUsers.filter(
            (u) => !alreadyAllocatedUserIds.has(String(u._id))
        );
        setSelectedUserIds(new Set(available.map((u) => String(u._id))));
    };

    const clearSelection = () => {
        setSelectedUserIds(new Set());
    };

    const handleAllocateSubmit = async () => {
        if (!allocatingCoupon || selectedUserIds.size === 0) return;

        setSubmittingAlloc(true);
        try {
            const res = await apiFetch(`/admin/coupons/${allocatingCoupon.id}/allocate`, {
                method: "POST",
                body: JSON.stringify({ userIds: Array.from(selectedUserIds) }),
                notifyOnError: true,
            });

            if (res?.success) {
                toast.success(res.message || `Successfully allocated to ${selectedUserIds.size} user(s)!`);
                setAllocatingCoupon(null);
                loadCoupons();
            }
        } catch (err: any) {
            toast.error(err?.message || "Failed to allocate coupon");
        } finally {
            setSubmittingAlloc(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return registeredUsers.filter((u) => {
            const matchesSearch =
                u.name.toLowerCase().includes(allocSearch.toLowerCase().trim()) ||
                u.email.toLowerCase().includes(allocSearch.toLowerCase().trim()) ||
                (u.phone && u.phone.includes(allocSearch.trim()));
            const matchesFilter =
                allocFilter === "all" || u.membership === allocFilter;
            return matchesSearch && matchesFilter;
        });
    }, [registeredUsers, allocSearch, allocFilter]);

    return (
        <div className="space-y-6 pb-10 select-none">
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 16,
                        padding: "16px 20px",
                    }}
                    className="shadow-sm transition hover:border-indigo-500/40"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Active Coupons
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            {activeCount}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-extrabold text-emerald-500 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live in Checkout
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 16,
                        padding: "16px 20px",
                    }}
                    className="shadow-sm transition hover:border-indigo-500/40"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Total Users Allocated
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            {totalAllocations.toLocaleString("en-IN")}
                        </span>
                        <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-extrabold text-indigo-500">
                            Assigned to Wallets
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 16,
                        padding: "16px 20px",
                    }}
                    className="shadow-sm transition hover:border-indigo-500/40"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Total Redemptions
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            {totalRedemptions.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-bold text-indigo-500">+14.2% uplift</span>
                    </div>
                </div>

                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 16,
                        padding: "16px 20px",
                    }}
                    className="shadow-sm transition hover:border-indigo-500/40"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Total Campaigns
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            {coupons.length}
                        </span>
                        <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-extrabold text-indigo-500">
                            MongoDB Synced
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Table Shell */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 18,
                    overflow: "hidden",
                }}
                className="shadow-lg"
            >
                {/* Controls Header */}
                <div
                    style={{
                        background: "var(--admin-soft)",
                        borderBottom: "1px solid var(--admin-border)",
                    }}
                    className="flex flex-wrap items-center justify-between gap-4 p-4.5"
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 style={{ color: "var(--admin-text)" }} className="text-base font-extrabold m-0">
                                Promo Codes & Discount Offers
                            </h3>
                            <button
                                onClick={() => loadCoupons(true)}
                                disabled={refreshing}
                                className="text-slate-400 hover:text-indigo-500 transition cursor-pointer p-1"
                                title="Refresh Coupons"
                            >
                                <RefreshCw size={14} className={refreshing ? "animate-spin text-indigo-500" : ""} />
                            </button>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-medium m-0">
                            Create promotional discount coupons, allocate to specific user accounts, and track redemptions.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative flex items-center">
                            <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search code or offer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    background: "var(--admin-surface)",
                                    border: "1px solid var(--admin-border)",
                                    color: "var(--admin-text)",
                                }}
                                className="w-56 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold outline-none transition focus:border-indigo-500"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                            }}
                            className="flex rounded-xl p-1 text-xs font-bold"
                        >
                            {(["all", "active", "scheduled", "expired"] as const).map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`capitalize px-3 py-1 rounded-lg transition cursor-pointer ${
                                        statusFilter === st
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>

                        {/* Create Coupon Button */}
                        <button
                            onClick={openCreateModal}
                            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700"
                        >
                            <Plus size={15} strokeWidth={2.5} />
                            <span>Create Coupon</span>
                        </button>
                    </div>
                </div>

                {/* Coupons Table */}
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
                                <th className="py-3 px-4">Coupon Code</th>
                                <th className="py-3 px-4">Discount</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Allocation & Usage</th>
                                <th className="py-3 px-4">Validity</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-2 font-semibold">
                                            <Loader2 size={18} className="animate-spin text-indigo-500" />
                                            <span>Loading coupon database...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-14 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-500 mb-1">
                                                <TicketPercent size={24} />
                                            </div>
                                            <p style={{ color: "var(--admin-text)" }} className="text-sm font-extrabold m-0">
                                                {coupons.length === 0 ? "No coupons created yet" : "No coupons found"}
                                            </p>
                                            <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-medium m-0 max-w-sm">
                                                {coupons.length === 0
                                                    ? "Click \"Create Coupon\" above to create your first coupon."
                                                    : "No coupons match your filter or search query."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2.5">
                                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-indigo-500/10 font-mono font-black text-indigo-600 dark:text-indigo-400">
                                                    %
                                                </span>
                                                <div>
                                                    <span style={{ color: "var(--admin-text)" }} className="font-mono text-sm font-black tracking-wider">
                                                        {coupon.code}
                                                    </span>
                                                    <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-[11px] font-medium m-0 max-w-xs truncate">
                                                        {coupon.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <span style={{ color: "var(--admin-text)" }} className="font-extrabold text-sm">
                                                {coupon.discountType === "percentage" || coupon.discountType === "PERCENT"
                                                    ? `${coupon.discountValue ?? coupon.value}% OFF`
                                                    : `₹${coupon.discountValue ?? coupon.value} OFF`}
                                            </span>
                                            <p style={{ color: "var(--admin-text-secondary)" }} className="text-[10.5px] font-semibold m-0">
                                                Min: ₹{coupon.minOrderAmount ?? coupon.minAmount ?? 0}{" "}
                                                {coupon.maxDiscount ? `• Max: ₹${coupon.maxDiscount}` : ""}
                                            </p>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                {coupon.applicableCategory}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div className="w-36">
                                                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                                                    <span className="text-indigo-500 font-extrabold">{coupon.allocatedCount || 0} allocated</span>
                                                    <span>{coupon.usedCount} used</span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${Math.min(
                                                                100,
                                                                ((coupon.usedCount || 0) /
                                                                    (coupon.maxUsageLimit || coupon.usageLimit || 1000)) *
                                                                    100
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4 text-slate-500 font-semibold text-[11.5px]">
                                            Expires: {coupon.expiryDate}
                                        </td>

                                        <td className="py-3.5 px-4">
                                            {coupon.status === "active" ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-emerald-500 uppercase">
                                                    <CheckCircle2 size={12} /> Active
                                                </span>
                                            ) : coupon.status === "scheduled" ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-amber-500 uppercase">
                                                    <Clock size={12} /> Scheduled
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-rose-500 uppercase">
                                                    <XCircle size={12} /> Expired
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Allocate Button */}
                                                <button
                                                    onClick={() => openAllocateModal(coupon)}
                                                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 hover:text-white px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 dark:hover:text-white transition cursor-pointer border border-indigo-600/20"
                                                    title="Allocate coupon to specific users"
                                                >
                                                    <UserPlus size={13} />
                                                    <span>Allocate</span>
                                                </button>

                                                {/* Toggle Status */}
                                                <button
                                                    onClick={() => requestToggleStatus(coupon)}
                                                    className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                                                >
                                                    {coupon.status === "active" ? "Deactivate" : "Activate"}
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => requestDeleteCoupon(coupon)}
                                                    className="grid h-7 w-7 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50 cursor-pointer"
                                                    title="Delete Coupon"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Allocate Coupon to Users Modal */}
            {allocatingCoupon && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                        }}
                        className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30">
                                    <UserPlus size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                            Allocate Coupon
                                        </h3>
                                        <span className="font-mono text-xs font-black bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                                            {allocatingCoupon.code}
                                        </span>
                                    </div>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-medium m-0 mt-0.5">
                                        Select registered users to allocate this coupon directly to their personal coupon wallet.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAllocatingCoupon(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="space-y-2.5 shrink-0">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or phone..."
                                        value={allocSearch}
                                        onChange={(e) => setAllocSearch(e.target.value)}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div
                                    style={{
                                        background: "var(--admin-soft)",
                                        border: "1px solid var(--admin-border)",
                                    }}
                                    className="flex rounded-xl p-1 text-xs font-bold shrink-0"
                                >
                                    {(["all", "pro", "free"] as const).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setAllocFilter(m)}
                                            className={`capitalize px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                                                allocFilter === m
                                                    ? "bg-indigo-600 text-white shadow-sm font-extrabold"
                                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                            }`}
                                        >
                                            {m === "all" ? "All Users" : `${m.toUpperCase()} Members`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selection Controls */}
                            <div className="flex items-center justify-between text-xs px-1">
                                <span style={{ color: "var(--admin-text-secondary)" }} className="font-semibold text-[11.5px]">
                                    {alreadyAllocatedUserIds.size} already have this coupon • {filteredUsers.length} shown
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={selectAllAvailable}
                                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-xs cursor-pointer"
                                    >
                                        Select All Eligible
                                    </button>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <button
                                        type="button"
                                        onClick={clearSelection}
                                        className="text-slate-500 hover:underline font-bold text-xs cursor-pointer"
                                    >
                                        Deselect All
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Users List */}
                        <div
                            style={{
                                background: "var(--admin-soft)",
                                border: "1px solid var(--admin-border)",
                            }}
                            className="flex-1 overflow-y-auto rounded-xl p-2 min-h-[260px] max-h-[360px] divide-y divide-slate-200 dark:divide-slate-800"
                        >
                            {loadingAllocUsers ? (
                                <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 text-slate-400">
                                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                                    <span className="text-xs font-semibold">Loading user list and allocations...</span>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-slate-400">
                                    <Users size={32} className="opacity-30 mb-2" />
                                    <span className="text-xs font-bold">No users found matching search</span>
                                </div>
                            ) : (
                                filteredUsers.map((user) => {
                                    const isAllocated = alreadyAllocatedUserIds.has(String(user._id));
                                    const isSelected = selectedUserIds.has(String(user._id));

                                    return (
                                        <div
                                            key={user._id}
                                            onClick={() => !isAllocated && toggleSelectUser(String(user._id))}
                                            className={`flex items-center justify-between p-2.5 rounded-lg transition ${
                                                isAllocated
                                                    ? "opacity-60 bg-transparent cursor-not-allowed"
                                                    : isSelected
                                                    ? "bg-indigo-600/10 dark:bg-indigo-500/15 cursor-pointer"
                                                    : "hover:bg-slate-100/60 dark:hover:bg-slate-800/40 cursor-pointer"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Checkbox */}
                                                <div
                                                    className={`grid h-5 w-5 place-items-center rounded-md border transition ${
                                                        isAllocated
                                                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                                                            : isSelected
                                                            ? "border-indigo-600 bg-indigo-600 text-white"
                                                            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                    }`}
                                                >
                                                    {isAllocated ? (
                                                        <Check size={12} strokeWidth={3} />
                                                    ) : isSelected ? (
                                                        <Check size={12} strokeWidth={3} />
                                                    ) : null}
                                                </div>

                                                {/* User Info */}
                                                <div className="flex items-center gap-2.5">
                                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 font-bold text-white text-xs uppercase shadow-sm">
                                                        {user.name ? user.name.slice(0, 2) : "U"}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ color: "var(--admin-text)" }} className="font-bold text-xs">
                                                                {user.name}
                                                            </span>
                                                            <span
                                                                className={`rounded px-1.5 py-0.2 text-[9.5px] font-extrabold uppercase ${
                                                                    user.membership === "pro"
                                                                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                                                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                                }`}
                                                            >
                                                                {user.membership}
                                                            </span>
                                                        </div>
                                                        <p style={{ color: "var(--admin-text-secondary)" }} className="text-[11px] font-medium m-0">
                                                            {user.email} {user.phone ? `• ${user.phone}` : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Pill */}
                                            <div>
                                                {isAllocated ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                                                        <ShieldCheck size={12} /> Already Allocated
                                                    </span>
                                                ) : isSelected ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white uppercase shadow-sm">
                                                        Selected
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-slate-400">
                                                        Ready
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 shrink-0">
                            <span style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold">
                                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{selectedUserIds.size}</span> user(s) selected
                            </span>

                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setAllocatingCoupon(null)}
                                    disabled={submittingAlloc}
                                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAllocateSubmit}
                                    disabled={submittingAlloc || selectedUserIds.size === 0}
                                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-extrabold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submittingAlloc ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Allocating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={13} />
                                            <span>Allocate Coupon ({selectedUserIds.size})</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Coupon Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                        }}
                        className="w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4"
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white font-bold">
                                    <TicketPercent size={18} />
                                </div>
                                <h3 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                    Create New Coupon
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer p-1">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCoupon} className="space-y-3.5">
                            <div>
                                <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                    Coupon Code
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. SUMMER2026"
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                                    style={{
                                        background: "var(--admin-soft)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 font-mono text-sm font-black outline-none focus:border-indigo-500 uppercase"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                    Description / Campaign Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 50% OFF on movie tickets for verified users"
                                    value={formDesc}
                                    onChange={(e) => setFormDesc(e.target.value)}
                                    style={{
                                        background: "var(--admin-soft)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                        Discount Type
                                    </label>
                                    <select
                                        value={formType}
                                        onChange={(e) => setFormType(e.target.value as "percentage" | "fixed")}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                    >
                                        <option value="percentage">Percentage (% OFF)</option>
                                        <option value="fixed">Flat Amount (₹ OFF)</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                        Discount Value
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={formVal}
                                        onChange={(e) => setFormVal(Number(e.target.value))}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                    />
                                </div>
                            </div>

                            {formType === "percentage" && (
                                <div>
                                    <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                        Max Discount Cap (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formMax === "" ? "" : formMax}
                                        onChange={(e) => setFormMax(e.target.value === "" ? "" : Number(e.target.value))}
                                        placeholder="e.g. 150 (Leave blank for no cap)"
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                        Min Order Spend (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={formMinOrder}
                                        onChange={(e) => setFormMinOrder(Number(e.target.value))}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                        Category Scope
                                    </label>
                                    <select
                                        value={formCategory}
                                        onChange={(e) => setFormCategory(e.target.value)}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                    >
                                        <option value="Movies">Movies</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Gaming">Gaming & Esports</option>
                                        <option value="Transit & Trains">Transit & Trains</option>
                                        <option value="All Categories">All Categories</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                        Usage Limit
                                    </label>
                                    <input
                                        type="number"
                                        value={formLimit}
                                        onChange={(e) => setFormLimit(Number(e.target.value))}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formExpiry}
                                        onChange={(e) => setFormExpiry(e.target.value)}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-extrabold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Save Coupon Code</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal for Activate / Deactivate / Delete */}
            {confirmAction && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                        }}
                        className="w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                                    confirmAction.action === "delete"
                                        ? "bg-rose-500/15 text-rose-500"
                                        : confirmAction.action === "deactivate"
                                        ? "bg-amber-500/15 text-amber-500"
                                        : "bg-emerald-500/15 text-emerald-500"
                                }`}
                            >
                                {confirmAction.action === "delete" ? (
                                    <Trash2 size={22} />
                                ) : confirmAction.action === "deactivate" ? (
                                    <AlertTriangle size={22} />
                                ) : (
                                    <CheckCircle2 size={22} />
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                    {confirmAction.action === "delete"
                                        ? "Delete Coupon Permanently?"
                                        : confirmAction.action === "deactivate"
                                        ? "Deactivate Coupon?"
                                        : "Activate Coupon?"}
                                </h3>

                                <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-medium mt-1.5 leading-relaxed m-0">
                                    {confirmAction.action === "delete" ? (
                                        <>
                                            Are you sure you want to permanently delete coupon{" "}
                                            <span className="font-mono font-black text-rose-500 dark:text-rose-400">
                                                {confirmAction.coupon.code}
                                            </span>
                                            ? This action cannot be undone and will expire any active user allocations.
                                        </>
                                    ) : confirmAction.action === "deactivate" ? (
                                        <>
                                            Are you sure you want to deactivate coupon{" "}
                                            <span className="font-mono font-black text-amber-500 dark:text-amber-400">
                                                {confirmAction.coupon.code}
                                            </span>
                                            ? Users will temporarily no longer be able to apply this coupon during checkout.
                                        </>
                                    ) : (
                                        <>
                                            Are you sure you want to activate coupon{" "}
                                            <span className="font-mono font-black text-emerald-500 dark:text-emerald-400">
                                                {confirmAction.coupon.code}
                                            </span>
                                            ? Users will be able to apply and redeem this coupon immediately according to its terms.
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => !actionLoading && setConfirmAction(null)}
                                disabled={actionLoading}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmAction}
                                disabled={actionLoading}
                                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold text-white shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                    confirmAction.action === "delete"
                                        ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
                                        : confirmAction.action === "deactivate"
                                        ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30"
                                        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"
                                }`}
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : confirmAction.action === "delete" ? (
                                    <>
                                        <Trash2 size={14} />
                                        <span>Delete Coupon</span>
                                    </>
                                ) : confirmAction.action === "deactivate" ? (
                                    <>
                                        <AlertTriangle size={14} />
                                        <span>Deactivate Coupon</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={14} />
                                        <span>Activate Coupon</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
