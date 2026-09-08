"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
    Train,
    Database,
    PlusCircle,
    Trash2,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    UploadCloud,
    Sparkles,
    FileCode,
} from "lucide-react";

export type TrainRoute = {
    _id: string;
    trainNumber: string;
    trainName: string;
    fromStation: string;
    toStation: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    totalSeats?: number;
    availableSeats?: number;
    rating?: number;
    amenities?: string[];
    operatingDays?: string[];
};

const SAMPLE_TRAIN_JSON = `{
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "fromStation": "Mumbai Central (MMCT)",
  "toStation": "New Delhi (NDLS)",
  "departureTime": "05:00 PM",
  "arrivalTime": "08:32 AM",
  "price": 2450,
  "totalSeats": 50,
  "availableSeats": 50,
  "rating": 4.9,
  "amenities": ["WiFi", "Meals", "AC 1st Class", "Bedroll"],
  "operatingDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}`;

const INITIAL_CREATE_FORM = {
    trainNumber: "",
    trainName: "",
    fromStation: "",
    toStation: "",
    departureTime: "05:00 PM",
    arrivalTime: "08:30 AM",
    price: 1850,
    totalSeats: 50,
    availableSeats: 50,
};

export default function AdminAddTrainPanel() {
    const [activeTab, setActiveTab] = useState<"database" | "create">("database");
    const [createMode, setCreateMode] = useState<"form" | "json">("form");

    const [trains, setTrains] = useState<TrainRoute[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
    const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);

    // Form Builder state
    const [createForm, setCreateForm] = useState(INITIAL_CREATE_FORM);
    const [createStatus, setCreateStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [createError, setCreateError] = useState<string | null>(null);

    // JSON Payload state
    const [jsonText, setJsonText] = useState(SAMPLE_TRAIN_JSON);
    const [jsonStatus, setJsonStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [jsonError, setJsonError] = useState<string | null>(null);

    const loadTrains = async () => {
        setStatus("loading");
        try {
            const data = await apiFetch("/trains", { publicRequest: true });
            const list = Array.isArray(data) ? data : [];
            setTrains(list);
            setStatus("success");
        } catch (err) {
            setStatus("error");
        }
    };

    useEffect(() => {
        loadTrains();
    }, []);

    const handleDeleteTrain = async (id: string, name: string) => {
        setDeletingId(id);
        setDeleteSuccessMsg(null);
        setDeleteErrorMsg(null);

        try {
            await apiFetch(`/trains/admin/${id}`, { method: "DELETE" });
            setTrains((prev) => prev.filter((item) => item._id !== id));
            setDeleteSuccessMsg(`Train route "${name}" deleted successfully from database.`);
        } catch (err) {
            setDeleteErrorMsg(err instanceof Error ? err.message : "Failed to delete train route");
        } finally {
            setDeletingId(null);
            setConfirmingDeleteId(null);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError(null);
        setCreateStatus("saving");

        try {
            const payload = {
                trainNumber: createForm.trainNumber,
                trainName: createForm.trainName,
                fromStation: createForm.fromStation,
                toStation: createForm.toStation,
                departureTime: createForm.departureTime,
                arrivalTime: createForm.arrivalTime,
                price: Number(createForm.price),
                totalSeats: Number(createForm.totalSeats),
                availableSeats: Number(createForm.availableSeats),
                rating: 4.8,
                amenities: ["WiFi", "Pantry", "AC Class"],
                operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            };

            await apiFetch("/trains/admin/create", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setCreateStatus("success");
            setDeleteSuccessMsg(`Train "${createForm.trainName} (#${createForm.trainNumber})" created successfully!`);
            setCreateForm(INITIAL_CREATE_FORM);
            loadTrains();
            setActiveTab("database");
        } catch (err) {
            setCreateStatus("error");
            setCreateError(err instanceof Error ? err.message : "Failed to create train route");
        }
    };

    const handleJsonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setJsonError(null);
        setJsonStatus("saving");

        let parsed: Record<string, unknown>;
        try {
            parsed = JSON.parse(jsonText);
        } catch {
            setJsonStatus("error");
            setJsonError("Invalid JSON syntax. Please check formatting.");
            return;
        }

        try {
            await apiFetch("/trains/admin/create", {
                method: "POST",
                body: JSON.stringify(parsed),
            });
            setJsonStatus("success");
            setDeleteSuccessMsg("Train route inserted successfully!");
            loadTrains();
            setActiveTab("database");
        } catch (err) {
            setJsonStatus("error");
            setJsonError(err instanceof Error ? err.message : "Failed to create train route");
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
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/30">
                        <Train size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                Transit & Train Routes Catalog
                            </h2>
                            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black text-cyan-400 uppercase tracking-wider">
                                Live Database
                            </span>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-semibold m-0">
                            Create new express routes from UI form and manage railway catalogs in MongoDB.
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
                            ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <Database size={15} />
                        <span>Database Routes ({trains.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("create")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "create"
                            ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <PlusCircle size={15} />
                        <span>Add Train Route</span>
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
                            Total <strong>{trains.length}</strong> train routes in database.
                        </span>
                        <button
                            type="button"
                            onClick={loadTrains}
                            disabled={status === "loading"}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-cyan-400 transition hover:bg-cyan-500/10"
                        >
                            {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                            <span>Refresh Catalog</span>
                        </button>
                    </div>

                    {/* Trains Grid */}
                    {status === "loading" && trains.length === 0 ? (
                        <div
                            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                            className="p-12 text-center"
                        >
                            <Loader2 className="mx-auto text-cyan-500 animate-spin" size={32} />
                            <p style={{ color: "var(--admin-text-secondary)" }} className="mt-3 text-xs font-bold">
                                Fetching train routes from database...
                            </p>
                        </div>
                    ) : trains.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trains.map((item) => {
                                const isDeleting = deletingId === item._id;
                                const title = `${item.trainName} #${item.trainNumber}`;

                                return (
                                    <div
                                        key={item._id}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            borderRadius: 20,
                                        }}
                                        className="p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition"
                                    >
                                        <div className="space-y-3">
                                            {/* Badge */}
                                            <div className="flex items-center justify-between">
                                                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black text-cyan-400 uppercase">
                                                    #{item.trainNumber}
                                                </span>
                                                <span className="text-[11px] font-mono text-slate-400 font-bold">
                                                    Seats: {item.totalSeats || 50}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black leading-tight m-0">
                                                {item.trainName}
                                            </h3>

                                            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1.5 text-xs text-slate-300 font-mono">
                                                <div className="flex items-center justify-between">
                                                    <span>From: {item.fromStation}</span>
                                                    <span className="text-cyan-400">{item.departureTime}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>To: {item.toStation}</span>
                                                    <span className="text-cyan-400">{item.arrivalTime}</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
                                                <span style={{ color: "var(--admin-text-secondary)" }}>Base Fare:</span>
                                                <span className="font-bold text-emerald-500">₹{item.price}</span>
                                            </div>
                                        </div>

                                        {/* Action Button with In-Card Confirmation */}
                                        {confirmingDeleteId === item._id ? (
                                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2.5 text-center animate-in fade-in duration-200">
                                                <p className="text-[11px] font-black text-rose-400 m-0 flex items-center justify-center gap-1.5">
                                                    <AlertTriangle size={14} /> Delete route from database?
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteTrain(item._id, title)}
                                                        disabled={isDeleting}
                                                        className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold transition cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                                                    >
                                                        {isDeleting ? (
                                                            <>
                                                                <Loader2 size={13} className="animate-spin" /> Deleting...
                                                            </>
                                                        ) : (
                                                            "Yes, Delete DB"
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmingDeleteId(null)}
                                                        disabled={isDeleting}
                                                        className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setConfirmingDeleteId(item._id)}
                                                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition cursor-pointer shadow-md bg-rose-600 hover:bg-rose-700 text-white active:scale-95"
                                            >
                                                <Trash2 size={16} /> Delete Route from DB
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                            className="p-12 text-center space-y-3"
                        >
                            <Train className="mx-auto text-cyan-500" size={32} />
                            <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                No Train Routes in Database
                            </h3>
                            <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                Click "Add Train Route" above to insert routes into MongoDB.
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
                                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <Sparkles size={15} /> UI Form Builder
                        </button>
                        <button
                            type="button"
                            onClick={() => setCreateMode("json")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${createMode === "json"
                                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
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
                                <Sparkles className="text-cyan-500" size={24} />
                                <div>
                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                        Create New Train Route (UI Form)
                                    </h3>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                        Fill in express train route details below to store directly in MongoDB.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Train Number (5-digits) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 12951"
                                            value={createForm.trainNumber}
                                            onChange={(e) => setCreateForm({ ...createForm, trainNumber: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-cyan-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Train Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Vande Bharat Express"
                                            value={createForm.trainName}
                                            onChange={(e) => setCreateForm({ ...createForm, trainName: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-cyan-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Origin Station *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Mumbai Central (MMCT)"
                                            value={createForm.fromStation}
                                            onChange={(e) => setCreateForm({ ...createForm, fromStation: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-cyan-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Destination Station *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. New Delhi (NDLS)"
                                            value={createForm.toStation}
                                            onChange={(e) => setCreateForm({ ...createForm, toStation: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-cyan-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Departure Time *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 05:00 PM"
                                            value={createForm.departureTime}
                                            onChange={(e) => setCreateForm({ ...createForm, departureTime: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-cyan-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Arrival Time *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 08:30 AM"
                                            value={createForm.arrivalTime}
                                            onChange={(e) => setCreateForm({ ...createForm, arrivalTime: e.target.value })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-cyan-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Base Ticket Fare (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            value={createForm.price}
                                            onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })}
                                            style={{
                                                background: "var(--admin-soft)",
                                                border: "1px solid var(--admin-border)",
                                                color: "var(--admin-text)",
                                            }}
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-cyan-500"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                            Total Berth Seats
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
                                            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-cyan-500"
                                        />
                                    </div>
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
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-cyan-600/30 transition hover:bg-cyan-700 active:scale-95 disabled:opacity-50"
                                    >
                                        {createStatus === "saving" ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <PlusCircle size={16} />
                                        )}
                                        <span>{createStatus === "saving" ? "Creating Route..." : "Create & Save Route"}</span>
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
                                <UploadCloud className="text-cyan-500" size={24} />
                                <div>
                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                        Insert Train Route JSON Payload
                                    </h3>
                                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                        Paste single train route object to push directly into database.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleJsonSubmit} className="space-y-4">
                                <div>
                                    <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                        Train JSON Content
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
                                        className="w-full rounded-2xl p-4 text-xs font-mono outline-none focus:border-cyan-500 leading-relaxed resize-none"
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
                                            setJsonText(SAMPLE_TRAIN_JSON);
                                            setJsonError(null);
                                        }}
                                        className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                                    >
                                        Reset Sample Payload
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={jsonStatus === "saving"}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-cyan-600/30 transition hover:bg-cyan-700 active:scale-95 disabled:opacity-50"
                                    >
                                        <UploadCloud size={16} />
                                        <span>{jsonStatus === "saving" ? "Inserting Route..." : "Insert Route to Database"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
