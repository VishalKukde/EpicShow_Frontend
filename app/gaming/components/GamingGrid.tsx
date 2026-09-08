import type { Gaming } from "@/types/Gaming";
import GamingCard from "./GamingCard";

interface GamingGridProps {
  items: Gaming[];
  loading: boolean;
}

export default function GamingGrid({ items, loading }: GamingGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-5 pb-24">
      <div className="grid gap-6 sm:gap-6 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-75 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))
          : items.map((item) => <GamingCard key={item._id} item={item} />)}
      </div>

      {!loading && items.length === 0 && (
        <div className="text-center py-16 px-4 bg-gray-50 border border-gray-100 rounded-3xl space-y-2">
          <h3 className="text-base font-bold text-gray-800">No Upcoming Gaming Events</h3>
          <p className="text-xs text-gray-500 font-medium">
            There are currently no gaming events scheduled from tomorrow onwards. Please check back soon!
          </p>
        </div>
      )}
    </section>
  );
}
