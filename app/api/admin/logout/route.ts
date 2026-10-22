import { NextResponse, type NextRequest } from "next/server";
import { assertSameOrigin, jsonError, sessionCookieOptions } from "@/lib/http";

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) {
    return jsonError("Origem recusada.", 403);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    ...sessionCookieOptions(request),
    value: "",
    maxAge: 0,
  });
  return response;
}
