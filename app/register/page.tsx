"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const nextErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      nextErrors.name = "Name is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(nextErrors);
    const firstError = Object.values(nextErrors).find(Boolean);
    return {
      valid: Object.keys(nextErrors).length === 0,
      firstError,
    };
  };

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const { valid, firstError } = validateForm();
    if (!valid) {
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      router.push("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
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
              Create account
            </h1>
            <p className="text-sm text-center mb-6" style={{ color: "var(--text-secondary)" }}>
              Sign up to get started
            </p>

            {error && (
              <p className="mb-4 rounded-lg border px-3 py-2 text-sm text-center auth-error">
                {error}
              </p>
            )}

            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                placeholder="Full name"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className="auth-input w-full px-4 py-3 rounded-lg border focus:outline-none"
              />
              {fieldErrors.name && (
                <p className="-mt-2 text-xs auth-error-text">{fieldErrors.name}</p>
              )}

              <input
                placeholder="Email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className="auth-input w-full px-4 py-3 rounded-lg border focus:outline-none"
              />
              {fieldErrors.email && (
                <p className="-mt-2 text-xs auth-error-text">{fieldErrors.email}</p>
              )}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className="auth-input w-full px-4 py-3 rounded-lg border focus:outline-none"
              />
              {fieldErrors.password && (
                <p className="-mt-2 text-xs auth-error-text">{fieldErrors.password}</p>
              )}

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                className="auth-input w-full px-4 py-3 rounded-lg border focus:outline-none"
              />
              {fieldErrors.confirmPassword && (
                <p className="-mt-2 text-xs auth-error-text">{fieldErrors.confirmPassword}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="auth-primary-btn w-full cursor-pointer py-3 rounded-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="auth-link font-medium cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
