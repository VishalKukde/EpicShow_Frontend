"use client";

import { useState } from "react";
import {
    Bell,
    Send,
    Users,
    Smartphone,
    Sparkles,
    CheckCircle2,
    Clock,
    ExternalLink,
    Search,
    Radio,
    AlertOctagon,
    Layers,
} from "lucide-react";

export type BroadcastCampaign = {
    id: string;
    title: string;
    body: string;
    channel: "Push Notification" | "In-App Popup" | "SMS Alert";
    targetSegment: "All Registered Users" | "VIP Loyalty Members" | "Movie Enthusiasts" | "Train Travelers";
    deepLink: string;
    sentCount: number;
    openRate: string;
    dispatchedAt: string;
    status: "Delivered" | "Scheduled" | "Draft";
};

const INITIAL_CAMPAIGNS: BroadcastCampaign[] = [
    {
        id: "BC-501",
        title: "🎟️ Avatar: Fire & Ash Advance Bookings OPEN!",
        body: "Secure your IMAX 3D seats now before seats fill up. 20% cashback with EpicWallet!",
        channel: "Push Notification",
        targetSegment: "Movie Enthusiasts",
        deepLink: "/movies",
        sentCount: 842000,
        openRate: "34.2%",
        dispatchedAt: "2026-09-04 12:00",
        status: "Delivered",
    },
    {
        id: "BC-502",
        title: "⚡ Vande Bharat Express Weekend Offer",
        body: "Zero convenience fee on executive chair car bookings today only.",
        channel: "In-App Popup",
        targetSegment: "Train Travelers",
        deepLink: "/trains",
        sentCount: 154000,
        openRate: "48.1%",
        dispatchedAt: "2026-09-03 09:30",
        status: "Delivered",
    },
    {
        id: "BC-503",
        title: "👑 VIP Loyalty Level Up Warning!",
        body: "You are only 150 points away from Gold VIP tier status. Claim your bonus points now.",
        channel: "Push Notification",
        targetSegment: "VIP Loyalty Members",
        deepLink: "/loyalty",
        sentCount: 42000,
        openRate: "62.4%",
        dispatchedAt: "2026-09-02 18:15",
        status: "Delivered",
    },
    {
        id: "BC-504",
        title: "🏆 IPL 2026 Finals Special Alert",
        body: "Exclusive hospitality suite passes released for Mumbai venue.",
        channel: "SMS Alert",
        targetSegment: "All Registered Users",
        deepLink: "/sports",
        sentCount: 1200000,
        openRate: "28.9%",
        dispatchedAt: "Scheduled (Tomorrow 10:00 AM)",
        status: "Scheduled",
    },
];

export default function AdminNotificationsPanel() {
    const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>(INITIAL_CAMPAIGNS);
    const [search, setSearch] = useState("");
    const [channelFilter, setChannelFilter] = useState("all");

    // Broadcast Composer Form State
    const [title, setTitle] = useState("🎉 Weekend Special Offer!");
    const [body, setBody] = useState("Book any movie or train ticket today and get 15% instant discount using code EPIC15.");
    const [channel, setChannel] = useState<BroadcastCampaign["channel"]>("Push Notification");
    const [targetSegment, setTargetSegment] = useState<BroadcastCampaign["targetSegment"]>("All Registered Users");
    const [deepLink, setDeepLink] = useState("/movies");

    const [dispatching, setDispatching] = useState(false);
    const [dispatchSuccess, setDispatchSuccess] = useState("");

    // Site-wide Emergency Announcement Banner Switch
    const [emergencyActive, setEmergencyActive] = useState(false);
    const [emergencyText, setEmergencyText] = useState("⚠️ System Alert: Scheduled server maintenance tonight between 2:00 AM - 3:00 AM IST.");

    const filteredCampaigns = campaigns.filter((c) => {
        const q = search.toLowerCase();
        const matchesSearch = c.title.toLowerCase().includes(q) || c.body.toLowerCase().includes(q);
        const matchesChannel = channelFilter === "all" || c.channel.toLowerCase() === channelFilter.toLowerCase();
        return matchesSearch && matchesChannel;
    });

    const totalAudienceCount = 2450000;
    const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);

    const handleDispatchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !body) return;

        setDispatching(true);

        setTimeout(() => {
            let recipientEstimate = 2450000;
            if (targetSegment === "VIP Loyalty Members") recipientEstimate = 42000;
            if (targetSegment === "Movie Enthusiasts") recipientEstimate = 842000;
            if (targetSegment === "Train Travelers") recipientEstimate = 154000;

            const newCampaign: BroadcastCampaign = {
                id: `BC-${500 + campaigns.length + 1}`,
                title,
                body,
                channel,
                targetSegment,
                deepLink,
                sentCount: recipientEstimate,
                openRate: "0.0%",
                dispatchedAt: "Just now",
                status: "Delivered",
            };

            setCampaigns([newCampaign, ...campaigns]);
            setDispatching(false);
            setDispatchSuccess(`Successfully dispatched to ${recipientEstimate.toLocaleString()} users!`);

            setTimeout(() => {
                setDispatchSuccess("");
            }, 3000);
        }, 1200);
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
                        <Bell size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                Push Broadcast & Customer Alerts
                            </h2>
                            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                                2.45M Subscribers
                            </span>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-semibold m-0">
                            Compose real-time mobile push notifications, segment audiences, and trigger emergency banners.
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Subscribers</span>
                        <Users size={18} className="text-indigo-500" />
                    </div>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        {(totalAudienceCount / 1000000).toFixed(2)}M
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-500 m-0">Active push tokens</p>
                </div>

                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Campaigns Sent</span>
                        <Send size={18} className="text-emerald-500" />
                    </div>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        {campaigns.length}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-500 m-0">{(totalSent / 1000000).toFixed(2)}M messages delivered</p>
                </div>

                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Average Open Rate</span>
                        <Sparkles size={18} className="text-amber-500" />
                    </div>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        43.4%
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-amber-500 m-0">Industry avg is 18.2%</p>
                </div>

                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Site Banner Status</span>
                        <AlertOctagon size={18} className={emergencyActive ? "text-rose-500 animate-pulse" : "text-slate-400"} />
                    </div>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-xl font-black m-0">
                        {emergencyActive ? "Active Broadcast" : "Inactive"}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-400 m-0">Global alert header</p>
                </div>
            </div>

            {/* Main Grid: Composer & Mobile Lockscreen Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Campaign Composer */}
                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 20,
                    }}
                    className="lg:col-span-7 p-6 shadow-lg space-y-4"
                >
                    <div className="flex items-center gap-2">
                        <Radio className="text-indigo-500 animate-pulse" size={20} />
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-extrabold m-0">
                            Compose & Dispatch New Broadcast
                        </h3>
                    </div>

                    {dispatchSuccess && (
                        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center text-xs font-black text-emerald-500">
                            <CheckCircle2 size={20} className="mx-auto mb-1" />
                            {dispatchSuccess}
                        </div>
                    )}

                    <form onSubmit={handleDispatchSubmit} className="space-y-4">
                        <div>
                            <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                Notification Headline
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={60}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    background: "var(--admin-surface)",
                                    border: "1px solid var(--admin-border)",
                                    color: "var(--admin-text)",
                                }}
                                className="w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-indigo-500"
                            />
                            <span className="text-[10px] text-slate-400 float-right mt-1">{title.length}/60 chars</span>
                        </div>

                        <div>
                            <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                Message Body Content
                            </label>
                            <textarea
                                rows={3}
                                required
                                maxLength={140}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                style={{
                                    background: "var(--admin-surface)",
                                    border: "1px solid var(--admin-border)",
                                    color: "var(--admin-text)",
                                }}
                                className="w-full rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500 resize-none"
                            />
                            <span className="text-[10px] text-slate-400 float-right mt-1">{body.length}/140 chars</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Delivery Channel
                                </label>
                                <select
                                    value={channel}
                                    onChange={(e) => setChannel(e.target.value as any)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                                >
                                    <option value="Push Notification">Mobile Push Notification</option>
                                    <option value="In-App Popup">In-App Banner Popup</option>
                                    <option value="SMS Alert">SMS Text Alert</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Target Audience Segment
                                </label>
                                <select
                                    value={targetSegment}
                                    onChange={(e) => setTargetSegment(e.target.value as any)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                                >
                                    <option value="All Registered Users">All Users (2.45 Million)</option>
                                    <option value="Movie Enthusiasts">Movie Enthusiasts (842k Users)</option>
                                    <option value="Train Travelers">Train Travelers (154k Users)</option>
                                    <option value="VIP Loyalty Members">VIP Loyalty Members (42k Users)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                Deep Link Action URL
                            </label>
                            <input
                                type="text"
                                value={deepLink}
                                onChange={(e) => setDeepLink(e.target.value)}
                                style={{
                                    background: "var(--admin-surface)",
                                    border: "1px solid var(--admin-border)",
                                    color: "var(--admin-text)",
                                }}
                                className="w-full rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div className="pt-2 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={dispatching}
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                            >
                                <Send size={15} />
                                <span>{dispatching ? "Dispatching Broadcast..." : "Dispatch Broadcast Now"}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Mobile Lock Screen Preview */}
                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 20,
                    }}
                    className="lg:col-span-5 p-6 shadow-lg flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Smartphone className="text-indigo-500" size={18} />
                            <h3 style={{ color: "var(--admin-text)" }} className="text-base font-extrabold m-0">
                                Live Smartphone Lock Screen Preview
                            </h3>
                        </div>

                        {/* Mock iPhone Card */}
                        <div className="mx-auto w-full max-w-[280px] rounded-[32px] border-4 border-slate-700 bg-slate-950 p-4 shadow-2xl text-white space-y-4">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                <span>9:41 AM</span>
                                <span>5G 🔋 100%</span>
                            </div>

                            {/* Notification Banner Badge */}
                            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 shadow-xl backdrop-blur-md space-y-1.5 animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-4 w-4 rounded-md bg-indigo-600 grid place-items-center text-[9px] font-bold">
                                            E
                                        </div>
                                        <span className="text-[11px] font-black uppercase text-slate-300">EPICSHOW</span>
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-mono">now</span>
                                </div>

                                <p className="text-xs font-black text-white m-0 line-clamp-1">{title || "Headline preview..."}</p>
                                <p className="text-[11px] font-medium text-slate-300 m-0 line-clamp-2 leading-relaxed">
                                    {body || "Message body preview..."}
                                </p>
                            </div>

                            <div className="text-center pt-6">
                                <span className="text-[10px] text-slate-500 font-medium">Swipe up to open app</span>
                                <div className="h-1 w-20 bg-slate-600 rounded-full mx-auto mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-indigo-500/10 p-3 text-center text-[11px] font-semibold text-indigo-400">
                        Targeting: <strong>{targetSegment}</strong> via <strong>{channel}</strong>
                    </div>
                </div>
            </div>

            {/* Emergency Announcement Banner Toggle */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 20,
                }}
                className="p-5 shadow-lg space-y-3"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertOctagon className={emergencyActive ? "text-rose-500" : "text-slate-400"} size={18} />
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-extrabold m-0">
                            Site-Wide Emergency Announcement Banner
                        </h3>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={emergencyActive}
                            onChange={(e) => setEmergencyActive(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                </div>

                <input
                    type="text"
                    value={emergencyText}
                    onChange={(e) => setEmergencyText(e.target.value)}
                    disabled={!emergencyActive}
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        color: "var(--admin-text)",
                    }}
                    className="w-full rounded-xl px-3 py-2 text-xs font-semibold outline-none disabled:opacity-40"
                />
            </div>

            {/* Broadcast Campaign History Table */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 20,
                }}
                className="shadow-lg overflow-hidden"
            >
                <div
                    style={{ borderBottom: "1px solid var(--admin-border)", background: "var(--admin-soft)" }}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex items-center">
                            <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search campaigns..."
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

                        <select
                            value={channelFilter}
                            onChange={(e) => setChannelFilter(e.target.value)}
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                color: "var(--admin-text)",
                            }}
                            className="rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                        >
                            <option value="all">All Delivery Channels</option>
                            <option value="Push Notification">Push Notification</option>
                            <option value="In-App Popup">In-App Popup</option>
                            <option value="SMS Alert">SMS Alert</option>
                        </select>
                    </div>

                    <span className="text-xs font-bold text-slate-400">
                        Showing <strong>{filteredCampaigns.length}</strong> campaigns
                    </span>
                </div>

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
                                <th className="py-3.5 px-4">Campaign Headline</th>
                                <th className="py-3.5 px-4">Channel & Target</th>
                                <th className="py-3.5 px-4">Recipients</th>
                                <th className="py-3.5 px-4">Open Rate</th>
                                <th className="py-3.5 px-4">Dispatched At</th>
                                <th className="py-3.5 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                            {filteredCampaigns.map((c) => (
                                <tr key={c.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                    <td className="py-3.5 px-4 max-w-[260px]">
                                        <span style={{ color: "var(--admin-text)" }} className="font-extrabold block truncate">
                                            {c.title}
                                        </span>
                                        <p style={{ color: "var(--admin-text-secondary)" }} className="text-[11px] font-medium m-0 truncate">
                                            {c.body}
                                        </p>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <span className="inline-block rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black text-indigo-500 uppercase mb-0.5">
                                            {c.channel}
                                        </span>
                                        <p style={{ color: "var(--admin-text-secondary)" }} className="text-[11px] font-semibold m-0">
                                            {c.targetSegment}
                                        </p>
                                    </td>

                                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-600 dark:text-slate-300">
                                        {c.sentCount.toLocaleString("en-IN")}
                                    </td>

                                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                                        {c.openRate}
                                    </td>

                                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{c.dispatchedAt}</td>

                                    <td className="py-3.5 px-4">
                                        {c.status === "Delivered" ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-emerald-500 uppercase">
                                                <CheckCircle2 size={12} /> Delivered
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-amber-500 uppercase">
                                                <Clock size={12} /> Scheduled
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
