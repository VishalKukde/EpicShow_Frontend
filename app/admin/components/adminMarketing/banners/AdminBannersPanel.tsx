"use client";

import { useState } from "react";
import Image from "next/image";
import { Megaphone, Plus, Trash2, ExternalLink, X } from "lucide-react";

type BannerPlacement = "Hero Carousel" | "Category Spotlight" | "Checkout Promo";

type Banner = {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    targetRoute: string;
    placement: BannerPlacement;
    impressions: number;
    clicks: number;
    priority: number;
    status: "active" | "inactive";
};

const DUMMY_BANNERS: Banner[] = [
    {
        id: "BNR-001",
        title: "Avatar 3: Fire & Ash Premiere",
        subtitle: "Book advance IMAX 3D tickets now with 20% cashback",
        imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
        targetRoute: "/movies/avatar-3",
        placement: "Hero Carousel",
        impressions: 48500,
        clicks: 4210,
        priority: 1,
        status: "active",
    },
    {
        id: "BNR-002",
        title: "IPL 2026 Season Tickets Live!",
        subtitle: "Get exclusive stadium VIP lounge access & merchandise",
        imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
        targetRoute: "/sports/ipl-2026",
        placement: "Hero Carousel",
        impressions: 62100,
        clicks: 5890,
        priority: 2,
        status: "active",
    },
    {
        id: "BNR-003",
        title: "Valorant Masters Gaming Fest",
        subtitle: "Esports tournament entry passes starting at ₹499",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
        targetRoute: "/gaming/valorant-masters",
        placement: "Category Spotlight",
        impressions: 18400,
        clicks: 1240,
        priority: 3,
        status: "active",
    },
    {
        id: "BNR-004",
        title: "Vande Bharat Express Special Fares",
        subtitle: "0% booking fee on high-speed rail ticket reservations",
        imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80",
        targetRoute: "/trains/vande-bharat",
        placement: "Checkout Promo",
        impressions: 12500,
        clicks: 980,
        priority: 4,
        status: "inactive",
    },
];

export default function AdminBannersPanel() {
    const [banners, setBanners] = useState<Banner[]>(DUMMY_BANNERS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formTitle, setFormTitle] = useState("");
    const [formSubtitle, setFormSubtitle] = useState("");
    const [formImage, setFormImage] = useState("");
    const [formRoute, setFormRoute] = useState("/movies");
    const [formPlacement, setFormPlacement] = useState<BannerPlacement>("Hero Carousel");

    const toggleStatus = (id: string) => {
        setBanners((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b))
        );
    };

    const deleteBanner = (id: string) => {
        setBanners((prev) => prev.filter((b) => b.id !== id));
    };

    const handleAddBanner = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle.trim()) return;

        const newBanner: Banner = {
            id: `BNR-00${banners.length + 1}`,
            title: formTitle,
            subtitle: formSubtitle || "Featured offer & promotion",
            imageUrl: formImage || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80",
            targetRoute: formRoute,
            placement: formPlacement,
            impressions: 0,
            clicks: 0,
            priority: banners.length + 1,
            status: "active",
        };

        setBanners((prev) => [newBanner, ...prev]);
        setIsModalOpen(false);
        setFormTitle("");
        setFormSubtitle("");
        setFormImage("");
    };

    const totalImpressions = banners.reduce((acc, b) => acc + b.impressions, 0);
    const totalClicks = banners.reduce((acc, b) => acc + b.clicks, 0);
    const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0.0";

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
                        Active Banners
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            {banners.filter((b) => b.status === "active").length}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-extrabold text-emerald-500">
                            Live Rotating
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
                        Daily Banner Impressions
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            {(totalImpressions / 1000).toFixed(1)}K
                        </span>
                        <span className="text-xs font-bold text-indigo-500">+12.4% vs last week</span>
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
                        Avg Click-Through Rate (CTR)
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            {avgCtr}%
                        </span>
                        <span className="text-xs font-bold text-amber-500">{totalClicks.toLocaleString()} Clicks</span>
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
                        Ticket Conversion Revenue
                    </p>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span style={{ color: "var(--admin-text)" }} className="text-2xl font-black">
                            ₹8,45,000
                        </span>
                        <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-extrabold text-purple-500">
                            High Return
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Header & Cards Grid */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                        Hero Banners & Spotlight Promotions
                    </h3>
                    <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-medium m-0">
                        Manage carousel banners, placement positions, and promotional routes across EpicShow.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700"
                >
                    <Plus size={15} strokeWidth={2.5} />
                    <span>Add Hero Banner</span>
                </button>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                        }}
                        className="rounded-2xl overflow-hidden shadow-lg transition hover:shadow-xl flex flex-col"
                    >
                        {/* Banner Image Preview Container */}
                        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                            {/* Image */}
                            <Image
                                src={banner.imageUrl}
                                alt={banner.title}
                                fill
                                unoptimized
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                            {/* Status Badge */}
                            <div className="absolute top-3 left-3 flex gap-2 z-10">
                                <span className="rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10.5px] font-black text-white">
                                    Pos #{banner.priority}
                                </span>
                                <span className="rounded-lg bg-indigo-600/80 backdrop-blur-md px-2.5 py-1 text-[10.5px] font-black text-white">
                                    {banner.placement}
                                </span>
                            </div>

                            {/* Toggle Status Pill */}
                            <div className="absolute top-3 right-3 z-10">
                                <button
                                    onClick={() => toggleStatus(banner.id)}
                                    className={`cursor-pointer rounded-full px-3 py-1 text-[10.5px] font-black uppercase backdrop-blur-md transition ${banner.status === "active"
                                            ? "bg-emerald-500/90 text-white shadow-lg"
                                            : "bg-rose-500/90 text-white"
                                        }`}
                                >
                                    {banner.status === "active" ? "Live" : "Inactive"}
                                </button>
                            </div>

                            {/* Overlay Content */}
                            <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                                <p className="text-base font-black tracking-tight leading-tight m-0">{banner.title}</p>
                                <p className="text-xs font-medium text-slate-200 mt-0.5 line-clamp-1 m-0">{banner.subtitle}</p>
                            </div>
                        </div>

                        {/* Bottom Card Controls & Analytics */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-3">
                                <div className="flex items-center gap-1">
                                    <ExternalLink size={13} className="text-indigo-500" />
                                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{banner.targetRoute}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span>{banner.impressions.toLocaleString()} views</span>
                                    <span className="text-indigo-500">{banner.clicks.toLocaleString()} clicks</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold">
                                    CTR Performance: <strong>{banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(1) : 0}%</strong>
                                </span>

                                <button
                                    onClick={() => deleteBanner(banner.id)}
                                    className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                                >
                                    <Trash2 size={13} />
                                    <span>Remove Banner</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Banner Modal */}
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
                                    <Megaphone size={18} />
                                </div>
                                <h3 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                    Add Hero Banner Spotlight
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAddBanner} className="space-y-3.5">
                            <div>
                                <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                    Banner Headline Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. IMAX 3D Premiere - Blockbuster Weekend"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    style={{
                                        background: "var(--admin-soft)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                    Subtitle Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Book now to get 20% instant cashback on credit cards"
                                    value={formSubtitle}
                                    onChange={(e) => setFormSubtitle(e.target.value)}
                                    style={{
                                        background: "var(--admin-soft)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                    Image Backdrop URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formImage}
                                    onChange={(e) => setFormImage(e.target.value)}
                                    style={{
                                        background: "var(--admin-soft)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                        Placement Position
                                    </label>
                                    <select
                                        value={formPlacement}
                                        onChange={(e) => setFormPlacement(e.target.value as BannerPlacement)}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                    >
                                        <option value="Hero Carousel">Hero Main Carousel</option>
                                        <option value="Category Spotlight">Category Spotlight</option>
                                        <option value="Checkout Promo">Checkout Promo Banner</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text-secondary)" }} className="block text-xs font-extrabold uppercase mb-1">
                                        Target Route Path
                                    </label>
                                    <input
                                        type="text"
                                        value={formRoute}
                                        onChange={(e) => setFormRoute(e.target.value)}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none"
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
                                    Publish Banner Live
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
