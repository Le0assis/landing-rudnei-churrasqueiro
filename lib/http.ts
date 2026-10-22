import { NextResponse, type NextRequest } from "next/server";
import { readSessionFromCookie, SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, getSessionSecret } from "@/lib/auth";

export function jsonError(
  message: string,
  status: number,
  headers?: Record<string, string>,
): NextResponse {
  return NextResponse.json({ ok: false, message }, { status, headers });
}

export function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function requireSession(request: NextRequest): NextResponse | null {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!readSessionFromCookie(token)) {
    return jsonError("Sessão expirada. Entre de novo.", 401);
  }
  return null;
}

export function sessionCookieOptions(request: Request) {
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const https = proto === "https" || new URL(request.url).protocol === "https:";
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    secure: https,
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function attachSession(response: NextResponse, request: Request): NextResponse | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  response.cookies.set({
    ...sessionCookieOptions(request),
    value: createSessionToken(secret),
  });
  return response;
}
