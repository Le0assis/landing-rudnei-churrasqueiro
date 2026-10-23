// Migra a categoria antiga "feedbacks" para "clientes". Idempotente.
// Uso: node scripts/migrate-clientes.mjs           (local, data/photos)
//      node scripts/migrate-clientes.mjs --blob    (Vercel Blob, precisa de BLOB_READ_WRITE_TOKEN)
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { alias: { "@": new URL("..", import.meta.url).pathname } });
const { migrateLocal, migrateBlob } = await jiti.import("../lib/storage/migrate.ts");

if (process.argv.includes("--blob")) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("BLOB_READ_WRITE_TOKEN não está configurado.");
    process.exit(1);
  }
  const { list, copy, head, del, put } = await import("@vercel/blob");
  const MANIFEST = "gallery/manifest.json";
  const result = await migrateBlob({
    async list(prefix) {
      const out = [];
      let cursor;
      do {
        const page = await list({ prefix, token, cursor });
        out.push(...page.blobs);
        cursor = page.hasMore ? page.cursor : undefined;
      } while (cursor);
      return out;
    },
    copy: (fromUrl, toPathname) => copy(fromUrl, toPathname, { access: "public", token, addRandomSuffix: false }),
    head: (pathname) => head(pathname, { token }).catch(() => null),
    del: (url) => del(url, { token }),
    async readManifest() {
      const found = await list({ prefix: MANIFEST, token, limit: 10 });
      const blob = found.blobs.find((b) => b.pathname === MANIFEST);
      if (!blob) return {};
      const res = await fetch(`${blob.url}?v=${Date.now()}`, { cache: "no-store" });
      return res.json();
    },
    writeManifest: (manifest) =>
      put(MANIFEST, JSON.stringify(manifest), {
        access: "public", token, addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60,
      }).then(() => undefined),
  });
  console.log("Blob:", result);
} else {
  console.log("Local:", await migrateLocal());
}
