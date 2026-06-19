import TrainTicketModalShell from "@/app/profile/bookings/trains/TrainTicketModalShell";
import TrainTicketModalContent from "./components/TrainTicketModalContent";

export default async function TrainTicketModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const closeHref = "/profile/bookings/trains";

  return (
    <TrainTicketModalShell closeHref={closeHref}>
      <TrainTicketModalContent id={id} closeHref={closeHref} />
    </TrainTicketModalShell>
  );
}
