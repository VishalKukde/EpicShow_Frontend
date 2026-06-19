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
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_48px_-34px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-950">
      <div className="bg-slate-950 p-6 text-white dark:bg-white dark:text-slate-950">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] opacity-70">Booking Summary</p>
        <h3 className="mt-2 text-2xl font-black">Review travellers</h3>
      </div>

      <div className="space-y-6 p-6">
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-start gap-3">
            <Route size={18} className="mt-0.5 shrink-0 text-cyan-600" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Route</p>
              <p className="truncate font-bold text-slate-950 dark:text-slate-50">{train.trainName}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                {train.fromStation} <ArrowRight size={13} className="inline" /> {train.toStation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
            <Ticket size={18} className="text-emerald-600" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {seats.length} seat{seats.length !== 1 ? "s" : ""} selected
            </span>
          </div>
        </div>

        <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
              Passengers ({passengers.length}/{seats.length})
            </p>
            <UserRoundCheck size={18} className={isComplete ? "text-emerald-600" : "text-amber-600"} />
          </div>
          <div className="space-y-2">
            {passengers.map((passenger) => (
              <div key={passenger.seatNumber} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900/70">
                <span className="min-w-0 truncate font-semibold text-slate-700 dark:text-slate-200">{passenger.name}</span>
                <span className="shrink-0 text-xs font-bold text-slate-500">Seat {passenger.seatNumber}</span>
              </div>
            ))}
            {pendingCount > 0 && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                {pendingCount} passenger{pendingCount !== 1 ? "s" : ""} pending
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Base Price (x{seats.length})</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">GST (18%)</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              ₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-end justify-between gap-4">
            <span className="font-bold text-slate-900 dark:text-slate-100">Total Amount</span>
            <span className="text-3xl font-black text-cyan-600 dark:text-cyan-300">
              ₹{finalPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <motion.button
          onClick={onProceed}
          whileHover={isComplete ? { scale: 1.02 } : {}}
          whileTap={isComplete ? { scale: 0.98 } : {}}
          disabled={!isComplete}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 to-cyan-700 py-3 font-bold text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 dark:from-white dark:to-cyan-300 dark:text-slate-950"
        >
          <CreditCard size={18} />
          {isComplete ? "Proceed to Review" : `Complete ${pendingCount} More`}
        </motion.button>

        <div className="flex items-start gap-2 rounded-xl border border-cyan-100 bg-cyan-50 p-3 dark:border-cyan-900/70 dark:bg-cyan-950/40">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-cyan-700 dark:text-cyan-300" />
          <p className="text-xs text-cyan-900 dark:text-cyan-200">
            Review your passengers before moving to secure payment.
          </p>
        </div>
      </div>
    </div>
  );
}
