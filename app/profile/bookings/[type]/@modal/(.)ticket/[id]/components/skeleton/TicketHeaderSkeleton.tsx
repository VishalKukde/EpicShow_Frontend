export default function HeaderSkeleton() {
  return (
    <div className="px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-4 animate-pulse">
        {/* Poster */}
        <div className="w-16 h-20 rounded-lg bg-gray-200" />

        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-4 w-40 bg-gray-200 rounded" />

          {/* Subtitle */}
          <div className="h-3 w-28 bg-gray-200 rounded" />

          {/* Location */}
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>

        {/* Close button */}
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
