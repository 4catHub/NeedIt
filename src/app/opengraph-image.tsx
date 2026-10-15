import { ImageResponse } from "next/og";
export const alt = "NeedIt? — Your time. Your money. Your choice.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f0f3ec",
        color: "#1e2b23",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div style={{ fontSize: 44, color: "#375b2c" }}>NeedIt?</div>
      <div style={{ fontSize: 82, fontWeight: 700, marginTop: 40, lineHeight: 1.1 }}>
        Your time. Your money.
      </div>
      <div style={{ fontSize: 82, fontWeight: 700 }}>Your choice.</div>
      <div style={{ fontSize: 28, marginTop: 40, color: "#59665b" }}>
        Do you really need that service?
      </div>
    </div>,
    size,
  );
}
