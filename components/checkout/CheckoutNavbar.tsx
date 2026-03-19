"use client";

import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";

export type CheckoutNavbarProps = {
  backUrl: string;
  title?: string;
  badgeText?: string;
};

export default function CheckoutNavbar({
  backUrl,
  title = "Secure Checkout",
  badgeText = "256-bit SSL Secure Payment",
}: CheckoutNavbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const mode = useThemeStore((s) => s.mode);

  const handleConfirm = () => {
    setOpen(false);
    router.push(backUrl);
  };

  return (
    <>
      <div
        className={`fixed top-0 z-50 w-full border-b backdrop-blur-xl ${
          mode === "dark"
            ? "border-zinc-700/70 bg-zinc-950/70"
            : "border-white/40 bg-white/70"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => setOpen(true)}
            className={`group inline-flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium transition ${
              mode === "dark"
                ? "text-zinc-200 hover:bg-zinc-800 hover:text-white"
                : "text-gray-700 hover:bg-white/80 hover:text-black"
            }`}
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Back</span>
          </button>

          <div className="flex flex-col items-center">
            <h2
              className={`text-sm font-semibold tracking-wide ${
                mode === "dark" ? "text-zinc-100" : "text-gray-800"
              }`}
            >
              {title}
            </h2>

            <div className="mt-1 flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-1 text-xs text-white shadow-sm">
              <Lock size={12} />
              {badgeText}
            </div>
          </div>

          <div className="w-16" />
        </div>
      </div>

      {open && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200 ${
            mode === "dark" ? "bg-black/70" : "bg-black/40"
          }`}
        >
          <div
            className={`w-full max-w-md scale-100 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 ${
              mode === "dark" ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              <div
                className={`rounded-full p-3 ${
                  mode === "dark"
                    ? "bg-red-500/15 ring-1 ring-red-500/40"
                    : "bg-red-100"
                }`}
              >
                <ShieldCheck
                  className={mode === "dark" ? "text-red-300" : "text-red-600"}
                  size={22}
                />
              </div>
            </div>

            <h3
              className={`text-center text-xl font-semibold ${
                mode === "dark" ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              Leave Checkout?
            </h3>

            <p
              className={`mt-3 text-center text-sm leading-relaxed ${
                mode === "dark" ? "text-zinc-400" : "text-gray-500"
              }`}
            >
              If you go back now, your current payment process will be cancelled.
              You may need to start again.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className={`flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition ${
                  mode === "dark"
                    ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Stay Here
              </button>

              <button
                onClick={handleConfirm}
                className={`flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-medium text-white transition shadow-md ${
                  mode === "dark"
                    ? "bg-indigo-600 hover:bg-indigo-500"
                    : "bg-gray-900 hover:bg-black"
                }`}
              >
                Confirm Exit
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
