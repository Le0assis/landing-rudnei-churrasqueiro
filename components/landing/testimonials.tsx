import { SectionHeading } from "@/components/landing/section-heading";
import { testimonials } from "@/content/site";

export function Testimonials() {
  return (
    <section id="depoimentos" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Depoimentos"
          title="O lugar das palavras reais"
          intro="Ainda não publico fala de cliente sem autorização. Os cartões abaixo são só o espaço. Está escrito neles que são ilustrativos."
        />
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li
              key={item.id}
              className="flex flex-col rounded-[1.6rem] border border-dashed border-ember/50 bg-ink-2 p-6"
            >
              <p className="w-fit rounded-full bg-ember px-3 py-1 text-xs font-semibold tracking-wide text-ink uppercase">
                Depoimento ilustrativo — edite em content/site.ts
              </p>
              <blockquote className="mt-4 flex-1 font-serif text-xl text-cream italic">
                “{item.quote}”
              </blockquote>
              <p className="mt-5 text-sm text-cream-dim">
                {item.name}
                <span className="block">{item.context}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
