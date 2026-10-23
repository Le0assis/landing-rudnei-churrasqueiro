import { randomUUID } from "node:crypto";
import { del, list, put } from "@vercel/blob";
import { extensionFor } from "@/lib/image-file";
import { assertCanAdd, isPhotoId, parseManifest, reorderPhotos } from "@/lib/storage/manifest";
import type { SectionSettings } from "@/lib/sections";
import type { Testimonial } from "@/lib/testimonials";
import {
  StorageConfigError,
  emptyManifest,
  type GalleryManifest,
  type NewPhoto,
  type PhotoCategory,
  type PhotoStore,
} from "@/lib/storage/types";

const MANIFEST_PATH = "gallery/manifest.json";

function token(): string {
  const value = process.env.BLOB_READ_WRITE_TOKEN;
  if (!value) {
    throw new StorageConfigError(
      "BLOB_READ_WRITE_TOKEN não está configurado. Na Vercel, crie um Blob store e cole o token.",
    );
  }
  return value;
}

async function readManifest(): Promise<GalleryManifest> {
  const found = await list({ prefix: MANIFEST_PATH, token: token(), limit: 10 });
  const blob = found.blobs.find((item) => item.pathname === MANIFEST_PATH);
  if (!blob) return emptyManifest();

  const response = await fetch(`${blob.url}?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Não foi possível ler a lista de fotos no Vercel Blob.");
  }
  return parseManifest((await response.json()) as unknown);
}

async function writeManifest(manifest: GalleryManifest): Promise<void> {
  await put(MANIFEST_PATH, JSON.stringify(manifest), {
    access: "public",
    token: token(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

export class BlobPhotoStore implements PhotoStore {
  readonly kind = "blob" as const;

  async list(): Promise<GalleryManifest> {
    return readManifest();
  }

  async add(input: NewPhoto): Promise<GalleryManifest> {
    const manifest = await readManifest();
    assertCanAdd(manifest, input.category);
    const id = randomUUID();
    const pathname = `gallery/files/${id}${extensionFor(input.contentType)}`;
    const blob = await put(pathname, input.data, {
      access: "public",
      token: token(),
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: input.contentType,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });

    const next: GalleryManifest = {
      ...manifest,
      photos: [
        ...manifest.photos,
        {
          id,
          alt: input.alt,
          caption: input.caption,
          category: input.category,
          width: input.width,
          height: input.height,
          bytes: input.data.length,
          contentType: input.contentType,
          createdAt: new Date().toISOString(),
          url: blob.url,
          pathname: blob.pathname,
        },
      ],
    };

    try {
      await writeManifest(next);
    } catch (error) {
      await del(blob.url, { token: token() }).catch(() => undefined);
      throw error;
    }
    return next;
  }

  async remove(id: string): Promise<GalleryManifest> {
    if (!isPhotoId(id)) throw new Error("Foto inválida.");
    const manifest = await readManifest();
    const photo = manifest.photos.find((item) => item.id === id);
    if (!photo) throw new Error("Foto não encontrada.");

    const next: GalleryManifest = {
      ...manifest,
      photos: manifest.photos.filter((item) => item.id !== id),
    };
    await writeManifest(next);
    if (photo.url) {
      await del(photo.url, { token: token() }).catch((error: unknown) => {
        console.error("Não consegui apagar o arquivo no Blob.", error);
      });
    }
    return next;
  }

  async reorder(ids: string[], category: PhotoCategory): Promise<GalleryManifest> {
    const next = reorderPhotos(await readManifest(), ids, category);
    await writeManifest(next);
    return next;
  }

  async setShuffle(shuffle: boolean): Promise<GalleryManifest> {
    const next = { ...(await readManifest()), shuffle };
    await writeManifest(next);
    return next;
  }

  async setSections(sections: SectionSettings): Promise<GalleryManifest> {
    const next = { ...(await readManifest()), sections };
    await writeManifest(next);
    return next;
  }

  async setTestimonials(testimonials: Testimonial[]): Promise<GalleryManifest> {
    const next = { ...(await readManifest()), testimonials };
    await writeManifest(next);
    return next;
  }
}
