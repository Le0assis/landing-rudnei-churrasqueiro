import { defaultSections, type SectionSettings } from "@/lib/sections";

export const PHOTO_CATEGORIES = ["carrossel", "festas", "feedbacks"] as const;

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number];

export function isPhotoCategory(value: unknown): value is PhotoCategory {
  return typeof value === "string" && (PHOTO_CATEGORIES as readonly string[]).includes(value);
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
  return { shuffle: true, photos: [], sections: defaultSections() };
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
