"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
// import { getToken } from "@/lib/tokenStore";
import { useThemeStore } from "@/store/themeStore";
import {
  MAX_TOPUP,
  MIN_TOPUP,
  PRESET_AMOUNTS,
  type WalletTransaction,
} from "./constants";
import RewardsBoosterCard from "./components/RewardsBoosterCard";
import WalletActivity from "./components/WalletActivity";
import WalletBalanceCard from "./components/WalletBalanceCard";
import WalletHero from "./components/WalletHero";
import WalletTopupModal from "./components/WalletTopupModal";
import WalletUsageHint from "./components/WalletUsageHint";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCtor = new (options: {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  modal?: { ondismiss?: () => void };
  theme?: { color: string };
}) => { open: () => void };

const BOOSTER_THRESHOLD = 1000;
const BOOSTER_RATE = 0.05;

function calculateRewardBonus(amount: number) {
  if (amount < BOOSTER_THRESHOLD) return 0;
  return Number((amount * BOOSTER_RATE).toFixed(2));
}

function getMaxAllowedTopup(remainingLimit: number) {
  if (remainingLimit < MIN_TOPUP) return 0;
  if (remainingLimit < BOOSTER_THRESHOLD) return Number(remainingLimit.toFixed(2));

  const boostedMax = Number((remainingLimit / (1 + BOOSTER_RATE)).toFixed(2));
  if (boostedMax >= BOOSTER_THRESHOLD) return boostedMax;

  return 999.99;
}

function isTopupAllowed(amount: number, remainingLimit: number) {
  if (amount < MIN_TOPUP) return false;
  const totalCredit = Number((amount + calculateRewardBonus(amount)).toFixed(2));
  return totalCredit <= remainingLimit;
}

type WalletTransactionApiItem = {
  id: string;
  type: "credit" | "debit";
  source:
    | "topup"
    | "reward_bonus"
    | "booking_payment"
    | "refund"
    | "admin_adjustment";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: "pending" | "success" | "failed";
  note: string;
  createdAt: string;
};

type WalletTransactionsApiResponse = {
  transactions?: WalletTransactionApiItem[];
  pagination?: {
    hasMore?: boolean;
  };
  message?: string;
};

const SOURCE_TO_TITLE: Record<WalletTransactionApiItem["source"], string> = {
  topup: "Wallet Top-up",
  reward_bonus: "Reward Booster Bonus",
  booking_payment: "Booking Payment",
  refund: "Refund",
  admin_adjustment: "Admin Adjustment",
};

function formatWalletDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  const datePart = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} • ${timePart}`;
}

const WALLET_ACTIVITY_PAGE_SIZE = 5;

export default function WalletPage() {
  const { user, updateUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("1000.00");
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsLoadingMore, setTransactionsLoadingMore] = useState(false);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsHasMore, setTransactionsHasMore] = useState(false);
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const mode = useThemeStore((s) => s.mode);

  const walletBalance = Number(Number(user?.walletBalance ?? 0).toFixed(2));
  const remainingTopupLimit = Number((MAX_TOPUP - walletBalance).toFixed(2));

  const dynamicPresetAmounts = useMemo(() => {
    if (remainingTopupLimit < MIN_TOPUP) return [];

    const filtered = PRESET_AMOUNTS.filter((value) =>
      isTopupAllowed(value, remainingTopupLimit)
    );
    const lastAmount = getMaxAllowedTopup(remainingTopupLimit);

    if (!filtered.includes(lastAmount)) {
      filtered.push(lastAmount);
    }

    return filtered.sort((a, b) => a - b);
  }, [remainingTopupLimit]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  useEffect(() => {
    if (!rewardsModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setRewardsModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rewardsModalOpen]);

  const fetchTransactions = useCallback(
    async (nextPage: number, append: boolean) => {
      if (append) {
        setTransactionsLoadingMore(true);
      } else {
        setTransactionsLoading(true);
        setTransactions([]);
      }

      try {
        // const token = getToken();
        const query = new URLSearchParams({
          page: String(nextPage),
          limit: String(WALLET_ACTIVITY_PAGE_SIZE),
        });

        const response = await fetch(`/api/wallet/transactions?${query.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const result = (await response.json()) as WalletTransactionsApiResponse;
        if (!response.ok) {
          throw new Error(result?.message || "Failed to fetch wallet transactions");
        }

        const mapped = (result.transactions ?? []).map((txn) => ({
          id: txn.id,
          type: txn.type,
          title: txn.note?.trim() || SOURCE_TO_TITLE[txn.source],
          date: formatWalletDate(txn.createdAt),
          amount: Number(txn.amount.toFixed(2)),
        }));

        setTransactions((prev) => (append ? [...prev, ...mapped] : mapped));
        setTransactionsPage(nextPage);

        if (typeof result.pagination?.hasMore === "boolean") {
          setTransactionsHasMore(result.pagination.hasMore);
        } else {
          setTransactionsHasMore(mapped.length === WALLET_ACTIVITY_PAGE_SIZE);
        }
      } catch {
        if (!append) {
          setTransactions([]);
        }
        setTransactionsHasMore(false);
      } finally {
        if (append) {
          setTransactionsLoadingMore(false);
        } else {
          setTransactionsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void fetchTransactions(1, false);
  }, [fetchTransactions, transactionsRefreshKey, user?.id]);

  const handleLoadMoreTransactions = () => {
    if (transactionsLoading || transactionsLoadingMore || !transactionsHasMore) {
      return;
    }
    void fetchTransactions(transactionsPage + 1, true);
  };

  const amountValue = useMemo(() => Number(amountInput), [amountInput]);
  const rewardBonusPreview = useMemo(
    () => calculateRewardBonus(amountValue),
    [amountValue]
  );
  const totalTopupCredit = useMemo(
    () => Number((amountValue + rewardBonusPreview).toFixed(2)),
    [amountValue, rewardBonusPreview]
  );
  const hasTwoDecimals = /^\d+(\.\d{2})$/.test(amountInput);
  const amountInvalid =
    !Number.isFinite(amountValue) ||
    !hasTwoDecimals ||
    amountValue < MIN_TOPUP ||
    !isTopupAllowed(amountValue, remainingTopupLimit) ||
    totalTopupCredit + walletBalance > MAX_TOPUP;

  const openModal = () => {
    const initialAmount =
      dynamicPresetAmounts.length > 0
        ? dynamicPresetAmounts[dynamicPresetAmounts.length - 1]
        : 0;
    setAmountInput(initialAmount > 0 ? initialAmount.toFixed(2) : "0.00");
    setSelectedAmount(initialAmount);
    setError("");
    setSuccess("");

    if (remainingTopupLimit < MIN_TOPUP) {
      setError("Wallet is already full. Maximum allowed is ₹5000.00");
    }

    setModalOpen(true);
  };

  const handlePreset = (value: number) => {
    setSelectedAmount(value);
    setAmountInput(value.toFixed(2));
    setError("");
  };

  const handleInputChange = (next: string) => {
    if (!/^\d{0,4}(\.\d{0,2})?$/.test(next)) {
      return;
    }
    setSelectedAmount(0);
    setAmountInput(next);
    setError("");
  };

  const handleInputBlur = () => {
    if (!amountInput) return;
    const parsed = Number(amountInput);
    if (!Number.isFinite(parsed)) return;
    setAmountInput(parsed.toFixed(2));
  };

  const handleOneTimeTopup = async () => {
    setError("");
    setSuccess("");

    if (amountInvalid) {
      setError(
        `Enter a valid amount with 2 decimals between ₹1.00 and ₹${Math.max(
          getMaxAllowedTopup(remainingTopupLimit),
          0
        ).toFixed(2)}`
      );
      return;
    }

    if (typeof window === "undefined") return;

    const razorpayCtor = (window as unknown as { Razorpay?: RazorpayCtor }).Razorpay;

    if (!razorpayCtor) {
      setError("Razorpay SDK failed to load. Refresh and try again.");
      return;
    }

    setSubmitting(true);

    try {
      const amount = Number(amountInput);
      const order = await apiFetch("/wallet/create-order", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      const razorpay = new razorpayCtor({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: Math.round(order.amount * 100),
        currency: "INR",
        name: "Wallet Top-up",
        description: "Add amount to your wallet",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const verification = await apiFetch("/wallet/verify", {
              method: "POST",
              body: JSON.stringify(response),
            });

            updateUser({ walletBalance: verification.walletBalance });
            const bonusAmount = Number(verification.bonusAmount ?? 0);
            const creditedAmount = Number(verification.creditedAmount ?? 0);
            const totalCreditedAmount = Number(
              verification.totalCreditedAmount ?? creditedAmount
            );

            if (bonusAmount > 0) {
              setSuccess(
                `₹${creditedAmount.toFixed(2)} top-up + ₹${bonusAmount.toFixed(
                  2
                )} reward bonus credited. Total added ₹${totalCreditedAmount.toFixed(
                  2
                )}.`
              );
            } else {
              setSuccess(`₹${creditedAmount.toFixed(2)} added to wallet`);
            }
            await fetch("/api/wallet/transactions/revalidate", {
              method: "POST",
            });
            setTransactionsRefreshKey((prev) => prev + 1);
            setModalOpen(false);
          } catch (verifyError) {
            const verifyMessage =
              verifyError instanceof Error
                ? verifyError.message
                : "Payment verification failed";
            setError(verifyMessage);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
        theme: { color: "#0f172a" },
      });

      razorpay.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to start top-up";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] select-none space-y-4 px-3 py-3 pb-6 sm:space-y-5 sm:px-4 lg:space-y-6 lg:px-0">
      <WalletHero />

      <section>
        <WalletBalanceCard walletBalance={walletBalance} onOpenModal={openModal} />
      </section>

      <section>
        <RewardsBoosterCard
          mode={mode}
          onCheckOffers={() => setRewardsModalOpen(true)}
        />
      </section>

      <section>
        <WalletActivity
          mode={mode}
          transactions={transactions}
          loading={transactionsLoading}
          loadingMore={transactionsLoadingMore}
          hasMore={transactionsHasMore}
          onLoadMore={handleLoadMoreTransactions}
        />
      </section>

      <WalletUsageHint />

      {success && (
        <section className="rounded-2xl border border-emerald-300 bg-emerald-100/80 p-4 text-sm text-emerald-800 dark:border-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
          {success}
        </section>
      )}

      <WalletTopupModal
        mode={mode}
        isOpen={modalOpen}
        maxTopup={MAX_TOPUP}
        amountInput={amountInput}
        selectedAmount={selectedAmount}
        dynamicPresetAmounts={dynamicPresetAmounts}
        submitting={submitting}
        amountInvalid={amountInvalid}
        error={error}
        onClose={() => setModalOpen(false)}
        onPresetSelect={handlePreset}
        onInputChange={handleInputChange}
        onInputBlur={handleInputBlur}
        onSubmit={handleOneTimeTopup}
      />

      {rewardsModalOpen && (
        <div
          onClick={() => setRewardsModalOpen(false)}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
            mode === "dark" ? "bg-black/70" : "bg-black/40"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
              mode === "dark"
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <h3
              className={`text-lg font-semibold ${
                mode === "dark" ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Rewards Booster Offer
            </h3>
            <p
              className={`mt-2 text-sm ${
                mode === "dark" ? "text-slate-300 " : "text-slate-600"
              }`}
            >
              Top up ₹1,000.00 or more in one transaction and get extra 5% reward
              bonus added to your wallet.
            </p>
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                mode === "dark"
                  ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200"
                  : "border-indigo-200 bg-indigo-50 text-indigo-700"
              }`}
            >
              Example: Top up ₹1000.00 and get ₹50.00 bonus. Total credit:
              ₹1050.00.
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setRewardsModalOpen(false)}
                className={`w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium ${
                  mode === "dark"
                    ? "border border-slate-400 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setRewardsModalOpen(false);
                  openModal();
                }}
                className="w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Top Up Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
