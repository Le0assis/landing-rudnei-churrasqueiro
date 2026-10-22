import { NextResponse, type NextRequest } from "next/server";
import {
  passwordConfigurationError,
  sessionSecretError,
  verifyAdminPassword,
} from "@/lib/auth";
import {
  assertSameOrigin,
  attachSession,
  getClientIp,
  jsonError,
} from "@/lib/http";
import { clearRateLimit, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) {
    return jsonError("Origem recusada.", 403);
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return jsonError("Muitas tentativas. Espere alguns minutos e tente de novo.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    return jsonError("Não foi possível entrar.", 400);
  }

  if (passwordConfigurationError() || sessionSecretError()) {
    console.error(passwordConfigurationError() ?? sessionSecretError());
    return jsonError("A área administrativa não está configurada neste ambiente.", 500);
  }

  const valid = await verifyAdminPassword(password);
  if (!valid) {
    return jsonError("Não foi possível entrar.", 401);
  }

  clearRateLimit(`login:${ip}`);
  const response = NextResponse.json({ ok: true });
  const withCookie = attachSession(response, request);
  if (!withCookie) {
    return jsonError("A área administrativa não está configurada neste ambiente.", 500);
  }
  return withCookie;
}
