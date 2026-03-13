"use client";

import { useMemo, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";
import { useThemeStore } from "@/store/themeStore";

const SAMPLE_JSON = `{
  "name": "Interstellar",
  "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  "genre": ["Sci-Fi", "Adventure"],
  "imageUrl": "https://example.com/posters/interstellar.jpg",
  "language": "EN",
  "runtimeMinutes": 169
}`;

const REQUIRED_FIELDS = [
  "name",
  "description",
  "genre",
  "imageUrl",
  "language",
  "runtimeMinutes",
];

export default function MovieImportPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [jsonText, setJsonText] = useState(SAMPLE_JSON);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [result, setResult] = useState<Record<string, unknown> | Record<string, unknown>[] | null>(null);

  const helperText = useMemo(
    () =>
      "Paste a single movie JSON object. Required fields: " +
      REQUIRED_FIELDS.join(", ") +
      ". Rating is optional and will be auto-generated. You can also paste an array of movies.",
    []
  );

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
      runtimeMinutes:
        raw.runtimeMinutes === undefined ? raw.runtimeMinutes : Number(raw.runtimeMinutes),
      rating: raw.rating === undefined ? raw.rating : Number(raw.rating),
    };
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    let parsed: Record<string, unknown> | Record<string, unknown>[];
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setStatus("error");
      setError("Invalid JSON. Please check the syntax and try again.");
      return;
    }

    const items = Array.isArray(parsed) ? parsed : [parsed];
    const invalidIndex = items.findIndex((item) =>
      REQUIRED_FIELDS.some((field) => !(field in item))
    );

    if (invalidIndex !== -1) {
      const missing = REQUIRED_FIELDS.filter((field) => !(field in items[invalidIndex]));
      setStatus("error");
      setError(`Missing required fields in item ${invalidIndex + 1}: ${missing.join(", ")}`);
      return;
    }

    const payload = Array.isArray(parsed)
      ? items.map(normalizePayload)
      : normalizePayload(parsed);

    try {
      setStatus("saving");
      const data = await apiFetch("/movies", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setResult(data ?? null);
      setStatus("success");
      setJsonText("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to insert movie");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div
          className={`mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-3xl border p-6 shadow-xl sm:p-8 ${
            dark
              ? "border-slate-800 bg-slate-950 text-slate-100"
              : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          <div className="space-y-2 text-center">
            <p
              className={`text-xs font-semibold uppercase tracking-[0.24em] ${
                dark ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              Movie Import
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Insert Movie JSON</h1>
            <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
              {helperText}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium">Movie JSON</label>
            <textarea
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              rows={12}
              className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                dark
                  ? "border-slate-800 bg-slate-950 text-slate-100 focus:border-indigo-500"
                  : "border-slate-200 bg-slate-50 text-slate-800 focus:border-indigo-500"
              }`}
            />

            {error && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  dark
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {error}
              </div>
            )}

            {status === "success" && result && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  dark
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {Array.isArray(result)
                  ? `Inserted ${result.length} movies successfully.`
                  : `Movie inserted successfully. ID: ${String(result._id ?? "N/A")}`}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setJsonText(SAMPLE_JSON);
                  setError(null);
                  setStatus("idle");
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  dark
                    ? "border-slate-700 text-slate-200 hover:border-slate-500"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                Load Sample
              </button>

              <button
                type="submit"
                disabled={status === "saving"}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  status === "saving"
                    ? dark
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-200 text-slate-500"
                    : dark
                      ? "bg-indigo-500 text-white hover:bg-indigo-400"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {status === "saving" ? "Saving..." : "Insert Movie"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
