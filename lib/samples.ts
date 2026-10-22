/**
 * Valores de exemplo commitados de propósito para o computador local.
 * Em produção (next start ou Vercel) eles são recusados.
 * Se trocar o .env.example, troque estas constantes junto.
 */
export const SAMPLE_ADMIN_PATH = "e41460582e2f26f2dd93fcd948f5ecdc";

export const SAMPLE_SESSION_SECRET =
  "LJ2tQJMlZSPxPfq4A3aWhxBgdLwuTnSGJ6LGcHX1WtcmTNsB";

export const SAMPLE_PASSWORD_HASH =
  "scrypt:760ae65514b609d0e7c7bb2263b79d84:b75d1ddec50b5ef8e777d4435e479e19e095c7e52600d953254d00c9c467cbefc17c3eaa3c3270a0ae18581ec6a4738059d7e55652c8e80b55cb692c0c05d655";

export function blocksSampleSecrets(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}
