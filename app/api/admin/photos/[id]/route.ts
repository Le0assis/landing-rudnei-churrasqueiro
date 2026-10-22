import { NextResponse, type NextRequest } from "next/server";
import { adminPayload } from "@/lib/admin-photos";
import { toErrorResponse } from "@/lib/api-error";
import { assertSameOrigin, jsonError, requireSession } from "@/lib/http";
import { getPhotoStore, storageKind, storageSetupMessage } from "@/lib/storage";

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/admin/photos/[id]">,
) {
  if (!assertSameOrigin(request)) return jsonError("Origem recusada.", 403);
  const denied = requireSession(request);
  if (denied) return denied;

  const { id } = await context.params;
  try {
    const manifest = await getPhotoStore().remove(id);
    return NextResponse.json({
      ...adminPayload(manifest),
      storage: storageKind(),
      storageMessage: storageSetupMessage(),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
