import { mkdtemp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { migrateBlob, migrateLocal, migrateManifestJson, type BlobApi } from "@/lib/storage/migrate";
import { parseManifest } from "@/lib/storage/manifest";

const ID = "11111111-1111-4111-8111-111111111111";
const photo = (extra: Record<string, unknown>) => ({
  id: ID, alt: "a", caption: "", width: 10, height: 10, bytes: 1, contentType: "image/jpeg",
  createdAt: "2026-01-01T00:00:00.000Z", url: null, pathname: `${ID}.jpg`, ...extra,
});

describe("migração feedbacks → clientes", () => {
  it("reescreve categoria, pasta e seção e é idempotente", () => {
    const first = migrateManifestJson({
      shuffle: true,
      photos: [photo({ category: "feedbacks", pathname: `feedbacks/${ID}.jpg` }), photo({ category: "festas" })],
      sections: { "galeria-feedbacks": false },
    });
    expect(first.changed).toBe(true);
    const photos = first.manifest.photos as Record<string, unknown>[];
    expect(photos[0]).toMatchObject({ category: "clientes", pathname: `clientes/${ID}.jpg` });
    expect(photos[1]?.category).toBe("festas");
    expect(first.manifest.sections).toEqual({ "galeria-clientes": false });
    expect(migrateManifestJson(first.manifest).changed).toBe(false);
  });

  it("leitura trata feedbacks como clientes antes da migração", () => {
    const parsed = parseManifest({ photos: [photo({ category: "feedbacks" })] });
    expect(parsed.photos[0]?.category).toBe("clientes");
  });

  it("local: move a pasta e o manifesto, e rodar de novo não muda nada", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "migra-"));
    await mkdir(path.join(root, "feedbacks"), { recursive: true });
    await writeFile(path.join(root, "feedbacks", "a.jpg"), "x");
    await writeFile(path.join(root, "manifest.json"), JSON.stringify({ photos: [photo({ category: "feedbacks" })] }));
    const first = await migrateLocal(root);
    expect(first.moved).toEqual([path.join("clientes", "a.jpg")]);
    expect(first.manifestChanged).toBe(true);
    expect(await readdir(root)).not.toContain("feedbacks");
    const saved = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
    expect(saved.photos[0].category).toBe("clientes");
    expect(await migrateLocal(root)).toEqual({ moved: [], manifestChanged: false });
  });

  it("blob: copia, atualiza o manifesto e só apaga depois de confirmar a cópia", async () => {
    const store = new Map<string, string>([["gallery/feedbacks/a.jpg", "https://b/gallery/feedbacks/a.jpg"]]);
    let manifest: unknown = { photos: [photo({ category: "feedbacks", pathname: "gallery/feedbacks/a.jpg", url: "https://b/gallery/feedbacks/a.jpg" })] };
    const log: string[] = [];
    const api: BlobApi = {
      list: async (prefix) => [...store].filter(([p]) => p.startsWith(prefix)).map(([pathname, url]) => ({ pathname, url })),
      copy: async (_from, to) => { log.push(`copy ${to}`); store.set(to, `https://b/${to}`); return { url: `https://b/${to}`, pathname: to }; },
      head: async (p) => (store.has(p) ? { url: store.get(p)! } : null),
      del: async (url) => { log.push(`del ${url}`); for (const [p, u] of store) if (u === url) store.delete(p); },
      readManifest: async () => manifest,
      writeManifest: async (m) => { log.push("manifest"); manifest = m; },
    };
    expect(await migrateBlob(api)).toEqual({ copied: 1, deleted: 1, manifestChanged: true });
    expect(log).toEqual(["copy gallery/clientes/a.jpg", "manifest", "del https://b/gallery/feedbacks/a.jpg"]);
    expect((manifest as { photos: Record<string, unknown>[] }).photos[0]).toMatchObject({
      category: "clientes", pathname: "gallery/clientes/a.jpg", url: "https://b/gallery/clientes/a.jpg",
    });
    expect(await migrateBlob(api)).toEqual({ copied: 0, deleted: 0, manifestChanged: false });
  });
});
