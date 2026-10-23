import { NextResponse, type NextRequest } from "next/server";
import { adminPayload } from "@/lib/admin-photos";
import { toErrorResponse } from "@/lib/api-error";
import { assertSameOrigin, getClientIp, jsonError, requireSession } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { toggleSection } from "@/lib/sections";
import { getPhotoStore, storageKind, storageSetupMessage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return jsonError("Origem recusada.", 403);
  const denied = requireSession(request);
  if (denied) return denied;

  const limit = rateLimit(`sections:${getClientIp(request)}`, 60, 15 * 60 * 1000);
  if (!limit.ok) {
    return jsonError("Muitas mudanças de seção. Espere um instante.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  let id: unknown;
  let enabled: unknown;
  try {
    const body = (await request.json()) as { id?: unknown; enabled?: unknown };
    id = body.id;
    enabled = body.enabled;
  } catch {
    return jsonError("Não consegui ler a seção.", 400);
  }

  try {
    const current = await getPhotoStore().list();
    const sections = toggleSection(current.sections, id, enabled);
    const manifest = await getPhotoStore().setSections(sections);
    return NextResponse.json({
      ...adminPayload(manifest),
      storage: storageKind(),
      storageMessage: storageSetupMessage(),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
