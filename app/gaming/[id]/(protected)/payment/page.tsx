"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { useGamingBookingStore } from "@/store/gamingBookingStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PaymentOption from "@/components/checkout/PaymentOption";
import CheckoutNavbar from "@/components/checkout/CheckoutNavbar";
import type { Gaming } from "@/types/Gaming";

const PaymentPage = () => {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("Confirming your payment...");
  const [actionError, setActionError] = useState<string | null>(null);

  const { verifiedAmount, loading, error } = usePaymentStore();
  const mode = useThemeStore((s) => s.mode);
  const { item, seats, venueId, date, slot, appliedCoupon, type, redeemReward } =
    useGamingBookingStore();
  const [method, setMethod] = useState<"wallet" | "card" | "upi">("upi");

  const payableAmount = Number(verifiedAmount ?? 0);
  const walletBalance = Number(user?.walletBalance ?? 0);
  const walletInsufficient = method === "wallet" && walletBalance < payableAmount;
  const ticketCount = seats.length > 0 ? seats.length : 1;

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
      router.replace(`/gaming/${item?._id}/payment/success/${bookingId}`);
    });
  };

  const goToFailed = (bookingId: string) => {
    startTransition(() => {
      router.replace(`/gaming/${item?._id}/payment/failed/${bookingId}`);
    });
  };

  const handlePayment = async () => {
    try {
      setActionError(null);

      if (!user?.id) {
        setActionError("Session expired. Please login again.");
        return;
      }

      if (method === "wallet" && walletBalance < payableAmount) {
        setActionError("Insufficient wallet balance. Please top up or choose another method.");
        return;
      }

      setIsProcessing(true);
      setProcessingMessage("Creating your secure order...");

      const orderData = await apiFetch("/gaming/payment/create-order", {
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
          showType: type || "gaming",
          userId: user.id,
        }),
      });

      if (method === "wallet") {
        setProcessingMessage("Processing wallet payment...");

        const walletResult = await apiFetch("/gaming/payment/wallet-pay", {
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
        await fetch("/api/wallet/transactions/revalidate", { method: "POST" });

        useGamingBookingStore.getState().resetBooking();
        usePaymentStore.getState().resetPayment();
        goToSuccess(orderData.bookingId);
        return;
      }

      setIsProcessing(false);

      const title = (item as Gaming | null)?.title;
      const description = title || item?.name || "gaming tickets";

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount * 100,
        currency: "INR",
        order_id: orderData.razorpayOrderId,
        name: "Epic Show",
        description: `Payment for ${description}`,
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
          setProcessingMessage("Verifying your payment...");

          try {
            const verification = await apiFetch("/gaming/payment/verify", {
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
            await fetch("/api/wallet/transactions/revalidate", { method: "POST" });

            useGamingBookingStore.getState().resetBooking();
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
              await apiFetch("/gaming/payment/fail", {
                method: "POST",
                body: JSON.stringify({
                  bookingId: orderData.bookingId,
                }),
              });
            } catch (dismissErr) {
              console.error("Failed to update payment status", dismissErr);
            } finally {
              useGamingBookingStore.getState().resetBooking();
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
        className={`min-h-screen flex items-center justify-center ${
          mode === "dark" ? "bg-zinc-950 text-zinc-300" : "bg-slate-50 text-slate-500"
        }`}
      >
        <p>Preparing payment...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 pb-10 pt-28 ${mode === "dark" ? "bg-zinc-950" : "bg-gradient-to-b from-slate-50 to-white"}`}>
      <CheckoutNavbar backUrl={`/gaming/${item?._id}/review`} />

      <div className="mx-auto grid w-full max-w-4xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className={`rounded-3xl border p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-6 ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <div className={`rounded-2xl border p-4 ${mode === "dark" ? "border-zinc-700 bg-zinc-800" : "border-indigo-100 bg-gradient-to-r from-indigo-50 to-cyan-50"}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${mode === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>
              Total Payable
            </p>
            <p className={`mt-1 text-3xl font-bold ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
              ₹{payableAmount.toFixed(2)}
            </p>
            {appliedCoupon && (
              <p className={`mt-1 text-xs ${mode === "dark" ? "text-emerald-300" : "text-emerald-700"}`}>
                Coupon {appliedCoupon.code} applied
              </p>
            )}
            {redeemReward && (
              <p className={`mt-1 text-xs ${mode === "dark" ? "text-emerald-300" : "text-emerald-700"}`}>
                Reward redemption applied (100 points = ₹100 off)
              </p>
            )}
          </div>

          <div className="mt-5 space-y-3">
            <div className={`flex items-center gap-2 text-sm font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-800"}`}>
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Choose Payment Method
            </div>

            <PaymentOption
              mode={mode}
              active={method === "upi"}
              onClick={() => setMethod("upi")}
              title="UPI"
              desc="Google Pay, PhonePe, Paytm"
              badge="Fastest"
            />

            <PaymentOption
              mode={mode}
              active={method === "card"}
              onClick={() => setMethod("card")}
              title="Credit / Debit Card"
              desc="Visa, Mastercard, RuPay"
            />

            <PaymentOption
              mode={mode}
              active={method === "wallet"}
              onClick={() => setMethod("wallet")}
              title="Wallet Balance"
              desc={`Available: ₹${walletBalance.toFixed(2)}`}
              badge={walletBalance >= payableAmount ? "Ready" : "Low Balance"}
            />
          </div>

          {(error || actionError) && (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${mode === "dark" ? "border-red-700 bg-red-500/15 text-red-300" : "border-red-300 bg-red-100/70 text-red-700"}`}>
              {actionError || error}
            </div>
          )}

          {walletInsufficient && (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${mode === "dark" ? "border-amber-600 bg-amber-500/15 text-amber-300" : "border-amber-300 bg-amber-100/70 text-amber-800"}`}>
              Wallet balance is insufficient for this payment. Please top up wallet or use UPI/Card.
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading || walletInsufficient}
            className={`mt-5 w-full cursor-pointer rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.35)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 ${
              mode === "dark"
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "bg-gradient-to-r from-indigo-600 to-indigo-700"
            }`}
          >
            {payButtonLabel}
          </button>
        </section>

        <aside className={`rounded-3xl border p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-6 ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <h3 className={`text-base font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
            Order Summary
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Gaming</span>
              <span className={`max-w-[65%] truncate text-right font-medium ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
                {(item as Gaming | null)?.title || item?.name || "-"}
              </span>
            </div>
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Date</span>
              <span className={`font-medium ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{date || "-"}</span>
            </div>
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Start Time</span>
              <span className={`font-medium ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{slot || "-"}</span>
            </div>
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Tickets</span>
              <span className={`font-medium ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{ticketCount}</span>
            </div>
          </div>

          <div className={`my-4 h-px ${mode === "dark" ? "bg-zinc-700" : "bg-slate-200"}`} />

          <div className={`flex items-center justify-between text-base font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
            <span>Payable Amount</span>
            <span>₹{payableAmount.toFixed(2)}</span>
          </div>

          <div className={`mt-4 rounded-2xl border px-3 py-2.5 text-xs ${mode === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            <div className={`flex items-center gap-2 font-medium ${mode === "dark" ? "text-zinc-200" : "text-slate-700"}`}>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              256-bit secure checkout
            </div>
            <p className="mt-1">Your payment and booking details are encrypted and protected.</p>
          </div>

          {method === "wallet" && (
            <div className={`mt-3 rounded-2xl border px-3 py-2.5 text-xs ${mode === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-indigo-200 bg-indigo-50 text-indigo-800"}`}>
              <div className="flex items-center gap-2 font-medium">
                <Wallet className="h-4 w-4" />
                Wallet payment selected
              </div>
              <p className="mt-1">Amount will be deducted instantly from your wallet balance.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;
