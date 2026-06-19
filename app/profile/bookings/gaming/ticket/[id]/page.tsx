import GamingTicketModalShell from "@/app/profile/bookings/gaming/GamingTicketModalShell";
import TicketModalContent from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/TicketModalContent";

export default async function GamingTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const closeHref = "/profile/bookings/gaming";

  return (
    <GamingTicketModalShell closeHref={closeHref}>
      <TicketModalContent id={id} type="gaming" closeHref={closeHref} />
    </GamingTicketModalShell>
  );
}
