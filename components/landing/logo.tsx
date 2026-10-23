import Image from "next/image";
import { slogans } from "@/content/site";

export function Seal({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/simbolo-192.png"
      alt="Logo Rudnei Sciole Churrasqueiro"
      width={192}
      height={192}
      priority
      className={`rounded-full ${className ?? ""}`}
    />
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
