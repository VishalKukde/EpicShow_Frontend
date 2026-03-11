import type { ComponentType } from "react";

type SecurityToggleCardProps = {
  title: string;
  note: string;
  enabledLabel: string;
  disabledLabel: string;
  enabled: boolean;
  onToggle: () => void;
  icon: ComponentType<{ className?: string }>;
  color: "emerald" | "indigo";
  dark: boolean;
};

export default function SecurityToggleCard({
  title,
  note,
  enabledLabel,
  disabledLabel,
  enabled,
  onToggle,
  icon: Icon,
  color,
  dark,
}: SecurityToggleCardProps) {
  const activeClass =
    color === "emerald"
      ? "border border-emerald-700 bg-emerald-600 text-white"
      : "border border-indigo-700 bg-indigo-600 text-white";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{note}</p>
          <p
            className={`mt-2 rounded-md border px-2 py-1 text-xs font-medium ${
              dark
                ? "border-amber-900/60 bg-amber-950/40 text-amber-200"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            This is currently unavailable and will be available soon.
          </p>
        </div>
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled
        className={`mt-4 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium ${
          enabled ? activeClass : "border border-gray-300 bg-gray-100 text-gray-900"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {enabled ? enabledLabel : disabledLabel}
      </button>
    </div>
  );
}
