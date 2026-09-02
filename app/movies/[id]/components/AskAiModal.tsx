"use client";

import { useEffect, useRef, useState } from "react";
import { BrainCircuit, X } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";

type MovieMeta = {
  cast?: string[];
  director?: string | null;
  writers?: string[];
  genres?: string[];
  runtime?: number | null;
  releaseDate?: string | null;
};

type AskAiModalProps = {
  open: boolean;
  movieTitle: string;
  releaseDate?: string;
  onClose: () => void;
};

const formatReleaseDate = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function AskAiModal({
  open,
  movieTitle,
  releaseDate,
  onClose,
}: AskAiModalProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [movieMeta, setMovieMeta] = useState<MovieMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrySeed, setRetrySeed] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const requestKeyRef = useRef<string>("");

  const loadingMessages = [
    "Analyzing your request...",
    "Finding interesting insights...",
    "Connecting the dots...",
    "Preparing your response...",
    "Almost there...",
  ];

  const isBusyError = (value?: string | null) =>
    !!value && /rate limit|429|too many requests|try again in a moment|server busy|temporar/i.test(value);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!loading) {
      setLoadingMessageIndex(0);
      return;
    }

    const messageTimer = window.setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);

    return () => window.clearInterval(messageTimer);
  }, [loading, loadingMessages.length]);

  useEffect(() => {
    if (!summary) {
      setDisplayText("");
      return;
    }

    setDisplayText("");
    let currentIndex = 0;
    const timer = window.setInterval(() => {
      currentIndex += 1;
      const nextValue = summary.slice(0, currentIndex);
      setDisplayText(nextValue);

      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

      if (currentIndex >= summary.length) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [summary]);

  useEffect(() => {
    if (!open) {
      requestKeyRef.current = "";
      return;
    }

    const requestKey = `${movieTitle}|${releaseDate ?? ""}|${retrySeed}`;
    if (requestKeyRef.current === requestKey) {
      return;
    }

    requestKeyRef.current = requestKey;
    let active = true;

    const loadSummary = async () => {
      if (!movieTitle.trim()) {
        setError("Movie title unavailable.");
        setSummary(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setSummary(null);
      setMovieMeta(null);

      try {
        const response = await apiFetch("/movies/ask-ai", {
          method: "POST",
          publicRequest: true,
          body: JSON.stringify({ movieTitle, releaseDate }),
        });

        if (!active) return;

        const generated = response?.summary || null;
        const meta = response?.meta || null;

        if (generated) {
          setMovieMeta(meta);
          setSummary(generated);
        } else {
          setError("No AI summary was returned for this movie.");
        }
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : "Unable to load AI movie details. Please try again.";

        const showBusyMessage = isBusyError(message) || isBusyError(String((err as { status?: number } | null)?.status ?? ""));

        setError(
          showBusyMessage
            ? "Server busy, please wait a moment before trying again"
            : "Unable to load AI movie details. Please try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadSummary();

    return () => {
      active = false;
    };
  }, [open, movieTitle, releaseDate, retrySeed]);

  const renderSummary = (text: string) => {
    const lines = text
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.map((line, index) => {
      const headingMatch = line.match(/^\*\*(.+?)\*\*:?$/);
      if (headingMatch) {
        return (
          <p
            key={`${line}-${index}`}
            className="mt-3 text-base font-semibold text-indigo-600 dark:text-indigo-300"
          >
            {headingMatch[1]}
          </p>
        );
      }

      const bulletMatch = line.match(/^[-•]\s*(.+)$/);
      if (bulletMatch) {
        return (
          <li
            key={`${line}-${index}`}
            className="ml-5 list-disc text-sm leading-7"
          >
            {bulletMatch[1]}
          </li>
        );
      }

      return (
        <p key={`${line}-${index}`} className="text-sm leading-7">
          {line.replace(/\*\*(.*?)\*\*/g, "$1")}
        </p>
      );
    });
  };

  if (!open) return null;

  const formattedReleaseDate = formatReleaseDate(releaseDate || movieMeta?.releaseDate);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-3 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ask AI"
    >
      <div
        className={`relative h-[70vh] w-[70vw] max-w-3xl overflow-hidden rounded-2xl border shadow-2xl ${
          dark ? "border-white/10 bg-slate-950 text-white" : "border-gray-200 bg-white text-gray-900"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          <div
            className={`flex items-center justify-between border-b px-4 py-3 sm:px-5 ${
              dark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <div className="min-w-0">
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${
                  dark ? "text-indigo-200/80" : "text-indigo-500"
                }`}
              >
                Ask AI
              </p>
              <h2 className="truncate text-lg font-semibold sm:text-xl">{movieTitle}</h2>
              {formattedReleaseDate && (
                <p className={`mt-1 text-xs ${dark ? "text-zinc-300" : "text-slate-500"}`}>
                  Released {formattedReleaseDate}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border text-xs transition ${
                dark
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            {loading && (
              <div className="flex min-h-[220px] items-start justify-start">
                <div className="flex items-center gap-3 text-left">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 shadow-[0_0_24px_rgba(99,102,241,0.18)]">
                    <BrainCircuit size={20} className="text-indigo-600 dark:text-indigo-300" />
                    <span className="absolute inset-0 rounded-full border border-indigo-400/30 animate-spin border-t-transparent dark:border-indigo-300/30" />
                  </div>

                  <div className="min-w-0 text-left">
                    <p
                      key={loadingMessageIndex}
                      className="text-sm font-semibold text-transparent bg-[linear-gradient(90deg,#4f46e5_0%,#c084fc_32%,#f472b6_62%,#4f46e5_100%)] bg-[length:220%_100%] bg-clip-text animate-pulse"
                    >
                      {loadingMessages[loadingMessageIndex]}
                    </p>
                    <p className={`mt-1 text-xs ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                      {loadingMessageIndex === 0 && "Gathering movie context"}
                      {loadingMessageIndex === 1 && "Spotting the key highlights"}
                      {loadingMessageIndex === 2 && "Linking story and themes"}
                      {loadingMessageIndex === 3 && "Shaping the final answer"}
                      {loadingMessageIndex === 4 && "Finalising the summary"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="space-y-3">
                <p className={dark ? "text-white/80" : "text-gray-700"}>{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSummary(null);
                    setRetrySeed((prev) => prev + 1);
                  }}
                  className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium ${
                    dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && summary && (
              <div className="space-y-4">
                <div
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${
                    dark
                      ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-200"
                      : "border-indigo-200 bg-indigo-50 text-indigo-700"
                  }`}
                >
                  Gemini AI
                </div>

                {(movieMeta?.cast?.length || movieMeta?.director || movieMeta?.genres?.length || movieMeta?.runtime) && (
                  <div className="flex flex-wrap gap-2">
                    {movieMeta?.cast?.slice(0, 3).map((person) => (
                      <span
                        key={person}
                        className={`rounded-full border px-2.5 py-1 text-[11px] ${
                          dark ? "border-white/10 bg-white/5 text-zinc-200" : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {person}
                      </span>
                    ))}
                    {movieMeta?.director && (
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] ${
                          dark ? "border-white/10 bg-white/5 text-zinc-200" : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        Dir: {movieMeta.director}
                      </span>
                    )}
                    {movieMeta?.genres?.slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className={`rounded-full border px-2.5 py-1 text-[11px] ${
                          dark ? "border-white/10 bg-white/5 text-zinc-200" : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {genre}
                      </span>
                    ))}
                    {movieMeta?.runtime && (
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] ${
                          dark ? "border-white/10 bg-white/5 text-zinc-200" : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {movieMeta.runtime} min
                      </span>
                    )}
                  </div>
                )}

                <div className={`${dark ? "text-zinc-200" : "text-slate-700"}`}>
                  {displayText ? (
                    <ul className="min-h-[200px]">{renderSummary(displayText)}</ul>
                  ) : (
                    <p className="min-h-[200px] text-sm">Loading summary...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
