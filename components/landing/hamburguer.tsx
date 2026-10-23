import Image from "next/image";
import { WhatsAppLink } from "@/components/landing/whatsapp-link";
import { hamburguer } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/quote";

export function Hamburguer() {
  return (
    <section id="hamburguer" className="scroll-mt-24 px-5 py-12 md:py-16">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 overflow-hidden rounded-[2rem] border border-cream/10 bg-ink-2 p-4 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:p-6">
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-coal">
          <Image
            src="/gallery/hamburguer-artesanal-luvas-pretas.webp"
            alt={hamburguer.imageAlt}
            fill
            unoptimized
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="px-2 pb-4 md:px-0 md:pb-0">
          <p className="font-condensed text-sm font-semibold tracking-[0.22em] text-ember uppercase">
            {hamburguer.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-4xl text-cream md:text-5xl">{hamburguer.title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-cream-dim">{hamburguer.text}</p>
          <p className="mt-3 font-condensed text-sm font-semibold tracking-[0.16em] text-cream uppercase">
            {hamburguer.price}
          </p>
          <WhatsAppLink href={buildWhatsAppUrl(hamburguer.message)} variant="outline" className="mt-6">
            {hamburguer.button}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
