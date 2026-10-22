import { LIMITS } from "@/lib/pricing";

const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function compressImage(file: File): Promise<{
  blob: Blob;
  width: number;
  height: number;
}> {
  if (!ACCEPTED.has(file.type)) {
    throw new Error("Use uma foto JPG, PNG ou WEBP.");
  }
  if (file.size > LIMITS.maxSourceBytes) {
    throw new Error("A foto original passa de 10 MB. Escolha uma menor.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, LIMITS.maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Não foi possível preparar a imagem neste navegador.");
  }

  context.fillStyle = "#100c0a";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.82;
  let blob: Blob | null = null;
  while (quality >= 0.55) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality);
    });
    if (blob && blob.size <= LIMITS.maxUploadBytes) {
      return { blob, width, height };
    }
    quality -= 0.12;
  }

  throw new Error("A foto continua grande demais depois da compressão. Tente outra.");
}
