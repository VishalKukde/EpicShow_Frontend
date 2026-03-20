"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { FormEvent } from "react";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--auth-page-bg)" }} />}>
            <LoginPageContent />
        </Suspense>
    );
}

function LoginPageContent() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
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
            return;
        }

        try {
            setError(null);
            setLoading(true);
            await login(trimmedEmail, password, rememberMe);

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
        <div className="relative min-h-screen overflow-hidden px-4 py-12">
            <div className="absolute inset-0" style={{ background: "var(--auth-page-bg)" }} />
            <div
                className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full blur-3xl opacity-70"
                style={{ background: "var(--auth-orb-1)" }}
            />
            <div
                className="pointer-events-none absolute right-[-6rem] top-1/4 h-80 w-80 rounded-full blur-3xl opacity-60"
                style={{ background: "var(--auth-orb-2)" }}
            />
            <div
                className="pointer-events-none absolute bottom-[-5rem] left-1/3 h-72 w-72 rounded-full blur-3xl opacity-55"
                style={{ background: "var(--auth-orb-3)" }}
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-35"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, var(--auth-grid-color) 1px, transparent 0)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center">
                {/* Card */}
                <div
                    className="relative w-full max-w-md rounded-[28px] border p-8 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-10"
                    style={{
                        background: "var(--auth-card-bg)",
                        borderColor: "var(--auth-card-border)",
                    }}
                >
                    <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/30" />
                    <div className="relative">
                        <h1 className="text-2xl font-semibold text-center mb-2" style={{ color: "var(--text-primary)" }}>
                            Sign in
                        </h1>
                        <p className="text-sm text-center mb-6" style={{ color: "var(--text-secondary)" }}>
                            Welcome back, please login to continue
                        </p>

                        {error && (
                            <p className="mb-4 rounded-lg border px-3 py-2 text-sm auth-error">
                                {error}
                            </p>
                        )}

                        <form className="space-y-4" onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                className="auth-input w-full px-4 py-3 rounded-lg border focus:outline-none"
                                onChange={e => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                className="auth-input w-full px-4 py-3 rounded-lg border focus:outline-none"
                                onChange={e => setPassword(e.target.value)}
                            />

                            <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded"
                                />
                                Remember me
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-primary-btn w-full cursor-pointer py-3 rounded-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
                            Don’t have an account?{" "}
                            <span
                                onClick={() => router.push("/register")}
                                className="auth-link font-medium cursor-pointer hover:underline"
                            >
                                Register
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
