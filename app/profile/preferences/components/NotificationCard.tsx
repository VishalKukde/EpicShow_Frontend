import { Bell, Sparkles } from "lucide-react";
import { ComingSoonChip } from "./ComingSoonChip";
import { ToggleRow } from "./ToggleRow";

type NotificationCardProps = {
  dark: boolean;
  bookingReminders: boolean;
  emailUpdates: boolean;
  offerAlerts: boolean;
  onToggleBookingReminders: () => void;
  onToggleEmailUpdates: () => void;
  onToggleOfferAlerts: () => void;
};

export function NotificationCard({
  dark,
  bookingReminders,
  emailUpdates,
  offerAlerts,
  onToggleBookingReminders,
  onToggleEmailUpdates,
  onToggleOfferAlerts,
}: NotificationCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>Notification Preferences</h2>
          <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Control communication and booking alerts.
          </p>
        </div>
        <ComingSoonChip dark={dark} />
      </div>

      <div className="mt-4 space-y-2">
        <ToggleRow
          dark={dark}
          title="Booking reminders"
          subtitle="Get reminders before your show starts"
          checked={bookingReminders}
          onToggle={onToggleBookingReminders}
          icon={<Bell className="h-4 w-4" />}
        />
        <ToggleRow
          dark={dark}
          title="Email updates"
          subtitle="Receive booking receipts and account updates"
          checked={emailUpdates}
          onToggle={onToggleEmailUpdates}
          icon={<Sparkles className="h-4 w-4" />}
        />
        <ToggleRow
          dark={dark}
          title="Offer alerts"
          subtitle="Notify me about new promos and coupon drops"
          checked={offerAlerts}
          onToggle={onToggleOfferAlerts}
          icon={<Sparkles className="h-4 w-4" />}
        />
      </div>
    </article>
  );
}
