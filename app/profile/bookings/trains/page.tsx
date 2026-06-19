import BookingSection from "../[type]/components/BookingSection";

export default function TrainBookingsPage() {
  return (
    <div className="h-[100vh] min-h-0 select-none">
      <BookingSection apiEndpoint="/trains/bookings/profile" title="Train Bookings" type="trains" />
    </div>
  );
}
