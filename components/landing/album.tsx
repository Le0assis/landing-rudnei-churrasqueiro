"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/landing/section-heading";
import { Button } from "@/components/ui/button";
import type { PublicPhoto } from "@/lib/storage/types";

type AlbumId = "festas" | "feedbacks";

const COPY: Record<AlbumId, { label: string; empty: string }> = {
  festas: {
    label: "Festas",
    empty: "As fotos da equipe e de quem estava na festa entram aqui, uma a uma.",
  },
  feedbacks: {
    label: "Feedbacks",
    empty: "Prints e fotos de recados, do WhatsApp ou do Instagram, entram aqui.",
  },
};

export function Album({
  festas,
  feedbacks,
  showFestas,
  showFeedbacks,
}: {
  festas: PublicPhoto[];
  feedbacks: PublicPhoto[];
  showFestas: boolean;
  showFeedbacks: boolean;
}) {
  const tabs = [
    showFestas ? { id: "festas" as const, photos: festas } : null,
    showFeedbacks ? { id: "feedbacks" as const, photos: feedbacks } : null,
  ].filter((tab): tab is { id: AlbumId; photos: PublicPhoto[] } => tab !== null);
  const [tab, setTab] = useState<AlbumId>(tabs[0]?.id ?? "festas");
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const baseId = useId();

  if (tabs.length === 0) return null;
  const active = tabs.find((item) => item.id === tab) ?? tabs[0];
  if (!active) return null;

  function select(next: AlbumId) {
    setTab(next);
    setOpen(null);
  }

  return (
    <section id="galeria" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Galeria"
          title="Quem estava na festa"
          intro={
            showFestas && showFeedbacks
              ? "Festas mostra a equipe e os clientes em cada evento. Feedbacks guarda os recados que chegaram no WhatsApp e no Instagram."
              : showFestas
                ? "Fotos da equipe e de quem estava em cada festa."
                : "Recados que chegaram no WhatsApp e no Instagram."
          }
        />

        {tabs.length > 1 ? (
          <div role="tablist" aria-label="Álbuns" className="mt-8 flex flex-wrap gap-2">
            {tabs.map((item) => {
              const selected = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-painel-${item.id}`}
                  className={`h-12 rounded-full px-5 font-condensed text-sm font-semibold tracking-[0.16em] uppercase transition ${
                    selected
                      ? "cta-glow bg-flame text-ink"
                      : "border border-cream/25 text-cream hover:border-ember hover:text-ember"
                  }`}
                  onClick={() => select(item.id)}
                >
                  {COPY[item.id].label}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 font-condensed text-sm font-semibold tracking-[0.2em] text-ember uppercase">
            {COPY[active.id].label}
          </p>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            role="tabpanel"
            id={`${baseId}-painel-${active.id}`}
            aria-labelledby={tabs.length > 1 ? `${baseId}-${active.id}` : undefined}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {active.photos.length === 0 ? (
              <p className="mt-8 rounded-[1.5rem] border border-dashed border-ember/50 p-6 text-cream-dim">
                {COPY[active.id].empty}
              </p>
            ) : (
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {active.photos.map((photo, index) => (
                  <li key={photo.id}>
                    <button
                      type="button"
                      className="group w-full text-left"
                      onClick={() => setOpen(index)}
                    >
                      <span className="relative block aspect-square overflow-hidden rounded-[1.3rem] border border-flame/25 shadow-[0_16px_40px_rgba(255,77,0,0.16)]">
                        <Image
                          src={photo.url}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                          className="album-zoom object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      </span>
                      {photo.caption ? (
                        <span className="mt-2 line-clamp-2 block text-sm leading-snug text-cream-dim">
                          {photo.caption}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {open !== null && active.photos[open] ? (
        <Lightbox
          photos={active.photos}
          index={open}
          onClose={() => setOpen(null)}
          onIndex={(step) => {
            setOpen((current) => {
              if (current === null || active.photos.length === 0) return current;
              return (current + step + active.photos.length) % active.photos.length;
            });
          }}
        />
      ) : null}
    </section>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: PublicPhoto[];
  index: number;
  onClose: () => void;
  onIndex: (step: number) => void;
}) {
  const photo = photos[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const onIndexRef = useRef(onIndex);
  const reduce = useReducedMotion();

  useEffect(() => {
    onCloseRef.current = onClose;
    onIndexRef.current = onIndex;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "ArrowRight") onIndexRef.current(1);
      if (event.key === "ArrowLeft") onIndexRef.current(-1);
      if (event.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = [...root.querySelectorAll<HTMLElement>("button, [href]")].filter(
        (element) => !element.hasAttribute("disabled"),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, []);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/92 p-3 sm:items-center sm:p-6" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={photo.caption || photo.alt}
        className="flex max-h-[100dvh] w-full max-w-5xl flex-col gap-3 rounded-[1.6rem] border border-flame/30 bg-ink-2 p-3 shadow-[0_30px_80px_rgba(255,77,0,0.28)] sm:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-condensed text-sm font-semibold tracking-[0.18em] text-ember uppercase">
            Foto {index + 1} de {photos.length}
          </p>
          <Button ref={closeRef} type="button" variant="outline" className="h-12 rounded-full px-5" onClick={onClose}>
            Fechar
          </Button>
        </div>
        <motion.div
          key={photo.id}
          className="relative h-[min(68dvh,720px)] overflow-hidden rounded-[1.2rem] bg-ink"
          drag={photos.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -48) onIndex(1);
            if (info.offset.x > 48) onIndex(-1);
          }}
          initial={reduce ? false : { opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-contain"
          />
        </motion.div>
        {photo.caption ? <p className="px-1 text-cream">{photo.caption}</p> : null}
        {photos.length > 1 ? (
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="h-12 flex-1 rounded-full" onClick={() => onIndex(-1)}>
              Anterior
            </Button>
            <Button type="button" variant="outline" className="h-12 flex-1 rounded-full" onClick={() => onIndex(1)}>
              Próxima
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AlbumFallback() {
  return (
    <section id="galeria" className="scroll-mt-24 px-5 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="h-8 w-32 rounded-full bg-coal" />
        <div className="mt-4 h-16 max-w-md rounded-3xl bg-coal" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="aspect-square rounded-[1.3rem] bg-coal" />
          <div className="aspect-square rounded-[1.3rem] bg-coal" />
          <div className="aspect-square rounded-[1.3rem] bg-coal" />
        </div>
        <p className="sr-only">Carregando a galeria.</p>
      </div>
    </section>
  );
}
