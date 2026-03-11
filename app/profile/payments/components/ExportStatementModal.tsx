"use client";

import { useEffect } from "react";
import { Download, FileSpreadsheet, Wallet, Sparkles, Ticket } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export type StatementType = "wallet" | "reward" | "booking";

type ExportStatementModalProps = {
  open: boolean;
  selectedType: StatementType;
  downloading: boolean;
  error: string;
  onClose: () => void;
  onSelectType: (type: StatementType) => void;
  onConfirm: () => void;
};

const OPTIONS: Array<{
  type: StatementType;
  title: string;
  subtitle: string;
  icon: typeof Wallet;
}> = [
  {
    type: "wallet",
    title: "Wallet Transactions",
    subtitle: "Wallet top-ups, debits and balance movement",
    icon: Wallet,
  },
  {
    type: "reward",
    title: "Reward Transactions",
    subtitle: "Reward earned and redeemed points history",
    icon: Sparkles,
  },
  {
    type: "booking",
    title: "Booking Transaction Payments",
    subtitle: "Booking payment records",
    icon: Ticket,
  },
];

export default function ExportStatementModal({
  open,
  selectedType,
  downloading,
  error,
  onClose,
  onSelectType,
  onConfirm,
}: ExportStatementModalProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl ${
          dark ? "border-zinc-700 bg-zinc-900 text-white" : "border-gray-200 bg-white text-gray-900"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`border-b px-6 py-4 ${dark ? "border-zinc-700" : "border-gray-200"}`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
            Export Statement
          </p>
          <h3 className="mt-1 text-lg font-semibold">Download Excel Statement</h3>
          <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
            Choose one statement type. You can export one statement per day.
          </p>
        </div>

        <div className="space-y-3 px-6 py-5">
          {OPTIONS.map((option) => {
            const selected = selectedType === option.type;
            return (
              <button
                key={option.type}
                type="button"
                onClick={() => onSelectType(option.type)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition ${
                  selected
                    ? dark
                      ? "border-indigo-500 bg-indigo-500/15"
                      : "border-indigo-500 bg-indigo-50"
                    : dark
                      ? "border-zinc-700 bg-zinc-800/70 hover:border-zinc-600"
                      : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`rounded-lg p-2 ${selected ? (dark ? "bg-indigo-500/20" : "bg-indigo-100") : dark ? "bg-zinc-700" : "bg-gray-100"}`}>
                  <option.icon className={`h-4 w-4 ${selected ? "text-indigo-600" : dark ? "text-zinc-300" : "text-gray-600"}`} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{option.title}</span>
                  <span className={`block truncate text-xs ${dark ? "text-zinc-400" : "text-gray-500"}`}>
                    {option.subtitle}
                  </span>
                </span>
                <span
                  className={`ml-auto h-4 w-4 rounded-full border ${
                    selected
                      ? "border-indigo-500 bg-indigo-500"
                      : dark
                        ? "border-zinc-500"
                        : "border-gray-300"
                  }`}
                />
              </button>
            );
          })}

          {error ? (
            <div className={`rounded-lg border px-3 py-2 text-sm ${dark ? "border-red-500/40 bg-red-500/10 text-red-200" : "border-red-200 bg-red-50 text-red-700"}`}>
              {error}
            </div>
          ) : null}
        </div>

        <div className={`flex items-center justify-between border-t px-6 py-4 ${dark ? "border-zinc-700" : "border-gray-200"}`}>
          <button
            type="button"
            onClick={onClose}
            disabled={downloading}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ${dark ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={downloading}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
              dark
                ? "bg-indigo-500 text-white hover:bg-indigo-400"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {downloading ? (
              <>
                <FileSpreadsheet className="h-4 w-4 animate-pulse" />
                Preparing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Excel
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
