import { STATUS_COLORS } from "./constants";
import { formatCurrency, formatDate } from "./formatters";
import { cellStyle } from "./styles";
import type { BookingRow } from "./types";

type BookingTableRowsProps = {
  rows: BookingRow[];
  loading: boolean;
  error: string;
  onView: (row: BookingRow) => void;
};

export default function BookingTableRows({ rows, loading, error, onView }: BookingTableRowsProps) {
  if (loading) {
    return (
      <>
        {Array.from({ length: 6 }, (_, index) => (
          <tr key={index}>
            <td colSpan={6} style={{ padding: 18, borderBottom: "1px solid var(--admin-border)" }}>
              <div style={{ height: 16, borderRadius: 999, background: "var(--admin-border)" }} />
            </td>
          </tr>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <tr>
        <td colSpan={6} style={{ padding: 28, color: "#DC2626", textAlign: "center", fontWeight: 700 }}>{error}</td>
      </tr>
    );
  }

  if (rows.length === 0) {
    return (
      <tr>
        <td colSpan={6} style={{ padding: 38, color: "var(--admin-text-secondary)", textAlign: "center", fontWeight: 700 }}>No bookings found for the selected filters.</td>
      </tr>
    );
  }

  return (
    <>
      {rows.map((row) => {
        const colors = STATUS_COLORS[row.status] || { bg: "#F3F4F6", text: "#374151" };

        return (
          <tr key={row._id} style={{ background: "var(--admin-surface)" }}>
            <td style={cellStyle}>
              <strong style={{ color: "var(--admin-text)" }}>{row.title || "-"}</strong>
              <div style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>{row.ticketCount || 0} tickets - {formatCurrency(row.saleAmount || 0)}</div>
            </td>
            <td style={cellStyle}>{row.userName || "Guest User"}</td>
            <td style={cellStyle}><span style={{ background: colors.bg, color: colors.text, borderRadius: 999, padding: "5px 10px", fontSize: 12, fontWeight: 800, textTransform: "capitalize" }}>{row.status}</span></td>
            <td style={cellStyle}>{formatDate(row.bookingTime)}</td>
            <td style={cellStyle}>{row.theater || "Venue TBD"}</td>
            <td style={cellStyle}><button onClick={() => onView(row)} style={{ border: "none", background: "rgba(99, 102, 241, 0.14)", color: "#4F46E5", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>View</button></td>
          </tr>
        );
      })}
    </>
  );
}
