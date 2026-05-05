type AdminComingSoonPanelProps = {
  label: string;
};

export default function AdminComingSoonPanel({ label }: AdminComingSoonPanelProps) {
  return (
    <section style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20, padding: 22, boxShadow: "0 18px 50px rgba(15,13,26,.06)" }}>
      <p style={{ margin: 0, color: "#4F46E5", fontSize: 11, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase" }}>Module ready</p>
      <h2 style={{ margin: "8px 0 8px", color: "var(--admin-text)", fontSize: 22, fontWeight: 950, letterSpacing: "-.04em" }}>{label} admin tools</h2>
      <p style={{ margin: 0, color: "var(--admin-text-secondary)", fontSize: 13, maxWidth: 560 }}>
        This tab is available in the admin navigation. The table can be connected once the {label.toLowerCase()} booking API is added.
      </p>
    </section>
  );
}
