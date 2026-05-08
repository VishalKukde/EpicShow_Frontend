import type { ReactNode } from "react";
import { useState } from "react";
import { Armchair, Film, Plane, Train, Trophy } from "lucide-react";
import type {
  FlightSeatPreference,
  MovieSeatZone,
  SeatPreferenceCategory,
  SeatPreferences,
  SportSeatPreference,
  TrainSeatPreference,
} from "./PreferenceTypes";
import { ComingSoonChip } from "./ComingSoonChip";

type BookingDefaultsCardProps = {
  dark: boolean;
  seatPreferences: SeatPreferences;
  setSeatPreferences: (
    category: SeatPreferenceCategory,
    value: SeatPreferences[SeatPreferenceCategory]
  ) => void;
  defaultTicketCount: number;
  setDefaultTicketCount: (count: number) => void;
  autoSelectSeats: boolean;
  onToggleAutoSelectSeats: () => void;
  instantConfirmOnly: boolean;
  onToggleInstantConfirmOnly: () => void;
};

type SeatPreferenceGroup<Value extends string> = {
  key: SeatPreferenceCategory;
  title: string;
  subtitle: string;
  icon: ReactNode;
  value: Value;
  options: Array<{ value: Value; label: string; description: string }>;
};

const movieSeatOptions: SeatPreferenceGroup<MovieSeatZone>["options"] = [
  { value: "front", label: "Front", description: "Closer screen view" },
  { value: "middle", label: "Middle", description: "Balanced center view" },
  { value: "back", label: "Back", description: "Wider relaxed view" },
];

const sportSeatOptions: SeatPreferenceGroup<SportSeatPreference>["options"] = [
  { value: "field_side", label: "Field side", description: "Closest to action" },
  { value: "center_view", label: "Center view", description: "Best full-ground angle" },
  { value: "covered_upper", label: "Covered upper", description: "Shade and wide view" },
];

const trainSeatOptions: SeatPreferenceGroup<TrainSeatPreference>["options"] = [
  { value: "window", label: "Window", description: "View and privacy" },
  { value: "lower_berth", label: "Lower berth", description: "Easy boarding" },
  { value: "aisle", label: "Aisle", description: "Quick movement" },
];

const flightSeatOptions: SeatPreferenceGroup<FlightSeatPreference>["options"] = [
  { value: "window", label: "Window", description: "View and wall side" },
  { value: "aisle", label: "Aisle", description: "Easy access" },
  { value: "extra_legroom", label: "Extra legroom", description: "More stretch space" },
];

export function BookingDefaultsCard({
  dark,
  seatPreferences,
  setSeatPreferences,
}: BookingDefaultsCardProps) {
  const seatPreferenceGroups = [
    {
      key: "movie",
      title: "Movie",
      subtitle: "Cinema rows",
      icon: <Film className="h-4 w-4" />,
      value: seatPreferences.movie,
      options: movieSeatOptions,
    },
    {
      key: "sport",
      title: "Sport",
      subtitle: "Stadium sections",
      icon: <Trophy className="h-4 w-4" />,
      value: seatPreferences.sport,
      options: sportSeatOptions,
    },
    {
      key: "train",
      title: "Train",
      subtitle: "Coach and berth",
      icon: <Train className="h-4 w-4" />,
      value: seatPreferences.train,
      options: trainSeatOptions,
    },
    {
      key: "flight",
      title: "Flight",
      subtitle: "Cabin seats",
      icon: <Plane className="h-4 w-4" />,
      value: seatPreferences.flight,
      options: flightSeatOptions,
    },
  ] satisfies Array<SeatPreferenceGroup<string>>;

  const [activeSeatCategory, setActiveSeatCategory] = useState<SeatPreferenceCategory>("movie");
  const activeSeatGroup = seatPreferenceGroups.find((group) => group.key === activeSeatCategory) ?? seatPreferenceGroups[0];

  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm ${dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>Seat Preferences</h2>
          <p className={`mt-1 text-xs ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Pre-select options to speed up booking flow.
          </p>
        </div>
        <ComingSoonChip dark={dark} />
      </div>

      <div className="mt-4 space-y-3 ">
        {/* <div
          className={`rounded-xl border px-3 py-2.5 sm:px-4 ${
            dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
          }`}
        > */}
          {/* <div className="flex items-center gap-2">
            <Armchair className={`h-4 w-4 ${dark ? "text-indigo-300" : "text-indigo-600"}`} />
            <p className={`text-sm font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>
              Seat Layout Preferences
            </p>
          </div> */}
          <div className="mt-3 space-y-3 ">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {seatPreferenceGroups.map((group) => {
                const active = group.key === activeSeatCategory;

                return (
                  <button
                    key={group.key}
                    type="button"
                    onClick={() => setActiveSeatCategory(group.key)}
                    className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition cursor-pointer ${
                      active
                        ? dark
                          ? "border-indigo-400 bg-indigo-400/15 text-indigo-100"
                          : "border-gray-900 bg-gray-900 text-white"
                        : dark
                          ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-pressed={active}
                  >
                    {group.icon}
                    {group.title}
                  </button>
                );
              })}
            </div>

            {activeSeatGroup ? (
              <section
                className={`rounded-xl border p-3 ${
                  dark ? "border-zinc-700 bg-zinc-800/60" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`inline-flex items-center gap-2 text-sm font-medium ${
                        dark ? "text-zinc-100" : "text-gray-900"
                      }`}
                    >
                      {activeSeatGroup.icon}
                      {activeSeatGroup.title}
                    </p>
                    <p className={`mt-0.5 text-xs ${dark ? "text-zinc-400" : "text-gray-600"}`}>
                      {activeSeatGroup.subtitle}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {activeSeatGroup.options.map((option) => {
                    const selected = activeSeatGroup.value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSeatPreferences(activeSeatGroup.key, option.value)}
                        className={`min-h-16 rounded-lg border px-3 py-2 text-left transition cursor-pointer ${
                          selected
                            ? dark
                              ? "border-indigo-400 bg-zinc-900 text-zinc-100"
                              : "border-gray-900 bg-gray-900 text-white"
                            : dark
                              ? "border-zinc-700 bg-zinc-700 text-zinc-300 hover:bg-zinc-800"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span className="block text-xs font-semibold">{option.label}</span>
                        <span
                          className={`mt-1 block text-[11px] leading-4 ${
                            selected ? (dark ? "text-zinc-300" : "text-gray-200") : dark ? "text-zinc-500" : "text-gray-500"
                          }`}
                        >
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>
        {/* </div> */}

        {/* <div
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
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition cursor-pointer ${
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
        </div> */}

        {/* <ToggleRow
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
        /> */}
      </div>
    </article>
  );
}
