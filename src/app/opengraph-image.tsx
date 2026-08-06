import { ImageResponse } from "next/og";

export const alt = "Finora — Income, Budget & Savings Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0b12",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(129,140,248,0.35), rgba(11,11,18,0) 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 22,
              backgroundColor: "#818cf8",
            }}
          >
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                stroke="#0b0b12"
                strokeWidth="1.6"
              />
              <circle cx="16.5" cy="13.5" r="1.5" fill="#0b0b12" />
            </svg>
          </div>
          <span
            style={{ fontSize: 68, fontWeight: 700, color: "#f8f8fc" }}
          >
            Finora
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#b6b6c4",
            maxWidth: 820,
            textAlign: "center",
          }}
        >
          Income, budget, and savings — in one app
        </div>
      </div>
    ),
    { ...size }
  );
}
