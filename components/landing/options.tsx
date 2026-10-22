import { SectionHeading } from "@/components/landing/section-heading";
import { slogans } from "@/content/site";
import { formatBrl } from "@/lib/format";
import { SERVICE_OPTIONS, SHARED_ITEMS, WAITER_PRICE } from "@/lib/pricing";

const options = [SERVICE_OPTIONS.completo, SERVICE_OPTIONS.assador];

export function Options() {
  return (
    <section id="opcoes" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading eyebrow="As duas opções" title="Escolhe o cuidado" intro={slogans.care} />
        <p className="mt-4 max-w-2xl text-cream-dim">
          Os preços abaixo são só a mão de obra. A carne e os outros alimentos não entram nesse valor.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {options.map((option) => (
            <article key={option.id} className="flex flex-col rounded-[1.8rem] border border-cream/10 bg-ink-2 p-6 md:p-8">
              <p className="font-condensed text-sm font-semibold tracking-[0.22em] text-ember uppercase">
                {option.code}
              </p>
              <h3 className="mt-2 font-display text-5xl text-cream md:text-6xl">{option.name}</h3>
              <p className="mt-4 font-display text-6xl text-flame">{formatBrl(option.labor)}</p>
              <p className="font-condensed text-sm tracking-[0.18em] text-cream-dim uppercase">mão de obra</p>
              <p className="mt-4 leading-relaxed text-cream-dim">{option.summary}</p>
              <ul className="mt-6 space-y-2">
                {option.items.map((item) => (
                  <li key={item} className="flex gap-3 text-cream">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-flame" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-4 rounded-[1.8rem] border border-ember/30 bg-coal/80 p-6 md:p-8">
          <h3 className="font-condensed text-xl font-semibold tracking-[0.14em] text-ember uppercase">
            Nas duas opções eu levo
          </h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {SHARED_ITEMS.map((item) => (
              <li key={item} className="text-cream">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-cream-dim">
            Garçom é opcional: {formatBrl(WAITER_PRICE)} cada. A lista de compras eu faço pelo número de
            pessoas e compro pessoalmente, sem taxa. Você manda um Pix aproximado e a diferença a gente
            acerta na mão de obra.
          </p>
        </div>
      </div>
    </section>
  );
}
