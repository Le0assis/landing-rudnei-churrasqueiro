import { NextResponse } from "next/server";
import { readLocalPhoto } from "@/lib/storage/local";

export async function GET(_request: Request, context: RouteContext<"/api/media/[id]">) {
  const { id } = await context.params;
  const photo = await readLocalPhoto(id);
  if (!photo) {
    return new NextResponse("Foto não encontrada.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(new Uint8Array(photo.data), {
    headers: {
      "Content-Type": photo.contentType,
      "Content-Length": String(photo.data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
