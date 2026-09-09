"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Movie } from "@/types/Movie";
import {
    Film,
    Globe,
    Sparkles,
    PlusCircle,
    CheckCircle2,
    AlertTriangle,
    FileCode,
    Search,
    ChevronLeft,
    ChevronRight,
    Star,
    Clock,
    UploadCloud,
    Check,
    Calendar,
    Rocket,
    Trash2,
    Database,
    Loader2,
} from "lucide-react";
import AdminDeleteConfirmModal from "../shared/AdminDeleteConfirmModal";

const LANGUAGE_OPTIONS = [
    { label: "Hollywood (EN)", value: "en" },
    { label: "Bollywood (HI)", value: "hi" },
    { label: "All Languages", value: "all" },
];

type TmdbMovie = {
    name: string;
    description: string;
    genre: string[];
    imageUrl: string | null;
    language: string;
    runtimeMinutes: number | null;
    rating: number | null;
    tmdbId?: number;
    releaseDate?: string | null;
};

const SAMPLE_JSON = `{
  "name": "Interstellar",
  "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  "genre": ["Sci-Fi", "Adventure"],
  "imageUrl": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "language": "EN",
  "runtimeMinutes": 169,
  "rating": 8.6,
  "releaseDate": "2014-11-05"
}`;

const REQUIRED_FIELDS = [
    "name",
    "description",
    "genre",
    "imageUrl",
    "language",
    "runtimeMinutes",
];

export default function AdminAddMoviePanel() {
    const [activeTab, setActiveTab] = useState<"database" | "tmdb" | "upcoming" | "json">("database");

    // --- DB Movies State (Existing Collection in Database) ---
    const [dbMovies, setDbMovies] = useState<Movie[]>([]);
    const [dbStatus, setDbStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [dbError, setDbError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
    const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);

    // --- TMDB Explorer State (Released Movies) ---
    const [language, setLanguage] = useState("en");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [totalResults, setTotalResults] = useState<number | null>(null);
    const [movies, setMovies] = useState<TmdbMovie[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    // --- TMDB Upcoming Movies State ---
    const [upcomingLanguage, setUpcomingLanguage] = useState("en");
    const [upcomingPage, setUpcomingPage] = useState(1);
    const [upcomingTotalPages, setUpcomingTotalPages] = useState<number | null>(null);
    const [upcomingTotalResults, setUpcomingTotalResults] = useState<number | null>(null);
    const [upcomingMovies, setUpcomingMovies] = useState<TmdbMovie[]>([]);
    const [upcomingStatus, setUpcomingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [upcomingError, setUpcomingError] = useState<string | null>(null);

    // --- Insert State (Shared) ---
    const [insertState, setInsertState] = useState<Record<string, "idle" | "saving" | "success" | "error">>({});
    const [insertError, setInsertError] = useState<Record<string, string>>({});

    // --- JSON Import State ---
    const [jsonText, setJsonText] = useState(SAMPLE_JSON);
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [jsonStatus, setJsonStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [jsonResult, setJsonResult] = useState<Record<string, unknown> | Record<string, unknown>[] | null>(null);

    // Fetch movies from DB
    const loadDbMovies = async () => {
        setDbStatus("loading");
        setDbError(null);
        try {
            const data = await apiFetch("/movies", { publicRequest: true });
            const list = Array.isArray(data) ? data : [];
            setDbMovies(list);
            setDbStatus("success");
        } catch (err) {
            setDbStatus("error");
            setDbError(err instanceof Error ? err.message : "Failed to load database movies");
        }
    };

    useEffect(() => {
        loadDbMovies();
    }, []);

    // Delete movie directly from database
    const handleDeleteMovie = async (id: string, name: string) => {
        setDeletingId(id);
        setDeleteSuccessMsg(null);
        setDeleteErrorMsg(null);

        try {
            await apiFetch(`/movies/${id}`, { method: "DELETE" });
            setDbMovies((prev) => prev.filter((m) => m._id !== id));
            setDeleteSuccessMsg(`Movie "${name}" was permanently deleted from the database.`);
            setDeleteTarget(null);
        } catch (err) {
            setDeleteErrorMsg(err instanceof Error ? err.message : "Failed to delete movie");
        } finally {
            setDeletingId(null);
        }
    };

    // TMDB Released Movies Loader
    const loadTmdbMovies = async () => {
        setStatus("loading");
        setError(null);
        try {
            const res = await fetch(`/api/tmdb/discover?lang=${language}&page=${page}&type=released`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || "Failed to fetch TMDB movies");
            }
            setMovies(data.items || []);
            setTotalPages(data.totalPages ?? null);
            setTotalResults(data.totalResults ?? null);
            setStatus("success");
        } catch (err) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Failed to fetch TMDB movies");
        }
    };

    // TMDB Upcoming Movies Loader
    const loadUpcomingMovies = async () => {
        setUpcomingStatus("loading");
        setUpcomingError(null);
        try {
            const res = await fetch(`/api/tmdb/discover?lang=${upcomingLanguage}&page=${upcomingPage}&type=upcoming`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || "Failed to fetch upcoming TMDB movies");
            }
            setUpcomingMovies(data.items || []);
            setUpcomingTotalPages(data.totalPages ?? null);
            setUpcomingTotalResults(data.totalResults ?? null);
            setUpcomingStatus("success");
        } catch (err) {
            setUpcomingStatus("error");
            setUpcomingError(err instanceof Error ? err.message : "Failed to fetch upcoming TMDB movies");
        }
    };

    // Add Movie to Website via Backend API
    const handleAddToSite = async (movie: TmdbMovie) => {
        const key = String(movie.tmdbId ?? movie.name);
        setInsertState((prev) => ({ ...prev, [key]: "saving" }));
        setInsertError((prev) => ({ ...prev, [key]: "" }));

        const runtimeValue =
            movie.runtimeMinutes && !Number.isNaN(Number(movie.runtimeMinutes))
                ? Number(movie.runtimeMinutes)
                : 120;

        try {
            await apiFetch("/movies", {
                method: "POST",
                body: JSON.stringify({
                    name: movie.name,
                    description: movie.description,
                    genre: movie.genre?.length ? movie.genre : ["Upcoming"],
                    imageUrl: movie.imageUrl,
                    language: movie.language,
                    runtimeMinutes: runtimeValue,
                    rating: movie.rating ?? undefined,
                    releaseDate: movie.releaseDate ?? undefined,
                }),
            });
            setInsertState((prev) => ({ ...prev, [key]: "success" }));
            // Refresh DB collection in background
            loadDbMovies();
        } catch (err) {
            setInsertState((prev) => ({ ...prev, [key]: "error" }));
            setInsertError((prev) => ({
                ...prev,
                [key]: err instanceof Error ? err.message : "Failed to add movie",
            }));
        }
    };

    // JSON Import Form Submit
    const handleJsonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setJsonError(null);
        setJsonResult(null);

        let parsed: Record<string, unknown> | Record<string, unknown>[];
        try {
            parsed = JSON.parse(jsonText);
        } catch {
            setJsonStatus("error");
            setJsonError("Invalid JSON format. Please verify syntax.");
            return;
        }

        const items = Array.isArray(parsed) ? parsed : [parsed];
        const invalidIndex = items.findIndex((item) =>
            REQUIRED_FIELDS.some((field) => !(field in item))
        );

        if (invalidIndex !== -1) {
            const missing = REQUIRED_FIELDS.filter((field) => !(field in items[invalidIndex]));
            setJsonStatus("error");
            setJsonError(`Missing required fields in item ${invalidIndex + 1}: ${missing.join(", ")}`);
            return;
        }

        const normalizePayload = (raw: Record<string, unknown>) => {
            const genre = raw.genre;
            const normalizedGenre = Array.isArray(genre)
                ? genre
                : typeof genre === "string"
                    ? genre.split(",").map((item) => item.trim()).filter(Boolean)
                    : genre;

            return {
                ...raw,
                genre: normalizedGenre,
                runtimeMinutes: raw.runtimeMinutes === undefined ? raw.runtimeMinutes : Number(raw.runtimeMinutes),
                rating: raw.rating === undefined ? raw.rating : Number(raw.rating),
            };
        };

        const payload = Array.isArray(parsed)
            ? items.map(normalizePayload)
            : normalizePayload(parsed);

        try {
            setJsonStatus("saving");
            const data = await apiFetch("/movies", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            setJsonResult(data ?? null);
            setJsonStatus("success");
            setJsonText("");
            loadDbMovies();
        } catch (err) {
            setJsonStatus("error");
            setJsonError(err instanceof Error ? err.message : "Failed to insert movie");
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
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                        <Film size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 style={{ color: "var(--admin-text)" }} className="text-lg font-black m-0">
                                Movie Catalog Manager
                            </h2>
                            <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-black text-indigo-500 uppercase tracking-wider">
                                Live Database & TMDB v3
                            </span>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-semibold m-0">
                            Manage database movie records, delete obsolete titles directly from MongoDB, or add new movies from TMDB.
                        </p>
                    </div>
                </div>

                {/* Tab Switchers */}
                <div
                    style={{ background: "var(--admin-soft)", border: "1px solid var(--admin-border)", borderRadius: 14 }}
                    className="p-1 flex flex-wrap items-center gap-1"
                >
                    <button
                        onClick={() => setActiveTab("database")}
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "database"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <Database size={15} />
                        <span>Database Movies ({dbMovies.length})</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("tmdb");
                            if (movies.length === 0 && status === "idle") {
                                loadTmdbMovies();
                            }
                        }}
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "tmdb"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <Sparkles size={15} />
                        <span>TMDB Trending</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("upcoming");
                            if (upcomingMovies.length === 0 && upcomingStatus === "idle") {
                                loadUpcomingMovies();
                            }
                        }}
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "upcoming"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <Rocket size={15} />
                        <span>Upcoming Releases</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("json")}
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${activeTab === "json"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                    >
                        <FileCode size={15} />
                        <span>Manual JSON Import</span>
                    </button>
                </div>
            </div>

            {/* TAB 1: Database Movies (Manage & Delete Movies) */}
            {activeTab === "database" && (
                <div className="space-y-6">
                    {/* Banners */}
                    {deleteSuccessMsg && (
                        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-black text-emerald-500 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                <span>{deleteSuccessMsg}</span>
                            </div>
                            <button
                                onClick={() => setDeleteSuccessMsg(null)}
                                className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
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
                            <button
                                onClick={() => setDeleteErrorMsg(null)}
                                className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Refresh Bar */}
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 16,
                        }}
                        className="px-5 py-3 flex items-center justify-between text-xs font-semibold"
                    >
                        <span style={{ color: "var(--admin-text-secondary)" }}>
                            Total <strong>{dbMovies.length}</strong> movies currently stored in MongoDB.
                        </span>
                        <button
                            type="button"
                            onClick={loadDbMovies}
                            disabled={dbStatus === "loading"}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 transition"
                        >
                            {dbStatus === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                            <span>Refresh DB Movies</span>
                        </button>
                    </div>

                    {/* Movie List Grid */}
                    {dbStatus === "loading" && dbMovies.length === 0 ? (
                        <div
                            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                            className="p-12 text-center"
                        >
                            <Loader2 className="mx-auto text-indigo-500 animate-spin" size={32} />
                            <p style={{ color: "var(--admin-text-secondary)" }} className="mt-3 text-xs font-bold">
                                Loading movies from database...
                            </p>
                        </div>
                    ) : dbMovies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dbMovies.map((movie) => {
                                const isDeleting = deletingId === movie._id;
                                const isUpcoming = movie.releaseDate
                                    ? new Date(movie.releaseDate).getTime() > Date.now()
                                    : false;

                                return (
                                    <div
                                        key={movie._id}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            borderRadius: 20,
                                        }}
                                        className="overflow-hidden shadow-lg flex flex-col justify-between transition hover:border-indigo-500/40 relative group"
                                    >
                                        <div>
                                            {/* Poster Image */}
                                            <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                                                {movie.imageUrl ? (
                                                    <img
                                                        src={movie.imageUrl}
                                                        alt={movie.name}
                                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="grid h-full place-items-center text-slate-500 text-xs font-bold">
                                                        No Poster Image
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase text-indigo-400 border border-indigo-500/20">
                                                    {movie.language || "EN"}
                                                </div>
                                                {isUpcoming ? (
                                                    <div className="absolute top-3 right-3 rounded-full bg-amber-500 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-slate-950 shadow-md">
                                                        UPCOMING
                                                    </div>
                                                ) : (
                                                    <div className="absolute top-3 right-3 rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-white shadow-md">
                                                        RELEASED
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="p-5 space-y-3">
                                                <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black leading-tight m-0">
                                                    {movie.name}
                                                </h3>

                                                <p
                                                    style={{ color: "var(--admin-text-secondary)" }}
                                                    className="text-xs font-semibold leading-relaxed m-0 line-clamp-2"
                                                >
                                                    {movie.description}
                                                </p>

                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {movie.genre?.map((g) => (
                                                        <span
                                                            key={g}
                                                            className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-black text-indigo-500"
                                                        >
                                                            {g}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={13} /> {movie.runtimeMinutes ? `${movie.runtimeMinutes} mins` : "120 mins"}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Star size={12} className="text-amber-400 fill-amber-400" />
                                                        {movie.rating ?? "8.0"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button: Delete from DB with In-Card Confirmation */}
                                        <div className="p-5 pt-0">
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget({ id: movie._id, name: movie.name })}
                                                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition cursor-pointer shadow-md bg-rose-600 hover:bg-rose-700 text-white active:scale-95"
                                            >
                                                <Trash2 size={16} /> Delete Movie from DB
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                            className="p-12 text-center space-y-3"
                        >
                            <Database className="mx-auto text-indigo-500" size={32} />
                            <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                No Movies Found in Database
                            </h3>
                            <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0 max-w-md mx-auto">
                                Switch to the "TMDB Trending" or "Upcoming Releases" tabs above to fetch and add movies to your website catalog.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: TMDB Trending Movies Explorer */}
            {activeTab === "tmdb" && (
                <div className="space-y-6">
                    {/* Controls Bar */}
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 20,
                        }}
                        className="p-5 shadow-lg flex flex-wrap items-center justify-between gap-4"
                    >
                        {/* Language Filter */}
                        <div className="flex items-center gap-2">
                            <Globe size={16} className="text-indigo-500 shrink-0" />
                            <span style={{ color: "var(--admin-text)" }} className="text-xs font-bold">
                                Language / Industry:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {LANGUAGE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setLanguage(opt.value)}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${language === opt.value
                                            ? "bg-indigo-600 text-white shadow-xs"
                                            : "border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pagination & Load Action */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold">
                                    Page:
                                </span>
                                <input
                                    type="number"
                                    min={1}
                                    value={page}
                                    onChange={(e) => setPage(Math.max(1, Number(e.target.value || 1)))}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-16 rounded-xl px-2.5 py-1.5 text-xs font-mono text-center outline-none focus:border-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 text-slate-400 hover:text-indigo-500 cursor-pointer"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 text-slate-400 hover:text-indigo-500 cursor-pointer"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={loadTmdbMovies}
                                disabled={status === "loading"}
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                            >
                                <Search size={15} />
                                <span>{status === "loading" ? "Fetching TMDB..." : "Load Trending Movies"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Status Banners */}
                    {error && (
                        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-black text-rose-500 flex items-center gap-2">
                            <AlertTriangle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {(totalPages || totalResults) && (
                        <div
                            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 14 }}
                            className="px-4 py-2.5 text-xs font-bold text-slate-400 flex items-center justify-between"
                        >
                            <span>
                                Found <strong>{totalResults?.toLocaleString()}</strong> total movies from TMDB API
                            </span>
                            <span>
                                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                            </span>
                        </div>
                    )}

                    {/* Movies Cards Grid */}
                    {movies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {movies.map((movie) => {
                                const key = String(movie.tmdbId ?? movie.name);
                                const curState = insertState[key] || "idle";
                                const curErr = insertError[key] || "";

                                return (
                                    <div
                                        key={key}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            borderRadius: 20,
                                        }}
                                        className="overflow-hidden shadow-lg flex flex-col justify-between transition hover:border-indigo-500/40"
                                    >
                                        {/* Poster Header */}
                                        <div>
                                            <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                                                {movie.imageUrl ? (
                                                    <img
                                                        src={movie.imageUrl}
                                                        alt={movie.name}
                                                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="grid h-full place-items-center text-slate-500 text-xs font-bold">
                                                        No Poster Image
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase text-indigo-400 border border-indigo-500/20">
                                                    {movie.language}
                                                </div>
                                                {movie.rating && (
                                                    <div className="absolute top-3 right-3 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-slate-950 flex items-center gap-1">
                                                        <Star size={11} className="fill-slate-950" />
                                                        <span>{movie.rating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content details */}
                                            <div className="p-5 space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black leading-tight m-0">
                                                        {movie.name}
                                                    </h3>
                                                </div>

                                                <p
                                                    style={{ color: "var(--admin-text-secondary)" }}
                                                    className="text-xs font-semibold leading-relaxed m-0 line-clamp-3"
                                                >
                                                    {movie.description}
                                                </p>

                                                {/* Genres */}
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {movie.genre?.map((g) => (
                                                        <span
                                                            key={g}
                                                            className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-black text-indigo-500"
                                                        >
                                                            {g}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={13} /> {movie.runtimeMinutes ? `${movie.runtimeMinutes} mins` : "120 mins"}
                                                    </span>
                                                    <span>{movie.releaseDate || "TBA"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="p-5 pt-0 space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => handleAddToSite(movie)}
                                                disabled={curState === "saving" || curState === "success"}
                                                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition cursor-pointer shadow-md ${curState === "success"
                                                    ? "bg-emerald-600 text-white"
                                                    : curState === "saving"
                                                        ? "bg-indigo-500/50 text-white cursor-wait"
                                                        : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95"
                                                    }`}
                                            >
                                                {curState === "success" ? (
                                                    <>
                                                        <Check size={16} /> Added to Movie Collection
                                                    </>
                                                ) : curState === "saving" ? (
                                                    "Adding to Collection..."
                                                ) : (
                                                    <>
                                                        <PlusCircle size={16} /> Add to Movie Collection
                                                    </>
                                                )}
                                            </button>

                                            {curErr && (
                                                <p className="text-[11px] font-bold text-rose-500 m-0 text-center">{curErr}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        status === "idle" && (
                            <div
                                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                                className="p-12 text-center space-y-3"
                            >
                                <Sparkles className="mx-auto text-indigo-500 animate-bounce" size={32} />
                                <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                    Ready to Load TMDB Catalog
                                </h3>
                                <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0 max-w-md mx-auto">
                                    Select your preferred language filter and click "Load Trending Movies" to browse titles.
                                </p>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* TAB 3: TMDB Upcoming Movies Explorer */}
            {activeTab === "upcoming" && (
                <div className="space-y-6">
                    {/* Controls Bar for Upcoming Movies */}
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 20,
                        }}
                        className="p-5 shadow-lg flex flex-wrap items-center justify-between gap-4"
                    >
                        {/* Language / Industry Filter */}
                        <div className="flex items-center gap-2">
                            <Rocket size={18} className="text-amber-500 shrink-0" />
                            <span style={{ color: "var(--admin-text)" }} className="text-xs font-bold">
                                Upcoming Industry:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {LANGUAGE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setUpcomingLanguage(opt.value)}
                                        className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition cursor-pointer ${upcomingLanguage === opt.value
                                            ? "bg-amber-500 text-slate-950 shadow-xs font-black"
                                            : "border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pagination & Load Action */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold">
                                    Page:
                                </span>
                                <input
                                    type="number"
                                    min={1}
                                    value={upcomingPage}
                                    onChange={(e) => setUpcomingPage(Math.max(1, Number(e.target.value || 1)))}
                                    style={{
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        color: "var(--admin-text)",
                                    }}
                                    className="w-16 rounded-xl px-2.5 py-1.5 text-xs font-mono text-center outline-none focus:border-amber-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setUpcomingPage((p) => Math.max(1, p - 1))}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 text-slate-400 hover:text-amber-500 cursor-pointer"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUpcomingPage((p) => p + 1)}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 text-slate-400 hover:text-amber-500 cursor-pointer"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={loadUpcomingMovies}
                                disabled={upcomingStatus === "loading"}
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-95 disabled:opacity-50"
                            >
                                <Rocket size={15} />
                                <span>{upcomingStatus === "loading" ? "Fetching Upcoming..." : "Fetch Upcoming Movies"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Status Banners */}
                    {upcomingError && (
                        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-black text-rose-500 flex items-center gap-2">
                            <AlertTriangle size={18} />
                            <span>{upcomingError}</span>
                        </div>
                    )}

                    {(upcomingTotalPages || upcomingTotalResults) && (
                        <div
                            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 14 }}
                            className="px-4 py-2.5 text-xs font-bold text-slate-400 flex items-center justify-between"
                        >
                            <span>
                                Found <strong>{upcomingTotalResults?.toLocaleString()}</strong> upcoming movies from Hollywood & Bollywood
                            </span>
                            <span>
                                Page <strong>{upcomingPage}</strong> of <strong>{upcomingTotalPages}</strong>
                            </span>
                        </div>
                    )}

                    {/* Upcoming Movies Cards Grid */}
                    {upcomingMovies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingMovies.map((movie) => {
                                const key = String(movie.tmdbId ?? movie.name);
                                const curState = insertState[key] || "idle";
                                const curErr = insertError[key] || "";

                                return (
                                    <div
                                        key={key}
                                        style={{
                                            background: "var(--admin-surface)",
                                            border: "1px solid var(--admin-border)",
                                            borderRadius: 20,
                                        }}
                                        className="overflow-hidden shadow-lg flex flex-col justify-between transition hover:border-amber-500/40"
                                    >
                                        {/* Poster Header */}
                                        <div>
                                            <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                                                {movie.imageUrl ? (
                                                    <img
                                                        src={movie.imageUrl}
                                                        alt={movie.name}
                                                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="grid h-full place-items-center text-slate-500 text-xs font-bold">
                                                        No Poster Image
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3 rounded-full bg-amber-500 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase text-slate-950 flex items-center gap-1 shadow-md">
                                                    <Rocket size={11} /> UPCOMING ({movie.language})
                                                </div>
                                                {movie.rating && (
                                                    <div className="absolute top-3 right-3 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                                        <Star size={11} className="fill-amber-400" />
                                                        <span>{movie.rating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content details */}
                                            <div className="p-5 space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black leading-tight m-0">
                                                        {movie.name}
                                                    </h3>
                                                </div>

                                                <p
                                                    style={{ color: "var(--admin-text-secondary)" }}
                                                    className="text-xs font-semibold leading-relaxed m-0 line-clamp-3"
                                                >
                                                    {movie.description}
                                                </p>

                                                {/* Genres */}
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {movie.genre?.map((g) => (
                                                        <span
                                                            key={g}
                                                            className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-500"
                                                        >
                                                            {g}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Release Date & Runtime */}
                                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={13} /> {movie.runtimeMinutes ? `${movie.runtimeMinutes} mins` : "120 mins (Est.)"}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-bold text-amber-500">
                                                        <Calendar size={13} /> {movie.releaseDate ? `Releasing ${movie.releaseDate}` : "Coming Soon"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="p-5 pt-0 space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => handleAddToSite(movie)}
                                                disabled={curState === "saving" || curState === "success"}
                                                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition cursor-pointer shadow-md ${curState === "success"
                                                    ? "bg-emerald-600 text-white"
                                                    : curState === "saving"
                                                        ? "bg-amber-500/50 text-slate-950 cursor-wait"
                                                        : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black active:scale-95"
                                                    }`}
                                            >
                                                {curState === "success" ? (
                                                    <>
                                                        <Check size={16} /> Added to Movie Collection
                                                    </>
                                                ) : curState === "saving" ? (
                                                    "Adding to Collection..."
                                                ) : (
                                                    <>
                                                        <PlusCircle size={16} /> Add to Movie Collection
                                                    </>
                                                )}
                                            </button>

                                            {curErr && (
                                                <p className="text-[11px] font-bold text-rose-500 m-0 text-center">{curErr}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        upcomingStatus === "idle" && (
                            <div
                                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20 }}
                                className="p-12 text-center space-y-3"
                            >
                                <Rocket className="mx-auto text-amber-500 animate-bounce" size={32} />
                                <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                    Ready to Fetch Upcoming Movies
                                </h3>
                                <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0 max-w-md mx-auto">
                                    Select Hollywood (EN) or Bollywood (HI) and click "Fetch Upcoming Movies" to browse unreleased upcoming releases.
                                </p>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* TAB 4: Manual JSON Import */}
            {activeTab === "json" && (
                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 20,
                    }}
                    className="p-6 shadow-lg space-y-5"
                >
                    <div className="flex items-center gap-3">
                        <UploadCloud className="text-indigo-500" size={24} />
                        <div>
                            <h3 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                Bulk / Single Movie JSON Payload Import
                            </h3>
                            <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                Paste a custom movie JSON object or array of movie objects to push directly into database.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleJsonSubmit} className="space-y-4">
                        <div>
                            <label style={{ color: "var(--admin-text)" }} className="text-xs font-bold block mb-1">
                                Movie JSON Content
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
                                className="w-full rounded-2xl p-4 text-xs font-mono outline-none focus:border-indigo-500 leading-relaxed resize-none"
                            />
                        </div>

                        {jsonError && (
                            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-black text-rose-500 flex items-center gap-2">
                                <AlertTriangle size={18} />
                                <span>{jsonError}</span>
                            </div>
                        )}

                        {jsonStatus === "success" && (
                            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-black text-emerald-500 flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                <span>
                                    {Array.isArray(jsonResult)
                                        ? `Successfully inserted ${jsonResult.length} movie documents.`
                                        : `Movie inserted successfully!`}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setJsonText(SAMPLE_JSON);
                                    setJsonError(null);
                                    setJsonStatus("idle");
                                }}
                                className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                            >
                                Reset to Sample JSON
                            </button>

                            <button
                                type="submit"
                                disabled={jsonStatus === "saving"}
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                            >
                                <UploadCloud size={16} />
                                <span>{jsonStatus === "saving" ? "Inserting Movies..." : "Insert Movie to Database"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <AdminDeleteConfirmModal
                isOpen={!!deleteTarget}
                itemType="Movie"
                itemName={deleteTarget?.name || ""}
                isDeleting={deletingId === deleteTarget?.id}
                onConfirm={() => {
                    if (deleteTarget) {
                        handleDeleteMovie(deleteTarget.id, deleteTarget.name);
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
