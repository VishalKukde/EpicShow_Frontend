"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { Sparkles, X, ChevronDown } from "lucide-react";
import { Release } from "@/app/utils/latestRelease";

type Props = {
  open: boolean;
  onClose: () => void;
  releases: Release[];
};

const LatestReleaseModal = ({ open, onClose, releases }: Props) => {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [showPrevious, setShowPrevious] = useState(false);

  // ESC close
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onClose]);



  if (!open || typeof window === "undefined") return null;

  const latest = releases.find((r) => r.status === "latest");
  const upcoming = releases.filter((r) => r.status === "upcoming");
  const planned = releases.filter((r) => r.status === "planned");
  const previous = releases.filter((r) => r.status === "previous");

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        onClick={(event) => event.stopPropagation()}
        className={`w-[60vw] h-[85vh] max-w-[900px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${dark
            ? "bg-zinc-950 border-zinc-700 text-zinc-100"
            : "bg-white border-slate-200 text-slate-900"
          }`}
      >
        {/* HEADER */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-slate-50"
            }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase opacity-80">
              <Sparkles className="h-4 w-4" />
              Product Roadmap
            </div>

            {latest && (
              <>
                <div className="flex items-center gap-2 mt-2">
                  {/* 🟢 BLINKING DOT */}
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 live-dot" />
                  <p className="text-sm font-semibold">
                    Live • v{latest.version}
                  </p>
                </div>

                <p className="text-xs opacity-60">
                  Released {latest.releaseDate}
                </p>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 🔥 LATEST */}
          {latest && (
            <Section
              title="Live Now"
              subtitle={`Version ${latest.version} • ${latest.releaseDate}`}
              dark={dark}
              highlight
            >
              {latest.features.map((f) => (
                <FeatureItem key={f.title} f={f} dark={dark} />
              ))}
            </Section>
          )}

          {/* 🟡 UPCOMING */}
          {upcoming.map((rel) => (
            <Section
              key={rel.version}
              title={`Coming Next`}
              subtitle={`v${rel.version} • Expected ${rel.releaseDate}`}
              dark={dark}
            >
              {rel.features.map((f) => (
                <FeatureItem key={f.title} f={f} dark={dark} />
              ))}
            </Section>
          ))}

          {/* 🔵 PLANNED */}
          {planned.map((rel) => (
            <Section
              key={rel.version}
              title={`Future Roadmap`}
              subtitle={`v${rel.version} • ${rel.releaseDate}`}
              dark={dark}
            >
              {rel.features.map((f) => (
                <FeatureItem key={f.title} f={f} dark={dark} />
              ))}
            </Section>
          ))}

          {/* 📦 PREVIOUS */}
          {previous.length > 0 && (
            <div>
              <button
                onClick={() => setShowPrevious(!showPrevious)}
                className="flex items-center gap-2 text-sm font-medium opacity-80 hover:opacity-100"
              >
                <ChevronDown
                  className={`h-4 w-4 transition ${showPrevious ? "rotate-180" : ""
                    }`}
                />
                Previous Releases
              </button>

              {showPrevious && (
                <div className="mt-4 space-y-5">
                  {previous.map((rel) => (
                    <div key={rel.version}>
                      <p className="text-xs font-medium opacity-60 mb-2">
                        v{rel.version} • {rel.releaseDate}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-2">
                        {rel.features.map((f) => (
                          <FeatureItem key={f.title} f={f} dark={dark} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const Section = ({ title, subtitle, children, dark, highlight }: any) => (
  <div
    className={`rounded-xl p-3 ${highlight
        ? dark
          ? "bg-emerald-500/5 border border-emerald-500/20"
          : "bg-emerald-50 border border-emerald-200"
        : ""
      }`}
  >
    <p className="text-sm font-semibold">{title}</p>
    {subtitle && <p className="text-xs opacity-60 mb-2">{subtitle}</p>}
    <div className="grid sm:grid-cols-3 gap-2">{children}</div>
  </div>
);
const FeatureItem = ({ f, dark }: any) => {
  const chip =
    f.status === "live"
      ? dark
        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500"
        : "bg-emerald-100 text-emerald-700"
      : f.status === "upcoming"
        ? dark
          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500"
          : "bg-yellow-100 text-yellow-700"
        : dark
          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500"
          : "bg-indigo-100 text-indigo-700";

  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-3 py-2 transition hover:scale-[1.01] ${dark
          ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
          : "border-slate-200 bg-slate-50 hover:border-indigo-200 hover:bg-white"
        }`}
    >
      <span className="text-sm font-medium truncate">{f.title}</span>
      <span className={`text-[8px] px-2 py-1 rounded-full ${chip}`}>
        {f.status.toUpperCase()}
      </span>
    </div>
  );
};

export default LatestReleaseModal;