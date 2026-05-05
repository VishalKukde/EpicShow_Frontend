"use client";

import { Check, X } from "lucide-react";

type FilterOption = {
  label: string;
  value: string;
};

type FilterSection = {
  title: string;
  value: string;
  allLabel: string;
  options: FilterOption[];
  onSelect: (value: string) => void;
};

type AdminFilterModalProps = {
  title: string;
  subtitle: string;
  sections: FilterSection[];
  search?: {
    label: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
  };
  onClear: () => void;
  onClose: () => void;
};

export default function AdminFilterModal({ title, subtitle, sections, search, onClear, onClose }: AdminFilterModalProps) {
  const activeCount = sections.filter((section) => section.value).length + (search?.value.trim() ? 1 : 0);

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="flex max-h-[min(82vh,680px)] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,.24)]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-100 px-5 py-4">
          <div>
            <p className="m-0 text-[17px] font-black leading-tight text-slate-900">{title}</p>
            <p className="mt-1 max-w-[420px] text-xs font-semibold leading-relaxed text-slate-500">{subtitle}</p>
          </div>
          <button
            aria-label="Close filters"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        <div className="grid gap-4 overflow-auto p-5">
          {search && (
            <label className="grid gap-2">
              <span className={sectionTitleClassName}>{search.label}</span>
              <input
                value={search.value}
                onChange={(event) => search.onChange(event.target.value)}
                placeholder={search.placeholder}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
          )}

          {sections.map((section) => (
            <div key={section.title} className="grid gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <p className={sectionTitleClassName}>{section.title}</p>
                {section.value && (
                  <button onClick={() => section.onSelect("")} className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-extrabold text-slate-500 transition hover:bg-slate-100">Clear</button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={!section.value} label={section.allLabel} onClick={() => section.onSelect("")} />
                {section.options.map((option) => (
                  <FilterChip
                    key={option.value}
                    active={section.value === option.value}
                    label={option.label}
                    onClick={() => section.onSelect(option.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
          <span className="text-[11px] font-extrabold text-slate-500">
            {activeCount ? `${activeCount} active filter${activeCount > 1 ? "s" : ""}` : "Showing all records"}
          </span>
          <div className="flex gap-2">
            <button onClick={onClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-700 transition hover:bg-slate-50">Clear all</button>
            <button onClick={onClose} className="rounded-xl bg-slate-950 px-3.5 py-2 text-[11px] font-black text-white shadow-sm transition hover:bg-slate-800">Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-black transition",
        active
          ? "border-indigo-500 bg-indigo-50 text-indigo-800 shadow-[0_8px_20px_rgba(79,70,229,.12)]"
          : "border-slate-200 bg-white text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,.035)] hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      {active && <Check size={12} strokeWidth={3} />}
      {label}
    </button>
  );
}

const sectionTitleClassName = "m-0 text-[10px] font-black uppercase tracking-[.07em] text-slate-900";
