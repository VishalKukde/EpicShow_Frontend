"use client";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { Sparkles, X } from "lucide-react";
import { Release } from "@/app/utils/latestRelease";

type Props = {
  open: boolean;
  onClose: () => void;
  releases: Release[];
};

const LatestReleaseModal = ({ open, onClose, releases }: Props) => {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "previous">("live");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const tabs = useMemo(
    () => [
      { key: "live", label: "Live" },
      { key: "upcoming", label: "Upcoming" },
      { key: "previous", label: "Previous" },
    ] as const,
    []
  );

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  useLayoutEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);
    const activeButton = tabRefs.current[activeIndex];
    const indicator = indicatorRef.current;

    if (!activeButton || !indicator) return;

    const parentRect = activeButton.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    const activeRect = activeButton.getBoundingClientRect();
    const relativeLeft = activeRect.left - parentRect.left;
    indicator.style.width = `${activeRect.width}px`;
    indicator.style.transform = `translateX(${relativeLeft}px)`;
  }, [activeTab, open, tabs]);

  if (!open || typeof window === "undefined") return null;

  const latest = releases.find((r) => r.status === "latest");
  const upcoming = releases.filter((r) => r.status === "upcoming");
  const planned = releases.filter((r) => r.status === "planned");
  const previous = releases.filter((r) => r.status === "previous");
  const upcomingFeatures = [...upcoming, ...planned];

  const renderTabContent = () => {
    if (activeTab === "live") {
      return latest ? (
        <Section
          title="Live Features"
          subtitle={`Version ${latest.version} • ${latest.releaseDate}`}
          dark={dark}
          highlight
        >
          {latest.features.map((f) => (
            <FeatureItem key={f.title} f={f} dark={dark} />
          ))}
        </Section>
      ) : null;
    }

    if (activeTab === "upcoming") {
      if (upcomingFeatures.length === 0) {
        return (
          <div className={`rounded-xl border p-4 text-sm ${dark ? "border-zinc-800 bg-zinc-900/70 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            No upcoming features at the moment.
          </div>
        );
      }

      return (
        <div className="space-y-5">
          {upcomingFeatures.map((rel) => (
            <Section
              key={rel.version}
              title={rel.status === "planned" ? "Future Roadmap" : "Coming Next"}
              subtitle={`v${rel.version} • ${rel.releaseDate}`}
              dark={dark}
            >
              {rel.features.map((f) => (
                <FeatureItem key={f.title} f={f} dark={dark} />
              ))}
            </Section>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {previous.length === 0 ? (
          <div className={`rounded-xl border p-4 text-sm ${dark ? "border-zinc-800 bg-zinc-900/70 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            No previous release history yet.
          </div>
        ) : (
          previous.map((rel) => (
            <div key={rel.version}>
              <p className="mb-2 text-xs font-medium opacity-60">
                v{rel.version} • {rel.releaseDate}
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {rel.features.map((f) => (
                  <FeatureItem key={f.title} f={f} dark={dark} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/45 px-4 select-none"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`w-[60vw] h-[85vh] max-w-225 rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${dark
          ? "bg-zinc-950 border-zinc-700 text-zinc-100"
          : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-slate-50"}`}
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] opacity-70">
              <Sparkles className="h-3.5 w-3.5" />
              Product roadmap
            </div>

            {latest && (
              <>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 live-dot" />
                  <p className="text-sm font-semibold tracking-tight">Live • v{latest.version}</p>
                </div>

                <p className="text-[11px] opacity-60">Released {latest.releaseDate}</p>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-slate-700 transition hover:bg-black/10 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className={`relative flex gap-2 rounded-full border p-1.5 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-slate-50"}`}>
            <span
              ref={indicatorRef}
              className={`absolute left-0 top-1.5 h-[calc(100%-0.75rem)] rounded-full transition-transform duration-300 ease-out ${dark ? "bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20" : "bg-slate-900 shadow-md"}`}
            />

            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer relative z-10 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                  activeTab === tab.key
                    ? "text-white"
                    : dark
                      ? "text-zinc-300 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>,
    document.body
  );
};

type SectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  dark: boolean;
  highlight?: boolean;
};

const Section = ({ title, subtitle, children, dark, highlight }: SectionProps) => (
  <div
    className={`rounded-2xl border p-3 shadow-sm ${highlight
        ? dark
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-emerald-200 bg-emerald-50"
        : dark
          ? "border-zinc-800 bg-zinc-900/60"
          : "border-slate-200 bg-slate-50"
      }`}
  >
    <div className="mb-3 flex items-center justify-between gap-2">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">{title}</p>
        {subtitle && <p className="mt-1 text-[11px] opacity-60">{subtitle}</p>}
      </div>
      {highlight && (
        <span className={`rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] ${dark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700"}`}>
          Live
        </span>
      )}
    </div>

    <div className="grid gap-2 sm:grid-cols-3">{children}</div>
  </div>
);

type FeatureItemProps = {
  f: { title: string; status: string };
  dark: boolean;
};

const FeatureItem = ({ f, dark }: FeatureItemProps) => {
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
      className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5 ${dark
          ? "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700"
          : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm"
        }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${f.status === "live" ? (dark ? "bg-emerald-400" : "bg-emerald-500") : f.status === "upcoming" ? (dark ? "bg-yellow-400" : "bg-yellow-500") : dark ? "bg-indigo-400" : "bg-indigo-500"}`} />
        <span className="truncate text-sm font-medium">{f.title}</span>
      </div>
      <span className={`flex shrink-0 items-center justify-center rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] leading-none ${chip}`}>
        {f.status}
      </span>
    </div>
  );
};

export default LatestReleaseModal;