import { Suspense } from "react";
import Ticket from "./Ticket";
import { PaymentSkeleton } from "./skeleton";

interface PageProps {
  params: Promise<{
    id: string;
    status: string;
    bookingId: string;
  }>;
}

export default async function PaymentPage({ params }: PageProps) {
  const { id, status, bookingId } = await params;

  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <Ticket id={id} status={status} bookingId={bookingId} />
    </Suspense>
  );
}
