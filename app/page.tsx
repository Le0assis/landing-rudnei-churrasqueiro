import { Suspense } from "react";
import { Area } from "@/components/landing/area";
import { Events } from "@/components/landing/events";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Gallery, GalleryFallback } from "@/components/landing/gallery";
import { Header } from "@/components/landing/header";
import { Hero, HeroFallback } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Options } from "@/components/landing/options";
import { QuoteForm } from "@/components/landing/quote-form";
import { StickyWhatsapp } from "@/components/landing/sticky-whatsapp";
import { Story } from "@/components/landing/story";
import { Testimonials } from "@/components/landing/testimonials";
import { TrustBar } from "@/components/landing/trust-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { loadGallery } from "@/lib/gallery";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <a
        href="#conteudo"
        className="absolute top-4 left-4 z-[70] -translate-y-24 rounded-full bg-flame px-4 py-3 font-semibold text-ink focus:translate-y-0"
      >
        Ir para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="pb-24 md:pb-0">
        <Suspense fallback={<HeroFallback />}>
          <HeroSlot />
        </Suspense>
        <TrustBar />
        <Suspense
          fallback={
            <div className="px-5 py-16">
              <div className="mx-auto h-96 max-w-6xl rounded-[2rem] bg-coal" />
              <p className="sr-only">Carregando a história.</p>
            </div>
          }
        >
          <StorySlot />
        </Suspense>
        <HowItWorks />
        <Events />
        <Options />
        <QuoteForm />
        <Testimonials />
        <Suspense fallback={<GalleryFallback />}>
          <GallerySlot />
        </Suspense>
        <Area />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyWhatsapp />
    </>
  );
}

async function HeroSlot() {
  const gallery = await loadGallery();
  return <Hero photo={gallery.hero} />;
}

async function StorySlot() {
  const gallery = await loadGallery();
  return <Story photo={gallery.story} />;
}

async function GallerySlot() {
  const gallery = await loadGallery();
  return (
    <Gallery
      key={gallery.photos.map((photo) => photo.id).join("|")}
      photos={gallery.photos}
      usingPlaceholders={gallery.usingPlaceholders}
      error={gallery.error}
    />
  );
}
