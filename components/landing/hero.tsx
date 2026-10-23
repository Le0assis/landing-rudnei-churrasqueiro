import { PhotoFrame } from "@/components/landing/photo-frame";
import { WhatsAppLink } from "@/components/landing/whatsapp-link";
import { Button } from "@/components/ui/button";
import { hero, slogans } from "@/content/site";
import { CITY_LABEL, OWNER_NAME } from "@/lib/contact";
import type { PublicPhoto } from "@/lib/storage/types";

export function Hero({ photo, showServices = true }: { photo: PublicPhoto; showServices?: boolean }) {
  return (
    <section id="topo" className="relative overflow-hidden px-5 pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="ember-float pointer-events-none absolute top-16 right-[4%] size-72 rounded-full bg-flame/45 blur-3xl" />
      <div className="ember-float pointer-events-none absolute bottom-6 left-[4%] size-52 rounded-full bg-ember/35 blur-3xl [animation-delay:1.5s]" />
      <div className="relative mx-auto grid w-full max-w-6xl items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="font-condensed text-sm font-semibold tracking-[0.28em] text-ember uppercase">
            {slogans.union}
          </p>
          <h1 className="display-glow mt-4 max-w-4xl font-display text-[3.4rem] leading-[0.86] text-cream sm:text-7xl md:text-8xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-dim">{hero.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppLink className="cta-glow">Chamar o {OWNER_NAME}</WhatsAppLink>
            {showServices ? (
              <Button
                nativeButton={false}
                variant="outline"
                size="touch"
                role="link"
                render={<a href="#opcoes" />}
                className="w-full border-ember/50 sm:w-auto"
              >
                Ver as opções
              </Button>
            ) : null}
          </div>
          <p className="mt-6 font-condensed text-sm tracking-[0.22em] text-cream-dim uppercase">
            {CITY_LABEL} · há 5 anos
          </p>
        </div>
        <PhotoFrame
          photo={photo}
          priority
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="frame-glow aspect-[4/5] rounded-[2rem] border border-flame/40"
        />
      </div>
    </section>
  );
}

export function HeroFallback() {
  return (
    <section className="px-5 pt-28 pb-16 md:pt-32">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="h-4 w-56 rounded-full bg-coal" />
          <div className="mt-4 h-28 max-w-xl rounded-3xl bg-coal" />
          <div className="mt-6 h-20 max-w-lg rounded-3xl bg-ink-2" />
        </div>
        <div className="aspect-[4/5] rounded-[2rem] bg-coal" />
      </div>
      <p className="sr-only">Carregando a foto de abertura.</p>
    </section>
  );
}
