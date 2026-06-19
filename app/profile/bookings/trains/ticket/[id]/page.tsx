import TrainTicketModalShell from "@/app/profile/bookings/trains/TrainTicketModalShell";
import TrainTicketModalContent from "../../@modal/(.)ticket/[id]/components/TrainTicketModalContent";

export default async function TrainTicketPage({
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
