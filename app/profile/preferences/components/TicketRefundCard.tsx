import { Bell } from "lucide-react";
import { ComingSoonChip } from "./ComingSoonChip";
import { ToggleRow } from "./ToggleRow";

type TicketRefundCardProps = {
  dark: boolean;
  pushTicketToEmail: boolean;
  onTogglePushTicketToEmail: () => void;
  refundStatusAlerts: boolean;
  onToggleRefundStatusAlerts: () => void;
};

export function TicketRefundCard({
  dark,
  pushTicketToEmail,
  onTogglePushTicketToEmail,
  refundStatusAlerts,
  onToggleRefundStatusAlerts,
}: TicketRefundCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
            Ticket & Refund Communication
          </h2>
          <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Decide how you receive booking and refund updates.
          </p>
        </div>
        <ComingSoonChip dark={dark} />
      </div>

      <div className="mt-4 space-y-2">
        <ToggleRow
          dark={dark}
          title="Send ticket copy to email"
          subtitle="Get e-ticket receipt in your inbox"
          checked={pushTicketToEmail}
          onToggle={onTogglePushTicketToEmail}
          icon={<Bell className="h-4 w-4" />}
        />
        <ToggleRow
          dark={dark}
          title="Refund status alerts"
          subtitle="Receive updates when refund state changes"
          checked={refundStatusAlerts}
          onToggle={onToggleRefundStatusAlerts}
          icon={<Bell className="h-4 w-4" />}
        />
        <div
          className={`rounded-xl border px-3 py-2.5 text-sm sm:px-4 ${
            dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
          }`}
        >
          <p className={`font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>SMS delivery</p>
          <p className={`mt-0.5 text-xs ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Coming soon. Ticket SMS support is currently disabled.
          </p>
          <span
            className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
              dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"
            }`}
          >
            Disabled
          </span>
        </div>
      </div>
    </article>
  );
}
