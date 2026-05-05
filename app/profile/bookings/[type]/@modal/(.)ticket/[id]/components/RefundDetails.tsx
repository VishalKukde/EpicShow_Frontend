import { BadgeIndianRupee, CircleDashed, Clock3 } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

const RefundDetails = ({ status, amount, date }: { status: string | null; amount: number | null; date: string | null }) => {
  const isRefundActive =
  status === "refund_initiated" || status === "refunded";
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
        Refund Details
      </h3>

      <div className="space-y-2.5">
        <Row label="Refund Amount" value={ isRefundActive && amount ? `₹${amount.toFixed(2)}` : "-"} icon={BadgeIndianRupee} />
        <Row
          label="Status"
          value={isRefundActive ? ( 
            <span className={`rounded-full ring-2 ${status == "refund_initiated" ? "bg-yellow-100 text-yellow-600 ring-yellow-200" : status == "refunded" ? "bg-green-100 text-green-600 ring-green-200" : "bg-gray-100 text-gray-600 ring-gray-200"}  px-2 py-0.5 text-[10px] font-semibold uppercase  `}>
              {status == "refund_initiated" ? "Refund Initiated" : status == "refunded" ? "Refunded" : ""}
            </span>):"-"
          }
          icon={CircleDashed}
        />
        <Row label="Processed On" value={isRefundActive && date
          ? new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          : "-"} icon={Clock3} />
      </div>
    </div>
  )
}

export default RefundDetails

function Row({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:p-3">
      <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
        <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        {label}
      </p>
      <div className="text-xs font-semibold text-gray-900 sm:text-sm">{value}</div>
    </div>
  );
}
