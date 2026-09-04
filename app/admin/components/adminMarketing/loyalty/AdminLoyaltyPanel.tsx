"use client";

import { useState } from "react";
import { Award, Crown, Gift, Search, ShieldCheck, Star, Zap, X } from "lucide-react";

type LoyaltyMember = {
    id: string;
    name: string;
    email: string;
    tier: "Bronze" | "Silver" | "Gold" | "Platinum";
    pointsBalance: number;
    lifetimePoints: number;
    totalSpent: number;
    joinedDate: string;
};

const DUMMY_MEMBERS: LoyaltyMember[] = [
    {
        id: "MEM-901",
        name: "Vikram Malhotra",
        email: "vikram.m@gmail.com",
        tier: "Platinum",
        pointsBalance: 14200,
        lifetimePoints: 38500,
        totalSpent: 42500,
        joinedDate: "2025-02-10",
    },
    {
        id: "MEM-902",
        name: "Ananya Sharma",
        email: "ananya.s@outlook.com",
        tier: "Gold",
        pointsBalance: 6800,
        lifetimePoints: 18200,
        totalSpent: 21000,
        joinedDate: "2025-06-18",
    },
    {
        id: "MEM-903",
        name: "Rohan Verma",
        email: "rohan.v@techcorp.in",
        tier: "Silver",
        pointsBalance: 2400,
        lifetimePoints: 7500,
        totalSpent: 9400,
        joinedDate: "2026-01-12",
    },
    {
        id: "MEM-904",
        name: "Priya Nair",
        email: "priya.nair@yahoo.com",
        tier: "Bronze",
        pointsBalance: 950,
        lifetimePoints: 2100,
        totalSpent: 3200,
        joinedDate: "2026-04-05",
    },
    {
        id: "MEM-905",
        name: "Aditya Kapoor",
        email: "aditya.k@gmail.com",
        tier: "Platinum",
        pointsBalance: 21500,
        lifetimePoints: 54000,
        totalSpent: 68000,
        joinedDate: "2024-11-20",
    },
];

export default function AdminLoyaltyPanel() {
    const [members, setMembers] = useState<LoyaltyMember[]>(DUMMY_MEMBERS);
    const [search, setSearch] = useState("");
    const [tierFilter, setTierFilter] = useState<string>("all");
    const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
    const [bonusPointsInput, setBonusPointsInput] = useState<number>(500);

    const filteredMembers = members.filter((m) => {
        const matchesSearch =
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase());
        const matchesTier = tierFilter === "all" || m.tier.toLowerCase() === tierFilter.toLowerCase();
        return matchesSearch && matchesTier;
    });

    const handleGrantBonus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember || bonusPointsInput <= 0) return;

        setMembers((prev) =>
            prev.map((m) =>
                m.id === selectedMember.id
                    ? {
                        ...m,
                        pointsBalance: m.pointsBalance + bonusPointsInput,
                        lifetimePoints: m.lifetimePoints + bonusPointsInput,
                    }
                    : m
            )
        );
        setSelectedMember(null);
    };

    return (
        <div className="space-y-6 pb-10 select-none">
            {/* Top Metrics Cards */}
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
                        Total Loyalty Members
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            18,420
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-extrabold text-emerald-500">
                            +8.5% MoM
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
                        Points Balance Issued
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            1.45M Pts
                        </span>
                        <span className="text-xs font-bold text-amber-500">₹1,45,000 value</span>
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
                        Points Redeemed
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            920K Pts
                        </span>
                        <span className="text-xs font-bold text-indigo-500">63.4% Burn Rate</span>
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
                        Platinum VIP Members
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            1,240
                        </span>
                        <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-extrabold text-purple-500">
                            High Spenders
                        </span>
                    </div>
                </div>
            </div>

            {/* Tier Overview Cards */}
            <div>
                <h3 style={{ color: "var(--admin-text)" }} className="text-sm font-black uppercase tracking-wider mb-3 m-0">
                    Loyalty Tiers & Rewards Multipliers
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                        className="rounded-2xl p-4 shadow-sm relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <span className="rounded-lg bg-amber-700/10 border border-amber-700/20 px-2.5 py-1 text-xs font-black text-amber-700 dark:text-amber-400">
                                BRONZE TIER
                            </span>
                            <span className="text-xs font-bold text-slate-400">1.0x Points</span>
                        </div>
                        <p style={{ color: "var(--admin-text)" }} className="mt-3 text-lg font-extrabold m-0">
                            Free Sign Up
                        </p>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-1 text-xs font-medium m-0">
                            Earn 10 points per ₹100 spent across all bookings.
                        </p>
                    </div>

                    <div
                        style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                        className="rounded-2xl p-4 shadow-sm relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <span className="rounded-lg bg-slate-400/10 border border-slate-400/20 px-2.5 py-1 text-xs font-black text-slate-600 dark:text-slate-300">
                                SILVER TIER
                            </span>
                            <span className="text-xs font-bold text-indigo-500">1.25x Points</span>
                        </div>
                        <p style={{ color: "var(--admin-text)" }} className="mt-3 text-lg font-extrabold m-0">
                            ₹5,000 Spend
                        </p>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-1 text-xs font-medium m-0">
                            Free popcorn voucher on 5th movie ticket booking.
                        </p>
                    </div>

                    <div
                        style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                        className="rounded-2xl p-4 shadow-sm relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-black text-amber-500">
                                GOLD TIER
                            </span>
                            <span className="text-xs font-bold text-amber-500">1.5x Points</span>
                        </div>
                        <p style={{ color: "var(--admin-text)" }} className="mt-3 text-lg font-extrabold m-0">
                            ₹15,000 Spend
                        </p>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-1 text-xs font-medium m-0">
                            Zero ticket cancellation fees + early show seat access.
                        </p>
                    </div>

                    <div
                        style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                        className="rounded-2xl p-4 shadow-sm relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <span className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-xs font-black text-purple-500">
                                PLATINUM VIP
                            </span>
                            <span className="text-xs font-bold text-purple-500">2.0x Points</span>
                        </div>
                        <p style={{ color: "var(--admin-text)" }} className="mt-3 text-lg font-extrabold m-0">
                            ₹35,000 Spend
                        </p>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-1 text-xs font-medium m-0">
                            Dedicated hotline, lounge access & free seat upgrades.
                        </p>
                    </div>
                </div>
            </div>

            {/* Member Points Directory Table Shell */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 18,
                    overflow: "hidden",
                }}
                className="shadow-lg"
            >
                {/* Table Controls */}
                <div
                    style={{
                        background: "var(--admin-soft)",
                        borderBottom: "1px solid var(--admin-border)",
                    }}
                    className="flex flex-wrap items-center justify-between gap-4 p-4.5"
                >
                    <div>
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-extrabold m-0">
                            Member Loyalty Points Directory
                        </h3>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-medium m-0">
                            Manage member reward tiers, adjust balances, and issue bonus points.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex items-center">
                            <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search member name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    background: "var(--admin-surface)",
                                    border: "1px solid var(--admin-border)",
                                    color: "var(--admin-text)",
                                }}
                                className="w-60 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                            }}
                            className="flex rounded-xl p-1 text-xs font-bold"
                        >
                            {(["all", "Platinum", "Gold", "Silver", "Bronze"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTierFilter(t)}
                                    className={`capitalize px-2.5 py-1 rounded-lg transition cursor-pointer ${tierFilter === t
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Directory Table */}
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
                                <th className="py-3 px-4">Member Info</th>
                                <th className="py-3 px-4">Loyalty Tier</th>
                                <th className="py-3 px-4">Points Balance</th>
                                <th className="py-3 px-4">Lifetime Points</th>
                                <th className="py-3 px-4">Total Spent</th>
                                <th className="py-3 px-4">Joined Date</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                    <td className="py-3.5 px-4">
                                        <div>
                                            <span style={{ color: "var(--admin-text)" }} className="font-extrabold text-sm">
                                                {member.name}
                                            </span>
                                            <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-[11px] font-medium m-0">
                                                {member.email}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        {member.tier === "Platinum" ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[11px] font-black text-purple-500">
                                                <Crown size={12} /> Platinum VIP
                                            </span>
                                        ) : member.tier === "Gold" ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-black text-amber-500">
                                                <Star size={12} /> Gold Tier
                                            </span>
                                        ) : member.tier === "Silver" ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-400/10 border border-slate-400/20 px-2.5 py-0.5 text-[11px] font-black text-slate-500 dark:text-slate-300">
                                                <Award size={12} /> Silver Tier
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-800/10 border border-amber-800/20 px-2.5 py-0.5 text-[11px] font-black text-amber-700 dark:text-amber-400">
                                                <ShieldCheck size={12} /> Bronze Tier
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400">
                                            {member.pointsBalance.toLocaleString()} Pts
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                                        {member.lifetimePoints.toLocaleString()} Pts
                                    </td>

                                    <td className="py-3.5 px-4 font-extrabold text-slate-700 dark:text-slate-200">
                                        ₹{member.totalSpent.toLocaleString("en-IN")}
                                    </td>

                                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                                        {member.joinedDate}
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            onClick={() => setSelectedMember(member)}
                                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-extrabold text-white shadow-sm transition hover:bg-indigo-700 cursor-pointer"
                                        >
                                            <Zap size={13} />
                                            <span>Grant Bonus Pts</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grant Bonus Points Modal */}
            {selectedMember && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                        }}
                        className="w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4"
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white font-bold">
                                    <Gift size={18} />
                                </div>
                                <div>
                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                        Grant Bonus Loyalty Points
                                    </h3>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                        To: {selectedMember.name} ({selectedMember.email})
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleGrantBonus} className="space-y-4">
                            <div>
                                <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                    Points Amount
                                </label>
                                <input
                                    type="number"
                                    min={50}
                                    step={50}
                                    value={bonusPointsInput}
                                    onChange={(e) => setBonusPointsInput(Number(e.target.value))}
                                    style={{
                                        background: "var(--admin-soft)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2.5 text-base font-mono font-black outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs font-medium text-indigo-400">
                                Current Points Balance: <strong>{selectedMember.pointsBalance.toLocaleString()} Pts</strong>.
                                New Balance will be <strong>{(selectedMember.pointsBalance + bonusPointsInput).toLocaleString()} Pts</strong>.
                            </div>

                            <div className="pt-2 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setSelectedMember(null)}
                                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-extrabold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 cursor-pointer"
                                >
                                    Confirm & Award Points
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
