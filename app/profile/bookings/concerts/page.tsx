import BookingSection from "../[type]/components/BookingSection";

export default function ConcertBookingsPage() {
  return (
    <div className="h-[100vh] min-h-0 select-none">
      <BookingSection apiEndpoint="/bookings/concerts" title="Concert Bookings" type="concerts" />
    </div>
  );
}
