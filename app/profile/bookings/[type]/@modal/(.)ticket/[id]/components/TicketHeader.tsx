import { BOOKING_STATUS } from "@/constants/Constants";
import CloseButton from "../CloseButton";
type TicketHeaderProps = {
  id: string;
  name: string;
  closeHref: string,
  status: string
}

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  paid:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  failed:
    "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  cancelled:
    "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
  refunded:
    "bg-indigo-50 text-gray-700 ring-1 ring-inset ring-indigo-200",
  expired:
    "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
};



export function TicketHeader({ id, name, closeHref, status }: TicketHeaderProps) {
  const normalizedStatus = status?.toLowerCase();
  const statusStyle =
    STATUS_STYLES[normalizedStatus] ||
    "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200";

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
            <span>{name}</span>
            <span
              className={`inline-flex shrink-0 items-center justify-center rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest leading-none ${statusStyle}`}
            >
              {status === BOOKING_STATUS.UPCOMING ? "UPCOMING" : status.toUpperCase()}
            </span>
          </h2>

          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Booking ID:{" "}{id}
          </p>
        </div>

        <div className="pt-0.5">
          <CloseButton closeHref={closeHref} />
        </div>
      </div>
    </div>

  );
}
