import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";

const MAX_TITLE_LENGTH = 90;

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? SITE_NAME).slice(0, MAX_TITLE_LENGTH);
  const eyebrow = searchParams.get("eyebrow");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(10,132,255,0.08), transparent 48%), radial-gradient(circle at 88% 92%, rgba(0,0,0,0.05), transparent 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#000000" }}>
          Literaphy
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
          {eyebrow && (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#71717A",
              }}
            >
              {eyebrow}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: title.length > 50 ? 52 : 64,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -1,
              color: "#000000",
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
