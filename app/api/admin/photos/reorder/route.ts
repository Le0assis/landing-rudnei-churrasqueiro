import { NextResponse, type NextRequest } from "next/server";
import { adminPayload } from "@/lib/admin-photos";
import { toErrorResponse } from "@/lib/api-error";
import { assertSameOrigin, getClientIp, jsonError, requireSession } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { getPhotoStore, storageKind, storageSetupMessage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return jsonError("Origem recusada.", 403);
  const denied = requireSession(request);
  if (denied) return denied;

  const limit = rateLimit(`reorder:${getClientIp(request)}`, 60, 15 * 60 * 1000);
  if (!limit.ok) {
    return jsonError("Muitas mudanças de ordem. Espere um instante.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  let ids: unknown;
  try {
    const body = (await request.json()) as { ids?: unknown };
    ids = body.ids;
  } catch {
    return jsonError("Ordem inválida.", 400);
  }

  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return jsonError("Ordem inválida.", 400);
  }

  try {
    const manifest = await getPhotoStore().reorder(ids);
    return NextResponse.json({
      ...adminPayload(manifest),
      storage: storageKind(),
      storageMessage: storageSetupMessage(),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
