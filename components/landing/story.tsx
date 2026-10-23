import { PhotoFrame } from "@/components/landing/photo-frame";
import { SectionHeading } from "@/components/landing/section-heading";
import { slogans, story } from "@/content/site";
import type { PublicPhoto } from "@/lib/storage/types";

export function Story({ photo }: { photo: PublicPhoto }) {
  return (
    <section id="historia" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <PhotoFrame
          photo={photo}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="frame-glow aspect-[4/5] rounded-[2rem] border border-flame/30"
        />
        <div>
          <SectionHeading eyebrow={story.eyebrow} title={story.title} />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-cream-dim">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="mt-8 border-l-2 border-flame pl-5 font-serif text-2xl text-cream italic">
            {slogans.union}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
