import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

// Migração idempotente da categoria antiga "feedbacks" para "clientes".
// Rodar de novo não muda nada: só toca no que ainda usa o nome antigo.

const OLD = "feedbacks";
const NEW = "clientes";

type RawManifest = Record<string, unknown> & { photos?: unknown; sections?: unknown };

export type ManifestMigration = { manifest: RawManifest; changed: boolean; renamedPaths: Map<string, string> };

/** Troca o prefixo de pasta feedbacks/ por clientes/ (local ou Blob). */
export function migratePathname(pathname: string): string {
  return pathname
    .replace(/(^|\/)feedbacks\//, `$1${NEW}/`);
}

/** Reescreve o manifesto cru (JSON) sem perder campos desconhecidos. */
export function migrateManifestJson(value: unknown): ManifestMigration {
  const renamedPaths = new Map<string, string>();
  if (!value || typeof value !== "object") return { manifest: {}, changed: false, renamedPaths };
  const manifest: RawManifest = { ...(value as RawManifest) };
  let changed = false;

  if (Array.isArray(manifest.photos)) {
    manifest.photos = manifest.photos.map((item: unknown) => {
      if (!item || typeof item !== "object") return item;
      const photo = { ...(item as Record<string, unknown>) };
      if (photo.category === OLD) {
        photo.category = NEW;
        changed = true;
      }
      if (typeof photo.pathname === "string") {
        const next = migratePathname(photo.pathname);
        if (next !== photo.pathname) {
          renamedPaths.set(photo.pathname, next);
          photo.pathname = next;
          changed = true;
        }
      }
      return photo;
    });
  }

  if (manifest.sections && typeof manifest.sections === "object") {
    const sections = { ...(manifest.sections as Record<string, unknown>) };
    if ("galeria-feedbacks" in sections) {
      if (typeof sections["galeria-clientes"] !== "boolean") sections["galeria-clientes"] = sections["galeria-feedbacks"];
      delete sections["galeria-feedbacks"];
      manifest.sections = sections;
      changed = true;
    }
  }

  return { manifest, changed, renamedPaths };
}

async function exists(target: string): Promise<boolean> {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

/** Local: move data/photos/feedbacks (e files/feedbacks) para clientes e reescreve o manifesto. */
export async function migrateLocal(root = path.join(process.cwd(), "data", "photos")): Promise<{ moved: string[]; manifestChanged: boolean }> {
  const moved: string[] = [];
  for (const base of [root, path.join(root, "files")]) {
    const from = path.join(base, OLD);
    const to = path.join(base, NEW);
    if (!(await exists(from))) continue;
    await mkdir(to, { recursive: true });
    for (const name of await readdir(from)) {
      const target = path.join(to, name);
      if (await exists(target)) continue;
      await rename(path.join(from, name), target);
      moved.push(path.relative(root, target));
    }
    if ((await readdir(from)).length === 0) await rm(from, { recursive: true, force: true });
  }

  const manifestPath = path.join(root, "manifest.json");
  if (!(await exists(manifestPath))) return { moved, manifestChanged: false };
  const result = migrateManifestJson(JSON.parse(await readFile(manifestPath, "utf8")) as unknown);
  if (result.changed) {
    await cp(manifestPath, `${manifestPath}.bak-feedbacks`, { force: false, errorOnExist: false });
    const tmp = `${manifestPath}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(result.manifest, null, 2));
    await rename(tmp, manifestPath);
  }
  return { moved, manifestChanged: result.changed };
}

export type BlobApi = {
  list(prefix: string): Promise<{ pathname: string; url: string }[]>;
  copy(fromUrl: string, toPathname: string): Promise<{ url: string; pathname: string }>;
  head(pathname: string): Promise<{ url: string } | null>;
  del(url: string): Promise<void>;
  readManifest(): Promise<unknown>;
  writeManifest(manifest: unknown): Promise<void>;
};

/** Blob: copia gallery/feedbacks/* para gallery/clientes/*, grava o manifesto e só então apaga os antigos. */
export async function migrateBlob(api: BlobApi): Promise<{ copied: number; deleted: number; manifestChanged: boolean }> {
  const old = await api.list(`gallery/${OLD}/`);
  const urlMap = new Map<string, string>();
  let copied = 0;
  for (const blob of old) {
    const target = migratePathname(blob.pathname);
    const already = await api.head(target);
    const done = already ?? (await api.copy(blob.url, target));
    if (!already) copied += 1;
    urlMap.set(blob.pathname, done.url);
  }

  const raw = await api.readManifest();
  const result = migrateManifestJson(raw);
  if (Array.isArray(result.manifest.photos)) {
    result.manifest.photos = result.manifest.photos.map((item: unknown) => {
      if (!item || typeof item !== "object") return item;
      const photo = item as Record<string, unknown>;
      const original = [...result.renamedPaths.entries()].find(([, next]) => next === photo.pathname)?.[0];
      const url = original ? urlMap.get(original) : undefined;
      return url ? { ...photo, url } : photo;
    });
  }
  if (result.changed) await api.writeManifest(result.manifest);

  // Confere a cópia antes de apagar qualquer coisa.
  let deleted = 0;
  for (const blob of old) {
    const copy = await api.head(migratePathname(blob.pathname));
    if (!copy) continue;
    await api.del(blob.url);
    deleted += 1;
  }
  return { copied, deleted, manifestChanged: result.changed };
}
