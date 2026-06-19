import { Train } from "@/types/Train";
import TrainCard from "./TrainCard";
import TrainLoader from "./TrainLoader";

interface TrainGridProps {
  items: Train[];
  loading: boolean;
  selectedDate: string;
}

export default function TrainGrid({ items, loading, selectedDate }: TrainGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full">
            <TrainLoader />
          </div>
        ) : items.length > 0
          ? items.map((train) => <TrainCard key={train._id} train={train} selectedDate={selectedDate} />)
          : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white py-14 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">No trains found</p>
              <p className="mt-1 text-sm">Try adjusting your search criteria</p>
            </div>
          )}
      </div>
    </section>
  );
}
