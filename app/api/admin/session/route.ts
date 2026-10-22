import { NextResponse, type NextRequest } from "next/server";
import { readSessionFromCookie, SESSION_COOKIE } from "@/lib/auth";
import { storageKind, storageSetupMessage } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const authenticated = readSessionFromCookie(request.cookies.get(SESSION_COOKIE)?.value);
  if (!authenticated) {
    return NextResponse.json({ ok: true, authenticated: false });
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    storage: storageKind(),
    storageMessage: storageSetupMessage(),
  });
}
