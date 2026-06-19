import BookingSection from "../[type]/components/BookingSection";

export default function GamingBookingsPage() {
  return (
    <div className="h-[100vh] min-h-0 select-none">
      <BookingSection apiEndpoint="/bookings/gaming" title="Gaming Bookings" type="gaming" />
    </div>
  );
}
