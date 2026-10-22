import { WhatsAppLink } from "@/components/landing/whatsapp-link";
import { slogans } from "@/content/site";
import { OWNER_NAME, WHATSAPP_DISPLAY } from "@/lib/contact";

export function FinalCta() {
  return (
    <section id="contato" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="frame-glow mx-auto w-full max-w-6xl rounded-[2rem] border border-flame/60 bg-[radial-gradient(circle_at_top_right,rgba(255,77,0,0.42),transparent_46%),radial-gradient(circle_at_bottom_left,rgba(255,193,74,0.16),transparent_40%),#1c1511] px-6 py-12 text-center md:px-12">
        <p className="font-condensed text-sm font-semibold tracking-[0.28em] text-ember uppercase">
          {slogans.motto}
        </p>
        <h2 className="display-glow mx-auto mt-4 max-w-3xl font-display text-6xl leading-[0.88] text-cream md:text-8xl">
          {slogans.available}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-cream-dim">
          Me chame no WhatsApp. Se eu estiver num evento, respondo assim que puder.
        </p>
        <div className="mt-8 flex justify-center">
          <WhatsAppLink className="cta-glow">Chamar o {OWNER_NAME} no WhatsApp</WhatsAppLink>
        </div>
        <p className="mt-4 text-cream-dim">{WHATSAPP_DISPLAY}</p>
      </div>
    </section>
  );
}
