import { LIMITS } from "@/lib/pricing";
import { toPublicPhoto, type GalleryManifest, type StoredPhoto } from "@/lib/storage/types";

export type AdminPhoto = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
};

export function toAdminPhoto(photo: StoredPhoto): AdminPhoto {
  const publicPhoto = toPublicPhoto(photo);
  return {
    id: photo.id,
    url: publicPhoto.url,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
    bytes: photo.bytes,
    createdAt: photo.createdAt,
  };
}

export function adminPayload(manifest: GalleryManifest) {
  return {
    ok: true as const,
    shuffle: manifest.shuffle,
    photos: manifest.photos.map(toAdminPhoto),
  };
}

export function cleanAlt(value: unknown): string {
  const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (!text) return "Churrasco do Rudnei Sciole Churrasqueiro em Marília";
  return text.slice(0, 180);
}

export function cleanDimension(value: unknown): number | null {
  const number = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  if (!Number.isInteger(number) || number < 1 || number > 8000) return null;
  return number;
}

export function uploadLimitLabel(): string {
  return `Até ${LIMITS.maxPhotos} fotos, com no máximo 2,5 MB cada depois da compressão.`;
}
