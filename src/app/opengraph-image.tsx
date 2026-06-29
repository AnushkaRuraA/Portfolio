import { ImageResponse } from "next/og";
import { defaultProfile } from "@/lib/defaultContent";

// Edge runtime is what ImageResponse is built for (avoids the Node prerender
// "Invalid URL" error) and is the recommended way to serve OG images.
export const runtime = "edge";

// Auto-used by Next for both Open Graph and Twitter cards.
export const alt = "Anushka Pandit — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const { name, title, location } = defaultProfile;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0b0b14 0%, #1a1730 55%, #312a63 100%)",
          padding: "72px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            AP
          </div>
          <div style={{ fontSize: 26, color: "#c7d2fe", fontWeight: 600 }}>
            {location}
          </div>
        </div>

        {/* Name + title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 36,
              fontWeight: 600,
              color: "#a5b4fc",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer accent line */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 120,
              height: 8,
              borderRadius: 8,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            }}
          />
          <div style={{ fontSize: 24, color: "#94a3b8" }}>
            Building scalable web apps end to end
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
