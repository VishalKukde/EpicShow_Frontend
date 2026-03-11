/* eslint-disable @next/next/no-img-element */

type OgTicketPosterProps = {
  title: string;
  bookingId: string;
  cinema: string;
  date: string;
  slot: string;
  seats: string;
  amount: string;
  status: string;
  posterUrl: string | null;
};

const labelStyle = {
  fontSize: 16,
  letterSpacing: "0.09em",
  textTransform: "uppercase" as const,
  color: "rgba(148, 163, 184, 0.88)",
};

const valueStyle = {
  fontSize: 31,
  fontWeight: 650,
  color: "#f8fafc",
};

export default function OgTicketPoster({
  title,
  bookingId,
  cinema,
  date,
  slot,
  seats,
  amount,
  status,
  posterUrl,
}: OgTicketPosterProps) {
  const isConfirmed = status === "confirmed" || status === "success";
  const statusColor = isConfirmed ? "#22c55e" : "#f97316";
  const statusLabel = isConfirmed ? "Booking Confirmed" : "Booking Update";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        fontFamily:
          "Inter, Segoe UI, Roboto, Helvetica Neue, Arial, ui-sans-serif, sans-serif",
        background: "radial-gradient(circle at 20% 0%, #1e293b 0%, #020617 66%)",
      }}
    >
      {posterUrl ? (
        <img
          src={posterUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.3,
            transform: "scale(1.08)",
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(109deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.82) 42%, rgba(2,6,23,0.95) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "44px 46px",
          gap: 30,
        }}
      >
        <div
          style={{
            width: 350,
            height: "100%",
            borderRadius: 28,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid rgba(148,163,184,0.5)",
            boxShadow: "0 22px 60px rgba(2,6,23,0.75)",
            background:
              "linear-gradient(150deg, rgba(15,23,42,0.92), rgba(2,6,23,0.95))",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px",
              borderBottom: "1px solid rgba(148,163,184,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 17,
                color: "#e2e8f0",
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: statusColor,
                }}
              />
              {statusLabel}
            </div>
            <span
              style={{
                fontSize: 14,
                color: "rgba(148,163,184,0.9)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Epic Show
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "22px 20px",
              gap: 13,
            }}
          >
            <div style={labelStyle}>Booking ID</div>
            <div
              style={{
                ...valueStyle,
                fontSize: 28,
                lineHeight: 1.15,
                wordBreak: "break-word",
              }}
            >
              {bookingId}
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 9,
                borderTop: "1px solid rgba(148,163,184,0.25)",
                paddingTop: 15,
              }}
            >
              <div style={labelStyle}>Total Paid</div>
              <div style={{ ...valueStyle, color: "#86efac" }}>{amount}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              alignItems: "center",
              borderRadius: 999,
              border: `1px solid ${statusColor}66`,
              background: "rgba(2,6,23,0.62)",
              padding: "10px 16px",
              fontSize: 18,
              fontWeight: 700,
              color: statusColor,
              letterSpacing: "0.05em",
            }}
          >
            Movie Ticket Share
          </div>

          <div
            style={{
              flex: 1,
              borderRadius: 26,
              border: "1px solid rgba(148,163,184,0.42)",
              background:
                "linear-gradient(165deg, rgba(15,23,42,0.76), rgba(2,6,23,0.84))",
              boxShadow: "0 18px 55px rgba(2,6,23,0.7)",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 13,
            }}
          >
            <div
              style={{
                fontSize: 61,
                lineHeight: 1.02,
                fontWeight: 800,
                color: "#f8fafc",
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
              <span style={labelStyle}>Cinema</span>
              <span style={valueStyle}>{cinema}</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
              <span style={labelStyle}>Date</span>
              <span style={valueStyle}>{date}</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
              <span style={labelStyle}>Time</span>
              <span style={valueStyle}>{slot}</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
              <span style={labelStyle}>Seats</span>
              <span style={{ ...valueStyle, fontSize: 26 }}>{seats}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div
              style={{
                borderRadius: 17,
                border: "1px solid rgba(56,189,248,0.45)",
                background:
                  "linear-gradient(90deg, rgba(8,47,73,0.68), rgba(14,116,144,0.4))",
                color: "#bae6fd",
                padding: "13px 18px",
                fontSize: 26,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
              }}
            >
              Tap to view ticket details
            </div>

            <div
              style={{
                borderRadius: 16,
                border: "1px solid rgba(148,163,184,0.42)",
                background: "rgba(2,6,23,0.6)",
                padding: "10px 14px",
                color: "#e2e8f0",
                fontSize: 18,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
              }}
            >
              epicshow.app
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
