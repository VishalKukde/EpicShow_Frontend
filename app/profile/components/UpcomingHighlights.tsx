export default function UpcomingHighlight() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex gap-6 items-center">
      <div className="w-24 h-32 bg-gray-200 rounded-lg" />

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">Dune: Part Two</h3>
        <p className="text-gray-500 mt-1">IMAX Cinema • 7:30 PM</p>
        <p className="text-gray-500">Seats A4, A5</p>
      </div>

      <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">
        View Ticket
      </button>
    </div>
  );
}
