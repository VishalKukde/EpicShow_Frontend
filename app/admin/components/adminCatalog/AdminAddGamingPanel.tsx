"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
    Gamepad2,
    Database,
    PlusCircle,
    Trash2,
    Edit3,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    UploadCloud,
    Calendar,
    MapPin,
    X,
    Save,
    FileCode,
    Sparkles,
    Copy,
    Clock,
} from "lucide-react";
import AdminDeleteConfirmModal from "../shared/AdminDeleteConfirmModal";

export type GamingEvent = {
    _id: string;
    title: string;
    description: string;
    showType?: string;
    city: string;
    venue: string;
    startDateTime: string;
    price: number;
    totalSeats?: number;
    availableSeats?: number;
    organizer: string;
    imageUrl?: string;
};

const SAMPLE_GAMING_JSON = `{
  "title": "Valorant Champions Tournament 2026",
  "description": "Epic LAN tournament featuring top esports teams in South Asia.",
  "showType": "gaming",
  "city": "Bengaluru",
  "venue": "Kanteerava Indoor Stadium",
  "startDateTime": "2026-06-15T10:00:00.000Z",
  "price": 499,
  "totalSeats": 500,
  "availableSeats": 500,
  "organizer": "Epic Esports India",
  "imageUrl": "/assets/category/Gaming.png"
}`;

const INITIAL_CREATE_FORM = {
    title: "",
    organizer: "",
    city: "",
    venue: "",
    startDateTime: "",
    price: 499,
    totalSeats: 500,
    availableSeats: 500,
    imageUrl: "/assets/category/Gaming.png",
    description: "",
    showType: "gaming",
};

const isEventExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    const eventDate = new Date(dateStr);
    if (Number.isNaN(eventDate.getTime())) return false;
    return eventDate < new Date();
};

export default function AdminAddGamingPanel() {
    const [activeTab, setActiveTab] = useState<"database" | "create">("database");
    const [createMode, setCreateMode] = useState<"form" | "json">("form");
    const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "expired">("upcoming");

    const [gamingEvents, setGamingEvents] = useState<GamingEvent[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
    const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);

    // Create Form state
    const [createForm, setCreateForm] = useState(INITIAL_CREATE_FORM);
    const [createStatus, setCreateStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [createError, setCreateError] = useState<string | null>(null);

    // Raw JSON state
    const [jsonText, setJsonText] = useState(SAMPLE_GAMING_JSON);
    const [jsonStatus, setJsonStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Edit state
    const [editingItem, setEditingItem] = useState<GamingEvent | null>(null);
    const [editForm, setEditForm] = useState<Partial<GamingEvent>>({});
    const [editStatus, setEditStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [editError, setEditError] = useState<string | null>(null);

    const loadGamingEvents = async () => {
        setStatus("loading");
        try {
            const data = await apiFetch("/gaming", { publicRequest: true });
            const list = Array.isArray(data) ? data : [];
            setGamingEvents(list);
            setStatus("success");
        } catch (err) {
            setStatus("error");
        }
    };

    useEffect(() => {
        loadGamingEvents();
    }, []);

    const handleDeleteGaming = async (id: string, title: string) => {
        setDeletingId(id);
        setDeleteSuccessMsg(null);
        setDeleteErrorMsg(null);

        try {
            await apiFetch(`/gaming/${id}`, { method: "DELETE" });
            setGamingEvents((prev) => prev.filter((item) => item._id !== id));
            setDeleteSuccessMsg(`Gaming event "${title}" deleted successfully from database.`);
            setDeleteTarget(null);
        } catch (err) {
            setDeleteErrorMsg(err instanceof Error ? err.message : "Failed to delete gaming event");
        } finally {
            setDeletingId(null);
        }
    };

    const handleCloneGaming = (item: GamingEvent) => {
        let isoDate = "";
        if (item.startDateTime) {
            try {
                const dateObj = new Date(item.startDateTime);
                isoDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16);
            } catch {
                isoDate = "";
            }
        }

        setCreateForm({
            title: `Copy of ${item.title}`,
            organizer: item.organizer || "",
            city: item.city || "",
            venue: item.venue || "",
            startDateTime: isoDate,
            price: item.price ?? 499,
            totalSeats: item.totalSeats ?? 500,
            availableSeats: item.availableSeats ?? item.totalSeats ?? 500,
            imageUrl: item.imageUrl || "/assets/category/Gaming.png",
            description: item.description || "",
            showType: item.showType || "gaming",
        });

        setCreateError(null);
        setCreateStatus("idle");
        setCreateMode("form");
        setActiveTab("create");
    };

    const handleOpenEditModal = (item: GamingEvent) => {
        setEditingItem(item);
        let isoDate = "";
        if (item.startDateTime) {
            try {
                const dateObj = new Date(item.startDateTime);
                isoDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16);
            } catch {
                isoDate = "";
            }
        }

        setEditForm({
            title: item.title,
            description: item.description,
            showType: item.showType || "gaming",
            city: item.city,
            venue: item.venue,
            startDateTime: isoDate,
            price: item.price,
            totalSeats: item.totalSeats ?? 500,
            availableSeats: item.availableSeats ?? item.totalSeats ?? 500,
            organizer: item.organizer,
            imageUrl: item.imageUrl || "/assets/category/Gaming.png",
        });
        setEditError(null);
        setEditStatus("idle");
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        setEditStatus("saving");
        setEditError(null);

        try {
            const updated = await apiFetch(`/gaming/${editingItem._id}`, {
                method: "PUT",
                body: JSON.stringify(editForm),
            });

            setGamingEvents((prev) =>
                prev.map((item) => (item._id === editingItem._id ? { ...item, ...updated } : item))
            );
            setDeleteSuccessMsg(`Gaming event "${editForm.title || editingItem.title}" updated successfully!`);
            setEditingItem(null);
            setEditStatus("success");
        } catch (err) {
            setEditStatus("error");
            setEditError(err instanceof Error ? err.message : "Failed to update gaming details");
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError(null);
        setCreateStatus("saving");

        try {
            const payload = {
                ...createForm,
                startDateTime: createForm.startDateTime
                    ? new Date(createForm.startDateTime).toISOString()
                    : new Date().toISOString(),
                price: Number(createForm.price),
                totalSeats: Number(createForm.totalSeats),
                availableSeats: Number(createForm.availableSeats),
            };

            await apiFetch("/gaming", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setCreateStatus("success");
            setDeleteSuccessMsg(`Gaming event "${createForm.title}" created successfully in MongoDB!`);
            setCreateForm(INITIAL_CREATE_FORM);
            loadGamingEvents();
            setActiveTab("database");
        } catch (err) {
            setCreateStatus("error");
            setCreateError(err instanceof Error ? err.message : "Failed to create gaming event");
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
            await apiFetch("/gaming", {
                method: "POST",
                body: JSON.stringify(parsed),
            });
            setJsonStatus("success");
            setDeleteSuccessMsg("Gaming event payload inserted successfully!");
            loadGamingEvents();
            setActiveTab("database");
        } catch (err) {
            setJsonStatus("error");
            setJsonError(err instanceof Error ? err.message : "Failed to insert gaming event");
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
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
                        <Gamepad2 size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                Gaming & Esports Catalog
                            </h2>
                            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-black text-purple-400 uppercase tracking-wider">
                                Live Database
                            </span>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-semibold m-0">
                            Create, update, or remove Esports tournaments & gaming shows directly in MongoDB.
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
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <Database size={15} />
                        <span>Database Gaming ({gamingEvents.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("create")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "create"
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <PlusCircle size={15} />
                        <span>Create Gaming Event</span>
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
                    {(() => {
                        const expiredEventsCount = gamingEvents.filter((item) => isEventExpired(item.startDateTime)).length;
                        const upcomingEventsCount = gamingEvents.filter((item) => !isEventExpired(item.startDateTime)).length;

                        return (
                            <div
                                style={{
                                    background: "var(--admin-surface)",
                                    border: "1px solid var(--admin-border)",
                                    borderRadius: 16,
                                }}
                                className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold"
                            >
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => setFilterStatus("all")}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${filterStatus === "all"
                                            ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                            : "border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-200"
                                            }`}
                                    >
                                        All Events ({gamingEvents.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFilterStatus("upcoming")}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${filterStatus === "upcoming"
                                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                            : "border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-200"
                                            }`}
                                    >
                                        <Sparkles size={13} /> Upcoming ({upcomingEventsCount})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFilterStatus("expired")}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${filterStatus === "expired"
                                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                                            : "border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-200"
                                            }`}
                                    >
                                        <Clock size={13} /> Expired ({expiredEventsCount})
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={loadGamingEvents}
                                    disabled={status === "loading"}
                                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-purple-400 transition hover:bg-purple-500/10"
                                >
                                    {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                                    <span>Refresh Catalog</span>
                                </button>
                            </div>
                        );
                    })()}

                    {/* Gaming Events Grid */}
                    {status === "loading" && gamingEvents.length === 0 ? (
                        <div
                            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                            className="p-12 text-center"
                        >
                            <Loader2 className="mx-auto text-purple-500 animate-spin" size={32} />
                            <p style={{ color: "var(--admin-text-secondary)" }} className="mt-3 text-xs font-bold">
                                Fetching gaming events from database...
                            </p>
                        </div>
                    ) : (() => {
                        const displayGamingEvents = gamingEvents.filter((item) => {
                            const expired = isEventExpired(item.startDateTime);
                            if (filterStatus === "upcoming") return !expired;
                            if (filterStatus === "expired") return expired;
                            return true;
                        });

                        if (displayGamingEvents.length === 0) {
                            return (
                                <div
                                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                                    className="p-12 text-center space-y-3"
                                >
                                    <Gamepad2 className="mx-auto text-purple-500" size={32} />
                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                        No Gaming Events Found ({filterStatus.toUpperCase()})
                                    </h3>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                        No events match the selected status filter.
                                    </p>
                                </div>
                            );
                        }

                        return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayGamingEvents.map((item) => {
                                    const isDeleting = deletingId === item._id;
                                    const isExpired = isEventExpired(item.startDateTime);
                                    const formattedDate = item.startDateTime
                                        ? new Date(item.startDateTime).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "TBA";

                                    return (
                                        <div
                                            key={item._id}
                                            style={{
                                                background: "var(--admin-surface)",
                                                border: "1px solid var(--admin-border)",
                                                borderRadius: 20,
                                            }}
                                            className={`p-5 shadow-lg flex flex-col justify-between space-y-4 transition ${isExpired ? "hover:border-amber-500/40 border-amber-500/20" : "hover:border-purple-500/40"
                                                }`}
                                        >
                                            <div className="space-y-3">
                                                {/* Badge & Expired Status Chip */}
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[10px] font-black text-purple-400 uppercase">
                                                            {item.showType || "Gaming"}
                                                        </span>
                                                        {isExpired ? (
                                                            <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black text-amber-400 uppercase tracking-wide flex items-center gap-1">
                                                                <Clock size={10} /> Expired
                                                            </span>
                                                        ) : (
                                                            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                                                                <Sparkles size={10} /> Upcoming
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-mono text-slate-400 font-bold truncate max-w-35">
                                                        {item.organizer}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black leading-tight m-0">
                                                    {item.title}
                                                </h3>

                                                <p
                                                    style={{ color: "var(--admin-text-secondary)" }}
                                                    className="text-xs font-semibold leading-relaxed m-0 line-clamp-2"
                                                >
                                                    {item.description}
                                                </p>

                                                <div className="space-y-1.5 text-xs text-slate-400 font-medium">
                                                    <p className="flex items-center gap-1.5 m-0">
                                                        <Calendar size={14} className={isExpired ? "text-amber-400" : "text-purple-400"} />
                                                        <span>{formattedDate}</span>
                                                    </p>
                                                    <p className="flex items-center gap-1.5 m-0">
                                                        <MapPin size={14} className="text-indigo-400" />
                                                        <span>{item.venue}, {item.city}</span>
                                                    </p>
                                                </div>

                                                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
                                                    <span style={{ color: "var(--admin-text-secondary)" }}>Ticket Pass:</span>
                                                    <span className="font-bold text-emerald-500">₹{item.price}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCloneGaming(item)}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition cursor-pointer border active:scale-95 shadow-xs ${isExpired
                                                        ? "border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 dark:text-amber-300"
                                                        : "border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 dark:text-purple-300"
                                                        }`}
                                                    title={isExpired ? "Re-create new upcoming event from this expired event" : "Clone event details into Form Builder"}
                                                >
                                                    <Copy size={14} /> {isExpired ? "Reuse & Re-create" : "Copy Event"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget({ id: item._id, name: item.title })}
                                                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition cursor-pointer shadow-md bg-rose-600 hover:bg-rose-700 text-white active:scale-95"
                                                >
                                                    <Trash2 size={14} /> Delete DB
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
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
                                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <Sparkles size={15} /> UI Form Builder
                        </button>
                        <button
                            type="button"
                            onClick={() => setCreateMode("json")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${createMode === "json"
                                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
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
                                <Sparkles className="text-purple-500" size={24} />
                                <div>
                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                        Create New Gaming Event (UI Form)
                                    </h3>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                        Fill in tournament details below to store directly in MongoDB.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Event Title / Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Valorant India Championship"
                                            value={createForm.title}
                                            onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Organizer Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. NODWIN Gaming"
                                            value={createForm.organizer}
                                            onChange={(e) => setCreateForm({ ...createForm, organizer: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Bengaluru"
                                            value={createForm.city}
                                            onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Venue Location *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Kanteerava Indoor Stadium"
                                            value={createForm.venue}
                                            onChange={(e) => setCreateForm({ ...createForm, venue: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Start Date & Time *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={createForm.startDateTime}
                                            onChange={(e) => setCreateForm({ ...createForm, startDateTime: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Ticket Pass Price (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            placeholder="e.g. 499"
                                            value={createForm.price}
                                            onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Total Capacity Seats
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={createForm.totalSeats}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    totalSeats: Number(e.target.value),
                                                    availableSeats: Number(e.target.value),
                                                })
                                            }
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Image Banner URL
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.imageUrl}
                                            onChange={(e) => setCreateForm({ ...createForm, imageUrl: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Event Description *
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Enter gaming event overview, rules, prize pool..."
                                        value={createForm.description}
                                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl p-3 text-xs font-medium outline-none focus:border-purple-500 resize-none"
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
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 active:scale-95 disabled:opacity-50"
                                    >
                                        {createStatus === "saving" ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <PlusCircle size={16} />
                                        )}
                                        <span>{createStatus === "saving" ? "Creating Event..." : "Create & Save Event"}</span>
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
                                <UploadCloud className="text-purple-500" size={24} />
                                <div>
                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                        Insert Gaming Event JSON Payload
                                    </h3>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                        Paste single event or array of gaming event objects to push directly into database.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleJsonSubmit} className="space-y-4">
                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Gaming JSON Content
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
                                        className="w-full rounded-2xl p-4 text-xs font-mono outline-none focus:border-purple-500 leading-relaxed resize-none"
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
                                            setJsonText(SAMPLE_GAMING_JSON);
                                            setJsonError(null);
                                        }}
                                        className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                                    >
                                        Reset Sample Payload
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={jsonStatus === "saving"}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 active:scale-95 disabled:opacity-50"
                                    >
                                        <UploadCloud size={16} />
                                        <span>{jsonStatus === "saving" ? "Inserting Event..." : "Insert Event to Database"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Gaming Modal Overlay */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 24,
                        }}
                        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 relative"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-600 text-white shadow-md">
                                    <Edit3 size={20} />
                                </div>
                                <div>
                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                        Edit Gaming Event Details
                                    </h3>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                        Update tournament schedule, location, pricing, or description.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingItem(null)}
                                className="rounded-full p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Edit Form */}
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Event Title / Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.title || ""}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Organizer *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.organizer || ""}
                                        onChange={(e) => setEditForm({ ...editForm, organizer: e.target.value })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.city || ""}
                                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Venue Location *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.venue || ""}
                                        onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Start Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={editForm.startDateTime || ""}
                                        onChange={(e) => setEditForm({ ...editForm, startDateTime: e.target.value })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Ticket Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={0}
                                        value={editForm.price ?? 0}
                                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Total Capacity Seats
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={editForm.totalSeats ?? 500}
                                        onChange={(e) => setEditForm({ ...editForm, totalSeats: Number(e.target.value) })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Image Banner URL
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.imageUrl || ""}
                                        onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                        style={{
                                            background: "var(--admin-soft)",
                                            border: "1px solid var(--admin-border)",
                                            color: "var(--admin-text)",
                                        }}
                                        className="w-full rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                    Event Description *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editForm.description || ""}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    style={{
                                        background: "var(--admin-soft)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-full rounded-xl p-3 text-xs font-medium outline-none focus:border-purple-500 resize-none"
                                />
                            </div>

                            {editError && (
                                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-black text-rose-500 flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    <span>{editError}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-100 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editStatus === "saving"}
                                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 active:scale-95 disabled:opacity-50"
                                >
                                    {editStatus === "saving" ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    <span>{editStatus === "saving" ? "Saving..." : "Save Changes"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AdminDeleteConfirmModal
                isOpen={!!deleteTarget}
                itemType="Gaming Event"
                itemName={deleteTarget?.name || ""}
                isDeleting={deletingId === deleteTarget?.id}
                onConfirm={() => {
                    if (deleteTarget) {
                        handleDeleteGaming(deleteTarget.id, deleteTarget.name);
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
