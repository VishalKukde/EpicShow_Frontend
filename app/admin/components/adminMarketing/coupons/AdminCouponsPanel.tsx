"use client";

import { useState, useMemo } from "react";
import { Search, Plus, CheckCircle2, Clock, XCircle, Trash2, X, TicketPercent } from "lucide-react";

export type Coupon = {
    id: string;
    code: string;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    maxDiscount?: number;
    minOrderAmount: number;
    applicableCategory: string;
    usedCount: number;
    maxUsageLimit: number;
    startDate: string;
    expiryDate: string;
    status: "active" | "scheduled" | "expired";
};

const DUMMY_COUPONS: Coupon[] = [
    {
        id: "CPN-101",
        code: "EPIC50",
        description: "50% OFF on first movie ticket booking",
        discountType: "percentage",
        discountValue: 50,
        maxDiscount: 150,
        minOrderAmount: 300,
        applicableCategory: "Movies",
        usedCount: 1420,
        maxUsageLimit: 5000,
        startDate: "2026-09-01",
        expiryDate: "2026-09-30",
        status: "active",
    },
    {
        id: "CPN-102",
        code: "IPL2026",
        description: "Flat ₹200 discount on IPL match tickets",
        discountType: "fixed",
        discountValue: 200,
        minOrderAmount: 800,
        applicableCategory: "Sports",
        usedCount: 890,
        maxUsageLimit: 2000,
        startDate: "2026-08-15",
        expiryDate: "2026-10-15",
        status: "active",
    },
    {
        id: "CPN-103",
        code: "GAMEFEST",
        description: "30% OFF on Gaming Arena entry passes",
        discountType: "percentage",
        discountValue: 30,
        maxDiscount: 300,
        minOrderAmount: 500,
        applicableCategory: "Gaming",
        usedCount: 310,
        maxUsageLimit: 1000,
        startDate: "2026-09-05",
        expiryDate: "2026-09-25",
        status: "scheduled",
    },
    {
        id: "CPN-104",
        code: "TRAINVIP",
        description: "Flat ₹100 cashback on transit bookings",
        discountType: "fixed",
        discountValue: 100,
        minOrderAmount: 400,
        applicableCategory: "Transit & Trains",
        usedCount: 3500,
        maxUsageLimit: 3500,
        startDate: "2026-07-01",
        expiryDate: "2026-08-31",
        status: "expired",
    },
    {
        id: "CPN-105",
        code: "WELCOMENEW",
        description: "Special ₹150 discount for newly registered users",
        discountType: "fixed",
        discountValue: 150,
        minOrderAmount: 350,
        applicableCategory: "All Categories",
        usedCount: 2840,
        maxUsageLimit: 10000,
        startDate: "2026-01-01",
        expiryDate: "2026-12-31",
        status: "active",
    },
];

export default function AdminCouponsPanel() {
    const [coupons, setCoupons] = useState<Coupon[]>(DUMMY_COUPONS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // Form State
    const [formCode, setFormCode] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formType, setFormType] = useState<"percentage" | "fixed">("percentage");
    const [formVal, setFormVal] = useState<number>(20);
    const [formMax, setFormMax] = useState<number>(100);
    const [formMinOrder, setFormMinOrder] = useState<number>(300);
    const [formCategory, setFormCategory] = useState("Movies");
    const [formLimit, setFormLimit] = useState<number>(1000);
    const [formExpiry, setFormExpiry] = useState("2026-10-31");

    const filteredCoupons = useMemo(() => {
        return coupons.filter((c) => {
            const matchesSearch =
                c.code.toLowerCase().includes(search.toLowerCase().trim()) ||
                c.description.toLowerCase().includes(search.toLowerCase().trim());
            const matchesStatus = statusFilter === "all" || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [coupons, search, statusFilter]);

    const activeCount = coupons.filter((c) => c.status === "active").length;
    const totalRedemptions = coupons.reduce((acc, c) => acc + c.usedCount, 0);

    const toggleStatus = (id: string) => {
        setCoupons((prev) =>
            prev.map((c) => {
                if (c.id === id) {
                    const nextStatus = c.status === "active" ? "expired" : "active";
                    return { ...c, status: nextStatus };
                }
                return c;
            })
        );
    };

    const deleteCoupon = (id: string) => {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
    };

    const openCreateModal = () => {
        setEditingCoupon(null);
        setFormCode("");
        setFormDesc("");
        setFormType("percentage");
        setFormVal(20);
        setFormMax(100);
        setFormMinOrder(300);
        setFormCategory("Movies");
        setFormLimit(1000);
        setFormExpiry("2026-10-31");
        setIsModalOpen(true);
    };

    const handleSaveCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formCode.trim()) return;

        if (editingCoupon) {
            setCoupons((prev) =>
                prev.map((c) =>
                    c.id === editingCoupon.id
                        ? {
                            ...c,
                            code: formCode.toUpperCase().trim(),
                            description: formDesc,
                            discountType: formType,
                            discountValue: formVal,
                            maxDiscount: formType === "percentage" ? formMax : undefined,
                            minOrderAmount: formMinOrder,
                            applicableCategory: formCategory,
                            maxUsageLimit: formLimit,
                            expiryDate: formExpiry,
                        }
                        : c
                )
            );
        } else {
            const newCoupon: Coupon = {
                id: `CPN-${Date.now().toString().slice(-3)}`,
                code: formCode.toUpperCase().trim(),
                description: formDesc || `${formVal}${formType === "percentage" ? "% OFF" : " ₹ OFF"} Special Discount`,
                discountType: formType,
                discountValue: formVal,
                maxDiscount: formType === "percentage" ? formMax : undefined,
                minOrderAmount: formMinOrder,
                applicableCategory: formCategory,
                usedCount: 0,
                maxUsageLimit: formLimit,
                startDate: new Date().toISOString().split("T")[0],
                expiryDate: formExpiry,
                status: "active",
            };
            setCoupons((prev) => [newCoupon, ...prev]);
        }
        setIsModalOpen(false);
    };

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
                    className="shadow-sm"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Active Coupons
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            {activeCount}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-extrabold text-emerald-500">
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
                    className="shadow-sm"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Total Redemptions
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            {totalRedemptions.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-bold text-indigo-500">+14.2% this month</span>
                    </div>
                </div>

                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 16,
                        padding: "16px 20px",
                    }}
                    className="shadow-sm"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Total Discount Given
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            ₹4,85,200
                        </span>
                        <span className="text-xs font-bold text-slate-400">Lifetime</span>
                    </div>
                </div>

                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 16,
                        padding: "16px 20px",
                    }}
                    className="shadow-sm"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Conversion Uplift
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            +18.4%
                        </span>
                        <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-extrabold text-indigo-500">
                            High Impact
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
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-extrabold m-0">
                            Promo Codes & Discount Offers
                        </h3>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-medium m-0">
                            Configure real-time discount coupons for movie tickets, sports, gaming, and transit.
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
                                    className={`capitalize px-3 py-1 rounded-lg transition cursor-pointer ${statusFilter === st ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
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
                                <th className="py-3 px-4">Usage Stats</th>
                                <th className="py-3 px-4">Validity</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                            {filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-slate-400 font-semibold">
                                        No coupons found matching filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-500/10 font-mono font-black text-indigo-500">
                                                    %
                                                </span>
                                                <div>
                                                    <span style={{ color: "var(--admin-text)" }} className="font-mono text-sm font-black tracking-wider">
                                                        {coupon.code}
                                                    </span>
                                                    <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-[11px] font-medium m-0">
                                                        {coupon.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <span style={{ color: "var(--admin-text)" }} className="font-extrabold text-sm">
                                                {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                            </span>
                                            <p style={{ color: "var(--admin-text-secondary)" }} className="text-[10.5px] font-semibold m-0">
                                                Min spend: ₹{coupon.minOrderAmount} {coupon.maxDiscount ? `• Max: ₹${coupon.maxDiscount}` : ""}
                                            </p>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                {coupon.applicableCategory}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div className="w-32">
                                                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                                                    <span>{coupon.usedCount.toLocaleString()} used</span>
                                                    <span>{coupon.maxUsageLimit.toLocaleString()} cap</span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-600 rounded-full"
                                                        style={{ width: `${Math.min(100, (coupon.usedCount / coupon.maxUsageLimit) * 100)}%` }}
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
                                                <button
                                                    onClick={() => toggleStatus(coupon.id)}
                                                    className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                                                >
                                                    {coupon.status === "active" ? "Deactivate" : "Activate"}
                                                </button>
                                                <button
                                                    onClick={() => deleteCoupon(coupon.id)}
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

            {/* Create / Edit Coupon Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
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
                                    {editingCoupon ? "Edit Coupon Code" : "Create New Coupon"}
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                                    Description / Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 50% OFF on movie tickets for new users"
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
                                        Usage Capacity Limit
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
                                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-extrabold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 cursor-pointer"
                                >
                                    Save Coupon Code
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
