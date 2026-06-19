import SportsTicketModalShell from "@/app/profile/bookings/sports/SportsTicketModalShell";
import TicketModalContent from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/TicketModalContent";

export default async function SportsTicketModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const closeHref = "/profile/bookings/sports";

  return (
    <SportsTicketModalShell closeHref={closeHref}>
      <TicketModalContent id={id} type="sports" closeHref={closeHref} />
    </SportsTicketModalShell>
  );
}
