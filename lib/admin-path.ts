import { SAMPLE_ADMIN_PATH, blocksSampleSecrets } from "@/lib/samples";

const PATH_PATTERN = /^[a-z0-9](?:[a-z0-9-]{15,62})[a-z0-9]$/;

export function getAdminPath(): string | null {
  const value = process.env.ADMIN_PATH?.trim().toLowerCase() ?? "";
  if (!PATH_PATTERN.test(value)) return null;
  if (blocksSampleSecrets() && value === SAMPLE_ADMIN_PATH) return null;
  return value;
}
