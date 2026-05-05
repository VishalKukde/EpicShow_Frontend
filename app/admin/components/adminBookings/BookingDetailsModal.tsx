import type { ReactNode } from "react";
import { X } from "lucide-react";
import { formatCurrency, formatDate } from "./formatters";
import type { BookingRow } from "./types";

type BookingDetailsModalProps = {
  row: BookingRow;
  onClose: () => void;
};

export default function BookingDetailsModal({ row, onClose }: BookingDetailsModalProps) {
  const seats = Array.isArray(row.seatIds) ? row.seatIds : [];
  const discountTotal = (row.couponDiscount || 0) + (row.rewardDiscount || 0);
  const schedule = [row.date || row.schedule?.date, row.slot || row.schedule?.time].filter(Boolean).join(" at ");
  const venue = row.theater || row.venue?.name || "Venue TBD";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/55 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="flex max-h-[min(82vh,700px)] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,.30)]" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal-header flex items-start justify-between gap-4 px-5 py-4 text-white">
          <div>
            <p className="m-0 text-[10px] font-black uppercase tracking-[.08em] text-emerald-200">{row.showType || row.sportType || "Booking"}</p>
            <p className="mt-1 text-xl font-black leading-tight text-white">{row.title || "Booking Details"}</p>
            <p className="mt-1.5 text-xs font-semibold text-slate-300">Booking ID: {row._id}</p>
          </div>
          <button aria-label="Close booking details" onClick={onClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20">
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>
        <div className="grid gap-3.5 overflow-auto p-5">
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            <Metric label="Status" value={row.status || "-"} />
            <Metric label="Tickets" value={String(row.ticketCount || seats.length || 0)} />
            <Metric label="Sale" value={formatCurrency(row.saleAmount || row.amount || 0)} />
            <Metric label="Discount" value={formatCurrency(discountTotal)} />
          </div>

          <Section title="Customer">
            <Detail label="Name" value={row.userName || "Guest User"} />
            <Detail label="Email" value={row.userEmail || "No email"} />
          </Section>

          <Section title="Show Details">
            <Detail label="Venue" value={venue} />
            <Detail label="Schedule" value={schedule || formatDate(row.bookingTime)} />
            <Detail label="Booked On" value={formatDate(row.bookingTime || row.createdAt || "")} />
            <Detail label="Type" value={row.showType || row.sportType || "-"} />
            <Detail label="League" value={row.league || "-"} />
            <Detail label="Teams" value={row.teams?.label || [row.teams?.teamA, row.teams?.teamB].filter(Boolean).join(" vs ") || "-"} />
          </Section>

          <Section title="Payment And Rewards">
            <Detail label="Payment ID" value={row.paymentId || "-"} />
            <Detail label="Razorpay Order ID" value={row.razorpayOrderId || "-"} />
            <Detail label="Amount" value={formatCurrency(row.amount || row.saleAmount || 0)} />
            <Detail label="Coupon" value={row.coupon || "-"} />
            <Detail label="Coupon Discount" value={formatCurrency(row.couponDiscount || 0)} />
            <Detail label="Reward Points" value={String(row.rewardPointsRedeemed || 0)} />
          </Section>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <p className="mb-2.5 text-xs font-black text-slate-900">Seats</p>
            <div className="flex flex-wrap gap-1.5">
              {seats.length ? seats.map((seat) => (
                <span key={seat} className="rounded-full border border-emerald-100 bg-white px-2.5 py-1 text-[11px] font-black text-emerald-700">{seat}</span>
              )) : <span className="text-xs font-bold text-slate-500">No seat data available</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <p className="mb-2.5 text-xs font-black text-slate-900">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-500">{label}</p>
      <p className="mt-1 text-[15px] font-black text-slate-900" style={{ overflowWrap: "anywhere", textTransform: label === "Status" ? "capitalize" : "none" }}>{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-[10px] font-black uppercase tracking-[.06em] text-slate-400">{label}</p>
      <p className="mt-1 text-xs font-extrabold text-slate-900" style={{ overflowWrap: "anywhere" }}>{value || "-"}</p>
    </div>
  );
}
