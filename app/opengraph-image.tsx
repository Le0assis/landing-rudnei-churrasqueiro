import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Rudnei Sciole Churrasqueiro — churrasco para eventos em Marília-SP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-512.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
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
        <img src={logoSrc} alt="" width={140} height={140} />
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#ffc14a" }}>
          MARÍLIA · SP
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 0.9 }}>Rudnei Sciole</div>
        <div style={{ marginTop: 8, fontSize: 48, color: "#ff4d00" }}>Churrasqueiro</div>
      </div>
      <div style={{ display: "flex", fontSize: 32 }}>
        Churrasco para o seu evento, em Marília e região
      </div>
    </div>,
    size,
  );
}
