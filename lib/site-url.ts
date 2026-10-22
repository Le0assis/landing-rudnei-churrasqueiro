function withoutSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function withoutProtocol(value: string): string {
  return withoutSlash(value.replace(/^https?:\/\//, ""));
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return withoutSlash(explicit);

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${withoutProtocol(production)}`;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${withoutProtocol(vercel)}`;

  return "http://127.0.0.1:43123";
}
