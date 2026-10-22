import { SectionHeading } from "@/components/landing/section-heading";
import { steps } from "@/content/site";
import { WAITER_PRICE } from "@/lib/pricing";
import { formatBrl } from "@/lib/format";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Como funciona"
          title="Do recado até a brasa"
          intro="É simples. Eu monto a lista, compro sem cobrar por isso, e no dia a gente acerta a diferença junto com a mão de obra."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <li key={step.number} className="rounded-[1.6rem] border border-cream/10 bg-ink-2 p-6">
              <p className="font-display text-5xl text-flame">{step.number}</p>
              <h3 className="mt-3 font-condensed text-2xl font-semibold tracking-wide text-cream uppercase">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-cream-dim">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-cream-dim">
          Se quiser alguém servindo, cada garçom sai {formatBrl(WAITER_PRICE)}. Não é obrigatório.
        </p>
      </div>
    </section>
  );
}
