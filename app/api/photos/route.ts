import { NextResponse } from "next/server";
import { loadGallery } from "@/lib/gallery";

export async function GET() {
  const gallery = await loadGallery();
  return NextResponse.json(
    {
      storage: gallery.storage,
      usingPlaceholders: gallery.usingPlaceholders,
      error: gallery.error,
      photos: gallery.photos,
      festas: gallery.festas,
      clientes: gallery.clientes,
      choripan: gallery.choripan,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
