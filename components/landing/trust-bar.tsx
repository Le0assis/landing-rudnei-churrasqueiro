import { trustItems } from "@/content/site";

export function TrustBar() {
  return (
    <section aria-label="Em poucas palavras" className="px-5">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 overflow-hidden rounded-[1.6rem] border border-flame/35 bg-cream/10 shadow-[0_18px_50px_rgba(255,77,0,0.12)] md:grid-cols-4">
        {trustItems.map((item) => (
          <li key={item.value} className="bg-ink-2 px-4 py-5 md:px-6 md:py-6">
            <p className="font-display text-4xl leading-none text-flame drop-shadow-[0_0_18px_rgba(255,77,0,0.45)] md:text-5xl">{item.value}</p>
            <p className="mt-2 text-sm leading-snug text-cream-dim">{item.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
