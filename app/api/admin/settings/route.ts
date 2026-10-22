import { NextResponse, type NextRequest } from "next/server";
import { adminPayload } from "@/lib/admin-photos";
import { toErrorResponse } from "@/lib/api-error";
import { assertSameOrigin, jsonError, requireSession } from "@/lib/http";
import { getPhotoStore, storageKind, storageSetupMessage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return jsonError("Origem recusada.", 403);
  const denied = requireSession(request);
  if (denied) return denied;

  let shuffle: unknown;
  try {
    const body = (await request.json()) as { shuffle?: unknown };
    shuffle = body.shuffle;
  } catch {
    return jsonError("Não consegui ler a configuração.", 400);
  }

  if (typeof shuffle !== "boolean") {
    return jsonError("Informe se o carrossel deve embaralhar.", 400);
  }

  try {
    const manifest = await getPhotoStore().setShuffle(shuffle);
    return NextResponse.json({
      ...adminPayload(manifest),
      storage: storageKind(),
      storageMessage: storageSetupMessage(),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
