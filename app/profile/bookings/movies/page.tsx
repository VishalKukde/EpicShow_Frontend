import BookingSection from "../[type]/components/BookingSection";

export default function MoviesBookingsPage() {
  return (
    <div className="h-[100vh] min-h-0 select-none">
      <BookingSection apiEndpoint="/bookings/movies" title="Movie Bookings" type="movies" />
    </div>
  );
}
