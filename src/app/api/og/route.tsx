import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Anant Yadav";
    const subtitle =
      searchParams.get("subtitle") || "Author • Poet • Writer • Thinker";
    const category = searchParams.get("category") || "Official Website";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#0d0e12",
            padding: "80px",
            fontFamily: "serif",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        >
          {/* Top category / badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#c5a880",
                fontWeight: 600,
                borderBottom: "1px solid rgba(197, 168, 128, 0.4)",
                paddingBottom: "4px",
              }}
            >
              {category}
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                fontSize: title.length > 40 ? "48px" : "64px",
                fontWeight: "bold",
                color: "#f8f9fa",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: "24px",
                  color: "#9ca3af",
                  fontWeight: 300,
                  fontStyle: "italic",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Footer branding */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                color: "#e5e7eb",
                fontWeight: 600,
                letterSpacing: "2px",
              }}
            >
              ANANT YADAV
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              anantyadav.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error";
    return new Response(`Failed to generate the image: ${message}`, {
      status: 500,
    });
  }
}
