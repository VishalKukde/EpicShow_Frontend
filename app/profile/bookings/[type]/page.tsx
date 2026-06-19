import BookingRoutePage from "../_shared/BookingRoutePage";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return <BookingRoutePage type={type} />;
}
