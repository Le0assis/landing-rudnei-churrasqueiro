import { connection } from "next/server";
import { cache } from "react";
import { placeholderPhotos } from "@/content/gallery";
import { getPhotoStore, storageKind } from "@/lib/storage";
import {
  toPublicPhoto,
  type PublicPhoto,
  type StorageKind,
} from "@/lib/storage/types";

export type GalleryView = {
  storage: StorageKind;
  usingPlaceholders: boolean;
  error: boolean;
  hero: PublicPhoto;
  story: PublicPhoto;
  photos: PublicPhoto[];
  shuffle: boolean;
};

function shufflePhotos(photos: PublicPhoto[]): PublicPhoto[] {
  const copy = [...photos];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    const other = copy[swap];
    if (!current || !other) continue;
    copy[index] = other;
    copy[swap] = current;
  }
  return copy;
}

export const loadGallery = cache(async function loadGallery(): Promise<GalleryView> {
  await connection();
  const storage = storageKind();

  if (storage === "unconfigured") {
    return {
      storage,
      usingPlaceholders: true,
      error: false,
      hero: placeholderPhotos[0],
      story: placeholderPhotos[1] ?? placeholderPhotos[0],
      photos: shufflePhotos(placeholderPhotos),
      shuffle: true,
    };
  }

  try {
    const manifest = await getPhotoStore().list();
    if (manifest.photos.length === 0) {
      return {
        storage,
        usingPlaceholders: true,
        error: false,
        hero: placeholderPhotos[0],
        story: placeholderPhotos[1] ?? placeholderPhotos[0],
        photos: manifest.shuffle ? shufflePhotos(placeholderPhotos) : placeholderPhotos,
        shuffle: manifest.shuffle,
      };
    }

    const photos = manifest.photos.map(toPublicPhoto);
    return {
      storage,
      usingPlaceholders: false,
      error: false,
      hero: photos[0] ?? placeholderPhotos[0],
      story: photos[1] ?? photos[0] ?? placeholderPhotos[0],
      photos: manifest.shuffle ? shufflePhotos(photos) : photos,
      shuffle: manifest.shuffle,
    };
  } catch (error) {
    console.error("Falha ao carregar as fotos do carrossel.", error);
    return {
      storage,
      usingPlaceholders: false,
      error: true,
      hero: placeholderPhotos[0],
      story: placeholderPhotos[1] ?? placeholderPhotos[0],
      photos: [],
      shuffle: true,
    };
  }
});
