import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PublicPhoto } from "@/lib/storage/types";

// Fotos estáticas do site (public/photos e public/gallery) já vêm em WebP otimizado
// e ficam fora dos localPatterns do next.config.ts, então são servidas direto.
const isStaticSitePhoto = (url: string) => url.startsWith("/photos/") || url.startsWith("/gallery/");

export function PhotoFrame({
  photo,
  priority = false,
  sizes,
  className,
}: {
  photo: PublicPhoto;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-coal", className)} style={{ position: "relative" }}>
      <Image
        src={photo.url}
        alt={photo.alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={isStaticSitePhoto(photo.url)}
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />
      {photo.placeholder ? (
        <span
          aria-hidden="true"
          className="absolute top-3 left-3 rounded-full border border-ember/60 bg-ink/85 px-3 py-1 font-condensed text-[0.7rem] font-semibold tracking-[0.18em] text-ember uppercase"
        >
          Imagem ilustrativa
        </span>
      ) : null}
    </div>
  );
}
