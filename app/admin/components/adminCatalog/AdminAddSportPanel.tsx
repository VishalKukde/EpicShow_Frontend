"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
    Trophy,
    Database,
    PlusCircle,
    Trash2,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    UploadCloud,
    Calendar,
    MapPin,
    Sparkles,
    FileCode,
} from "lucide-react";
import AdminDeleteConfirmModal from "../shared/AdminDeleteConfirmModal";

export type SportEvent = {
    _id: string;
    sportType?: string;
    league: string;
    matchNo?: string;
    teamA: string;
    teamB: string;
    date: string;
    time?: string;
    venue: string;
    city: string;
    imageUrl?: string;
    description?: string;
    rating?: number;
    genres?: string[];
    prices?: {
        standard?: number;
        premium?: number;
        vip?: number;
    };
};

const SAMPLE_SPORT_JSON = `{
  "sportType": "Cricket",
  "league": "IPL 2026",
  "matchNo": "Match 31",
  "teamA": "Mumbai Indians",
  "teamB": "Royal Challengers Bengaluru",
  "date": "2026-05-01",
  "time": "07:30 PM",
  "venue": "Wankhede Stadium",
  "venueId": "stadium_mum",
  "city": "Mumbai",
  "description": "High voltage clash between Mumbai and Bengaluru.",
  "durationMinutes": 205,
  "rating": 4.8,
  "genres": ["Cricket", "IPL", "Night Match"],
  "prices": { "standard": 350, "premium": 500, "vip": 750 }
}`;

const INITIAL_CREATE_FORM = {
    sportType: "Cricket",
    league: "IPL 2026",
    matchNo: "Match 1",
    teamA: "",
    teamB: "",
    date: "",
    time: "07:30 PM",
    venue: "",
    city: "",
    description: "",
    standardPrice: 350,
    premiumPrice: 500,
    vipPrice: 750,
    imageUrl: "/assets/category/Sport.png",
};

export default function AdminAddSportPanel() {
    const [activeTab, setActiveTab] = useState<"database" | "create">("database");
    const [createMode, setCreateMode] = useState<"form" | "json">("form");

    const [sports, setSports] = useState<SportEvent[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
    const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);

    // Form builder state
    const [createForm, setCreateForm] = useState(INITIAL_CREATE_FORM);
    const [createStatus, setCreateStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [createError, setCreateError] = useState<string | null>(null);

    // JSON payload state
    const [jsonText, setJsonText] = useState(SAMPLE_SPORT_JSON);
    const [jsonStatus, setJsonStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [jsonError, setJsonError] = useState<string | null>(null);

    const loadSports = async () => {
        setStatus("loading");
        try {
            const data = await apiFetch("/sports", { publicRequest: true });
            const list = Array.isArray(data) ? data : [];
            setSports(list);
            setStatus("success");
        } catch (err) {
            setStatus("error");
        }
    };

    useEffect(() => {
        loadSports();
    }, []);

    const handleDeleteSport = async (id: string, matchName: string) => {
        setDeletingId(id);
        setDeleteSuccessMsg(null);
        setDeleteErrorMsg(null);

        try {
            await apiFetch(`/sports/${id}`, { method: "DELETE" });
            setSports((prev) => prev.filter((item) => item._id !== id));
            setDeleteSuccessMsg(`Match "${matchName}" deleted successfully from database.`);
            setDeleteTarget(null);
        } catch (err) {
            setDeleteErrorMsg(err instanceof Error ? err.message : "Failed to delete sport match");
        } finally {
            setDeletingId(null);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError(null);
        setCreateStatus("saving");

        try {
            const payload = {
                sportType: createForm.sportType,
                league: createForm.league,
                matchNo: createForm.matchNo,
                teamA: createForm.teamA,
                teamB: createForm.teamB,
                date: createForm.date,
                time: createForm.time,
                venue: createForm.venue,
                city: createForm.city,
                description: createForm.description,
                imageUrl: createForm.imageUrl || "/assets/category/Sport.png",
                prices: {
                    standard: Number(createForm.standardPrice),
                    premium: Number(createForm.premiumPrice),
                    vip: Number(createForm.vipPrice),
                },
                genres: [createForm.sportType, createForm.league],
            };

            await apiFetch("/sports", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setCreateStatus("success");
            setDeleteSuccessMsg(`Match "${createForm.teamA} vs ${createForm.teamB}" created successfully!`);
            setCreateForm(INITIAL_CREATE_FORM);
            loadSports();
            setActiveTab("database");
        } catch (err) {
            setCreateStatus("error");
            setCreateError(err instanceof Error ? err.message : "Failed to create sport match");
        }
    };

    const handleJsonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setJsonError(null);
        setJsonStatus("saving");

        let parsed: Record<string, unknown> | Record<string, unknown>[];
        try {
            parsed = JSON.parse(jsonText);
        } catch {
            setJsonStatus("error");
            setJsonError("Invalid JSON syntax. Please check formatting.");
            return;
        }

        try {
            await apiFetch("/sports", {
                method: "POST",
                body: JSON.stringify(parsed),
            });
            setJsonStatus("success");
            setDeleteSuccessMsg("Sport match payload inserted successfully!");
            loadSports();
            setActiveTab("database");
        } catch (err) {
            setJsonStatus("error");
            setJsonError(err instanceof Error ? err.message : "Failed to insert sport event");
        }
    };

    return (
        <div className="space-y-6 pb-16 select-none">
            {/* Top Header Card */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 20,
                }}
                className="flex flex-wrap items-center justify-between gap-4 p-5 shadow-xs"
            >
                <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20">
                        <Trophy size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                Sports & Tournament Catalog
                            </h2>
                            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-500 uppercase tracking-wider">
                                Live Database
                            </span>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-semibold m-0">
                            Create new sports fixtures from UI form and manage live matches directly in MongoDB.
                        </p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div
                    style={{ background: "var(--admin-soft)", border: "1px solid var(--admin-border)", borderRadius: 14 }}
                    className="p-1 flex items-center gap-1"
                >
                    <button
                        onClick={() => setActiveTab("database")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "database"
                            ? "bg-amber-500 text-slate-950 shadow-md font-black"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <Database size={15} />
                        <span>Database Matches ({sports.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("create")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "create"
                            ? "bg-amber-500 text-slate-950 shadow-md font-black"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <PlusCircle size={15} />
                        <span>Add New Match</span>
                    </button>
                </div>
            </div>

            {/* Success and Error Banners */}
            {deleteSuccessMsg && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-black text-emerald-500 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <span>{deleteSuccessMsg}</span>
                    </div>
                    <button onClick={() => setDeleteSuccessMsg(null)} className="cursor-pointer text-slate-400">
                        ✕
                    </button>
                </div>
            )}

            {deleteErrorMsg && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-black text-rose-500 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={18} />
                        <span>{deleteErrorMsg}</span>
                    </div>
                    <button onClick={() => setDeleteErrorMsg(null)} className="cursor-pointer text-slate-400">
                        ✕
                    </button>
                </div>
            )}

            {activeTab === "database" && (
                <div className="space-y-6">
                    {/* Status Bar */}
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 16,
                        }}
                        className="px-5 py-3 flex items-center justify-between text-xs font-semibold"
                    >
                        <span style={{ color: "var(--admin-text-secondary)" }}>
                            Total <strong>{sports.length}</strong> sport matches in database.
                        </span>
                        <button
                            type="button"
                            onClick={loadSports}
                            disabled={status === "loading"}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-amber-500 transition hover:bg-amber-500/10"
                        >
                            {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                            <span>Refresh Catalog</span>
                        </button>
                    </div>

                    {/* Sports Matches Grid */}
                    {status === "loading" && sports.length === 0 ? (
                        <div
                            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                            className="p-12 text-center"
                        >
                            <Loader2 className="mx-auto text-amber-500 animate-spin" size={32} />
                            <p style={{ color: "var(--admin-text-secondary)" }} className="mt-3 text-xs font-bold">
                                Fetching sports matches from database...
                            </p>
                        </div>
                    ) : sports.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sports.map((item) => {
                                const isDeleting = deletingId === item._id;
                                const title = `${item.teamA} vs ${item.teamB}`;

                                return (
                                    <div
                                        key={item._id}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            borderRadius: 20,
                                        }}
                                        className="p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition"
                                    >
                                        <div className="space-y-3">
                                            {/* Badge */}
                                            <div className="flex items-center justify-between">
                                                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-500 uppercase">
                                                    {item.league || "IPL 2026"}
                                                </span>
                                                <span className="text-[11px] font-mono text-slate-400 font-bold">
                                                    {item.matchNo || "Match"}
                                                </span>
                                            </div>

                                            {/* Match Title */}
                                            <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black leading-tight m-0">
                                                {item.teamA} <span className="text-amber-500 text-xs">VS</span> {item.teamB}
                                            </h3>

                                            <div className="space-y-1.5 text-xs text-slate-400 font-medium">
                                                <p className="flex items-center gap-1.5 m-0">
                                                    <Calendar size={14} className="text-amber-500" />
                                                    <span>{item.date} {item.time ? `• ${item.time}` : ""}</span>
                                                </p>
                                                <p className="flex items-center gap-1.5 m-0">
                                                    <MapPin size={14} className="text-indigo-400" />
                                                    <span>{item.venue}, {item.city}</span>
                                                </p>
                                            </div>

                                            {item.prices && (
                                                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
                                                    <span style={{ color: "var(--admin-text-secondary)" }}>Ticket Rates:</span>
                                                    <span className="font-bold text-emerald-500">
                                                        ₹{item.prices.standard || 300} - ₹{item.prices.vip || 600}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button: Delete from DB */}
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget({ id: item._id, name: title })}
                                            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition cursor-pointer shadow-md bg-rose-600 hover:bg-rose-700 text-white active:scale-95"
                                        >
                                            <Trash2 size={16} /> Delete Match from DB
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                            className="p-12 text-center space-y-3"
                        >
                            <Trophy className="mx-auto text-amber-500" size={32} />
                            <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                No Sports Matches in Database
                            </h3>
                            <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                Click "Add New Match" above to insert matches into MongoDB.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "create" && (
                <div className="space-y-5">
                    {/* Creation Mode Selector */}
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                        <button
                            type="button"
                            onClick={() => setCreateMode("form")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${createMode === "form"
                                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <Sparkles size={15} /> UI Form Builder
                        </button>
                        <button
                            type="button"
                            onClick={() => setCreateMode("json")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${createMode === "json"
                                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <FileCode size={15} /> Raw JSON Payload
                        </button>
                    </div>

                    {createMode === "form" ? (
                        <div
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                borderRadius: 20,
                            }}
                            className="p-6 shadow-lg space-y-5"
                        >
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-amber-500" size={24} />
                                <div>
                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                        Create New Sports Match (UI Form)
                                    </h3>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                        Fill in match details below to store directly in MongoDB database.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Team A *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Mumbai Indians"
                                            value={createForm.teamA}
                                            onChange={(e) => setCreateForm({ ...createForm, teamA: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Team B *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Chennai Super Kings"
                                            value={createForm.teamB}
                                            onChange={(e) => setCreateForm({ ...createForm, teamB: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Tournament / League *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. IPL 2026"
                                            value={createForm.league}
                                            onChange={(e) => setCreateForm({ ...createForm, league: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Match Tag / Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Match 15"
                                            value={createForm.matchNo}
                                            onChange={(e) => setCreateForm({ ...createForm, matchNo: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Match Date (YYYY-MM-DD) *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={createForm.date}
                                            onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Match Time *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 07:30 PM"
                                            value={createForm.time}
                                            onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Venue Stadium *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Wankhede Stadium"
                                            value={createForm.venue}
                                            onChange={(e) => setCreateForm({ ...createForm, venue: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Mumbai"
                                            value={createForm.city}
                                            onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Sport Type
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Cricket"
                                            value={createForm.sportType}
                                            onChange={(e) => setCreateForm({ ...createForm, sportType: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Standard Ticket Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={createForm.standardPrice}
                                            onChange={(e) => setCreateForm({ ...createForm, standardPrice: Number(e.target.value) })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Premium Ticket Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={createForm.premiumPrice}
                                            onChange={(e) => setCreateForm({ ...createForm, premiumPrice: Number(e.target.value) })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            VIP Pass Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={createForm.vipPrice}
                                            onChange={(e) => setCreateForm({ ...createForm, vipPrice: Number(e.target.value) })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Match Overview & Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Enter key match details or head-to-head overview..."
                                        value={createForm.description}
                                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl p-3 text-xs font-medium outline-none focus:border-amber-500 resize-none"
                                    />
                                </div>

                                {createError && (
                                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-black text-rose-500 flex items-center gap-2">
                                        <AlertTriangle size={18} />
                                        <span>{createError}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={createStatus === "saving"}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-95 disabled:opacity-50"
                                    >
                                        {createStatus === "saving" ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <PlusCircle size={16} />
                                        )}
                                        <span>{createStatus === "saving" ? "Creating Match..." : "Create & Save Match"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                borderRadius: 20,
                            }}
                            className="p-6 shadow-lg space-y-5"
                        >
                            <div className="flex items-center gap-3">
                                <UploadCloud className="text-amber-500" size={24} />
                                <div>
                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                        Insert Sports Match JSON Payload
                                    </h3>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                        Paste single match or array of match objects to push directly into database.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleJsonSubmit} className="space-y-4">
                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Match JSON Content
                                    </label>
                                    <textarea
                                        value={jsonText}
                                        onChange={(e) => setJsonText(e.target.value)}
                                        rows={12}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-2xl p-4 text-xs font-mono outline-none focus:border-amber-500 leading-relaxed resize-none"
                                    />
                                </div>

                                {jsonError && (
                                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-black text-rose-500 flex items-center gap-2">
                                        <AlertTriangle size={18} />
                                        <span>{jsonError}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setJsonText(SAMPLE_SPORT_JSON);
                                            setJsonError(null);
                                        }}
                                        className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                                    >
                                        Reset Sample Payload
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={jsonStatus === "saving"}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-95 disabled:opacity-50"
                                    >
                                        <UploadCloud size={16} />
                                        <span>{jsonStatus === "saving" ? "Inserting Match..." : "Insert Match to Database"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            <AdminDeleteConfirmModal
                isOpen={!!deleteTarget}
                itemType="Sport Match"
                itemName={deleteTarget?.name || ""}
                isDeleting={deletingId === deleteTarget?.id}
                onConfirm={() => {
                    if (deleteTarget) {
                        handleDeleteSport(deleteTarget.id, deleteTarget.name);
                    }
                }}
                onClose={() => {
                    if (!deletingId) {
                        setDeleteTarget(null);
                    }
                }}
            />
        </div>
    );
}
