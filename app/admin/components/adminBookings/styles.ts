import type { CSSProperties } from "react";

export const cellStyle: CSSProperties = {
  padding: "11px 14px",
  borderBottom: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
  fontSize: 12,
  verticalAlign: "middle",
};

export const selectStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--admin-border)",
  background: "var(--admin-surface)",
  borderRadius: 12,
  padding: "10px 12px",
  color: "var(--admin-text)",
  fontSize: 13,
  outline: "none",
};

export const fieldStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

export const fieldLabelStyle: CSSProperties = {
  color: "var(--admin-text-secondary)",
  fontSize: 12,
  fontWeight: 800,
};

export const secondaryButtonStyle: CSSProperties = {
  border: "1px solid var(--admin-border)",
  background: "var(--admin-surface)",
  color: "var(--admin-text)",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
};

export const primaryButtonStyle: CSSProperties = {
  border: "none",
  background: "#4F46E5",
  color: "var(--admin-on-accent)",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
};
