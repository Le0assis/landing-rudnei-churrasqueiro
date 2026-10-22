import { afterEach, describe, expect, it } from "vitest";
import { getAdminPath } from "@/lib/admin-path";
import { createSessionToken, verifySessionToken } from "@/lib/auth";
import { detectImageType } from "@/lib/image-file";
import { clearRateLimit, rateLimit, resetRateLimits } from "@/lib/rate-limit";
import { SAMPLE_ADMIN_PATH } from "@/lib/samples";

const original = {
  ADMIN_PATH: process.env.ADMIN_PATH,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
};

function setNodeEnv(value: string | undefined) {
  Object.assign(process.env, { NODE_ENV: value });
}

afterEach(() => {
  process.env.ADMIN_PATH = original.ADMIN_PATH;
  setNodeEnv(original.NODE_ENV);
  process.env.VERCEL = original.VERCEL;
  resetRateLimits();
});

describe("caminho do admin", () => {
  it("aceita o exemplo só fora de produção", () => {
    process.env.ADMIN_PATH = SAMPLE_ADMIN_PATH;
    setNodeEnv("development");
    delete process.env.VERCEL;
    expect(getAdminPath()).toBe(SAMPLE_ADMIN_PATH);
  });

  it("recusa o exemplo em produção e caminho curto", () => {
    process.env.ADMIN_PATH = SAMPLE_ADMIN_PATH;
    setNodeEnv("production");
    expect(getAdminPath()).toBeNull();

    setNodeEnv("development");
    process.env.ADMIN_PATH = "admin";
    expect(getAdminPath()).toBeNull();

    process.env.ADMIN_PATH = "caminho-secreto-valido";
    expect(getAdminPath()).toBe("caminho-secreto-valido");
  });
});

describe("sessão", () => {
  it("aceita um token assinado e recusa adulteração e expiração", () => {
    const secret = "segredo-de-teste-com-mais-de-32-caracteres";
    const token = createSessionToken(secret, Date.parse("2026-10-22T12:00:00Z"));
    expect(verifySessionToken(token, secret, Date.parse("2026-10-22T13:00:00Z"))).toBe(true);
    expect(verifySessionToken(`${token}x`, secret, Date.parse("2026-10-22T13:00:00Z"))).toBe(false);
    expect(verifySessionToken(token, "outro-segredo-de-teste-com-32-chars", Date.parse("2026-10-22T13:00:00Z"))).toBe(
      false,
    );
    expect(verifySessionToken(token, secret, Date.parse("2026-10-23T12:00:01Z"))).toBe(false);
    expect(verifySessionToken(undefined, secret)).toBe(false);
  });
});

describe("limite de tentativas", () => {
  it("bloqueia a sexta tentativa e libera depois do sucesso", () => {
    const now = 1_000;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(rateLimit("login:1", 5, 1_000, now).ok).toBe(true);
    }
    const blocked = rateLimit("login:1", 5, 1_000, now);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    clearRateLimit("login:1");
    expect(rateLimit("login:1", 5, 1_000, now).ok).toBe(true);
  });
});

describe("arquivo de imagem", () => {
  it("reconhece jpg, png e webp e recusa o resto", () => {
    expect(detectImageType(Buffer.from([0xff, 0xd8, 0xff, 0x00]))).toBe("image/jpeg");
    expect(
      detectImageType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    ).toBe("image/png");
    const webp = Buffer.alloc(12);
    webp.write("RIFF", 0, "ascii");
    webp.write("WEBP", 8, "ascii");
    expect(detectImageType(webp)).toBe("image/webp");
    expect(detectImageType(Buffer.from("<svg></svg>"))).toBeNull();
    expect(detectImageType(Buffer.from([0xff, 0xd8]))).toBeNull();
  });
});
