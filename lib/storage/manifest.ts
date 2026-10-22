import { cleanCaption } from "@/lib/admin-photos";
import { LIMITS } from "@/lib/pricing";
import { parseSections } from "@/lib/sections";
import {
  emptyManifest,
  isPhotoCategory,
  isStoredPhoto,
  type GalleryManifest,
  type PhotoCategory,
  type StoredPhoto,
} from "@/lib/storage/types";

const ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPhotoId(id: string): boolean {
  return ID_PATTERN.test(id);
}

export function photoCategory(photo: { category?: unknown }): PhotoCategory {
  return isPhotoCategory(photo.category) ? photo.category : "carrossel";
}

export function categoryLimitLabel(category: PhotoCategory): string {
  if (category === "festas") return "Festas";
  if (category === "feedbacks") return "Feedbacks";
  return "O carrossel";
}

export function normalizeStoredPhoto(photo: StoredPhoto): StoredPhoto {
  const record = photo as StoredPhoto & { category?: unknown; caption?: unknown };
  return {
    ...photo,
    category: photoCategory(record),
    caption: cleanCaption(record.caption),
  };
}

export function parseManifest(value: unknown): GalleryManifest {
  if (!value || typeof value !== "object") return emptyManifest();
  const record = value as Record<string, unknown>;
  const photos = Array.isArray(record.photos)
    ? record.photos.filter(isStoredPhoto).map((photo) => normalizeStoredPhoto(photo))
    : [];
  return {
    shuffle: record.shuffle !== false,
    photos,
    sections: parseSections(record.sections),
  };
}

export function reorderPhotos(
  manifest: GalleryManifest,
  ids: string[],
  category: PhotoCategory,
): GalleryManifest {
  const group = manifest.photos.filter((photo) => photoCategory(photo) === category);
  if (ids.length !== group.length || new Set(ids).size !== ids.length) {
    throw new Error("A ordem precisa incluir cada foto uma vez.");
  }

  const byId = new Map(group.map((photo) => [photo.id, photo]));
  const ordered: StoredPhoto[] = [];
  for (const id of ids) {
    const photo = byId.get(id);
    if (!photo) throw new Error("A ordem cita uma foto que não existe.");
    ordered.push(photo);
  }

  let cursor = 0;
  const photos = manifest.photos.map((photo) => {
    if (photoCategory(photo) !== category) return photo;
    const next = ordered[cursor];
    cursor += 1;
    return next ?? photo;
  });

  return { ...manifest, photos };
}

export function assertCanAdd(manifest: GalleryManifest, category: PhotoCategory): void {
  const count = manifest.photos.filter((photo) => photoCategory(photo) === category).length;
  if (count >= LIMITS.maxPhotos) {
    throw new Error(
      `${categoryLimitLabel(category)} aceita até ${LIMITS.maxPhotos} fotos. Apague uma para enviar outra.`,
    );
  }
}
