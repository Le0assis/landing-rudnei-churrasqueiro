import { LIMITS } from "@/lib/pricing";
import type { SectionSettings } from "@/lib/sections";
import {
  toPublicPhoto,
  type GalleryManifest,
  type PhotoCategory,
  type StoredPhoto,
} from "@/lib/storage/types";

export type AdminPhoto = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  category: PhotoCategory;
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
    caption: photo.caption,
    category: photo.category,
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
    sections: manifest.sections satisfies SectionSettings,
    photos: manifest.photos.map(toAdminPhoto),
  };
}

export function cleanCaption(value: unknown): string {
  const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  return text.slice(0, 180);
}

export function altFor(category: PhotoCategory, caption: string): string {
  if (caption) return caption;
  if (category === "festas") return "Foto de festa com a equipe e os clientes do Rudnei Sciole";
  if (category === "feedbacks") return "Registro de feedback de cliente do Rudnei Sciole";
  return "Churrasco do Rudnei Sciole Churrasqueiro em Marília";
}

export function cleanAlt(value: unknown): string {
  const text = cleanCaption(value);
  if (!text) return altFor("carrossel", "");
  return text;
}

export function cleanDimension(value: unknown): number | null {
  const number = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  if (!Number.isInteger(number) || number < 1 || number > 8000) return null;
  return number;
}

export function uploadLimitLabel(): string {
  return `Até ${LIMITS.maxPhotos} fotos em cada categoria, com no máximo 2,5 MB cada depois da compressão.`;
}
