import { SectionHeading } from "@/components/landing/section-heading";
import { optionsCopy, slogans } from "@/content/site";
import { formatBrl } from "@/lib/format";
import { SERVICE_OPTIONS, SHARED_ITEMS } from "@/lib/pricing";

const options = [SERVICE_OPTIONS.completo, SERVICE_OPTIONS.assador];

export function Options() {
  return (
    <section id="opcoes" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading eyebrow="As duas opções" title="Completo ou Assador" intro={slogans.care} />
        <div className="mt-6 grid max-w-3xl gap-2 rounded-2xl border-l-4 border-flame bg-coal/60 px-5 py-4">
          <p className="text-cream">{optionsCopy.laborNote}</p>
          <p data-testid="people-rule" className="text-cream-dim">{optionsCopy.peopleRule}</p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {options.map((option) => (
            <article key={option.id} className="frame-glow flex flex-col rounded-[1.8rem] border border-flame/35 bg-[radial-gradient(circle_at_top_right,rgba(255,77,0,0.16),transparent_42%),#1c1511] p-6 md:p-8">
              <p className="font-condensed text-sm font-semibold tracking-[0.22em] text-ember uppercase">
                {option.code}
              </p>
              <h3 className="mt-2 font-display text-5xl text-cream md:text-6xl">{option.name}</h3>
              <p className="mt-4 font-display text-6xl text-flame drop-shadow-[0_0_18px_rgba(255,77,0,0.4)]">{formatBrl(option.labor)}</p>
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
          <p data-testid="shared-labor-note" className="mt-2 text-sm text-cream-dim">
            <span className="font-semibold text-cream">Incluído na mão de obra.</span> O valor cobre só o preparo desses itens; os
            ingredientes e insumos são cobrados à parte, fora dos {formatBrl(SERVICE_OPTIONS.completo.labor)} do Completo ou dos{" "}
            {formatBrl(SERVICE_OPTIONS.assador.labor)} do Assador.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {SHARED_ITEMS.map((item) => (
              <li key={item} className="text-cream">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-cream-dim">
            A lista de compras eu faço pelo número de pessoas e compro pessoalmente, sem taxa. Você manda um Pix aproximado e a diferença a gente
            acerta na mão de obra.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <p
            data-testid="waiter-strip"
            className="w-full max-w-3xl rounded-full border border-flame/40 bg-ink-2/80 px-6 py-4 text-center text-cream shadow-[0_0_0_1px_rgba(255,77,0,0.08)] before:mx-auto before:mb-3 before:block before:h-0.5 before:w-12 before:rounded-full before:bg-flame"
          >
            {optionsCopy.waiter}
          </p>
        </div>
      </div>
    </section>
  );
}
