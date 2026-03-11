import { Gift } from "lucide-react";

export default function WalletUsageHint() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-card p-4 shadow-sm sm:p-5">
      <div className="inline-flex w-full items-start gap-2 rounded-xl border border-amber-700 bg-amber-100 px-3 py-2 text-sm text-amber-800">
        <Gift className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="leading-5">
          Use wallet balance during checkout to reduce payment steps and complete
          bookings faster.
        </p>
      </div>
    </section>
  );
}
