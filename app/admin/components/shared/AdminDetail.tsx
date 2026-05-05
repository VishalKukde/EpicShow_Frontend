export default function AdminDetail({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--admin-soft-solid)", border: "1px solid var(--admin-border)", borderRadius: 16, padding: 14 }}>
      <p style={{ margin: 0, color: "var(--admin-text-muted)", fontSize: 11, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "5px 0 0", color: "var(--admin-text)", fontSize: 14, fontWeight: 800 }}>{value}</p>
    </div>
  );
}
