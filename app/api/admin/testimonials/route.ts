import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { adminPayload } from "@/lib/admin-photos";
import { toErrorResponse } from "@/lib/api-error";
import { assertSameOrigin, getClientIp, jsonError, requireSession } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { getPhotoStore, storageKind, storageSetupMessage } from "@/lib/storage";
import {
  addTestimonial,
  removeTestimonial,
  toggleTestimonial,
  updateTestimonial,
  type Testimonial,
} from "@/lib/testimonials";

type Body = { id?: unknown; name?: unknown; text?: unknown; event?: unknown; enabled?: unknown };

async function handle(request: NextRequest, change: (list: Testimonial[], body: Body) => Testimonial[]) {
  if (!assertSameOrigin(request)) return jsonError("Origem recusada.", 403);
  const denied = requireSession(request);
  if (denied) return denied;

  const limit = rateLimit(`testimonials:${getClientIp(request)}`, 60, 15 * 60 * 1000);
  if (!limit.ok) {
    return jsonError("Muitas mudanças seguidas. Espere um instante.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
    if (!body || typeof body !== "object") throw new Error();
  } catch {
    return jsonError("Não consegui ler o depoimento.", 400);
  }

  try {
    const store = getPhotoStore();
    const current = await store.list();
    let next: Testimonial[];
    try {
      next = change(current.testimonials, body);
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : "Depoimento inválido.", 400);
    }
    const manifest = await store.setTestimonials(next);
    return NextResponse.json({
      ...adminPayload(manifest),
      storage: storageKind(),
      storageMessage: storageSetupMessage(),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Adiciona um depoimento: { name, text, event? }. */
export function POST(request: NextRequest) {
  return handle(request, (list, body) => addTestimonial(list, body, randomUUID(), new Date().toISOString()));
}

/** Edita ({ id, name, text, event? }) ou liga/desliga ({ id, enabled }). */
export function PATCH(request: NextRequest) {
  return handle(request, (list, body) =>
    body.name === undefined && body.text === undefined && body.enabled !== undefined
      ? toggleTestimonial(list, body.id, body.enabled)
      : updateTestimonial(list, body.id, body),
  );
}

/** Apaga: { id }. */
export function DELETE(request: NextRequest) {
  return handle(request, (list, body) => removeTestimonial(list, body.id));
}
