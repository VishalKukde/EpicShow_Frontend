export default function TicketSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[240px] sm:h-[280px] rounded-xl bg-gray-200 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
