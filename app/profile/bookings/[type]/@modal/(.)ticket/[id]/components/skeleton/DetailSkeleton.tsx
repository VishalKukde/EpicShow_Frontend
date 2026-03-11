export default function DetailsSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-5 animate-pulse space-y-4">
      {/* Title */}
      <div className="h-4 w-32 bg-gray-200 rounded" />

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Seat badges */}
      <div className="flex gap-2 pt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-6 w-10 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  );
}
