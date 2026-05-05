import AdminPagination from "../shared/AdminPagination";
import BookingTableRows from "./BookingTableRows";
import type { BookingPagination, BookingRow } from "./types";

type BookingsDataTableProps = {
  label: string;
  rows: BookingRow[];
  loading: boolean;
  error: string;
  page: number;
  pagination: BookingPagination | null;
  activeFilterCount: number;
  onOpenFilters: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onViewRow: (row: BookingRow) => void;
};

const TABLE_HEADINGS = ["Title/Name", "User Name", "Booking Status", "Booking Time", "Theater", "Actions"];

export default function BookingsDataTable({
  label,
  rows,
  loading,
  error,
  page,
  pagination,
  activeFilterCount,
  onOpenFilters,
  onPreviousPage,
  onNextPage,
  onViewRow,
}: BookingsDataTableProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(248,250,252,.82)",
        paddingBottom: 6,
      }}
    >
      <div className="admin-table-shell" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 18px 50px rgba(15,13,26,.07)", backdropFilter: "blur(16px)" }}>
        <div style={{ padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--admin-border)" }}>
          <div>
            <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 14, fontWeight: 800 }}>{label} Bookings</p>
            <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12 }}>
              The table stays pinned while only the booking rows scroll.
            </p>
          </div>
          <button onClick={onOpenFilters} style={{ border: "1px solid rgba(99, 102, 241, 0.35)", background: "rgba(99, 102, 241, 0.12)", color: "#4F46E5", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
            Filters {activeFilterCount ? `(${activeFilterCount})` : ""}
          </button>
        </div>
        <div style={{ maxHeight: "calc(100vh - 210px)", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 5 }}>
              <tr style={{ background: "#0F0D1A" }}>
                {TABLE_HEADINGS.map((head) => (
                  <th key={head} style={{ padding: "11px 14px", color: "var(--admin-text-muted)", fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", whiteSpace: "nowrap" }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <BookingTableRows rows={rows} loading={loading} error={error} onView={onViewRow} />
            </tbody>
          </table>
        </div>

        <AdminPagination
          page={page}
          loading={loading}
          pagination={pagination}
          onPrevious={onPreviousPage}
          onNext={onNextPage}
        />
      </div>
    </div>
  );
}
