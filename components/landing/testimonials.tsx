import { SectionHeading } from "@/components/landing/section-heading";
import type { PublicTestimonial } from "@/lib/testimonials";

export function Testimonials({ items }: { items: PublicTestimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section id="depoimentos" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Depoimentos"
          title="O que dizem os clientes"
          intro="Comentários de quem já fez evento comigo. Só publico com a autorização de cada um."
        />
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex flex-col rounded-[1.6rem] border bg-ink-2 p-6 ${
                item.illustrative ? "border-dashed border-ember/50" : "border-cream/10"
              }`}
            >
              {item.illustrative ? (
                <p className="w-fit rounded-full bg-ember px-3 py-1 text-xs font-semibold tracking-wide text-ink uppercase">
                  Depoimento ilustrativo
                </p>
              ) : null}
              <blockquote className="mt-4 flex-1 font-serif text-xl whitespace-pre-line text-cream italic">
                “{item.text}”
              </blockquote>
              <p className="mt-5 text-sm text-cream-dim">
                {item.name}
                {item.event ? <span className="block">{item.event}</span> : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
