export type ImageContentType = "image/jpeg" | "image/png" | "image/webp";

export type StoredPhoto = {
  id: string;
  alt: string;
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
};

export type NewPhoto = {
  data: Buffer;
  contentType: ImageContentType;
  alt: string;
  width: number;
  height: number;
};

export type PublicPhoto = {
  id: string;
  url: string;
  alt: string;
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
  reorder(ids: string[]): Promise<GalleryManifest>;
  setShuffle(shuffle: boolean): Promise<GalleryManifest>;
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
  return { shuffle: true, photos: [] };
}

export function parseManifest(value: unknown): GalleryManifest {
  if (!value || typeof value !== "object") return emptyManifest();
  const record = value as Record<string, unknown>;
  const photos = Array.isArray(record.photos) ? record.photos.filter(isStoredPhoto) : [];
  return {
    shuffle: record.shuffle !== false,
    photos,
  };
}

export function toPublicPhoto(photo: StoredPhoto): PublicPhoto {
  return {
    id: photo.id,
    url: photo.url ?? `/api/media/${photo.id}`,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
    placeholder: false,
  };
}
