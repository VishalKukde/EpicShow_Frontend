import EventTicketModalShell from "@/app/profile/bookings/events/EventTicketModalShell";
import TicketModalContent from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/TicketModalContent";

export default async function EventsTicketModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const closeHref = "/profile/bookings/events";

  return (
    <EventTicketModalShell closeHref={closeHref}>
      <TicketModalContent id={id} type="events" closeHref={closeHref} />
    </EventTicketModalShell>
  );
}
