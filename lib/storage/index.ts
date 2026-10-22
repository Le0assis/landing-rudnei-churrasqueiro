import { BlobPhotoStore } from "@/lib/storage/blob";
import { LocalPhotoStore } from "@/lib/storage/local";
import {
  StorageConfigError,
  type PhotoStore,
  type StorageKind,
} from "@/lib/storage/types";

export function storageKind(): StorageKind {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.VERCEL === "1") return "unconfigured";
  return "local";
}

export function storageSetupMessage(): string | null {
  if (storageKind() !== "unconfigured") return null;
  return "Na Vercel as fotos precisam do Vercel Blob. Crie um store, copie BLOB_READ_WRITE_TOKEN e faça um novo deploy. No seu computador, sem esse token, as fotos ficam na pasta data/photos.";
}

export function getPhotoStore(): PhotoStore {
  const kind = storageKind();
  if (kind === "blob") return new BlobPhotoStore();
  if (kind === "local") return new LocalPhotoStore();
  throw new StorageConfigError(
    storageSetupMessage() ?? "O armazenamento de fotos não está configurado.",
  );
}

export { StorageConfigError } from "@/lib/storage/types";
