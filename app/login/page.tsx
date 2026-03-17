"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "@/lib/toast";

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
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: "var(--auth-page-bg)" }}
        >

            {/* Card */}
            <div
                className="w-full max-w-md rounded-2xl backdrop-blur-lg border shadow-lg p-8"
                style={{
                    background: "var(--auth-card-bg)",
                    borderColor: "var(--auth-card-border)",
                }}
            >

                <h1 className="text-2xl font-semibold text-center mb-2" style={{ color: "var(--text-primary)" }}>
                    Sign in
                </h1>
                <p className="text-sm text-center mb-6" style={{ color: "var(--text-secondary)" }}>
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
    );
}
