import { ImageResponse } from "next/og";

export const runtime = "edge";
export const preferredRegion = "auto";

const CACHE_CONTROL = "public, max-age=86400, immutable";

function sanitizeInviteCode(value: string | null) {
  const normalized = (value || "").replace(/[^a-z0-9]/gi, "").slice(0, 14).toUpperCase();
  return normalized || "VISHAL50";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inviteCode = sanitizeInviteCode(searchParams.get("code"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#050505",
          color: "#f8fafc",
          fontFamily: "Inter, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(135deg, #050505 0%, #111827 36%, #0f766e 68%, #fb7185 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 36,
            display: "flex",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 34,
            background: "rgba(5,5,5,0.46)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "68px 76px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  background: "#f8fafc",
                  color: "#111827",
                  fontSize: 23,
                  fontWeight: 900,
                }}
              >
                ES
              </div>
              EpicShow
            </div>
            <div
              style={{
                display: "flex",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 999,
                padding: "12px 18px",
                fontSize: 18,
                fontWeight: 800,
                color: "#ccfbf1",
                background: "rgba(15,23,42,0.45)",
              }}
            >
              Invite Rewards
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
              gap: 54,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 675 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 74,
                  lineHeight: 0.98,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Book better plans with my invite.
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 28,
                  fontSize: 30,
                  lineHeight: 1.35,
                  color: "rgba(248,250,252,0.82)",
                }}
              >
                Use this EpicShow code for booking rewards across movies, sports, events, and more.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 355,
                borderRadius: 30,
                border: "1px solid rgba(255,255,255,0.24)",
                background: "rgba(255,255,255,0.92)",
                color: "#0f172a",
                boxShadow: "0 26px 70px rgba(0,0,0,0.38)",
                padding: 26,
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#64748b",
                  fontSize: 19,
                  fontWeight: 900,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Invite Code
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 18,
                  fontSize: 52,
                  fontWeight: 950,
                  letterSpacing: "0.08em",
                  color: "#0f766e",
                }}
              >
                {inviteCode}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 24,
                  borderRadius: 18,
                  background: "#0f172a",
                  color: "#f8fafc",
                  padding: "18px 20px",
                  fontSize: 24,
                  fontWeight: 900,
                  justifyContent: "center",
                }}
              >
                Join and book on EpicShow
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "rgba(248,250,252,0.72)",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            <span>Fast booking</span>
            <span>Wallet rewards</span>
            <span>Premium entertainment</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    }
  );
}
