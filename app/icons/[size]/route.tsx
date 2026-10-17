import { ImageResponse } from "next/og";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  const s = Math.min(Math.max(Number(size) || 192, 48), 1024);
  const round = new URL(req.url).searchParams.get("round") === "1";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
          borderRadius: round ? "50%" : 0,
          overflow: "hidden",
        }}
      >
        <svg width={s} height={s} viewBox="0 0 512 512" fill="none">
          <g transform="rotate(-22 256 256)" stroke="#fcd34d" strokeWidth="18" strokeLinecap="round">
            <path d="M86 256 A170 52 0 0 1 426 256" />
          </g>
          <circle cx="256" cy="256" r="84" fill="#ffffff" />
          <g transform="rotate(-22 256 256)" stroke="#fcd34d" strokeWidth="18" strokeLinecap="round">
            <path d="M86 256 A170 52 0 0 0 426 256" />
          </g>
          <path d="M372 124 Q372 150 398 150 Q372 150 372 176 Q372 150 346 150 Q372 150 372 124Z" fill="#ffffff" />
          <path d="M150 354 Q150 372 168 372 Q150 372 150 390 Q150 372 132 372 Q150 372 150 354Z" fill="#ffffff" fillOpacity="0.85" />
        </svg>
      </div>
    ),
    { width: s, height: s }
  );
}