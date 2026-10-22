import { StorageConfigError } from "@/lib/storage";
import { jsonError } from "@/lib/http";

const SAFE_PREFIXES = [
  "A ordem precisa",
  "A ordem cita",
  "O carrossel aceita",
  "Festas aceita",
  "Feedbacks aceita",
  "Seção desconhecida",
  "Informe se a seção",
  "Foto não encontrada",
  "Foto inválida",
  "A imagem precisa",
  "Envie um arquivo",
  "Não foi possível ler",
];

export function toErrorResponse(error: unknown) {
  if (error instanceof StorageConfigError) {
    return jsonError(error.message, 503);
  }

  if (error instanceof Error && SAFE_PREFIXES.some((prefix) => error.message.startsWith(prefix))) {
    const status = error.message.startsWith("Não foi possível ler") ? 502 : 400;
    return jsonError(error.message, status);
  }

  console.error(error);
  return jsonError("Não consegui concluir agora. Tente de novo.", 500);
}
