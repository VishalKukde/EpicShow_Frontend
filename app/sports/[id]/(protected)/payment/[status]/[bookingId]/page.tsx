import Ticket from "./Ticket";

interface PageProps {
  params: Promise<{
    id: string;
    status: string;
    bookingId: string;
  }>;
}

export default async function SportsPaymentTicketPage({ params }: PageProps) {
  const { id, status, bookingId } = await params;

  return <Ticket id={id} status={status} bookingId={bookingId} />;
}
