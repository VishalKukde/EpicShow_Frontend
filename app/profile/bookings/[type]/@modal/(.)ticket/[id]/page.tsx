import TicketModalShell from "./TicketModalShell";
import TicketModalContent from "./components/TicketModalContent";

export default async function TicketModal({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) {
  const { id, type } = await params;
  const closeHref = `/profile/bookings/${type}`;

  return (
    <TicketModalShell closeHref={closeHref}>
        <TicketModalContent id={id} type={type} closeHref={closeHref} />
    </TicketModalShell>
  );
}
