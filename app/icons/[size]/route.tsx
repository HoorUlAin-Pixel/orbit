import { ImageResponse } from "next/og";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  const s = Math.min(Math.max(Number(size) || 192, 48), 1024);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#4f46e5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: s * 0.5,
            height: s * 0.5,
            borderRadius: "50%",
            border: `${Math.round(s * 0.08)}px solid white`,
            display: "flex",
          }}
        />
      </div>
    ),
    { width: s, height: s }
  );
}