import { SectionHeading } from "@/components/landing/section-heading";
import { area } from "@/content/site";

const MAPS_EMBED = "https://www.google.com/maps?q=Mar%C3%ADlia,SP&z=11&output=embed";
const MAPS_LINK = "https://www.google.com/maps?q=Mar%C3%ADlia,SP";

export function Area() {
  return (
    <section id="area" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-[2rem] border border-cream/10 bg-ink-2 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-10">
        <div className="relative min-h-72 overflow-hidden rounded-[1.5rem] bg-coal">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="font-condensed text-xl tracking-[0.22em] text-cream uppercase">Marília-SP</p>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-ember underline underline-offset-4"
            >
              Ver no Google Maps
            </a>
          </div>
          <iframe
            src={MAPS_EMBED}
            title="Mapa de Marília-SP"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full border-0 [filter:invert(90%)_hue-rotate(180deg)]"
          />
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 rounded-full border border-ember/50 bg-ink/85 px-3 py-1 text-xs font-semibold text-cream hover:text-ember"
          >
            Ver no Google Maps
          </a>
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
