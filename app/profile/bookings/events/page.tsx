import BookingSection from "../[type]/components/BookingSection";

export default function EventsBookingsPage() {
  return (
    <div className="h-[100vh] min-h-0 select-none">
      <BookingSection apiEndpoint="/bookings/events" title="Event Bookings" type="events" />
    </div>
  );
}
