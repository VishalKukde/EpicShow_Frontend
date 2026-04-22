import { bookingTypeConfig } from "@/lib/BookingTypes";
import BookingSection from "./components/BookingSection";
import {
  Clapperboard,
  Gamepad2,
  Sparkles,
  Ticket,
  Trophy,
} from "lucide-react";
import type { ComponentType } from "react";

const bookingHeroMeta: Record<
  string,
  {
    eyebrow: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
  }
> = {
  movies: {
    eyebrow: "Movie Ticket Hub",
    description:
      "Track schedules, seats, payment status, and open your movie tickets from one polished dashboard.",
    icon: Clapperboard,
  },
  sports: {
    eyebrow: "Sports Ticket Hub",
    description:
      "Follow match-day details, venue info, and payment-ready sports passes in one place.",
    icon: Trophy,
  },
  gaming: {
    eyebrow: "Gaming Ticket Hub",
    description:
      "Keep your gaming sessions, slot details, and entry tickets organized with a cleaner booking view.",
    icon: Gamepad2,
  },
  games: {
    eyebrow: "Gaming Ticket Hub",
    description:
      "Keep your gaming sessions, slot details, and entry tickets organized with a cleaner booking view.",
    icon: Gamepad2,
  },
  events: {
    eyebrow: "Event Ticket Hub",
    description:
      "Review upcoming events, venue details, and ticket access without digging through your history.",
    icon: Ticket,
  },
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  const config = bookingTypeConfig[type as keyof typeof bookingTypeConfig];

  if (!config) {
    return <div className="p-6"># Coming Soon... </div>;
  }

  const hero = bookingHeroMeta[type] || {
    eyebrow: "Booking Hub",
    description: `View and manage your ${config.title.toLowerCase()} here.`,
    icon: Ticket,
  };
  const HeroIcon = hero.icon;

  return (
    <div className="h-full min-h-0 select-none">
      {/* <section className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-gradient-to-br from-white/95 via-slate-50/90 to-white/95 p-5 shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Sparkles className="h-3.5 w-3.5" />
              {hero.eyebrow}
            </div>
            <div className="mt-4 flex items-start gap-3">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                <HeroIcon className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-100 sm:text-3xl">
                  {config.title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-zinc-400">
                  {hero.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Cleaner layout", "Quick ticket access", "Modern booking cards"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section> */}
      <BookingSection apiEndpoint={config.api} title={config.title} />
    </div>
  );
}
