"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/store/themeStore";
import { toast } from "@/lib/toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
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
      if (firstError) {
        toast.warning(firstError);
      }
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      toast.success("Account created successfully. Please sign in.");
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
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        dark ? "bg-zinc-950" : "bg-[#f7f8fa]"
      }`}
    >

      {/* Card */}
      <div
        className={`w-full max-w-md rounded-2xl backdrop-blur-lg border shadow-lg p-8 ${
          dark ? "bg-zinc-900/80 border-zinc-700" : "bg-white/70 border-gray-200"
        }`}
      >

        <h1 className={`text-2xl font-semibold text-center mb-2 ${dark ? "text-white" : "text-gray-800"}`}>
          Create account
        </h1>
        <p className={`text-sm text-center mb-6 ${dark ? "text-zinc-300" : "text-gray-500"}`}>
          Sign up to get started
        </p>

        {error && (
          <p className="text-sm text-red-500 text-center mb-4">
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
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              dark
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-zinc-600"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-gray-300"
            }`}
          />
          {fieldErrors.name && (
            <p className="-mt-2 text-xs text-red-600">{fieldErrors.name}</p>
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              dark
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-zinc-600"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-gray-300"
            }`}
          />
          {fieldErrors.email && (
            <p className="-mt-2 text-xs text-red-600">{fieldErrors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
            }}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              dark
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-zinc-600"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-gray-300"
            }`}
          />
          {fieldErrors.password && (
            <p className="-mt-2 text-xs text-red-600">{fieldErrors.password}</p>
          )}

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              dark
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-zinc-600"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-gray-300"
            }`}
          />
          {fieldErrors.confirmPassword && (
            <p className="-mt-2 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${
              dark
                ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className={`text-center mt-6 text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className={`font-medium cursor-pointer hover:underline ${dark ? "text-zinc-100" : "text-gray-800"}`}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
