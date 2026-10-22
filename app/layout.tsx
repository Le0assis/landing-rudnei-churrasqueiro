import type { Metadata } from "next";
import { Bebas_Neue, Literata, Oswald, Outfit } from "next/font/google";
import { localMetaDescription } from "@/components/seo/json-ld";
import { BUSINESS_NAME } from "@/lib/contact";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-literata",
  display: "swap",
});

const title = `${BUSINESS_NAME} | Churrasco em Marília-SP`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: title,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: localMetaDescription,
  applicationName: BUSINESS_NAME,
  authors: [{ name: "Gustavo" }],
  keywords: [
    "churrasco Marília",
    "churrasqueiro Marília",
    "churrasco para eventos Marília",
    "churrasco Marília SP",
    "Rudnei Sciole",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: BUSINESS_NAME,
    title,
    description: localMetaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: localMetaDescription,
  },
  robots: { index: true, follow: true },
  other: {
    "geo.region": "BR-SP",
    "geo.placename": "Marília",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${bebas.variable} ${oswald.variable} ${outfit.variable} ${literata.variable} dark h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
