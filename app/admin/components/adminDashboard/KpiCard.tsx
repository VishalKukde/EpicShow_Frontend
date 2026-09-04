import AnimatedNumber from "./AnimatedNumber";

type SubMetric = {
  label: string;
  rawValue: number;
  formatter?: (val: number) => string;
  isInteger?: boolean;
  color: string;
};

type KpiCardProps = {
  label: string;
  rawValue: number;
  formatter?: (val: number) => string;
  isInteger?: boolean;
  helper: string;
  color: string;
  subMetrics?: SubMetric[];
};

export default function KpiCard({ label, rawValue, formatter, isInteger = false, helper, color, subMetrics }: KpiCardProps) {
  return (
    <div
      className="admin-kpi-card"
      style={{
        background: "var(--admin-soft)",
        border: "1px solid var(--admin-border)",
        borderRadius: 16,
        padding: "16px 18px 14px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 6px 24px rgba(15,13,26,.03)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 132,
      }}
    >
      {/* Left accent bar bending seamlessly with card outer radius */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4.5,
          background: color,
          borderRadius: "16px 0 0 16px",
        }}
      />

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <p
            style={{
              margin: 0,
              color: "var(--admin-text-secondary)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </p>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
        </div>

        <p
          style={{
            margin: "4px 0 6px",
            color: "var(--admin-text)",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-.03em",
            lineHeight: 1.1,
          }}
        >
          <AnimatedNumber value={rawValue} formatter={formatter} isInteger={isInteger} />
        </p>
      </div>

      {/* Sub-metrics breakdown or single helper pill */}
      {subMetrics && subMetrics.length > 0 ? (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
          {subMetrics.map((item) => (
            <span
              key={item.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: `${item.color}14`,
                color: item.color,
                border: `1px solid ${item.color}25`,
                borderRadius: 6,
                padding: "2px 7px",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              <span style={{ width: 4, height: 4, borderRadius: 999, background: item.color }} />
              {item.label}: <AnimatedNumber value={item.rawValue} formatter={item.formatter} isInteger={item.isInteger} />
            </span>
          ))}
        </div>
      ) : (
        <span
          style={{
            color: "var(--admin-text-secondary)",
            background: `${color}0D`,
            borderRadius: 999,
            padding: "3px 9px",
            fontSize: 10.5,
            fontWeight: 600,
            width: "fit-content",
          }}
        >
          {helper}
        </span>
      )}
    </div>
  );
}
