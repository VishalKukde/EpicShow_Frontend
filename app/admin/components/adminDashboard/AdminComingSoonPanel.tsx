"use client";

import { Construction, Clock } from "lucide-react";

type AdminComingSoonPanelProps = {
  label: string;
};

export default function AdminComingSoonPanel({ label }: AdminComingSoonPanelProps) {
  return (
    <div
      style={{
        background: "var(--admin-surface)",
        border: "1px solid var(--admin-border)",
        borderRadius: 20,
      }}
      className="w-full p-10 shadow-sm text-center select-none space-y-4"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500">
        <Construction size={28} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <h2 style={{ color: "var(--admin-text)" }} className="text-xl font-black m-0">
            {label}
          </h2>
          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-500 uppercase tracking-wider">
            In Development
          </span>
        </div>

        <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0 max-w-md mx-auto">
          This feature is currently under active development and will be available in the next release.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/80 px-4 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
        <Clock size={14} />
        <span>Coming Soon in Platform Update</span>
      </div>
    </div>
  );
}
