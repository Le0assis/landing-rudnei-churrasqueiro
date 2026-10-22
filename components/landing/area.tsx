import { SectionHeading } from "@/components/landing/section-heading";
import { area } from "@/content/site";

export function Area() {
  return (
    <section id="area" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-[2rem] border border-cream/10 bg-ink-2 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-10">
        <div className="flex items-center justify-center rounded-[1.5rem] bg-coal p-8">
          <div className="text-center">
            <p className="font-display text-7xl text-flame">SP</p>
            <p className="mt-2 font-condensed text-xl tracking-[0.22em] text-cream uppercase">Marília</p>
            <p className="mt-1 text-sm text-cream-dim">e a região, com confirmação</p>
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Área atendida" title={area.title} />
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-cream-dim">
            {area.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
