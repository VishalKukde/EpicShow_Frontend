/* eslint-disable @next/next/no-img-element */

type OgPosterProps = {
  title: string;
  description: string;
  venue: string;
  location: string;
  dateTime: string;
  price: string;
  posterUrl: string | null;
};

const labelStyle = {
  fontSize: 17,
  letterSpacing: "0.09em",
  textTransform: "uppercase" as const,
  color: "rgba(226, 232, 240, 0.72)",
};

const valueStyle = {
  fontSize: 33,
  fontWeight: 650,
  color: "#f8fafc",
};

export default function OgPoster({
  title,
  description,
  venue,
  location,
  dateTime,
  price,
  posterUrl,
}: OgPosterProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(circle at 18% 0%, #1f2a44 0%, #05060a 65%)",
        color: "#f8fafc",
        fontFamily:
          "Inter, Segoe UI, Roboto, Helvetica Neue, Arial, ui-sans-serif, sans-serif",
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
            opacity: 0.35,
            transform: "scale(1.08)",
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "linear-gradient(108deg, rgba(3,7,18,0.92) 0%, rgba(3,7,18,0.86) 48%, rgba(4,8,18,0.95) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "radial-gradient(circle at 12% 42%, rgba(56,189,248,0.16) 0%, rgba(56,189,248,0) 46%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "46px 48px",
          gap: 34,
        }}
      >
        <div
          style={{
            width: 355,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 28,
              overflow: "hidden",
              display: "flex",
              border: "1px solid rgba(148,163,184,0.5)",
              boxShadow: "0 28px 70px rgba(2,6,23,0.75)",
              background:
                "linear-gradient(135deg, rgba(11,18,32,0.96), rgba(2,6,23,0.98))",
            }}
          >
            {posterUrl ? (
              <img
                src={posterUrl}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 92,
                  fontWeight: 700,
                  color: "rgba(226,232,240,0.9)",
                }}
              >
                {title.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: 10,
              borderRadius: 999,
              border: "1px solid rgba(56,189,248,0.45)",
              background: "rgba(2,6,23,0.6)",
              color: "#67e8f9",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.06em",
              padding: "10px 16px",
            }}
          >
            Now Showing
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              borderRadius: 26,
              border: "1px solid rgba(148, 163, 184, 0.45)",
              background:
                "linear-gradient(160deg, rgba(15,23,42,0.72), rgba(2,6,23,0.8))",
              boxShadow: "0 24px 65px rgba(2,6,23,0.72)",
              padding: "26px 30px",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 64,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 24,
                lineHeight: 1.4,
                color: "rgba(226,232,240,0.86)",
              }}
            >
              {description}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginTop: "auto",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                <span style={labelStyle}>Venue</span>
                <span style={valueStyle}>{venue}</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                <span style={labelStyle}>Location</span>
                <span style={valueStyle}>{location}</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                <span style={labelStyle}>Date & Time</span>
                <span style={valueStyle}>{dateTime}</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                <span style={labelStyle}>Starting Price</span>
                <span style={valueStyle}>{price}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 18,
                border: "1px solid rgba(34,211,238,0.45)",
                background:
                  "linear-gradient(90deg, rgba(8,51,68,0.65), rgba(14,116,144,0.42))",
                padding: "14px 20px",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "0.01em",
                color: "#cffafe",
              }}
            >
              🎟 Book Tickets Now
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 14px",
                borderRadius: 16,
                border: "1px solid rgba(148,163,184,0.42)",
                background: "rgba(2,6,23,0.58)",
                color: "#e2e8f0",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  fontSize: 13,
                  fontWeight: 800,
                  background:
                    "linear-gradient(120deg, rgba(34,211,238,0.95), rgba(14,165,233,0.95))",
                  color: "#02131c",
                }}
              >
                ES
              </div>
              <span style={{ fontSize: 19, fontWeight: 700 }}>Epic Show</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
