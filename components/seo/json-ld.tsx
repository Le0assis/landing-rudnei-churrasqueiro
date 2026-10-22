import { faqs } from "@/content/site";
import { BUSINESS_NAME, CITY_LABEL, INSTAGRAM_URL, WHATSAPP_DISPLAY } from "@/lib/contact";
import { getSiteUrl } from "@/lib/site-url";

export function JsonLd() {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FoodEstablishment",
        name: BUSINESS_NAME,
        description:
          "Churrasco de pai e filho em Marília-SP e região, há 5 anos. Mão de obra para eventos, com lista de compras e atendimento no WhatsApp.",
        url: siteUrl,
        telephone: "+55-14-99627-2725",
        image: `${siteUrl}/opengraph-image`,
        servesCuisine: "Churrasco brasileiro",
        priceRange: "R$700–R$1500",
        currenciesAccepted: "BRL",
        paymentAccepted: "Pix",
        slogan: "Churrasco é mais que comida, é união!",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Marília",
          addressRegion: "SP",
          addressCountry: "BR",
        },
        areaServed: [
          { "@type": "City", name: "Marília" },
          { "@type": "AdministrativeArea", name: "Região de Marília, São Paulo" },
        ],
        sameAs: [INSTAGRAM_URL],
        knowsLanguage: "pt-BR",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const localMetaDescription = `Churrasco de pai e filho em ${CITY_LABEL} e região, há 5 anos. Mão de obra para o seu evento, com sabor, cuidado e atendimento no WhatsApp ${WHATSAPP_DISPLAY}.`;
