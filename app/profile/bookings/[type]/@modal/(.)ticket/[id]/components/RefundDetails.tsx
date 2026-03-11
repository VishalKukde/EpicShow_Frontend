import { BadgeIndianRupee, CircleDashed, Clock3 } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

const RefundDetails = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
        Refund Details
      </h3>

      <div className="space-y-2.5">
        <Row label="Refund Amount" value="₹0" icon={BadgeIndianRupee} />
        <Row
          label="Status"
          value={
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-600 ring-1 ring-gray-200">
              Not initiated
            </span>
          }
          icon={CircleDashed}
        />
        <Row label="Processed On" value="—" icon={Clock3} />
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
