import { CalendarClock } from "lucide-react";

export default function NextAutoDebitCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">Next Auto Debit</h3>
      <p className="mt-1 text-sm text-gray-500">No upcoming recurring payments.</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700">
        <CalendarClock className="h-4 w-4" />
        Recurring plans disabled
      </div>
    </div>
  );
}
