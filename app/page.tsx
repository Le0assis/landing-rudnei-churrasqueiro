import { Suspense } from "react";
import { Area } from "@/components/landing/area";
import { Choripan } from "@/components/landing/choripan";
import { Album } from "@/components/landing/album";
import { Events } from "@/components/landing/events";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Gallery } from "@/components/landing/gallery";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Options } from "@/components/landing/options";
import { QuoteForm } from "@/components/landing/quote-form";
import { StickyWhatsapp } from "@/components/landing/sticky-whatsapp";
import { Story } from "@/components/landing/story";
import { Testimonials } from "@/components/landing/testimonials";
import { TrustBar } from "@/components/landing/trust-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { loadGallery } from "@/lib/gallery";
import { isPublicSectionVisible, visibleNav } from "@/lib/sections";

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
      <Suspense fallback={<HomeFallback />}>
        <HomeBody />
      </Suspense>
    </>
  );
}

function HomeFallback() {
  return (
    <>
      <div className="h-20 border-b border-cream/10 bg-ink/80" />
      <div className="px-5 pt-10">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="h-4 w-56 rounded-full bg-coal" />
            <div className="mt-4 h-28 max-w-xl rounded-3xl bg-coal" />
            <div className="mt-6 h-20 max-w-lg rounded-3xl bg-ink-2" />
          </div>
          <div className="aspect-[4/5] rounded-[2rem] bg-coal" />
        </div>
      </div>
      <p className="sr-only">Carregando a página.</p>
    </>
  );
}

async function HomeBody() {
  const site = await loadGallery();
  const { sections } = site;
  const show = (id: Parameters<typeof isPublicSectionVisible>[1]) => isPublicSectionVisible(sections, id);
  const showSticky = show("contato");

  return (
    <>
      <Header links={visibleNav(sections)} />
      <main
        id="conteudo"
        className={`${show("hero") ? "" : "pt-28"} ${showSticky ? "pb-24 md:pb-0" : ""}`}
      >
        {show("hero") ? <Hero photo={site.hero} showServices={show("servicos")} /> : null}
        {show("confianca") ? <TrustBar /> : null}
        {show("sobre") ? <Story photo={site.story} /> : null}
        {show("choripan") ? <Choripan photos={site.choripan} /> : null}
        {show("como-funciona") ? <HowItWorks /> : null}
        {show("eventos") ? <Events /> : null}
        {show("servicos") ? <Options /> : null}
        {show("orcamento") ? <QuoteForm /> : null}
        {show("depoimentos") ? <Testimonials items={site.testimonials} /> : null}
        {show("carrossel") ? (
          <Gallery
            key={site.photos.map((photo) => photo.id).join("|")}
            photos={site.photos}
            usingPlaceholders={site.usingPlaceholders}
            error={site.error}
          />
        ) : null}
        {show("galeria") ? (
          <Album
            festas={show("galeria-festas") ? site.festas : []}
            clientes={show("galeria-clientes") ? site.clientes : []}
            showFestas={show("galeria-festas")}
            showClientes={show("galeria-clientes")}
          />
        ) : null}
        {show("area") ? <Area /> : null}
        {show("faq") ? <Faq /> : null}
        {showSticky ? <FinalCta /> : null}
      </main>
      <Footer />
      {showSticky ? <StickyWhatsapp /> : null}
    </>
  );
}
