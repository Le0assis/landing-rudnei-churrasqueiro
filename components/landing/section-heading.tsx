export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-condensed text-sm font-semibold tracking-[0.28em] text-flame uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[3.15rem] leading-[0.88] text-cream sm:text-6xl md:text-7xl">
        {title}
      </h2>
      {intro ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream-dim">{intro}</p> : null}
    </div>
  );
}
