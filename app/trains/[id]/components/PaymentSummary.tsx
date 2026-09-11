import { PassengerDetail, Train } from "@/types/Train";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Route, ShieldCheck, Ticket, UserRoundCheck } from "lucide-react";

interface PaymentSummaryProps {
  train: Train;
  passengers: PassengerDetail[];
  seats: string[];
  onProceed: () => void;
  isComplete: boolean;
}

export default function PaymentSummary({
  train,
  passengers,
  seats,
  onProceed,
  isComplete,
}: PaymentSummaryProps) {
  const totalPrice = seats.length * train.price;
  const gst = totalPrice * 0.18;
  const finalPrice = totalPrice + gst;
  const pendingCount = Math.max(seats.length - passengers.length, 0);

  return (
    <div className="no-gradient overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* Luxury Booking Header (Solid dark background in both modes for high contrast) */}
      <div className="no-gradient border-b border-slate-800 bg-slate-900 p-6 text-white dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">Booking Summary</p>
        <h3 className="mt-1.5 text-2xl font-black text-white tracking-tight">Review Travellers</h3>
      </div>

      <div className="space-y-6 p-6">
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <div className="flex items-start gap-3">
            <Route size={18} className="mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Route</p>
              <p className="truncate font-bold text-slate-950 dark:text-white">{train.trainName}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                {train.fromStation} <ArrowRight size={13} className="inline mx-1 text-cyan-600 dark:text-cyan-400" /> {train.toStation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-slate-200 pt-3 dark:border-zinc-800">
            <Ticket size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">
              {seats.length} seat{seats.length !== 1 ? "s" : ""} selected
            </span>
          </div>
        </div>

        <div className="border-b border-slate-200 pb-6 dark:border-zinc-800">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-slate-950 dark:text-white">
              Passengers ({passengers.length}/{seats.length})
            </p>
            <UserRoundCheck size={18} className={isComplete ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"} />
          </div>
          <div className="space-y-2">
            {passengers.map((passenger) => (
              <div key={passenger.seatNumber} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm dark:bg-zinc-800/80">
                <span className="min-w-0 truncate font-semibold text-slate-700 dark:text-zinc-200">{passenger.name}</span>
                <span className="shrink-0 text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400">Seat {passenger.seatNumber}</span>
              </div>
            ))}
            {pendingCount > 0 && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                {pendingCount} passenger{pendingCount !== 1 ? "s" : ""} pending details
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-zinc-400">Base Fare (×{seats.length})</span>
            <span className="font-semibold text-slate-900 dark:text-white">₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-zinc-400">GST (18%)</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              ₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="my-2 h-px bg-slate-200 dark:bg-zinc-800" />
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <span className="block font-bold text-slate-900 dark:text-white">Total Amount</span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">Includes all taxes</span>
            </div>
            <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
              ₹{finalPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Action Button: Solid Cyan, No Gradient, High Contrast */}
        <motion.button
          onClick={onProceed}
          whileHover={isComplete ? { scale: 1.01 } : {}}
          whileTap={isComplete ? { scale: 0.99 } : {}}
          disabled={!isComplete}
          className="no-gradient inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 font-bold text-white transition-colors duration-200 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-white shadow-xs"
        >
          <CreditCard size={18} />
          {isComplete ? "Proceed to Review" : `Complete ${pendingCount} More`}
        </motion.button>

        <div className="flex items-start gap-2 rounded-xl border border-cyan-100 bg-cyan-50 p-3 dark:border-cyan-900/70 dark:bg-cyan-950/40">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-cyan-700 dark:text-cyan-300" />
          <p className="text-xs text-cyan-900 dark:text-cyan-200">
            Review your passenger details before moving to checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
