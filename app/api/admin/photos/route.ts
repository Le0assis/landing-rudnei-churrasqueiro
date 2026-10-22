import { NextResponse, type NextRequest } from "next/server";
import { adminPayload, altFor, cleanCaption, cleanDimension } from "@/lib/admin-photos";
import { defaultSections } from "@/lib/sections";
import { isPhotoCategory } from "@/lib/storage/types";
import { toErrorResponse } from "@/lib/api-error";
import { assertSameOrigin, getClientIp, jsonError, requireSession } from "@/lib/http";
import { assertUploadBuffer } from "@/lib/image-file";
import { rateLimit } from "@/lib/rate-limit";
import { getPhotoStore, storageKind, storageSetupMessage } from "@/lib/storage";
import { StorageConfigError } from "@/lib/storage/types";

export async function GET(request: NextRequest) {
  const denied = requireSession(request);
  if (denied) return denied;

  try {
    const manifest = await getPhotoStore().list();
    return NextResponse.json({
      ...adminPayload(manifest),
      storage: storageKind(),
      storageMessage: storageSetupMessage(),
    });
  } catch (error) {
    if (error instanceof StorageConfigError) {
      return NextResponse.json({
        ok: true,
        shuffle: true,
        sections: defaultSections(),
        photos: [],
        storage: "unconfigured",
        storageMessage: error.message,
      });
    }
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return jsonError("Origem recusada.", 403);
  const denied = requireSession(request);
  if (denied) return denied;

  const limit = rateLimit(`upload:${getClientIp(request)}`, 20, 15 * 60 * 1000);
  if (!limit.ok) {
    return jsonError("Muitos envios. Espere um pouco e tente de novo.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Não consegui ler a foto.", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("Envie uma imagem.", 400);

  const width = cleanDimension(form.get("width"));
  const height = cleanDimension(form.get("height"));
  if (!width || !height) return jsonError("Não consegui ler o tamanho da imagem.", 400);

  const rawCategory = form.get("category");
  const category =
    rawCategory == null || rawCategory === ""
      ? "carrossel"
      : isPhotoCategory(rawCategory)
        ? rawCategory
        : null;
  if (!category) return jsonError("Categoria inválida.", 400);
  const caption = cleanCaption(form.get("caption") ?? form.get("alt"));

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = assertUploadBuffer(buffer);
    const manifest = await getPhotoStore().add({
      data: buffer,
      contentType,
      alt: altFor(category, caption),
      caption,
      category,
      width,
      height,
    });
    return NextResponse.json({
      ...adminPayload(manifest),
      storage: storageKind(),
      storageMessage: storageSetupMessage(),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
