import { defaultSections, type SectionSettings } from "@/lib/sections";
import { defaultTestimonials, type Testimonial } from "@/lib/testimonials";

export const PHOTO_CATEGORIES = ["carrossel", "festas", "clientes", "choripan"] as const;

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number];

// Nome antigo da aba Clientes. Manifestos gravados antes da troca ainda trazem
// "feedbacks"; a leitura converte e a próxima gravação já sai com "clientes".
export const LEGACY_CATEGORY_ALIASES: Record<string, PhotoCategory> = { feedbacks: "clientes" };

export function isPhotoCategory(value: unknown): value is PhotoCategory {
  return typeof value === "string" && (PHOTO_CATEGORIES as readonly string[]).includes(value);
}

export function toPhotoCategory(value: unknown): PhotoCategory | null {
  if (isPhotoCategory(value)) return value;
  if (typeof value === "string" && value in LEGACY_CATEGORY_ALIASES) return LEGACY_CATEGORY_ALIASES[value] ?? null;
  return null;
}

export type ImageContentType = "image/jpeg" | "image/png" | "image/webp";

export type StoredPhoto = {
  id: string;
  alt: string;
  caption: string;
  category: PhotoCategory;
  width: number;
  height: number;
  bytes: number;
  contentType: ImageContentType;
  createdAt: string;
  url: string | null;
  pathname: string;
};

export type GalleryManifest = {
  shuffle: boolean;
  photos: StoredPhoto[];
  sections: SectionSettings;
  testimonials: Testimonial[];
};

export type NewPhoto = {
  data: Buffer;
  contentType: ImageContentType;
  alt: string;
  caption: string;
  category: PhotoCategory;
  width: number;
  height: number;
};

export type PublicPhoto = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  placeholder: boolean;
};

export type StorageKind = "local" | "blob" | "unconfigured";

export class StorageConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageConfigError";
  }
}

export interface PhotoStore {
  readonly kind: "local" | "blob";
  list(): Promise<GalleryManifest>;
  add(input: NewPhoto): Promise<GalleryManifest>;
  remove(id: string): Promise<GalleryManifest>;
  reorder(ids: string[], category: PhotoCategory): Promise<GalleryManifest>;
  setShuffle(shuffle: boolean): Promise<GalleryManifest>;
  setSections(sections: SectionSettings): Promise<GalleryManifest>;
  setTestimonials(testimonials: Testimonial[]): Promise<GalleryManifest>;
}

const CONTENT_TYPES = new Set<ImageContentType>(["image/jpeg", "image/png", "image/webp"]);

export function isStoredPhoto(value: unknown): value is StoredPhoto {
  if (!value || typeof value !== "object") return false;
  const photo = value as Record<string, unknown>;
  return (
    typeof photo.id === "string" &&
    typeof photo.alt === "string" &&
    typeof photo.width === "number" &&
    typeof photo.height === "number" &&
    typeof photo.bytes === "number" &&
    typeof photo.contentType === "string" &&
    CONTENT_TYPES.has(photo.contentType as ImageContentType) &&
    typeof photo.createdAt === "string" &&
    (photo.url === null || typeof photo.url === "string") &&
    typeof photo.pathname === "string"
  );
}

export function emptyManifest(): GalleryManifest {
  return { shuffle: true, photos: [], sections: defaultSections(), testimonials: defaultTestimonials() };
}

export function toPublicPhoto(photo: StoredPhoto): PublicPhoto {
  return {
    id: photo.id,
    url: photo.url ?? `/api/media/${photo.id}`,
    alt: photo.alt,
    caption: photo.caption,
    width: photo.width,
    height: photo.height,
    placeholder: false,
  };
}
