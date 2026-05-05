import type { Payment } from "@/types/Payment";

export function PaymentCard({ payment }: { payment: Payment | null }) {
  const safePayment = payment ?? null;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2.5">
        <Info
          label="Amount Paid"
          value={safePayment?.amount ? `₹${safePayment.amount}` : "—"}
          highlight
        />
        <Info
          label="Payment Method"
          value={safePayment?.method ? safePayment.method.toUpperCase() : "—"}
        />

        <Info
          label="Processed On"
          value={
            safePayment?.createdAt
              ? new Date(safePayment.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"
          }
        />

        <Info
          label="Time"
          value={
            safePayment?.createdAt
              ? new Date(safePayment.createdAt).toLocaleTimeString("en-IN")
              : "—"
          }
        />
      </div>

      <div className="mt-1.5 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-[11px] text-gray-600 sm:px-3 sm:text-xs">
        {payment ? "This payment has been securely processed." : "No payment recorded for this booking."}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">{label}</p>
      <p
        className={`mt-1.5 font-semibold text-gray-900 ${
          highlight
            ? "text-lg sm:text-xl"
            : mono
              ? "break-all font-mono text-[11px] sm:text-xs"
              : "text-xs sm:text-sm"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}
