import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { extensionFor } from "@/lib/image-file";
import { assertCanAdd, isPhotoId, parseManifest, reorderPhotos } from "@/lib/storage/manifest";
import type { SectionSettings } from "@/lib/sections";
import type { Testimonial } from "@/lib/testimonials";
import {
  emptyManifest,
  type GalleryManifest,
  type NewPhoto,
  type PhotoCategory,
  type PhotoStore,
} from "@/lib/storage/types";

const ROOT = path.join(process.cwd(), "data", "photos");
const FILES = path.join(ROOT, "files");
const MANIFEST = path.join(ROOT, "manifest.json");

async function readManifest(): Promise<GalleryManifest> {
  try {
    const raw = await readFile(MANIFEST, "utf8");
    return parseManifest(JSON.parse(raw) as unknown);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyManifest();
    throw error;
  }
}

async function writeManifest(manifest: GalleryManifest): Promise<void> {
  await mkdir(ROOT, { recursive: true });
  const temporary = `${MANIFEST}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(manifest, null, 2));
  await rename(temporary, MANIFEST);
}

function filePath(pathname: string): string {
  const resolved = path.resolve(FILES, pathname);
  if (!resolved.startsWith(`${FILES}${path.sep}`)) {
    throw new Error("Caminho de foto inválido.");
  }
  return resolved;
}

export class LocalPhotoStore implements PhotoStore {
  readonly kind = "local" as const;

  async list(): Promise<GalleryManifest> {
    return readManifest();
  }

  async add(input: NewPhoto): Promise<GalleryManifest> {
    const manifest = await readManifest();
    assertCanAdd(manifest, input.category);
    await mkdir(FILES, { recursive: true });

    const id = randomUUID();
    const pathname = `${id}${extensionFor(input.contentType)}`;
    await writeFile(filePath(pathname), input.data);

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
          url: null,
          pathname,
        },
      ],
    };
    await writeManifest(next);
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
    await rm(filePath(photo.pathname), { force: true });
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

export async function readLocalPhoto(id: string): Promise<{
  data: Buffer;
  contentType: string;
} | null> {
  if (!isPhotoId(id)) return null;
  const manifest = await readManifest();
  const photo = manifest.photos.find((item) => item.id === id);
  if (!photo || photo.url) return null;
  try {
    const data = await readFile(filePath(photo.pathname));
    return { data, contentType: photo.contentType };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
