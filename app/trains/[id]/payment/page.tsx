"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, Wallet } from "lucide-react";
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
import { toast } from "@/lib/toast";
import { usePaymentStore } from "@/store/paymentStore";
import { useThemeStore } from "@/store/themeStore";
import type { PaymentMethod } from "@/types/Auth";
import type { PassengerDetail, Train } from "@/types/Train";
import TrainLoader from "../../components/TrainLoader";

type TrainBookingData = {
  trainId: string;
  seats: string[];
  passengers: PassengerDetail[];
  baseAmount?: number;
  taxAmount?: number;
  totalPrice: number;
  journeyDate: string;
};

export default function TrainPaymentPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const { verifiedAmount, loading, error, resetPayment } = usePaymentStore();
  const [bookingData, setBookingData] = useState<TrainBookingData | null>(null);
  const [train, setTrain] = useState<Train | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("Confirming your payment...");
  const [actionError, setActionError] = useState<string | null>(null);

  const payableAmount = Number(verifiedAmount || bookingData?.totalPrice || 0);
  const walletBalance = Number(user?.walletBalance ?? 0);
  const walletInsufficient = method === "wallet" && walletBalance < payableAmount;
  const disabledMethods = getDisabledPaymentMethods(user);

  useEffect(() => {
    const raw = sessionStorage.getItem("trainBookingData");
    if (!raw) {
      toast.warning("Please review your train booking before payment");
      router.replace(`/trains/${id}`);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as TrainBookingData;
      if (!parsed.trainId || !Array.isArray(parsed.seats) || !parsed.seats.length) {
        throw new Error("Invalid train booking data");
      }
      setBookingData(parsed);
    } catch {
      sessionStorage.removeItem("trainBookingData");
      toast.error("Booking session expired. Please try again.");
      router.replace(`/trains/${id}`);
    }
  }, [id, router]);

  useEffect(() => {
    const loadTrain = async () => {
      try {
        const data = await apiFetch(`/trains/${id}?date=${bookingData?.journeyDate || ""}`, { publicRequest: true });
        setTrain(data);
      } catch {
        toast.error("Failed to load train details");
      }
    };

    loadTrain();
  }, [bookingData?.journeyDate, id]);

  useEffect(() => {
    setMethod(resolvePreferredPaymentMethod(user, payableAmount));
  }, [payableAmount, user]);

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
    if (method === "wallet") return `Pay via Wallet Rs.${payableAmount.toFixed(2)}`;
    return `Pay Rs.${payableAmount.toFixed(2)}`;
  }, [loading, method, payableAmount]);

  const goToPaymentSuccess = (bookingId: string) => {
    startTransition(() => {
      router.replace(`/trains/${id}/payment/success/${bookingId}`);
    });
  };

  const goToFailed = (bookingId?: string) => {
    startTransition(() => {
      router.replace(
        bookingId
          ? `/trains/${id}/payment/failed/${bookingId}`
          : `/trains/${id}`
      );
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
    if (!bookingData || !train) return;

    try {
      setActionError(null);

      if (!bookingData.seats.length) {
        setActionError("No seats allotted.");
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
      setProcessingMessage("Creating your secure train order...");

      const orderData = await apiFetch("/trains/payment/create-order", {
        method: "POST",
        body: JSON.stringify({
          trainId: bookingData.trainId,
          seats: bookingData.seats,
          passengerDetails: bookingData.passengers,
          journeyDate: bookingData.journeyDate,
          paymentMethod: method,
          userId: user.id,
          showType: "train",
        }),
      });

      if (method === "wallet") {
        setProcessingMessage("Processing wallet payment...");

        const walletResult = await apiFetch("/trains/payment/wallet-pay", {
          method: "POST",
          body: JSON.stringify({
            bookingId: orderData.bookingId,
          }),
        });

        if (typeof walletResult?.walletBalance === "number") {
          updateUser({ walletBalance: walletResult.walletBalance });
        }

        await markLastUsedPaymentMethod();
        await fetch("/api/wallet/transactions/revalidate", { method: "POST" });
        sessionStorage.removeItem("trainBookingData");
        resetPayment();
        goToPaymentSuccess(walletResult.bookingId || orderData.bookingId);
        return;
      }

      setIsProcessing(false);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount * 100,
        currency: "INR",
        order_id: orderData.razorpayOrderId,
        name: "Epic Show",
        description: `Payment for ${train.trainName}`,
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
          setProcessingMessage("Verifying your train payment...");

          try {
            const verification = await apiFetch("/trains/payment/verify", {
              method: "POST",
              body: JSON.stringify({
                bookingId: orderData.bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            await markLastUsedPaymentMethod();
            await fetch("/api/wallet/transactions/revalidate", { method: "POST" });
            sessionStorage.removeItem("trainBookingData");
            resetPayment();
            goToPaymentSuccess(verification.bookingId || orderData.bookingId);
          } catch {
            goToFailed(orderData.bookingId);
          }
        },
        modal: {
          ondismiss: async function () {
            setIsProcessing(true);
            setProcessingMessage("Cancelling your payment...");

            try {
              await apiFetch("/trains/payment/fail", {
                method: "POST",
                body: JSON.stringify({
                  bookingId: orderData.bookingId,
                }),
              });
            } catch (dismissErr) {
              console.error("Failed to update train payment status", dismissErr);
            } finally {
              resetPayment();
              goToFailed(orderData.bookingId);
            }
          },
        },
        theme: {
          color: "#0891b2",
        },
      };

      const razorpayCtor = (
        window as unknown as { Razorpay?: new (opts: unknown) => { open: () => void } }
      ).Razorpay;

      if (!razorpayCtor) {
        throw new Error("Razorpay SDK failed to load. Refresh and try again.");
      }

      const razor = new razorpayCtor(options);
      razor.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to process train payment";
      setActionError(message);
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${dark ? "bg-zinc-950/75" : "bg-slate-950/50"}`}>
        <div className={`w-[92%] max-w-sm rounded-3xl border p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.2)] ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <TrainLoader compact fullScreen={false} label={processingMessage} />
        </div>
      </div>
    );
  }

  if (!bookingData || !train) {
    return (
      <div className={`min-h-screen pt-24 ${dark ? "bg-zinc-950" : "bg-slate-50"}`}>
        <TrainLoader label="Preparing train payment..." />
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 pb-10 pt-28 ${dark ? "bg-zinc-950" : "bg-gradient-to-b from-slate-50 to-white"}`}>
      <CheckoutNavbar backUrl={`/trains/${id}/review`} />

      <div className="mx-auto grid w-full max-w-4xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className={`rounded-3xl border p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <div className={`rounded-2xl border p-4 ${dark ? "border-zinc-700 bg-zinc-800" : "border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50"}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-cyan-300" : "text-cyan-700"}`}>
              Total Payable
            </p>
            <p className={`mt-1 text-3xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>
              Rs.{payableAmount.toFixed(2)}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <div className={`flex items-center gap-2 text-sm font-semibold ${dark ? "text-zinc-100" : "text-slate-800"}`}>
              <CreditCard className="h-4 w-4 text-cyan-600" />
              Choose Payment Method
            </div>

            {!disabledMethods.upi && (
              <PaymentOption
                mode={mode}
                active={method === "upi"}
                onClick={() => handleSelectMethod("upi")}
                title="UPI"
                desc="Google Pay, PhonePe, Paytm"
                badge="Fastest"
              />
            )}

            {!disabledMethods.card && (
              <PaymentOption
                mode={mode}
                active={method === "card"}
                onClick={() => handleSelectMethod("card")}
                title="Credit / Debit Card"
                desc="Visa, Mastercard, RuPay"
              />
            )}

            {!disabledMethods.wallet && (
              <PaymentOption
                mode={mode}
                active={method === "wallet"}
                onClick={() => handleSelectMethod("wallet")}
                title="Wallet Balance"
                desc={`Available: Rs.${walletBalance.toFixed(2)}`}
                badge={walletBalance >= payableAmount ? "Ready" : "Low Balance"}
              />
            )}
          </div>

          {(error || actionError) && (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${dark ? "border-red-700 bg-red-500/15 text-red-300" : "border-red-300 bg-red-100/70 text-red-700"}`}>
              {actionError || error}
            </div>
          )}

          {walletInsufficient && (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${dark ? "border-amber-600 bg-amber-500/15 text-amber-300" : "border-amber-300 bg-amber-100/70 text-amber-800"}`}>
              Wallet balance is insufficient for this payment. Please top up wallet or use UPI/Card.
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading || walletInsufficient}
            className={`mt-5 w-full cursor-pointer rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-[0_12px_28px_rgba(8,145,178,0.32)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 ${
              dark ? "bg-cyan-600 hover:bg-cyan-500" : "bg-gradient-to-r from-cyan-600 to-blue-700"
            }`}
          >
            {payButtonLabel}
          </button>
        </section>

        <aside className={`rounded-3xl border p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <h3 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>Order Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <SummaryRow dark={dark} label="Train" value={train.trainName} />
            <SummaryRow dark={dark} label="Journey" value={bookingData.journeyDate} />
            <SummaryRow dark={dark} label="Route" value={`${train.fromStation} to ${train.toStation}`} />
            <SummaryRow dark={dark} label="Seats" value={bookingData.seats.join(", ")} />
            <SummaryRow dark={dark} label="Base Fare" value={`Rs.${Number(bookingData.baseAmount || train.price * bookingData.passengers.length).toFixed(2)}`} />
            <SummaryRow dark={dark} label="Tax (18%)" value={`Rs.${Number(bookingData.taxAmount || 0).toFixed(2)}`} />
          </div>

          <div className={`my-4 h-px ${dark ? "bg-zinc-700" : "bg-slate-200"}`} />

          <div className={`flex items-center justify-between text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
            <span>Payable Amount</span>
            <span>Rs.{payableAmount.toFixed(2)}</span>
          </div>

          <div className={`mt-4 rounded-2xl border px-3 py-2.5 text-xs ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            <div className={`flex items-center gap-2 font-medium ${dark ? "text-zinc-200" : "text-slate-700"}`}>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              256-bit secure checkout
            </div>
            <p className="mt-1">Your payment and booking details are encrypted and protected.</p>
          </div>

          {method === "wallet" && (
            <div className={`mt-3 rounded-2xl border px-3 py-2.5 text-xs ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-cyan-200 bg-cyan-50 text-cyan-800"}`}>
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
}

function SummaryRow({
  dark,
  label,
  value,
}: {
  dark: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${dark ? "text-zinc-300" : "text-slate-600"}`}>
      <span>{label}</span>
      <span className={`max-w-[62%] truncate text-right font-medium ${dark ? "text-zinc-100" : "text-slate-900"}`}>
        {value || "-"}
      </span>
    </div>
  );
}
