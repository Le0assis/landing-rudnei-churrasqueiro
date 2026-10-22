import { createHmac, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import {
  SAMPLE_PASSWORD_HASH,
  SAMPLE_SESSION_SECRET,
  blocksSampleSecrets,
} from "@/lib/samples";

const scryptAsync = promisify(scrypt);

export const SESSION_COOKIE = "rsc_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

type PasswordRecord = {
  salt: Buffer;
  hash: Buffer;
};

export function passwordConfigurationError(): string | null {
  const stored = process.env.ADMIN_PASSWORD?.trim() ?? "";
  if (!stored) return "ADMIN_PASSWORD ausente.";
  if (blocksSampleSecrets() && stored === SAMPLE_PASSWORD_HASH) {
    return "A senha de exemplo não pode ser usada em produção.";
  }

  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return "ADMIN_PASSWORD precisa ser um hash scrypt gerado por npm run admin:hash.";
  }

  const [, saltHex, hashHex] = parts;
  if (!/^[0-9a-f]+$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(hashHex)) {
    return "ADMIN_PASSWORD está com um hash inválido.";
  }
  if (saltHex.length < 16 || hashHex.length < 32) {
    return "ADMIN_PASSWORD está com um hash curto demais.";
  }

  return null;
}

function readPasswordRecord(): PasswordRecord | null {
  if (passwordConfigurationError()) return null;
  const stored = process.env.ADMIN_PASSWORD?.trim() ?? "";
  const [, saltHex, hashHex] = stored.split(":");
  return {
    salt: Buffer.from(saltHex, "hex"),
    hash: Buffer.from(hashHex, "hex"),
  };
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (password.length < 1 || password.length > 200) return false;
  const record = readPasswordRecord();
  if (!record) return false;

  const actual = (await scryptAsync(password, record.salt, record.hash.length)) as Buffer;
  if (actual.length !== record.hash.length) return false;
  return timingSafeEqual(actual, record.hash);
}

export function sessionSecretError(): string | null {
  const secret = process.env.SESSION_SECRET ?? "";
  if (secret.length < 32) {
    return "SESSION_SECRET precisa ter pelo menos 32 caracteres.";
  }
  if (blocksSampleSecrets() && secret === SAMPLE_SESSION_SECRET) {
    return "O segredo de sessão de exemplo não pode ser usado em produção.";
  }
  return null;
}

export function getSessionSecret(): string | null {
  if (sessionSecretError()) return null;
  return process.env.SESSION_SECRET ?? null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(secret: string, now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({
      v: 1,
      exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
    }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret: string | null,
  now = Date.now(),
): boolean {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  const expected = sign(payload, secret);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      v?: unknown;
      exp?: unknown;
    };
    if (data.v !== 1 || typeof data.exp !== "number") return false;
    return data.exp * 1000 > now;
  } catch {
    return false;
  }
}

export function readSessionFromCookie(token: string | undefined): boolean {
  return verifySessionToken(token, getSessionSecret());
}
