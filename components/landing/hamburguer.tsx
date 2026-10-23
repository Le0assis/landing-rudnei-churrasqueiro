import { WhatsAppLink } from "@/components/landing/whatsapp-link";
import { hamburguer } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/quote";

export function Hamburguer() {
  return (
    <section id="hamburguer" className="scroll-mt-24 px-5 py-12 md:py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 rounded-[2rem] border border-cream/10 bg-ink-2 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-xl">
          <p className="font-condensed text-sm font-semibold tracking-[0.22em] text-ember uppercase">
            {hamburguer.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-4xl text-cream md:text-5xl">{hamburguer.title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-cream-dim">{hamburguer.text}</p>
          <p className="mt-3 font-condensed text-sm font-semibold tracking-[0.16em] text-cream uppercase">
            {hamburguer.price}
          </p>
        </div>
        <WhatsAppLink href={buildWhatsAppUrl(hamburguer.message)} variant="outline" className="shrink-0">
          {hamburguer.button}
        </WhatsAppLink>
      </div>
    </section>
  );
}
