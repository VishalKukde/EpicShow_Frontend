type KpiCardProps = {
  label: string;
  value: string;
  helper: string;
  color: string;
};

export default function KpiCard({ label, value, helper, color }: KpiCardProps) {
  return (
    <div className="admin-kpi-card" style={{ background: "var(--admin-soft)", border: "1px solid var(--admin-border)", borderRadius: 16, padding: 15, position: "relative", overflow: "hidden", boxShadow: "0 12px 34px rgba(15,13,26,.055)" }}>
      <div style={{ position: "absolute", right: -28, top: -32, width: 96, height: 96, background: `${color}14`, borderRadius: "50%" }} />
      <div style={{ width: 32, height: 32, borderRadius: 12, background: `${color}1F`, display: "grid", placeItems: "center", marginBottom: 11 }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
      </div>
      <p style={{ margin: 0, color: "var(--admin-text-secondary)", fontSize: 10.5, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "4px 0 7px", color: "var(--admin-text)", fontSize: 22, fontWeight: 900, letterSpacing: "-.05em" }}>{value}</p>
      <span style={{ color, background: `${color}12`, borderRadius: 999, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>{helper}</span>
    </div>
  );
}
