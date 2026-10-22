import { ImageResponse } from "next/og";

export const alt = "Rudnei Sciole Churrasqueiro — churrasco de pai e filho em Marília-SP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0c0908",
        color: "#fff6ea",
        padding: "72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 999,
            border: "4px solid #ff4d00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffc14a",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          RS
        </div>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#ffc14a" }}>
          MARÍLIA · SP
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 0.9 }}>Rudnei Sciole</div>
        <div style={{ marginTop: 8, fontSize: 48, color: "#ff4d00" }}>Churrasqueiro</div>
      </div>
      <div style={{ display: "flex", fontSize: 32 }}>
        Churrasco de pai e filho em Marília, há 5 anos
      </div>
    </div>,
    size,
  );
}
