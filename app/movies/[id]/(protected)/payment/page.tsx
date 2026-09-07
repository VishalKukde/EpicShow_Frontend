"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PaymentOption from "@/components/checkout/PaymentOption";
import CheckoutNavbar from "@/components/checkout/CheckoutNavbar";
import {
  getDisabledPaymentMethods,
  persistPaymentPreferences,
  resolvePreferredPaymentMethod,
  resolveWalletFallbackMethod,
} from "@/lib/paymentPreferences";
import type { PaymentMethod } from "@/types/Auth";

const PaymentPage = () => {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("Confirming your payment...");
  const [actionError, setActionError] = useState<string | null>(null);

  const { verifiedAmount, loading, error } = usePaymentStore();
  const mode = useThemeStore((s) => s.mode);
  const { item, seats, venueId, date, slot, appliedCoupon, type, redeemReward } =
    useBookingStore();
  const [method, setMethod] = useState<PaymentMethod>("upi");

  const payableAmount = Number(verifiedAmount ?? 0);
  const walletBalance = Number(user?.walletBalance ?? 0);
  const walletInsufficient = method === "wallet" && walletBalance < payableAmount;
  const disabledMethods = getDisabledPaymentMethods(user);

  useEffect(() => {
    setMethod(resolvePreferredPaymentMethod(user, payableAmount));
  }, [payableAmount, user?.preferences?.payment, user?.walletBalance]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payButtonLabel = useMemo(() => {
    if (loading) return "Preparing payment...";
    if (method === "wallet") return `Pay via Wallet ₹${payableAmount.toFixed(2)}`;
    return `Pay ₹${payableAmount.toFixed(2)}`;
  }, [loading, method, payableAmount]);

  const goToSuccess = (bookingId: string) => {
    startTransition(() => {
      router.replace(`/movies/${item?._id}/payment/success/${bookingId}`);
    });
  };

  const goToFailed = (bookingId: string) => {
    startTransition(() => {
      router.replace(`/movies/${item?._id}/payment/failed/${bookingId}`);
    });
  };

  const handleSelectMethod = (nextMethod: PaymentMethod) => {
    setActionError(null);

    if (disabledMethods[nextMethod]) return;

    if (nextMethod === "wallet" && walletBalance < payableAmount) {
      const fallbackMethod = resolveWalletFallbackMethod(user, payableAmount);
      setMethod(fallbackMethod);
      setActionError(
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
      setActionError(null);

      if (!seats.length) {
        setActionError("No seats selected.");
        return;
      }

      if (!user?.id) {
        setActionError("Session expired. Please login again.");
        return;
      }

      if (disabledMethods[method]) {
        setActionError("This payment method is disabled. Please enable another method from payment settings.");
        return;
      }

      if (method === "wallet" && walletBalance < payableAmount) {
        const fallbackMethod = resolveWalletFallbackMethod(user, payableAmount);
        setMethod(fallbackMethod);
        setActionError(
          `Wallet balance is low. We selected your last used payment method: ${fallbackMethod.toUpperCase()}.`
        );
        return;
      }

      setIsProcessing(true);
      setProcessingMessage("Creating your secure order...");

      const orderData = await apiFetch("/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cinemaId: venueId!,
          movieId: item?._id,
          showDate: date,
          showSlot: slot,
          seatIds: seats.map((s) => s.id),
          coupon: appliedCoupon || null,
          redeemReward,
          showType: type,
          userId: user.id,
        }),
      });

      if (method === "wallet") {
        setProcessingMessage("Processing wallet payment...");

        const walletResult = await apiFetch("/payment/wallet-pay", {
          method: "POST",
          body: JSON.stringify({
            bookingId: orderData.bookingId,
          }),
        });

        if (typeof walletResult?.walletBalance === "number") {
          updateUser({ walletBalance: walletResult.walletBalance });
        }
        if (typeof walletResult?.earnedPoints === "number") {
          const prevRewardPoints = Number(user?.rewardPoints ?? 0);
          updateUser({ rewardPoints: prevRewardPoints + walletResult.earnedPoints });
        }
        await markLastUsedPaymentMethod();
        await fetch("/api/wallet/transactions/revalidate", { method: "POST" });

        setProcessingMessage("Getting booking details...");
        useBookingStore.getState().resetBooking();
        usePaymentStore.getState().resetPayment();
        goToSuccess(orderData.bookingId);
        return;
      }

      setIsProcessing(false);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount * 100,
        currency: "INR",
        order_id: orderData.razorpayOrderId,
        name: "Epic Show",
        description: `Payment for ${item?.name || "movie tickets"}`,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          ...(user?.phone && /^\d{10}$/.test(String(user.phone))
            ? { contact: String(user.phone) }
            : {}),
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          setIsProcessing(true);
          setProcessingMessage("Verifying your payment...");

          try {
            const verification = await apiFetch("/payment/verify", {
              method: "POST",
              body: JSON.stringify({
                bookingId: orderData.bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (typeof verification?.earnedPoints === "number") {
              const prevRewardPoints = Number(user?.rewardPoints ?? 0);
              updateUser({
                rewardPoints: prevRewardPoints + verification.earnedPoints,
              });
            }
            await markLastUsedPaymentMethod();
            await fetch("/api/wallet/transactions/revalidate", { method: "POST" });

            setProcessingMessage("Getting booking details...");
            useBookingStore.getState().resetBooking();
            usePaymentStore.getState().resetPayment();
            goToSuccess(orderData.bookingId);
          } catch {
            goToFailed(orderData.bookingId);
          }
        },
        modal: {
          ondismiss: async function () {
            setIsProcessing(true);
            setProcessingMessage("Cancelling your payment...");

            try {
              await apiFetch("/payment/fail", {
                method: "POST",
                body: JSON.stringify({
                  bookingId: orderData.bookingId,
                }),
              });
            } catch (dismissErr) {
              console.error("Failed to update payment status", dismissErr);
            } finally {
              useBookingStore.getState().resetBooking();
              usePaymentStore.getState().resetPayment();
              goToFailed(orderData.bookingId);
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to process payment";
      setActionError(message);
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${mode === "dark" ? "bg-zinc-950/75" : "bg-slate-950/50"}`}>
        <div className={`w-[92%] max-w-sm rounded-3xl border p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.2)] ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <div className="mx-auto h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className={`mt-4 text-base font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
            Please wait
          </p>
          <p className={`mt-1 text-sm ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>{processingMessage}</p>
        </div>
      </div>
    );
  }

  if (!verifiedAmount && !loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${mode === "dark" ? "bg-zinc-950 text-zinc-300" : "bg-slate-50 text-slate-500"
          }`}
      >
        <p>Preparing payment...</p>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen px-4 pb-10 pt-22 transition-colors duration-300 ${mode === "dark"
      ? "bg-zinc-950 text-zinc-100 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-950/30 via-zinc-950 to-zinc-950"
      : "bg-slate-50 text-slate-900 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-50/60 via-slate-50 to-amber-50/40"
      } select-none`}>
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-[140px]" />

      <CheckoutNavbar
        backUrl={`/movies/${item?._id}/review`}
        title="Payment Options"
        badgeText="Step 3 of 3 • Finalize Order"
      />

      <main className="relative mx-auto max-w-5xl">
        {/* 2-Column Aligned Card Grid */}
        <div className="grid w-full gap-5 lg:grid-cols-[1.2fr_0.8fr] items-start">
          {/* Main Content Column */}
          <section className="space-y-4">
            {/* Total Payable Card */}
            <div className={`relative overflow-hidden rounded-2xl border p-4 sm:p-4.5 backdrop-blur-xl shadow-md transition-all ${mode === "dark"
              ? "border-zinc-800/80 bg-zinc-900/90"
              : "border-white/80 bg-white/90 shadow-[0_10px_25px_rgba(15,23,42,0.04)]"
              }`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${mode === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                    Total Payable Amount
                  </p>
                  <p className={`mt-1 text-2xl sm:text-3xl font-extrabold ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                    ₹{payableAmount.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {appliedCoupon && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                      🎟️ {appliedCoupon.code} Saved ₹{appliedCoupon.off.toFixed(2)}
                    </span>
                  )}
                  {redeemReward && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                      👑 Reward Points Applied
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Options Selection Card */}
            <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl shadow-md transition-all ${mode === "dark"
              ? "border-zinc-800/80 bg-zinc-900/90"
              : "border-white/80 bg-white/90 shadow-[0_10px_25px_rgba(15,23,42,0.04)]"
              }`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${mode === "dark" ? "text-zinc-200" : "text-slate-800"}`}>
                  Choose Payment Method
                </h3>
                <span className={`text-xs font-medium ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                  Select 1 option
                </span>
              </div>

              <div className="space-y-3.5">
                {!disabledMethods.upi && (
                  <PaymentOption
                    mode={mode}
                    active={method === "upi"}
                    onClick={() => handleSelectMethod("upi")}
                    title="Instant UPI"
                    desc="Google Pay, PhonePe, Paytm, BHIM"
                    badge="Fastest"
                  />
                )}

                {!disabledMethods.card && (
                  <PaymentOption
                    mode={mode}
                    active={method === "card"}
                    onClick={() => handleSelectMethod("card")}
                    title="Credit / Debit Card"
                    desc="Visa, Mastercard, RuPay, American Express"
                  />
                )}

                {!disabledMethods.wallet && (
                  <PaymentOption
                    mode={mode}
                    active={method === "wallet"}
                    onClick={() => handleSelectMethod("wallet")}
                    title="Epic Wallet Balance"
                    desc={`Available Balance: ₹${walletBalance.toFixed(2)}`}
                    badge={walletBalance >= payableAmount ? "Ready" : "Low Balance"}
                  />
                )}
              </div>
            </div>

            {(error || actionError) && (
              <div className={`rounded-2xl border p-4 text-xs font-medium ${mode === "dark" ? "border-red-500/40 bg-red-500/15 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>{actionError || error}</span>
                </div>
              </div>
            )}

            {walletInsufficient && (
              <div className={`rounded-2xl border p-4 text-xs font-medium ${mode === "dark" ? "border-amber-500/40 bg-amber-500/15 text-amber-300" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                💡 Wallet balance is insufficient for this booking amount. Please select UPI or Card.
              </div>
            )}
          </section>

          {/* Right Summary Sidebar Card - Perfectly Aligned */}
          <aside className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all lg:sticky lg:top-24 ${mode === "dark"
            ? "border-zinc-800/80 bg-zinc-900/90 shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
            : "border-white/80 bg-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.05)]"
            }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${mode === "dark" ? "text-zinc-200" : "text-slate-800"}`}>
              Order Breakdown
            </h3>

            {/* Movie Info Header */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-500/10 bg-zinc-500/5 p-3">
              {item?.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item?.name || "Movie"}
                  className="h-12 w-9 rounded-lg object-cover shadow-sm shrink-0"
                />
              ) : (
                <div className="flex h-12 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-lg font-bold text-indigo-400 shrink-0">
                  🎬
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className={`truncate text-sm font-bold ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                  {item?.name || "Movie Ticket"}
                </h4>
                {item?.language && (
                  <p className={`mt-0.5 text-xs ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                    {item.language} {item?.genre ? `• ${Array.isArray(item.genre) ? item.genre.join(", ") : item.genre}` : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Detail Rows */}
            <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
                <span>Date</span>
                <span className={`font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{date || "-"}</span>
              </div>
              <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
                <span>Show Time</span>
                <span className={`font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{slot || "-"}</span>
              </div>
              <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
                <span>Seats Selected</span>
                <span className={`font-bold ${mode === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                  {seats.length} Ticket{seats.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className={`my-4 h-px ${mode === "dark" ? "bg-zinc-800" : "bg-slate-200"}`} />

            {/* Final Payable */}
            <div className={`flex items-center justify-between text-base font-bold ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
              <span>Payable Amount</span>
              <span className="text-xl font-extrabold text-amber-500">₹{payableAmount.toFixed(2)}</span>
            </div>

            {/* Security Guarantee Box */}
            <div className={`mt-4 rounded-xl border p-3 text-xs ${mode === "dark" ? "border-zinc-800 bg-zinc-950/80 text-zinc-400" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
              <div className={`flex items-center gap-1.5 font-bold ${mode === "dark" ? "text-emerald-400" : "text-emerald-700"}`}>
                <ShieldCheck className="h-4 w-4" />
                256-Bit Encrypted Payment
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Your payment credentials are key-encrypted & processed through Razorpay.
              </p>
            </div>

            {method === "wallet" && (
              <div className={`mt-3 rounded-xl border p-3 text-xs ${mode === "dark" ? "border-indigo-500/30 bg-indigo-950/40 text-indigo-300" : "border-indigo-200 bg-indigo-50 text-indigo-800"}`}>
                <div className="flex items-center gap-1.5 font-bold">
                  <Wallet className="h-4 w-4" />
                  Wallet Debit Active
                </div>
                <p className="mt-1 leading-relaxed text-[11px]">
                  Amount will be deducted instantly from your available wallet balance.
                </p>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading || walletInsufficient}
              className={`mt-5 w-full cursor-pointer rounded-xl py-3.5 px-5 text-center text-sm font-bold text-white shadow-md transition-all duration-200 hover:scale-[1.005] hover:shadow-[0_10px_25px_rgba(79,70,229,0.35)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${mode === "dark"
                ? "bg-linear-to-r from-indigo-600 via-indigo-500 to-indigo-600"
                : "bg-linear-to-r from-indigo-600 via-indigo-700 to-slate-900"
                }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" />
                {payButtonLabel}
              </span>
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
