import { bookingTypeConfig } from "@/lib/BookingTypes";
import BookingSection from "./components/BookingSection";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  const config = bookingTypeConfig[type as keyof typeof bookingTypeConfig];

  if (!config) {
    return <div className="p-6">Invalid booking type</div>;
  }

  return (
    <div className="space-y-3">
      <div className="hidden sm:inline">
        <h1
          className={`text-2xl font-semibold text-gray-900 ${
            config.title === "Movie Bookings" ? "hidden sm:block" : ""
          }`}
        >
          {config.title}
        </h1>
        <p className="text-sm text-gray-500">
          {config.title === "Movie Bookings" ? (
            <>
              <span className="hidden">View and manage your bookings here.</span>
              <span className="hidden sm:inline">
                View and manage your {config.title.toLowerCase()} here.
              </span>
            </>
          ) : (
            `View and manage your ${config.title.toLowerCase()} here.`
          )}
        </p>
        <div className="border-b border-gray-200 pt-3" />
      </div>
      <BookingSection apiEndpoint={config.api} />
    </div>
  );
}
