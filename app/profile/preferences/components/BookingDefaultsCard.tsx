import { Armchair, Sparkles } from "lucide-react";
import type { SeatZone } from "./PreferenceTypes";
import { ComingSoonChip } from "./ComingSoonChip";
import { ToggleRow } from "./ToggleRow";

type BookingDefaultsCardProps = {
  dark: boolean;
  preferredSeatZone: SeatZone;
  setPreferredSeatZone: (zone: SeatZone) => void;
  defaultTicketCount: number;
  setDefaultTicketCount: (count: number) => void;
  autoSelectSeats: boolean;
  onToggleAutoSelectSeats: () => void;
  instantConfirmOnly: boolean;
  onToggleInstantConfirmOnly: () => void;
};

export function BookingDefaultsCard({
  dark,
  preferredSeatZone,
  setPreferredSeatZone,
  defaultTicketCount,
  setDefaultTicketCount,
  autoSelectSeats,
  onToggleAutoSelectSeats,
  instantConfirmOnly,
  onToggleInstantConfirmOnly,
}: BookingDefaultsCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>Booking Defaults</h2>
          <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Pre-select options to speed up booking flow.
          </p>
        </div>
        <ComingSoonChip dark={dark} />
      </div>

      <div className="mt-4 space-y-3">
        <div
          className={`rounded-xl border px-3 py-2.5 sm:px-4 ${
            dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
          }`}
        >
          <p className={`text-sm font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>Preferred Seat Zone</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["front", "middle", "back"] as const).map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => setPreferredSeatZone(zone)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium capitalize transition ${
                  preferredSeatZone === zone
                    ? dark
                      ? "border-indigo-400 bg-zinc-900 text-zinc-100"
                      : "border-gray-900 bg-gray-900 text-white"
                    : dark
                      ? "border-zinc-700 bg-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`rounded-xl border px-3 py-2.5 sm:px-4 ${
            dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
          }`}
        >
          <p className={`text-sm font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>Default Ticket Count</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setDefaultTicketCount(count)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                  defaultTicketCount === count
                    ? dark
                      ? "border-indigo-400 bg-zinc-900 text-zinc-100"
                      : "border-gray-900 bg-gray-900 text-white"
                    : dark
                      ? "border-zinc-700 bg-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          dark={dark}
          title="Auto-select best available seats"
          subtitle="Prioritize center seats when possible"
          checked={autoSelectSeats}
          onToggle={onToggleAutoSelectSeats}
          icon={<Armchair className="h-4 w-4" />}
        />
        <ToggleRow
          dark={dark}
          title="Show instant-confirmation shows first"
          subtitle="Prefer fast confirmation inventory"
          checked={instantConfirmOnly}
          onToggle={onToggleInstantConfirmOnly}
          icon={<Sparkles className="h-4 w-4" />}
        />
      </div>
    </article>
  );
}
