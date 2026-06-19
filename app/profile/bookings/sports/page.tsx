import BookingSection from "../[type]/components/BookingSection";

export default function SportsBookingsPage() {
  return (
    <div className="h-[100vh] min-h-0 select-none">
      <BookingSection apiEndpoint="/bookings/sports" title="Sports Bookings" type="sports" />
    </div>
  );
}
