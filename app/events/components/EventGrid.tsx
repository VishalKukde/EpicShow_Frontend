import type { Event } from "@/types/Event";
import EventCard from "./EventCard";

interface EventGridProps {
  items: Event[];
  loading: boolean;
}

export default function EventGrid({ items, loading }: EventGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-5 pb-24">
      <div className="grid gap-6 sm:gap-6 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[300px] rounded-2xl bg-gray-200 animate-pulse"
              />
            ))
          : items.map((event) => <EventCard key={event._id} event={event} />)}
      </div>
    </section>
  );
}
