"use client";

import { useEffect, useState } from "react";
import { InstagramIcon } from "@/components/landing/icons";
import { Seal, Wordmark } from "@/components/landing/logo";
import { WhatsAppLink } from "@/components/landing/whatsapp-link";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/contact";

const links = [
  ["#historia", "História"],
  ["#como-funciona", "Como funciona"],
  ["#opcoes", "Opções"],
  ["#orcamento", "Orçamento"],
  ["#fotos", "Fotos"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
        solid || open ? "border-cream/10 bg-ink/92 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#topo" className="flex min-w-0 items-center gap-3">
          <Seal className="size-12 shrink-0" />
          <Wordmark />
        </a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Seções">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="font-condensed text-sm font-semibold tracking-[0.16em] text-cream-dim uppercase hover:text-cream"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-11 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-ember hover:text-ember"
            aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
          >
            <InstagramIcon className="size-5" />
          </a>
          <WhatsAppLink className="w-auto">WhatsApp</WhatsAppLink>
        </div>
        <button
          type="button"
          className="inline-flex h-12 items-center rounded-full border border-cream/20 px-4 font-condensed text-sm font-semibold tracking-[0.16em] text-cream uppercase lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav id="menu-mobile" className="border-t border-cream/10 px-5 py-4 lg:hidden" aria-label="Seções">
          <ul className="grid gap-1">
            {links.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="block rounded-2xl px-3 py-3 font-display text-4xl text-cream"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
