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
                className="h-[300px] rounded-2xl bg-gray-200 animate-pulse"
              />
            ))
          : items.map((item) => <GamingCard key={item._id} item={item} />)}
      </div>
    </section>
  );
}
