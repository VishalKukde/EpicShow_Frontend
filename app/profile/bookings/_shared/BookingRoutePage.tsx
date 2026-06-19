import { bookingTypeConfig } from "@/lib/BookingTypes";
import BookingSection from "../[type]/components/BookingSection";

type BookingRoutePageProps = {
  type: string;
};

export default function BookingRoutePage({ type }: BookingRoutePageProps) {
  const config = bookingTypeConfig[type as keyof typeof bookingTypeConfig];

  if (!config) {
    return <div className="p-6"># Coming Soon... </div>;
  }

  return (
    <div className="h-[100vh] min-h-0 select-none">
      <BookingSection apiEndpoint={config.api} title={config.title} type={type} />
    </div>
  );
}
