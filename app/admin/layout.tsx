"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ShieldAlert, Home, Lock } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const mode = useThemeStore((s) => s.mode);

    if (loading) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center select-none ${mode === "dark" ? "bg-zinc-950 text-zinc-100" : "bg-slate-50 text-slate-900"
                    }`}
            >
                <div className="flex items-center gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-6 py-4 backdrop-blur-xl shadow-lg">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                    <span className="text-sm font-extrabold tracking-wide">Verifying Access Permissions...</span>
                </div>
            </div>
        );
    }

    const isNotAdmin = !user || user.role !== "admin";

    if (isNotAdmin) {
        return (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 select-none backdrop-blur-md transition-colors duration-300 ${mode === "dark"
                    ? "bg-zinc-950/85 text-zinc-100 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-950/40 via-zinc-950 to-zinc-950"
                    : "bg-slate-950/60 text-slate-900 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-50/60 via-slate-50 to-amber-50/40"
                    }`}
            >
                {/* Background Ambient Glows */}
                <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-rose-500/15 blur-[140px]" />
                <div className="pointer-events-none absolute bottom-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-indigo-600/15 blur-[130px]" />

                {/* Access Denied Modal Card */}
                <div
                    className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-8 text-center shadow-2xl backdrop-blur-2xl transition-all ${mode === "dark"
                        ? "border-rose-500/30 bg-zinc-900/95 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-zinc-100"
                        : "border-rose-200 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.15)] text-slate-900"
                        }`}
                >
                    {/* Top Icon */}
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                        <div className="absolute inset-0 rounded-2xl bg-rose-500/20 animate-ping" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-500 shadow-md">
                            <ShieldAlert className="h-8 w-8" />
                        </div>
                    </div>

                    <div className="mt-5 space-y-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-rose-500">
                            <Lock className="h-3 w-3" /> Restricted Area
                        </span>

                        <h1 className={`text-2xl font-black tracking-tight ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                            Access Denied
                        </h1>

                        <p className={`text-xs leading-relaxed max-w-xs mx-auto font-medium ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
                            You do not have administrative privileges to view the admin dashboard. Please return to the home page.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-7">
                        <button
                            onClick={() => router.push("/")}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600  hover:bg-indigo-500 px-6 py-3 text-xs font-black text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                            <Home className="h-4 w-4" />
                            <span>Back to Home Page</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
