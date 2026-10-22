import { SectionHeading } from "@/components/landing/section-heading";
import { events } from "@/content/site";

export function Events() {
  return (
    <section id="eventos" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Tipos de evento"
          title="Onde a mesa pede brasa"
          intro="Me conta o motivo. Se couber no fogo e na agenda, eu vou."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.title} className="rounded-[1.6rem] border border-cream/10 bg-coal/70 p-6">
              <h3 className="font-display text-4xl text-cream">{event.title}</h3>
              <p className="mt-3 leading-relaxed text-cream-dim">{event.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
