import MovieTicketModalShell from "@/app/profile/bookings/movies/MovieTicketModalShell";
import TicketModalContent from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/TicketModalContent";

export default async function MoviesTicketModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const closeHref = "/profile/bookings/movies";

  return (
    <MovieTicketModalShell closeHref={closeHref}>
      <TicketModalContent id={id} type="movies" closeHref={closeHref} />
    </MovieTicketModalShell>
  );
}
