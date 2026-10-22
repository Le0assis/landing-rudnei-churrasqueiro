"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PhotoFrame } from "@/components/landing/photo-frame";
import { SectionHeading } from "@/components/landing/section-heading";
import { Button } from "@/components/ui/button";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/contact";
import type { PublicPhoto } from "@/lib/storage/types";

export function Gallery({
  photos,
  usingPlaceholders,
  error,
}: {
  photos: PublicPhoto[];
  usingPlaceholders: boolean;
  error: boolean;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const count = photos.length;
  const photo = photos[index];

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (reduce || paused || hidden || count < 2) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % count);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [reduce, paused, hidden, count]);

  function go(step: number) {
    if (count < 2) return;
    setDirection(step);
    setIndex((current) => (current + step + count) % count);
  }

  return (
    <section id="fotos" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Fotos"
          title="A brasa, de perto"
          intro={
            usingPlaceholders
              ? "Enquanto as fotos reais não chegam, o carrossel gira estas ilustrações. A faixa deixa claro que ainda não são do evento."
              : "As fotos vêm do arquivo do Rudnei. Elas giram sozinhas e você pode arrastar para o lado."
          }
        />

        {error ? (
          <p role="alert" className="mt-8 rounded-2xl border border-destructive/40 bg-ink-2 p-5 text-cream">
            Não consegui carregar as fotos agora. Atualize a página daqui a pouco. O Instagram continua no ar.
          </p>
        ) : null}

        {photo ? (
          <div
            className="mt-8"
            role="region"
            aria-roledescription="carrossel"
            aria-label="Fotos do churrasco"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") go(1);
              if (event.key === "ArrowLeft") go(-1);
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <motion.div
              className="frame-glow relative aspect-[16/10] overflow-hidden rounded-[1.8rem] border border-flame/35"
              drag={count > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -48) go(1);
                if (info.offset.x > 48) go(-1);
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={photo.id}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, x: direction * 36 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: direction * -36 }}
                  transition={{ duration: 0.35 }}
                >
                  <PhotoFrame photo={photo} sizes="(min-width: 1152px) 1100px, 100vw" className="size-full" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="h-12 rounded-full px-4" onClick={() => go(-1)} disabled={count < 2}>
                  Anterior
                </Button>
                <Button type="button" variant="outline" className="h-12 rounded-full px-4" onClick={() => go(1)} disabled={count < 2}>
                  Próxima
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 rounded-full px-4"
                  onClick={() => setPaused((value) => !value)}
                  disabled={count < 2}
                >
                  {paused ? "Continuar" : "Pausar"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Escolher foto">
                {photos.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Foto ${itemIndex + 1} de ${count}`}
                    aria-current={itemIndex === index}
                    className={`size-3 rounded-full ${itemIndex === index ? "bg-flame" : "bg-cream/30"}`}
                    onClick={() => {
                      setDirection(itemIndex > index ? 1 : -1);
                      setIndex(itemIndex);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <p className="mt-6 text-cream-dim">
          Mais registros no{" "}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember underline decoration-ember/40 underline-offset-4"
          >
            Instagram {INSTAGRAM_HANDLE}
          </a>
          .
        </p>
      </div>
    </section>
  );
}

export function GalleryFallback() {
  return (
    <section id="fotos" className="scroll-mt-24 px-5 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="h-8 w-32 rounded-full bg-coal" />
        <div className="mt-4 h-16 max-w-md rounded-3xl bg-coal" />
        <div className="mt-8 aspect-[16/10] rounded-[1.8rem] bg-coal" />
        <p className="sr-only">Carregando as fotos.</p>
      </div>
    </section>
  );
}
