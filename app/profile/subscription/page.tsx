"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import BillingCycleSelector from "./components/BillingCycleSelector";
import CurrentSubscriptionDetails from "./components/CurrentSubscriptionDetails";
import FreePlanCard from "./components/FreePlanCard";
import ProPlanCard from "./components/ProPlanCard";
import { freeFeatures, proFeatures, proPrices } from "./data";
import type { BillingCycle, SubscriptionStatusResponse } from "./types";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";

export default function SubscriptionPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [status, setStatus] = useState<SubscriptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<"upgrade" | "cancel" | null>(null);
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { updateUser } = useAuth();
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const selected = proPrices[cycle];

  const savings = useMemo(() => {
    const monthlyCost = proPrices.monthly.amount;
    const quarterlyMonthlyAvg = Math.round(proPrices.quarterly.amount / 3);
    const yearlyMonthlyAvg = Math.round(proPrices.yearly.amount / 12);

    return {
      quarterly: monthlyCost - quarterlyMonthlyAvg,
      yearly: monthlyCost - yearlyMonthlyAvg,
    };
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      const data: SubscriptionStatusResponse = await apiFetch("/subscription/status", {
        method: "GET",
      });
      setStatus(data);
      updateUser({ membership: data.membership });
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleUpgrade = async () => {
    setShowUpgradeConfirm(true);
  };

  const handleConfirmUpgrade = async () => {
    setBusyAction("upgrade");
    try {
      await apiFetch("/subscription/checkout/prepare", {
        method: "POST",
        body: JSON.stringify({ billingCycle: cycle }),
      });
      setShowUpgradeConfirm(false);
      router.push(`/profile/subscription/payment?cycle=${cycle}`);
    } finally {
      setBusyAction(null);
    }
  };

  const handleCancel = async () => {
    setBusyAction("cancel");
    try {
      const data = await apiFetch("/subscription/cancel", {
        method: "POST",
        body: JSON.stringify({ reason: "user_requested" }),
      });
      toast.success(data?.message || "Subscription cancelled");
      await loadStatus();
      setShowCancelConfirm(false);
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="space-y-5 px-3 py-2 pb-6 select-none sm:px-4 lg:px-0">
      {/* Admin-Style Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${mode === "dark" ? "text-zinc-50" : "text-slate-900"}`}>
              Subscription Plans
            </h1>
            {status?.isPro && (
              <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                PRO Member
              </span>
            )}
          </div>
          <p className={`text-xs font-medium mt-0.5 ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
            {status?.isPro
              ? `Your Pro benefits are active until ${
                  status.subscription?.endDate
                    ? new Intl.DateTimeFormat("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(status.subscription.endDate))
                    : "renewal"
                }.`
              : "Compare Free vs Pro tiers and upgrade to unlock priority booking and deals."}
          </p>
        </div>
      </div>

      {status?.isPro ? (
        <CurrentSubscriptionDetails
          subscription={status.subscription}
          busyAction={busyAction}
          onCancelClick={() => setShowCancelConfirm(true)}
        />
      ) : (
        <>
          <BillingCycleSelector
            cycle={cycle}
            onChange={setCycle}
            quarterlySavings={savings.quarterly}
            yearlySavings={savings.yearly}
          />

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <FreePlanCard features={freeFeatures} isCurrent={!status?.isPro} />
            <ProPlanCard
              amount={selected.amount}
              label={selected.label}
              features={proFeatures}
              status={status}
              loading={loading}
              busyAction={busyAction}
              onUpgrade={handleUpgrade}
              onCancel={() => setShowCancelConfirm(true)}
            />
          </section>
        </>
      )}

      {showUpgradeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl border p-5 shadow-2xl ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
            <h3 className={`text-lg font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
              Upgrade to Pro?
            </h3>
            <p className={`mt-2 text-sm ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
              You will be redirected to checkout where you can pay using wallet, UPI, or card.
            </p>
            <div className={`mt-4 rounded-2xl p-4 text-sm ${mode === "dark" ? "bg-indigo-500/10 text-indigo-200" : "bg-indigo-50 text-indigo-900"}`}>
              Pro {selected.label}: ₹{selected.amount}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowUpgradeConfirm(false)}
                disabled={busyAction === "upgrade"}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-60 cursor-pointer  ${mode === "dark" ? "border-zinc-600 text-zinc-200 hover:bg-zinc-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpgrade}
                disabled={busyAction === "upgrade"}
                className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60 cursor-pointer"
              >
                {busyAction === "upgrade" ? "Preparing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl border p-5 shadow-2xl ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
            <h3 className={`text-lg font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
              Cancel Pro subscription?
            </h3>
            <p className={`mt-2 text-sm ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
              Your Pro benefits will remain active until the current expiry date. After that, your account will move back to Free.
            </p>
            <div className={`mt-4 rounded-2xl p-4 text-sm ${mode === "dark" ? "bg-red-500/10 text-red-200" : "bg-red-50 text-red-800"}`}>
              This action schedules cancellation and disables renewal.
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                disabled={busyAction === "cancel"}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${mode === "dark" ? "border-zinc-600 text-zinc-200 hover:bg-zinc-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
              >
                Keep Pro
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={busyAction === "cancel"}
                className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {busyAction === "cancel" ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
