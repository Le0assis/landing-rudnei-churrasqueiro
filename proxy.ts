import { NextResponse, type NextRequest } from "next/server";
import { getAdminPath } from "@/lib/admin-path";

function notFound(): NextResponse {
  return new NextResponse("Página não encontrada.", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/interno" || pathname.startsWith("/interno/")) {
    return notFound();
  }

  const adminPath = getAdminPath();
  if (!adminPath) return NextResponse.next();

  const secretRoot = `/${adminPath}`;
  if (pathname !== secretRoot && !pathname.startsWith(`${secretRoot}/`)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const rest = pathname.slice(secretRoot.length);
  url.pathname = rest ? `/interno/painel${rest}` : "/interno/painel";
  const response = NextResponse.rewrite(url);
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|txt|xml)$).*)",
  ],
};
