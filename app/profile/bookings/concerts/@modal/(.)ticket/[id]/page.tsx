import ConcertTicketModalShell from "@/app/profile/bookings/concerts/ConcertTicketModalShell";
import TicketModalContent from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/TicketModalContent";

export default async function ConcertTicketModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const closeHref = "/profile/bookings/concerts";

  return (
    <ConcertTicketModalShell closeHref={closeHref}>
      <TicketModalContent id={id} type="concerts" closeHref={closeHref} />
    </ConcertTicketModalShell>
  );
}
