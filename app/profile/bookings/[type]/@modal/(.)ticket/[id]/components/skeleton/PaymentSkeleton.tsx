export default function PaymentSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-5 animate-pulse space-y-4">
      {/* Title */}
      <div className="h-4 w-28 bg-gray-200 rounded" />

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between pt-3 border-t">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
