import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "ARCHRON";
  const decodedTitle = decodeURIComponent(title);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #1A1815 0%, #3A3835 100%)",
          fontFamily: "IBM Plex Sans Thai, Noto Serif Thai, serif",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 24, color: "#B89A63", marginBottom: 20, letterSpacing: 4 }}>
          ARCHRON
        </div>
        <div style={{ fontSize: 48, color: "#FAF8F5", textAlign: "center", lineHeight: 1.3, maxWidth: 900 }}>
          {decodedTitle}
        </div>
        <div style={{ fontSize: 20, color: "#8A8780", marginTop: 40 }}>
          คลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
