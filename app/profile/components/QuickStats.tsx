export default function QuickStats() {
  const stats = [
    { title: "Total bookings", value: "24" },
    { title: "Upcoming shows", value: "3" },
    { title: "Total spent", value: "$420" },
    { title: "Favorite genre", value: "Sci-Fi" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.title}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <p className="text-sm text-gray-500">{s.title}</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
