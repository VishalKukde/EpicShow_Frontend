"use client";

import CheckoutNavbar from "@/components/checkout/CheckoutNavbar";
import PaymentOption from "@/components/checkout/PaymentOption";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import {
  getDisabledPaymentMethods,
  persistPaymentPreferences,
  resolvePreferredPaymentMethod,
  resolveWalletFallbackMethod,
} from "@/lib/paymentPreferences";
import { useThemeStore } from "@/store/themeStore";
import type { PaymentMethod } from "@/types/Auth";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, startTransition, useEffect, useMemo, useState } from "react";

type BillingCycle = "monthly" | "quarterly" | "yearly";

type CheckoutPreview = {
  plan: "pro";
  billingCycle: BillingCycle;
  amount: number;
  currency: "INR";
  durationDays: number;
};

function SubscriptionPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cycle = (searchParams.get("cycle") || "monthly") as BillingCycle;
  const mode = useThemeStore((s) => s.mode);
  const { user, updateUser } = useAuth();
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("Preparing checkout...");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    router.push("/profile/subscription");
  };

  const walletBalance = Number(user?.walletBalance ?? 0);
  const amount = Number(preview?.amount ?? 0);
  const walletInsufficient = method === "wallet" && walletBalance < amount;
  const disabledMethods = getDisabledPaymentMethods(user);

  useEffect(() => {
    setMethod(resolvePreferredPaymentMethod(user, amount));
  }, [amount, user?.preferences?.payment, user?.walletBalance]);

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
    let active = true;

    const loadPreview = async () => {
      try {
        setLoading(true);
        const data: CheckoutPreview = await apiFetch("/subscription/checkout/prepare", {
          method: "POST",
          body: JSON.stringify({ billingCycle: cycle }),
        });
        if (active) setPreview(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to prepare checkout");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPreview();

    return () => {
      active = false;
    };
  }, [cycle]);

  const payButtonLabel = useMemo(() => {
    if (loading) return "Preparing checkout...";
    if (method === "wallet") return `Pay via Wallet ₹${amount.toFixed(2)}`;
    return `Pay ₹${amount.toFixed(2)}`;
  }, [amount, loading, method]);

  const finishSuccess = () => {
    startTransition(() => {
      router.replace("/profile/subscription?payment=success");
    });
  };

  const handleSelectMethod = (nextMethod: PaymentMethod) => {
    setError(null);

    if (disabledMethods[nextMethod]) return;

    if (nextMethod === "wallet" && walletBalance < amount) {
      const fallbackMethod = resolveWalletFallbackMethod(user, amount);
      setMethod(fallbackMethod);
      setError(
        `Wallet balance is low. We selected your last used payment method: ${fallbackMethod.toUpperCase()}.`
      );
      return;
    }

    setMethod(nextMethod);
  };

  const markLastUsedPaymentMethod = async () => {
    try {
      await persistPaymentPreferences({
        preferences: { lastUsedMethod: method },
        updateUser,
      });
    } catch (err) {
      console.error("Failed to update last used payment method", err);
    }
  };

  const handlePayment = async () => {
    try {
      setError(null);

      if (!user?.id) {
        setError("Session expired. Please login again.");
        return;
      }

      if (!preview) {
        setError("Checkout is not ready yet.");
        return;
      }

      if (disabledMethods[method]) {
        setError("This payment method is disabled. Please enable another method from payment settings.");
        return;
      }

      if (walletInsufficient) {
        const fallbackMethod = resolveWalletFallbackMethod(user, amount);
        setMethod(fallbackMethod);
        setError(
          `Wallet balance is low. We selected your last used payment method: ${fallbackMethod.toUpperCase()}.`
        );
        return;
      }

      setIsProcessing(true);
      setProcessingMessage("Creating your subscription order...");

      const orderData = await apiFetch("/subscription/checkout/create-order", {
        method: "POST",
        body: JSON.stringify({ billingCycle: preview.billingCycle }),
      });

      if (method === "wallet") {
        setProcessingMessage("Processing wallet payment...");
        const result = await apiFetch("/subscription/checkout/wallet-pay", {
          method: "POST",
          body: JSON.stringify({ checkoutId: orderData.checkoutId }),
        });

        updateUser({
          membership: "pro",
          walletBalance:
            typeof result?.walletBalance === "number" ? result.walletBalance : walletBalance,
        });
        await markLastUsedPaymentMethod();
        await fetch("/api/wallet/transactions/revalidate", { method: "POST" });
        finishSuccess();
        return;
      }

      setIsProcessing(false);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: "Epic Show",
        description: `EpicShow Pro ${preview.billingCycle} subscription`,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          setIsProcessing(true);
          setProcessingMessage("Verifying your Pro subscription...");

          await apiFetch("/subscription/checkout/verify", {
            method: "POST",
            body: JSON.stringify({
              checkoutId: orderData.checkoutId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          updateUser({ membership: "pro" });
          await markLastUsedPaymentMethod();
          finishSuccess();
        },
        modal: {
          ondismiss: async function () {
            setIsProcessing(true);
            setProcessingMessage("Cancelling your checkout...");

            try {
              await apiFetch("/subscription/checkout/fail", {
                method: "POST",
                body: JSON.stringify({ checkoutId: orderData.checkoutId }),
              });
            } finally {
              router.replace("/profile/subscription?payment=failed");
            }
          },
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const razorpayCtor = (
        window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }
      ).Razorpay;
      const razor = new razorpayCtor(options);
      razor.open();
    } catch (err) {
      setIsProcessing(false);
      setError(err instanceof Error ? err.message : "Unable to process payment");
    }
  };

  if (isProcessing) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${mode === "dark" ? "bg-zinc-950/75" : "bg-slate-950/50"}`}>
        <div className={`w-[92%] max-w-sm rounded-3xl border p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.2)] ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className={`mt-4 text-base font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
            Please wait
          </p>
          <p className={`mt-1 text-sm ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>{processingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="m-auto grid w-full max-w-4xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className={`rounded-3xl border p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-6 ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <button
            onClick={() => setOpen(true)}
            className={`group inline-flex cursor-pointer items-center gap-2 rounded-xl px-2 pt-0 pb-6 text-sm font-medium transition ${mode === "dark"
                ? "text-zinc-200 hover:bg-zinc-800 hover:text-white"
                : "text-gray-700 hover:bg-white/80 hover:text-black"
              }`}
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Back to subscription</span>
          </button>
          <div className={`rounded-2xl border p-4 ${mode === "dark" ? "border-zinc-700 bg-zinc-800" : "border-indigo-100 bg-gradient-to-r from-indigo-50 to-cyan-50"}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${mode === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>
              Total Payable
            </p>
            <p className={`mt-1 text-3xl font-bold ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
              ₹{amount.toFixed(2)}
            </p>
            <p className={`mt-1 text-xs ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
              Pro {preview?.billingCycle || cycle} subscription
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <div className={`flex items-center gap-2 text-sm font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-800"}`}>
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Choose Payment Method
            </div>

            {!disabledMethods.upi && (
              <PaymentOption mode={mode} active={method === "upi"} onClick={() => handleSelectMethod("upi")} title="UPI" desc="Google Pay, PhonePe, Paytm" badge="Fastest" />
            )}
            {!disabledMethods.card && (
              <PaymentOption mode={mode} active={method === "card"} onClick={() => handleSelectMethod("card")} title="Credit / Debit Card" desc="Visa, Mastercard, RuPay" />
            )}
            {!disabledMethods.wallet && (
              <PaymentOption mode={mode} active={method === "wallet"} onClick={() => handleSelectMethod("wallet")} title="Wallet Balance" desc={`Available: ₹${walletBalance.toFixed(2)}`} badge={walletBalance >= amount ? "Ready" : "Low Balance"} />
            )}
          </div>

          {error && (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${mode === "dark" ? "border-red-700 bg-red-500/15 text-red-300" : "border-red-300 bg-red-100/70 text-red-700"}`}>
              {error}
            </div>
          )}

          {walletInsufficient && (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${mode === "dark" ? "border-amber-600 bg-amber-500/15 text-amber-300" : "border-amber-300 bg-amber-100/70 text-amber-800"}`}>
              Wallet balance is insufficient for this payment.
            </div>
          )}
        </section>

        <aside className={`rounded-3xl border p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-6 ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <h3 className={`text-base font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>Order Summary</h3>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Plan</span>
              <span className={`font-medium ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>Pro</span>
            </div>
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Billing</span>
              <span className={`font-medium capitalize ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{preview?.billingCycle || cycle}</span>
            </div>
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Duration</span>
              <span className={`font-medium ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{preview?.durationDays || "-"} days</span>
            </div>
          </div>
          <div className={`my-4 h-px ${mode === "dark" ? "bg-zinc-700" : "bg-slate-200"}`} />
          <div className={`flex items-center justify-between text-base font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
            <span>Total</span>
            <span>₹{amount.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || walletInsufficient || !preview}
            className={`mt-5 w-full cursor-pointer rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.35)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 ${mode === "dark" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gradient-to-r from-indigo-600 to-indigo-700"
              }`}
          >
            {payButtonLabel}
          </button>
        </aside>
      </div>

      <>
        {open && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200 ${mode === "dark" ? "bg-black/70" : "bg-black/40"
              }`}
          >
            <div
              className={`w-full max-w-md scale-100 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 ${mode === "dark" ? "bg-zinc-900" : "bg-white"
                }`}
            >
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`rounded-full p-3 ${mode === "dark"
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
                className={`text-center text-xl font-semibold ${mode === "dark" ? "text-zinc-100" : "text-gray-900"
                  }`}
              >
                Leave Checkout?
              </h3>

              <p
                className={`mt-3 text-center text-sm leading-relaxed ${mode === "dark" ? "text-zinc-400" : "text-gray-500"
                  }`}
              >
                If you go back now, your current payment process will be cancelled.
                You may need to start again.
              </p>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className={`flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition ${mode === "dark"
                      ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                      : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  Stay Here
                </button>

                <button
                  onClick={handleConfirm}
                  className={`flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-medium text-white transition shadow-md ${mode === "dark"
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

    </div>
  );
}

export default function SubscriptionPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <SubscriptionPaymentContent />
    </Suspense>
  );
}
