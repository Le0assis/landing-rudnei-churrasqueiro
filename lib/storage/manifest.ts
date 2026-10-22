import { LIMITS } from "@/lib/pricing";
import type { GalleryManifest, StoredPhoto } from "@/lib/storage/types";

const ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPhotoId(id: string): boolean {
  return ID_PATTERN.test(id);
}

export function reorderPhotos(manifest: GalleryManifest, ids: string[]): GalleryManifest {
  if (ids.length !== manifest.photos.length || new Set(ids).size !== ids.length) {
    throw new Error("A ordem precisa incluir cada foto uma vez.");
  }

  const byId = new Map(manifest.photos.map((photo) => [photo.id, photo]));
  const photos: StoredPhoto[] = [];
  for (const id of ids) {
    const photo = byId.get(id);
    if (!photo) throw new Error("A ordem cita uma foto que não existe.");
    photos.push(photo);
  }

  return { ...manifest, photos };
}

export function assertCanAdd(manifest: GalleryManifest): void {
  if (manifest.photos.length >= LIMITS.maxPhotos) {
    throw new Error(`O carrossel aceita até ${LIMITS.maxPhotos} fotos. Apague uma para enviar outra.`);
  }
}
