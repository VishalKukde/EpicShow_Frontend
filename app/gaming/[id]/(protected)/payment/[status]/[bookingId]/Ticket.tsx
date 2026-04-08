import { Booking } from "@/types/Booking";
import { Payment } from "@/types/Payment";
import Link from "next/link";
import CopyButton from "@/app/movies/[id]/(protected)/payment/components/CopyButton";
import DownloadTicketButton from "@/app/movies/[id]/(protected)/payment/components/DownloadTicketButton";
import { Home } from "lucide-react";
import AutoRedirect from "@/app/movies/[id]/(protected)/payment/components/AutoRedirect";
import ResetGamingStores from "../../components/ResetGamingStores";
import { serverFetch } from "@/lib/serverFetch";
import type { Gaming } from "@/types/Gaming";
import TicketShareButton from "@/components/TicketShareButton";

interface Props {
  id: string;
  status: string;
  bookingId: string;
}

export default async function Ticket({ id, status, bookingId }: Props) {
  const data = await serverFetch(`/gaming/booking/${bookingId}`, {
    authRedirectPath: `/gaming/${id}/payment/${status}/${bookingId}`,
  });
  const booking = data?.booking as Booking;
  const payment = data?.payment as Payment;
  const gaming = (await serverFetch(`/gaming/${id}`, {
    skipAuthRedirect: true,
  }).catch(() => null)) as Gaming | null;

  const themeMap = {
    success: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      icon: "✓",
      title: "Booking Confirmed",
      message: "Your ticket has been successfully booked",
    },
    failed: {
      bg: "bg-rose-100",
      text: "text-rose-600",
      icon: "✕",
      title: "Payment Failed",
      message: "Your payment was not successful",
    },
  };

  const theme = themeMap[status as keyof typeof themeMap];

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invalid payment status
      </div>
    );
  }

  return (
    <>
      <ResetGamingStores />
      <div className="h-screen bg-background flex items-center justify-center px-4 overflow-hidden select-none">
        <div className="w-full max-w-4xl relative">
          <AutoRedirect seconds={20} />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden">
            <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full" />
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full" />

            <div className="p-6 border-b border-dashed">
              <div className="flex items-center gap-4">
                <AnimatedCheck status={status} />
                <div>
                  <h1 className="text-xl font-bold">{theme.title}</h1>
                  <p className="text-gray-500 text-sm">{theme.message}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 text-sm md:grid-cols-2">
              {booking && (
                <div className="space-y-2">
                  <SectionTitle title="Booking" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Booking ID</span>
                    <div className="flex items-center font-medium text-gray-900">
                      {booking._id}
                      <CopyButton value={booking._id} />
                    </div>
                  </div>

                  <Row label="Venue" value={booking.cinemaId} />
                  <Row label="Date" value={booking.date} />
                  <Row label="Time" value={booking.slot} />
                  <Row label="Seats" value={booking.seatIds?.join(", ")} />
                  <div className="pt-2 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{booking.amount}</span>
                  </div>
                </div>
              )}

              {payment && (
                <div className="space-y-2">
                  <SectionTitle title="Payment" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Payment ID</span>
                    <div className="flex items-center font-medium text-gray-900">
                      {payment.paymentId}
                      <CopyButton value={payment.paymentId} />
                    </div>
                  </div>

                  <Row label="Method" value={formatMethod(payment.method)} />
                  <Row
                    label="Status"
                    value={
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                          payment.status === "success"
                            ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                            : "bg-rose-50 text-rose-600 ring-rose-200"
                        }`}
                      >
                        {capitalize(payment.status)}
                      </span>
                    }
                  />
                  <Row
                    label="Transaction"
                    value={new Date(payment.createdAt).toLocaleString()}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3 sm:gap-4">
            <DownloadTicketButton booking={booking} payment={payment} />
            {booking ? (
              <TicketShareButton
                movieTitle={gaming?.title}
                movieId={id}
                bookingId={booking._id}
                cinemaId={booking.cinemaId}
                date={booking.date}
                slot={booking.slot}
                seatIds={booking.seatIds}
                amount={booking.amount}
                status={booking.status}
                posterUrl={gaming?.imageUrl}
              />
            ) : null}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <Home size={16} strokeWidth={2} />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const Row = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between text-gray-700">
    <span>{label}</span>
    <span className="font-medium text-gray-900 text-right">{value}</span>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <div className="text-xs uppercase tracking-wide text-gray-400 pb-2">
    {title}
  </div>
);

const formatMethod = (method?: string) => {
  if (!method) return "—";

  const map: Record<string, string> = {
    upi: "UPI",
    card: "Card",
    netbanking: "Net Banking",
    wallet: "Wallet",
  };

  return map[method] || method;
};

const capitalize = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "—";

const AnimatedCheck = ({ status }: { status: string }) => {
  const color =
    status === "success"
      ? "text-emerald-500"
      : status === "failed"
        ? "text-rose-500"
        : "text-amber-500";

  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <circle cx="28" cy="28" r="26" stroke="currentColor" className={color} strokeWidth="3" />
      <path
        d="M18 29L25 36L38 21"
        stroke="currentColor"
        className={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
