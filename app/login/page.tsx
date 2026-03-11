"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import { useThemeStore } from "@/store/themeStore";
import { toast } from "@/lib/toast";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f7f8fa]" />}>
            <LoginPageContent />
        </Suspense>
    );
}

function LoginPageContent() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = useThemeStore((state) => state.mode);
    const dark = mode === "dark";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const redirectPath = searchParams.get("redirect");

    async function handleLogin(event?: FormEvent<HTMLFormElement>) {
        event?.preventDefault();
        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            const message = "Please enter both email and password.";
            setError(message);
            toast.warning(message);
            return;
        }

        try {
            setError(null);
            setLoading(true);
            await login(trimmedEmail, password, rememberMe);
            toast.success("Signed in successfully.");

            if (redirectPath) {
                router.replace(redirectPath);
            } else {
                router.replace("/"); // default fallback
            }
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Login failed. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div
            className={`min-h-screen flex items-center justify-center px-4 ${
                dark
                    ? "bg-zinc-950"
                    : "bg-[#f7f8fa]"
            }`}
        >

            {/* Card */}
            <div
                className={`w-full max-w-md rounded-2xl backdrop-blur-lg border shadow-lg p-8 ${
                    dark
                        ? "bg-zinc-900/80 border-zinc-700"
                        : "bg-white/70 border-gray-200"
                }`}
            >

                <h1 className={`text-2xl font-semibold text-center mb-2 ${dark ? "text-white" : "text-gray-800"}`}>
                    Sign in
                </h1>
                <p className={`text-sm text-center mb-6 ${dark ? "text-zinc-300" : "text-gray-500"}`}>
                    Welcome back, please login to continue
                </p>

                {error && (
                    <p className="mb-4 rounded-lg border border-red-300 bg-red-100/70 px-3 py-2 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                            dark
                                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-zinc-600"
                                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-gray-300"
                        }`}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                            dark
                                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-zinc-600"
                                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-gray-300"
                        }`}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <label className={`flex cursor-pointer items-center gap-2 text-sm ${dark ? "text-zinc-300" : "text-gray-600"}`}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className={`h-4 w-4 rounded ${dark ? "border-zinc-600 bg-zinc-800 text-zinc-100 focus:ring-zinc-500" : "border-gray-300 text-gray-900 focus:ring-gray-400"}`}
                        />
                        Remember me
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full cursor-pointer py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${
                            dark
                                ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                                : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className={`text-center mt-6 text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
                    Don’t have an account?{" "}
                    <span
                        onClick={() => router.push("/register")}
                        className={`font-medium cursor-pointer hover:underline ${dark ? "text-zinc-100" : "text-gray-800"}`}
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}
