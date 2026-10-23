import { PhotoFrame } from "@/components/landing/photo-frame";
import { choripan } from "@/content/site";
import type { PublicPhoto } from "@/lib/storage/types";

export function Choripan({ photos }: { photos: PublicPhoto[] }) {
  return (
    <section id="choripan" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="frame-glow grid items-center gap-8 overflow-hidden rounded-[2.2rem] border border-flame/50 bg-[radial-gradient(circle_at_top_left,rgba(255,77,0,0.28),transparent_55%),#1c1511] p-6 md:grid-cols-[1.05fr_0.95fr] md:p-10">
          <div>
            <p className="inline-flex rounded-full border border-ember/50 bg-ember/10 px-4 py-1 font-condensed text-sm font-semibold tracking-[0.22em] text-ember uppercase">
              {choripan.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-6xl text-cream drop-shadow-[0_0_24px_rgba(255,77,0,0.45)] md:text-8xl">
              {choripan.title}
            </h2>
            <p className="mt-5 font-serif text-2xl text-cream italic">{choripan.lead}</p>
            <div className="mt-5 space-y-3 text-lg leading-relaxed text-cream-dim">
              {choripan.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          {photos.length > 0 ? (
            <div className="grid gap-3">
              <PhotoFrame
                photo={photos[0]}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="aspect-[4/3] rounded-[1.8rem] border border-flame/40"
              />
              {photos.length > 1 ? (
                <div className="grid grid-cols-3 gap-3">
                  {photos.slice(1, 4).map((photo) => (
                    <PhotoFrame
                      key={photo.id}
                      photo={photo}
                      sizes="(min-width: 768px) 15vw, 33vw"
                      className="aspect-square rounded-2xl border border-flame/30"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-flame/40 bg-ink/60 p-6 text-center">
              <p className="font-display text-5xl text-flame">Choripán</p>
              <p className="mt-3 text-sm text-cream-dim">{choripan.photoNote}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
