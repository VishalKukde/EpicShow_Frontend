import type { CSSProperties } from "react";

type AdminPaginationProps = {
  page: number;
  loading: boolean;
  pagination: { page: number; total: number; totalPages: number; hasMore: boolean } | null;
  onPrevious: () => void;
  onNext: () => void;
};

export default function AdminPagination({
  page,
  loading,
  pagination,
  onPrevious,
  onNext,
}: AdminPaginationProps) {
  const previousDisabled = page <= 1 || loading;
  const nextDisabled = !pagination?.hasMore || loading;

  return (
    <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--admin-border)", background: "var(--admin-surface)" }}>
      <span style={{ color: "var(--admin-text-secondary)", fontSize: 13 }}>Showing page {pagination?.page || page} of {pagination?.totalPages || 1} • {pagination?.total || 0} records</span>
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={previousDisabled} onClick={onPrevious} style={pageButtonStyle(previousDisabled)}>Previous</button>
        <button disabled={nextDisabled} onClick={onNext} style={pageButtonStyle(nextDisabled)}>Next</button>
      </div>
    </div>
  );
}

function pageButtonStyle(disabled: boolean): CSSProperties {
  return {
    border: "1px solid var(--admin-border)",
    background: disabled ? "var(--admin-soft-solid)" : "var(--admin-surface)",
    color: disabled ? "var(--admin-text-muted)" : "var(--admin-text)",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
