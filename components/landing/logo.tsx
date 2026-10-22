import { slogans } from "@/content/site";

export function Seal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="57" fill="#0c0908" stroke="#ff4d00" strokeWidth="3" />
      <circle cx="60" cy="60" r="49" fill="none" stroke="#ffc14a" strokeWidth="1.5" opacity="0.9" />
      <path
        d="M34 86c4-14 12-20 12-32 4 8 8 14 6 24 8-10 16-26 8-40 12 14 18 32 12 48-4 12-14 18-26 18H46c-10 0-16-8-12-18z"
        fill="#ff4d00"
      />
      <path
        d="M48 90c2-10 10-16 8-28 6 8 8 16 4 26 6-8 12-20 6-32 8 12 10 26 4 36-4 8-10 12-16 12h-6c-6 0-8-6 0-14z"
        fill="#ffc14a"
      />
      <path d="M38 62c2-18 10-30 22-30s20 12 22 30v2H38v-2z" fill="#f4ecdf" />
      <ellipse cx="60" cy="36" rx="18" ry="12" fill="#f4ecdf" />
      <rect x="34" y="62" width="52" height="9" rx="2" fill="#f4ecdf" />
      <path d="M40 66h40" stroke="#1c1511" strokeWidth="2" opacity="0.25" />
    </svg>
  );
}

export function Wordmark({ motto = false }: { motto?: boolean }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="font-display text-2xl leading-none tracking-wide text-cream">Rudnei Sciole</span>
      <span className="font-condensed text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-ember">
        Churrasqueiro
      </span>
      {motto ? (
        <span className="mt-2 hidden max-w-xs font-serif text-sm italic text-cream-dim lg:block">
          {slogans.motto}
        </span>
      ) : null}
    </span>
  );
}
