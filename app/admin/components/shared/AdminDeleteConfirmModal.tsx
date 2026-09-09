"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

type AdminDeleteConfirmModalProps = {
  isOpen: boolean;
  itemType: string;
  itemName: string;
  isDeleting?: boolean;
  description?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function AdminDeleteConfirmModal({
  isOpen,
  itemType,
  itemName,
  isDeleting = false,
  description,
  onConfirm,
  onClose,
}: AdminDeleteConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (!isDeleting) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150 select-none"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[460px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] animate-in zoom-in-95 duration-150 text-left"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-500 dark:text-rose-400 shadow-sm shadow-rose-500/10">
              <AlertTriangle size={22} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                Confirm Deletion
              </p>
              <h3 id="delete-modal-title" className="text-base font-black text-slate-900 dark:text-white m-0">
                Delete {itemType} from DB?
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              aria-label="Close modal (Esc)"
              className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition disabled:opacity-50"
            >
              <X size={16} />
            </button>
            <span className="text-[9px] font-semibold text-slate-400 select-none">ESC</span>
          </div>
        </div>

        {/* Item Card Highlight */}
        <div className="my-4 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 p-3.5 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500 dark:text-rose-400">
            <Trash2 size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 dark:text-rose-400">
              {itemType}
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate m-0">
              {itemName || "Selected Item"}
            </p>
          </div>
        </div>

        {/* Description Warning */}
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 m-0 mb-5">
          {description ||
            "This action cannot be undone. This record will be permanently deleted from MongoDB and removed from the website catalog."}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="cursor-pointer flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition active:scale-95 shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Yes, Delete from DB</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
