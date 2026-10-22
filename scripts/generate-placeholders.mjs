import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const posters = [
  {
    file: "brasa.jpg",
    title: "Brasa",
    subtitle: "Ilustração de espera — envie a foto real pelo admin",
    colors: ["#2a120c", "#8a2e12", "#ff5a1f"],
    motif: "grill",
  },
  {
    file: "corte.jpg",
    title: "Na grelha",
    subtitle: "Ilustração de espera — envie a foto real pelo admin",
    colors: ["#1a0e0c", "#6b2a18", "#c2410c"],
    motif: "cut",
  },
  {
    file: "mesa.jpg",
    title: "A mesa",
    subtitle: "Ilustração de espera — envie a foto real pelo admin",
    colors: ["#140e0c", "#3d2418", "#ffb15a"],
    motif: "table",
  },
  {
    file: "pao-de-alho.jpg",
    title: "Pão de alho",
    subtitle: "Ilustração de espera — envie a foto real pelo admin",
    colors: ["#1c120c", "#7a3b12", "#e8a15a"],
    motif: "bread",
  },
  {
    file: "molhos.jpg",
    title: "Acompanhamentos",
    subtitle: "Ilustração de espera — envie a foto real pelo admin",
    colors: ["#120e0c", "#3f2a18", "#d86a32"],
    motif: "bowls",
  },
  {
    file: "noite.jpg",
    title: "O evento",
    subtitle: "Ilustração de espera — envie a foto real pelo admin",
    colors: ["#0c0a09", "#3a2018", "#ff5a1f"],
    motif: "night",
  },
];

function motif(kind) {
  if (kind === "grill") {
    return `
      <g stroke="#1a0c07" stroke-width="8" opacity="0.55">
        ${Array.from({ length: 9 }, (_, index) => `<line x1="760" y1="${180 + index * 48}" x2="1480" y2="${160 + index * 48}" />`).join("")}
      </g>
      <ellipse cx="1180" cy="430" rx="180" ry="70" fill="#ffb15a" opacity="0.85"/>
      <ellipse cx="1120" cy="390" rx="90" ry="120" fill="#ff5a1f"/>
      <ellipse cx="1240" cy="360" rx="70" ry="100" fill="#ffb15a"/>`;
  }
  if (kind === "cut") {
    return `
      <ellipse cx="1160" cy="460" rx="280" ry="120" fill="#3a1812"/>
      <ellipse cx="1160" cy="430" rx="240" ry="90" fill="#6b2e22"/>
      <path d="M980 430 C1080 360 1280 360 1360 450" fill="none" stroke="#ffb15a" stroke-width="16"/>`;
  }
  if (kind === "table") {
    return `
      <rect x="860" y="520" width="560" height="28" rx="8" fill="#3a2418"/>
      <circle cx="980" cy="430" r="70" fill="#f4ecdf" opacity="0.85"/>
      <circle cx="1160" cy="400" r="86" fill="#ff5a1f"/>
      <circle cx="1340" cy="440" r="64" fill="#ffb15a"/>`;
  }
  if (kind === "bread") {
    return `
      <g fill="#e2b07a">
        <rect x="900" y="360" width="180" height="90" rx="28"/>
        <rect x="1110" y="330" width="200" height="100" rx="30"/>
        <rect x="1020" y="470" width="220" height="90" rx="28"/>
      </g>
      <g fill="#3d6b32" opacity="0.8">
        <circle cx="960" cy="400" r="8"/>
        <circle cx="1180" cy="370" r="8"/>
        <circle cx="1120" cy="510" r="8"/>
      </g>`;
  }
  if (kind === "bowls") {
    return `
      <ellipse cx="1040" cy="470" rx="120" ry="46" fill="#1c1511"/>
      <ellipse cx="1040" cy="450" rx="110" ry="40" fill="#6a8f3a"/>
      <ellipse cx="1280" cy="500" rx="130" ry="48" fill="#1c1511"/>
      <ellipse cx="1280" cy="478" rx="118" ry="40" fill="#f4ecdf"/>
      <ellipse cx="1160" cy="360" rx="90" ry="36" fill="#1c1511"/>
      <ellipse cx="1160" cy="344" rx="80" ry="30" fill="#ff5a1f"/>`;
  }
  return `
    <g fill="#ffb15a">
      <circle cx="980" cy="300" r="8"/>
      <circle cx="1120" cy="240" r="5"/>
      <circle cx="1300" cy="280" r="7"/>
      <circle cx="1420" cy="360" r="4"/>
      <circle cx="1200" cy="180" r="6"/>
    </g>
    <path d="M860 640 C1000 560 1280 560 1480 660 L1480 760 L860 760 Z" fill="#ff5a1f" opacity="0.85"/>`;
}

function poster(item) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${item.colors[0]}"/>
      <stop offset="58%" stop-color="${item.colors[1]}"/>
      <stop offset="100%" stop-color="${item.colors[2]}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <circle cx="1280" cy="280" r="340" fill="#ffb15a" opacity="0.16"/>
  ${motif(item.motif)}
  <rect x="64" y="64" width="470" height="58" rx="29" fill="#100c0a" stroke="#ffb15a" stroke-width="2"/>
  <text x="299" y="101" text-anchor="middle" fill="#ffb15a" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="22" font-weight="700" letter-spacing="3">IMAGEM ILUSTRATIVA</text>
  <text x="72" y="820" fill="#f4ecdf" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="84" font-weight="700">${item.title}</text>
  <text x="72" y="890" fill="#f4ecdf" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="30">${item.subtitle}</text>
</svg>`;
}

await mkdir("public/placeholders", { recursive: true });

for (const item of posters) {
  await sharp(Buffer.from(poster(item))).jpeg({ quality: 82 }).toFile(`public/placeholders/${item.file}`);
  console.log(`public/placeholders/${item.file}`);
}
