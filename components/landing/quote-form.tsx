"use client";

import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/landing/section-heading";
import { WhatsAppIcon } from "@/components/landing/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBrl } from "@/lib/format";
import { LIMITS, SERVICE_OPTIONS, WAITER_PRICE, isServiceOption } from "@/lib/pricing";
import { calculateLaborTotal, createQuote, saoPauloToday, type QuoteField } from "@/lib/quote";

const fieldClass = "h-12 rounded-xl bg-ink px-3 text-base text-cream";

export function QuoteForm() {
  const [option, setOption] = useState("");
  const [people, setPeople] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [waiters, setWaiters] = useState("0");
  const [today, setToday] = useState("");
  const [touched, setTouched] = useState<Partial<Record<QuoteField, boolean>>>({});

  const result = useMemo(
    () => createQuote({ option, people, date, city, waiters, today: today || undefined }),
    [option, people, date, city, waiters, today],
  );

  const preview = useMemo(() => {
    const count = Number(waiters);
    if (!isServiceOption(option) || !Number.isInteger(count)) return null;
    if (count < LIMITS.minWaiters || count > LIMITS.maxWaiters) return null;
    return calculateLaborTotal(option, count);
  }, [option, waiters]);

  const allErrors = result.ok ? {} : result.errors;
  const errors = {
    option: touched.option ? allErrors.option : undefined,
    people: touched.people ? allErrors.people : undefined,
    date: touched.date ? allErrors.date : undefined,
    city: touched.city ? allErrors.city : undefined,
    waiters: touched.waiters ? allErrors.waiters : undefined,
  };

  function mark(field: QuoteField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function changeWaiters(next: number) {
    const clamped = Math.min(LIMITS.maxWaiters, Math.max(LIMITS.minWaiters, next));
    setWaiters(String(clamped));
  }

  return (
    <section id="orcamento" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <SectionHeading
            eyebrow="Orçamento rápido"
            title="Me conta o básico"
            intro="Eu calculo a mão de obra na hora e abro o WhatsApp com a mensagem pronta. Nada disso fica salvo no site."
          />
          <form
            className="mt-8 grid gap-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <fieldset className="grid gap-3">
              <legend className="font-condensed text-sm font-semibold tracking-[0.16em] text-cream uppercase">
                Opção de churrasco
              </legend>
              {[SERVICE_OPTIONS.completo, SERVICE_OPTIONS.assador].map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${
                    option === item.id ? "border-flame bg-flame/10" : "border-cream/15 bg-ink-2"
                  }`}
                >
                  <input
                    type="radio"
                    name="opcao"
                    value={item.id}
                    checked={option === item.id}
                    onChange={() => {
                      setOption(item.id);
                      mark("option");
                    }}
                    className="mt-1 size-5 accent-flame"
                  />
                  <span>
                    <span className="block font-semibold text-cream">
                      {item.code} — {item.name}
                    </span>
                    <span className="text-sm text-cream-dim">
                      {formatBrl(item.labor)} de mão de obra
                    </span>
                  </span>
                </label>
              ))}
              {errors.option ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.option}
                </p>
              ) : null}
            </fieldset>

            <div className="grid gap-2">
              <Label htmlFor="pessoas">Número de pessoas</Label>
              <Input
                id="pessoas"
                inputMode="numeric"
                value={people}
                onChange={(event) => setPeople(event.target.value)}
                onBlur={() => mark("people")}
                aria-invalid={Boolean(errors.people)}
                aria-describedby="pessoas-ajuda pessoas-erro"
                className={fieldClass}
              />
              <p id="pessoas-ajuda" className="text-sm text-cream-dim">
                Esse número não muda a mão de obra. Eu uso ele para montar a lista de compras.
              </p>
              {errors.people ? (
                <p id="pessoas-erro" role="alert" className="text-sm text-destructive">
                  {errors.people}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="data">Data do evento</Label>
                <Input
                  id="data"
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setToday((current) => current || saoPauloToday(new Date()));
                  }}
                  onBlur={() => mark("date")}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? "data-erro" : undefined}
                  className={fieldClass}
                />
                {errors.date ? (
                  <p id="data-erro" role="alert" className="text-sm text-destructive">
                    {errors.date}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  onBlur={() => mark("city")}
                  autoComplete="address-level2"
                  placeholder="Marília"
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? "cidade-erro" : undefined}
                  className={fieldClass}
                />
                {errors.city ? (
                  <p id="cidade-erro" role="alert" className="text-sm text-destructive">
                    {errors.city}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="garcons">Garçons</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="size-12 rounded-full"
                  onClick={() => changeWaiters(Number(waiters || 0) - 1)}
                  aria-label="Diminuir garçons"
                >
                  −
                </Button>
                <Input
                  id="garcons"
                  inputMode="numeric"
                  value={waiters}
                  onChange={(event) => setWaiters(event.target.value)}
                  onBlur={() => mark("waiters")}
                  aria-invalid={Boolean(errors.waiters)}
                  aria-describedby="garcons-ajuda garcons-erro"
                  className={`${fieldClass} max-w-24 text-center`}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="size-12 rounded-full"
                  onClick={() => changeWaiters(Number(waiters || 0) + 1)}
                  aria-label="Aumentar garçons"
                >
                  +
                </Button>
              </div>
              <p id="garcons-ajuda" className="text-sm text-cream-dim">
                Cada garçom soma {formatBrl(WAITER_PRICE)}. Zero se não quiser.
              </p>
              {errors.waiters ? (
                <p id="garcons-erro" role="alert" className="text-sm text-destructive">
                  {errors.waiters}
                </p>
              ) : null}
            </div>
          </form>
        </div>

        <aside className="h-fit rounded-[1.8rem] border border-flame/40 bg-ink-2 p-6 lg:sticky lg:top-28">
          <p className="font-condensed text-sm font-semibold tracking-[0.2em] text-ember uppercase">
            Total da mão de obra
          </p>
          <p data-testid="labor-total" className="mt-3 font-display text-6xl text-flame">
            {preview === null ? "—" : formatBrl(preview)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream-dim">
            Os alimentos não entram nesse número. O Pix das compras é aproximado e a diferença é
            acertada no dia.
          </p>
          {result.ok ? (
            <Button
              nativeButton={false}
              size="touch"
              role="link"
              render={
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              className="cta-glow mt-6 w-full"
            >
              <WhatsAppIcon className="size-5" />
              Mandar orçamento no WhatsApp
            </Button>
          ) : (
            <Button
              type="button"
              size="touch"
              className="cta-glow mt-6 w-full"
              onClick={() => {
                setTouched({
                  option: true,
                  people: true,
                  date: true,
                  city: true,
                  waiters: true,
                });
                const order: QuoteField[] = ["option", "people", "date", "city", "waiters"];
                const first = order.find((field) => allErrors[field]);
                const target =
                  first === "option"
                    ? "input[name='opcao']"
                    : first === "people"
                      ? "#pessoas"
                      : first === "date"
                        ? "#data"
                        : first === "city"
                          ? "#cidade"
                          : "#garcons";
                document.querySelector<HTMLElement>(target)?.focus();
              }}
            >
              Preencha o orçamento
            </Button>
          )}
        </aside>
      </div>
    </section>
  );
}
