type FilterPillsProps = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  counts: Record<string, number>;
};

export default function FilterPills({
  activeFilter,
  setActiveFilter,
  counts,
}: FilterPillsProps) {
  const filters = ["All", "Upcoming", "Past", "Cancelled"];
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((f: string, idx: number) => (
        <button
          key={idx}
          onClick={() => setActiveFilter(f)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition
          ${
            activeFilter === f
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {f} ({counts[f]})
        </button>
      ))}
    </div>
  );
}
