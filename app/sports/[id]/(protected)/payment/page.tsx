"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Wallet } from "lucide-react";
import PaymentLayout from "@/components/checkout/PaymentLayout";
import PaymentOption from "@/components/checkout/PaymentOption";
import { useSportBookingStore } from "@/store/sportBookingStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { type SportMatch } from "@/app/sports/data";
import { fetchSportById } from "@/lib/sportsApi";

export default function SportsPaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const { verifiedAmount, loading, error } = usePaymentStore();
  const { item, seats, venue, venueId, date, slot, totalPrice, appliedCoupon, type, redeemReward } =
    useSportBookingStore();

    console.log("Booking details:", { item, seats, venue, venueId, date, slot, totalPrice, appliedCoupon, type, redeemReward });  

  const [match, setMatch] = useState<SportMatch | null>(null);

  useEffect(() => {
    let active = true;
    fetchSportById(String(id))
      .then((data) => {
        if (!active) return;
        setMatch(data);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const [method, setMethod] = useState<"upi" | "card" | "wallet">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("Confirming your payment...");
  const [actionError, setActionError] = useState<string | null>(null);

  const payableAmount = Number(verifiedAmount ?? totalPrice ?? 0);
  const walletBalance = Number(user?.walletBalance ?? 0);
  const walletInsufficient = method === "wallet" && walletBalance < payableAmount;

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
      router.replace(`/sports/${id}/payment/success/${bookingId}`);
    });
  };

  const goToFailed = (bookingId: string) => {
    startTransition(() => {
      router.replace(`/sports/${id}/payment/failed/${bookingId}`);
    });
  };

  const handlePayment = async () => {
    try {
      setActionError(null);

      if (!seats.length) {
        setActionError("No seats selected. Please select seats first.");
        router.replace(`/sports/${id}/seat-layout`);
        return;
      }

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

      const resolvedVenueId = venueId || match?.venueId || "";
      const resolvedVenue = venue || match?.venue || "";
      const matchLabel =
        match?.teamA && match?.teamB ? `${match.teamA} vs ${match.teamB}` : item?.name || "";

      const orderData = await apiFetch("/sports/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venueId: resolvedVenueId,
          itemId: item?._id || match?._id || String(id),
          showDate: date || match?.date,
          showSlot: slot || match?.time,
          seatIds: seats.map((s) => s.id),
          amount: payableAmount,
          coupon: appliedCoupon || null,
          redeemReward,
          showType: type,
          userId: user.id,
          sportType: match?.genres?.[0] || "Sport",
          league: match?.league,
          matchNo: match?.matchNo,
          teamA: match?.teamA,
          teamB: match?.teamB,
          matchLabel,
          venue: resolvedVenue,
          city: match?.city,
        }),
      });

      if (method === "wallet") {
        setProcessingMessage("Processing wallet payment...");

        const walletResult = await apiFetch("/sports/payment/wallet-pay", {
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

        useSportBookingStore.getState().resetBooking();
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
        description: `Payment for ${item?.name || "sport tickets"}`,
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
            const verification = await apiFetch("/sports/payment/verify", {
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
              updateUser({ rewardPoints: prevRewardPoints + verification.earnedPoints });
            }
            await fetch("/api/wallet/transactions/revalidate", { method: "POST" });

            useSportBookingStore.getState().resetBooking();
            usePaymentStore.getState().resetPayment();
            goToSuccess(orderData.bookingId);
          } catch {
            try {
              await apiFetch("/sports/payment/fail", {
                method: "POST",
                body: JSON.stringify({
                  bookingId: orderData.bookingId,
                }),
              });
            } catch (verifyErr) {
              console.error("Failed to update payment status", verifyErr);
            }
            goToFailed(orderData.bookingId);
          }
        },
        modal: {
          ondismiss: async function () {
            setIsProcessing(true);
            setProcessingMessage("Cancelling your payment...");

            try {
              await apiFetch("/sports/payment/fail", {
                method: "POST",
                body: JSON.stringify({
                  bookingId: orderData.bookingId,
                }),
              });
            } catch (dismissErr) {
              console.error("Failed to update payment status", dismissErr);
            } finally {
              useSportBookingStore.getState().resetBooking();
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

  const summaryItems = useMemo(
    () => [
      { label: "Match", value: item?.name || "Sport match" },
      { label: "Venue", value: venue || "Stadium" },
      { label: "Date", value: date || "-" },
      { label: "Time", value: slot || "-" },
      { label: "Seats", value: seats.map((seat) => seat.id).join(", ") || "-" },
    ],
    [item, venue, date, slot, seats]
  );

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

  const leftContent = (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className={`flex items-center gap-2 text-sm font-semibold ${dark ? "text-zinc-100" : "text-slate-800"}`}>
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
        <div className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-red-700 bg-red-500/15 text-red-300" : "border-red-300 bg-red-100/70 text-red-700"}`}>
          {actionError || error}
        </div>
      )}

      {walletInsufficient && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-amber-600 bg-amber-500/15 text-amber-300" : "border-amber-300 bg-amber-100/70 text-amber-800"}`}>
          Wallet balance is insufficient for this payment. Please top up wallet or use UPI/Card.
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading || walletInsufficient}
        className={`w-full cursor-pointer rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.35)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 ${
          dark
            ? "bg-indigo-600 hover:bg-indigo-500"
            : "bg-gradient-to-r from-indigo-600 to-indigo-700"
        }`}
      >
        {payButtonLabel}
      </button>

      {method === "wallet" && (
        <div className={`rounded-2xl border px-3 py-2.5 text-xs ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-indigo-200 bg-indigo-50 text-indigo-800"}`}>
          <div className="flex items-center gap-2 font-medium">
            <Wallet className="h-4 w-4" />
            Wallet payment selected
          </div>
          <p className="mt-1">
            Amount will be deducted instantly from your wallet balance.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <PaymentLayout
      backUrl={`/sports/${id}/review`}
      title="Secure Payment"
      badgeText="SSL secured"
      payableAmount={payableAmount}
      payableNotes={
        <p className={`mt-1 text-xs ${dark ? "text-emerald-300" : "text-emerald-700"}`}>
          Selected method: {method.toUpperCase()}
        </p>
      }
      leftContent={leftContent}
      summaryItems={summaryItems}
      totalLabel="Total Payable"
      totalValue={`₹${payableAmount.toFixed(2)}`}
      secureNoteTitle="Secure payment"
      secureNoteText="Your payment details are encrypted end-to-end."
    />
  );
}
