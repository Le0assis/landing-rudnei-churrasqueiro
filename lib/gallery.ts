import { connection } from "next/server";
import { cache } from "react";
import { placeholderPhotos } from "@/content/gallery";
import { defaultSections, type SectionSettings } from "@/lib/sections";
import { getPhotoStore, storageKind } from "@/lib/storage";
import { defaultTestimonials, publicTestimonials, type PublicTestimonial } from "@/lib/testimonials";
import { photoCategory } from "@/lib/storage/manifest";
import {
  toPublicPhoto,
  type PhotoCategory,
  type PublicPhoto,
  type StorageKind,
  type StoredPhoto,
} from "@/lib/storage/types";

export type GalleryView = {
  storage: StorageKind;
  usingPlaceholders: boolean;
  error: boolean;
  hero: PublicPhoto;
  story: PublicPhoto;
  photos: PublicPhoto[];
  festas: PublicPhoto[];
  clientes: PublicPhoto[];
  choripan: PublicPhoto[];
  shuffle: boolean;
  sections: SectionSettings;
  testimonials: PublicTestimonial[];
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

function ofCategory(photos: StoredPhoto[], category: PhotoCategory): PublicPhoto[] {
  return photos.filter((photo) => photoCategory(photo) === category).map(toPublicPhoto);
}

export const loadGallery = cache(async function loadGallery(): Promise<GalleryView> {
  await connection();
  const storage = storageKind();
  const fallbackHero = placeholderPhotos[0];
  const fallbackStory = placeholderPhotos[1] ?? placeholderPhotos[0];

  if (storage === "unconfigured") {
    return {
      storage,
      usingPlaceholders: true,
      error: false,
      hero: fallbackHero,
      story: fallbackStory,
      photos: shufflePhotos(placeholderPhotos),
      festas: [],
      clientes: [],
      choripan: [],
      shuffle: true,
      sections: defaultSections(),
      testimonials: publicTestimonials(defaultTestimonials()),
    };
  }

  try {
    const manifest = await getPhotoStore().list();
    const carousel = ofCategory(manifest.photos, "carrossel");
    const festas = ofCategory(manifest.photos, "festas");
    const clientes = ofCategory(manifest.photos, "clientes");
    const choripan = ofCategory(manifest.photos, "choripan");

    if (carousel.length === 0) {
      return {
        storage,
        usingPlaceholders: true,
        error: false,
        hero: fallbackHero,
        story: fallbackStory,
        photos: manifest.shuffle ? shufflePhotos(placeholderPhotos) : placeholderPhotos,
        festas,
        clientes,
        choripan,
        shuffle: manifest.shuffle,
        sections: manifest.sections,
        testimonials: publicTestimonials(manifest.testimonials),
      };
    }

    return {
      storage,
      usingPlaceholders: false,
      error: false,
      hero: carousel[0] ?? fallbackHero,
      story: carousel[1] ?? carousel[0] ?? fallbackStory,
      photos: manifest.shuffle ? shufflePhotos(carousel) : carousel,
      festas,
      clientes,
      choripan,
      shuffle: manifest.shuffle,
      sections: manifest.sections,
      testimonials: publicTestimonials(manifest.testimonials),
    };
  } catch (error) {
    console.error("Falha ao carregar as fotos do carrossel.", error);
    return {
      storage,
      usingPlaceholders: false,
      error: true,
      hero: fallbackHero,
      story: fallbackStory,
      photos: [],
      festas: [],
      clientes: [],
      choripan: [],
      shuffle: true,
      sections: defaultSections(),
      testimonials: publicTestimonials(defaultTestimonials()),
    };
  }
});
