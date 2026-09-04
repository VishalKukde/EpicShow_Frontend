"use client";

import { useState } from "react";
import {
    Settings,
    Shield,
    CreditCard,
    Percent,
    Server,
    Save,
    CheckCircle2,
    Lock,
    Eye,
    EyeOff,
    RefreshCw,
    Sliders,
    AlertTriangle,
    Globe,
} from "lucide-react";

export default function AdminSettingsPanel() {
    const [activeTab, setActiveTab] = useState<"general" | "payments" | "security" | "finance" | "maintenance">("general");
    const [saving, setSaving] = useState(false);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

    // General State
    const [appName, setAppName] = useState("EpicShow Platform");
    const [supportEmail, setSupportEmail] = useState("support@epicshow.in");
    const [currency, setCurrency] = useState("INR");
    const [timezone, setTimezone] = useState("Asia/Kolkata");

    // Payment State
    const [razorpayKey, setRazorpayKey] = useState("0");
    const [razorpaySecret, setRazorpaySecret] = useState("0");
    const [showSecret, setShowSecret] = useState(false);
    const [autoRefundThreshold, setAutoRefundThreshold] = useState("5000");

    // Security State
    const [sessionTimeout, setSessionTimeout] = useState("60");
    const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
    const [rateLimitReq, setRateLimitReq] = useState("120");
    const [forceSsl, setForceSsl] = useState(true);

    // Finance State
    const [convenienceFee, setConvenienceFee] = useState("25");
    const [gstRate, setGstRate] = useState("18");
    const [cancellationFee, setCancellationFee] = useState("10");

    // Maintenance State
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [cacheFlushing, setCacheFlushing] = useState(false);
    const [cacheFlushSuccess, setCacheFlushSuccess] = useState(false);

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        setTimeout(() => {
            setSaving(false);
            setSaveSuccessMsg("Platform Configuration Saved & Synchronized!");
            setTimeout(() => {
                setSaveSuccessMsg("");
            }, 3000);
        }, 800);
    };

    const handleFlushCache = () => {
        setCacheFlushing(true);
        setTimeout(() => {
            setCacheFlushing(false);
            setCacheFlushSuccess(true);
            setTimeout(() => setCacheFlushSuccess(false), 2500);
        }, 1200);
    };

    return (
        <div className="space-y-6 pb-16 select-none">
            {/* Top Header */}
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
                        <Settings size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                System Portal Settings & Infrastructure
                            </h2>
                            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                                Production v2.4
                            </span>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-semibold m-0">
                            Configure global platform parameters, API credentials, financial fees, and maintenance mode.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                >
                    <Save size={16} />
                    <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
                </button>
            </div>

            {saveSuccessMsg && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center text-xs font-black text-emerald-500">
                    <CheckCircle2 size={20} className="mx-auto mb-1" />
                    {saveSuccessMsg}
                </div>
            )}

            {/* Navigation Tabs */}
            <div
                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 18 }}
                className="p-1.5 flex flex-wrap items-center gap-2 shadow-sm"
            >
                <button
                    onClick={() => setActiveTab("general")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "general"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                >
                    <Globe size={15} />
                    <span>General & Branding</span>
                </button>

                <button
                    onClick={() => setActiveTab("payments")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "payments"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                >
                    <CreditCard size={15} />
                    <span>Payment Gateways</span>
                </button>

                <button
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "security"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                >
                    <Shield size={15} />
                    <span>Security & Limits</span>
                </button>

                <button
                    onClick={() => setActiveTab("finance")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "finance"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                >
                    <Percent size={15} />
                    <span>Taxes & Fee Rules</span>
                </button>

                <button
                    onClick={() => setActiveTab("maintenance")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "maintenance"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                >
                    <Server size={15} />
                    <span>System & Maintenance</span>
                </button>
            </div>

            {/* Tab Panels */}
            <form onSubmit={handleSaveSettings}>
                {/* Tab 1: General */}
                {activeTab === "general" && (
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 20,
                        }}
                        className="p-6 shadow-lg space-y-5"
                    >
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                            General Platform Identity & Localization
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Application Title Name
                                </label>
                                <input
                                    type="text"
                                    value={appName}
                                    onChange={(e) => setAppName(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Support Email Address
                                </label>
                                <input
                                    type="email"
                                    value={supportEmail}
                                    onChange={(e) => setSupportEmail(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Default Platform Currency
                                </label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                                >
                                    <option value="INR">Indian Rupee (INR - ₹)</option>
                                    <option value="USD">US Dollar (USD - $)</option>
                                    <option value="EUR">Euro (EUR - €)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Server Timezone Configuration
                                </label>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                                >
                                    <option value="Asia/Kolkata">Asia / Kolkata (IST +5:30)</option>
                                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Payments */}
                {activeTab === "payments" && (
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 20,
                        }}
                        className="p-6 shadow-lg space-y-5"
                    >
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                            Payment Gateway Integration & API Credentials
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Razorpay Live Key ID
                                </label>
                                <input
                                    type="text"
                                    value={razorpayKey}
                                    onChange={(e) => setRazorpayKey(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Razorpay Key Secret
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showSecret ? "text" : "password"}
                                        value={razorpaySecret}
                                        onChange={(e) => setRazorpaySecret(e.target.value)}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl py-2 pl-3.5 pr-10 text-xs font-mono outline-none focus:border-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                    >
                                        {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Instant Wallet Auto-Refund Threshold (INR)
                                </label>
                                <input
                                    type="number"
                                    value={autoRefundThreshold}
                                    onChange={(e) => setAutoRefundThreshold(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                                />
                                <p className="mt-1 text-[11px] text-slate-400 m-0 font-medium">
                                    Failed orders under ₹{Number(autoRefundThreshold).toLocaleString("en-IN")} will be instantly credited to EpicWallet.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 3: Security */}
                {activeTab === "security" && (
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 20,
                        }}
                        className="p-6 shadow-lg space-y-5"
                    >
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                            Security Policy, Rate Limiting & Session Expire
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Staff Session Expire Timeout (Minutes)
                                </label>
                                <input
                                    type="number"
                                    value={sessionTimeout}
                                    onChange={(e) => setSessionTimeout(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Max Failed Logins Before IP Lockout
                                </label>
                                <input
                                    type="number"
                                    value={maxLoginAttempts}
                                    onChange={(e) => setMaxLoginAttempts(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    API Rate Limiting (Requests / Min per IP)
                                </label>
                                <input
                                    type="number"
                                    value={rateLimitReq}
                                    onChange={(e) => setRateLimitReq(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div>
                                    <span style={{ color: "var(--admin-text)" }} className="text-xs font-black block">
                                        Force SSL & HTTPS Redirect
                                    </span>
                                    <span style={{ color: "var(--admin-text-secondary)" }} className="text-[11px] font-medium block">
                                        Enforce HSTS and secure cookies
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={forceSsl}
                                    onChange={(e) => setForceSsl(e.target.checked)}
                                    className="h-4 w-4 cursor-pointer accent-indigo-600"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 4: Finance */}
                {activeTab === "finance" && (
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 20,
                        }}
                        className="p-6 shadow-lg space-y-5"
                    >
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                            Platform Convenience Fees, Taxes & Cancellation Policy
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Convenience Fee Per Ticket (INR)
                                </label>
                                <input
                                    type="number"
                                    value={convenienceFee}
                                    onChange={(e) => setConvenienceFee(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    GST Tax Rate (%)
                                </label>
                                <input
                                    type="number"
                                    value={gstRate}
                                    onChange={(e) => setGstRate(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Cancellation Fee Deduction (%)
                                </label>
                                <input
                                    type="number"
                                    value={cancellationFee}
                                    onChange={(e) => setCancellationFee(e.target.value)}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 5: Maintenance */}
                {activeTab === "maintenance" && (
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 20,
                        }}
                        className="p-6 shadow-lg space-y-6"
                    >
                        <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                            System Infrastructure, Caching & Emergency Maintenance Mode
                        </h3>

                        {/* Emergency Maintenance Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
                            <div className="flex items-center gap-3">
                                <AlertTriangle size={24} className="text-rose-500 shrink-0" />
                                <div>
                                    <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider m-0">
                                        Platform Emergency Maintenance Mode
                                    </h4>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0 mt-0.5">
                                        Locks customer ticket booking checkout while keeping admin console active.
                                    </p>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={maintenanceMode}
                                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                            </label>
                        </div>

                        {/* Cache Flush & Server Ping Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--admin-text)" }} className="text-xs font-black">
                                        Redis Data Cache Engine
                                    </span>
                                    <span className="text-[10px] font-extrabold text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                                        Healthy (12ms)
                                    </span>
                                </div>
                                <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-medium m-0">
                                    Flush global Redis key-value cache to clear stale catalog items.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleFlushCache}
                                    disabled={cacheFlushing}
                                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                                >
                                    <RefreshCw size={14} className={cacheFlushing ? "animate-spin" : ""} />
                                    <span>{cacheFlushing ? "Flushing Cache..." : "Purge All Cache"}</span>
                                </button>
                                {cacheFlushSuccess && (
                                    <p className="text-[11px] font-bold text-emerald-500 m-0">Redis Cache Successfully Cleared!</p>
                                )}
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--admin-text)" }} className="text-xs font-black">
                                        Database Connection Pool
                                    </span>
                                    <span className="text-[10px] font-extrabold text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                                        Connected (18/50)
                                    </span>
                                </div>
                                <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-medium m-0">
                                    MongoDB Cluster status: 0 unhandled rejections, SSL TLS 1.3 enforced.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
