import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { formatBrl } from "@/lib/format";
import { WAITER_PRICE } from "@/lib/pricing";
import {
  buildWhatsAppUrl,
  calculateLaborTotal,
  createQuote,
  generalWhatsAppUrl,
  needsExtraPeopleFee,
} from "@/lib/quote";

const today = "2026-10-22";

function quote(overrides: Partial<Parameters<typeof createQuote>[0]> = {}) {
  return createQuote({
    option: "completo",
    people: "40",
    date: "2026-12-20",
    city: "Marília",
    waiters: "2",
    today,
    ...overrides,
  });
}

describe("cálculo da mão de obra", () => {
  it("cobra 1500 no completo sem garçom", () => {
    expect(calculateLaborTotal("completo", 0)).toBe(1500);
  });

  it("soma 150 por garçom no completo", () => {
    expect(calculateLaborTotal("completo", 1)).toBe(1650);
    expect(calculateLaborTotal("completo", 2)).toBe(1800);
  });

  it("cobra 700 no assador e soma os garçons", () => {
    expect(calculateLaborTotal("assador", 0)).toBe(700);
    expect(calculateLaborTotal("assador", 3)).toBe(700 + 3 * WAITER_PRICE);
  });

  it("não muda o total quando muda o número de pessoas", () => {
    const smaller = quote({ people: "10", waiters: "0" });
    const larger = quote({ people: "200", waiters: "0" });
    expect(smaller.ok && larger.ok).toBe(true);
    if (!smaller.ok || !larger.ok) return;
    expect(smaller.total).toBe(larger.total);
    expect(smaller.total).toBe(1500);
    expect(smaller.message).not.toBe(larger.message);
  });

  it("recusa garçom inválido", () => {
    expect(() => calculateLaborTotal("completo", -1)).toThrow(/garçons/i);
    expect(() => calculateLaborTotal("completo", 1.5)).toThrow(/garçons/i);
    expect(() => calculateLaborTotal("completo", 21)).toThrow(/garçons/i);
    expect(() => calculateLaborTotal("completo", Number.NaN)).toThrow(/garçons/i);
  });

  it("recusa opção desconhecida", () => {
    expect(() => calculateLaborTotal("foo" as "completo", 0)).toThrow(/opção/i);
  });
});

describe("mensagem de WhatsApp", () => {
  it("monta o texto e o link do completo com dois garçons", () => {
    const result = quote();
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const message = [
      "Olá! Vim pelo site do Rudnei Sciole Churrasqueiro e quero um orçamento.",
      "",
      "Opção: Opção 01 — Churrasco Completo",
      "Pessoas: 40",
      "Data: 20 de dezembro de 2026",
      "Cidade: Marília",
      "Garçons: 2",
      "",
      `Total da mão de obra: ${formatBrl(1800)}`,
      `(Churrasco Completo ${formatBrl(1500)} + 2 × ${formatBrl(150)} de garçom)`,
      "",
      "Os alimentos não entram nesse valor. Vocês montam a lista pelo número de pessoas e compram sem custo extra. Eu mando um Pix aproximado das compras, e a diferença a gente acerta na mão de obra.",
    ].join("\n");

    expect(result.total).toBe(1800);
    expect(result.waiterTotal).toBe(300);
    expect(result.message).toBe(message);
    expect(result.url).toBe(`https://wa.me/5514996272725?text=${encodeURIComponent(message)}`);
    expect(decodeURIComponent(result.url.split("text=")[1] ?? "")).toBe(message);
    expect(result.message).toContain("Pix");
    expect(result.message).toContain("não entram");
  });

  it("explica a ausência de garçom no assador", () => {
    const result = quote({ option: "assador", waiters: "0", people: "18", city: "Garça" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.total).toBe(700);
    expect(result.message).toContain("Opção 02 — Churrasco Assador");
    expect(result.message).toContain("Garçons: nenhum");
    expect(result.message).toContain("sem garçom");
    expect(result.message).toContain("Cidade: Garça");
    expect(result.message).toContain("Pessoas: 18");
    expect(result.url.startsWith("https://wa.me/5514996272725?text=")).toBe(true);
  });

  it("aponta erros de formulário sem calcular", () => {
    const result = quote({
      option: "",
      people: "0",
      date: "2026-02-31",
      city: "  ",
      waiters: "-1",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.option).toMatch(/escolha/i);
    expect(result.errors.people).toMatch(/pessoas/i);
    expect(result.errors.date).toMatch(/data/i);
    expect(result.errors.city).toMatch(/cidade/i);
    expect(result.errors.waiters).toMatch(/garçons/i);
  });

  it("não aceita data passada nem data longe demais", () => {
    const past = quote({ date: "2026-10-21" });
    const far = quote({ date: "2029-01-01" });
    expect(past.ok).toBe(false);
    expect(far.ok).toBe(false);
    if (past.ok || far.ok) return;
    expect(past.errors.date).toMatch(/futura/i);
    expect(far.errors.date).toMatch(/longe/i);
  });

  it("aceita o dia de hoje em Marília", () => {
    const result = quote({ date: today });
    expect(result.ok).toBe(true);
  });

  it("abre um oi geral no número certo", () => {
    const url = generalWhatsAppUrl();
    expect(url.startsWith("https://wa.me/5514996272725?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1] ?? "")).toContain("Rudnei Sciole");
    expect(buildWhatsAppUrl("Oi")).toBe("https://wa.me/5514996272725?text=Oi");
  });
});

describe("hash da senha", () => {
  it("usa o mesmo scrypt do script e do login", async () => {
    const { verifyAdminPassword } = await import("@/lib/auth");
    const hash = execFileSync("node", ["scripts/hash-password.mjs"], {
      input: "senha-de-teste-123",
      encoding: "utf8",
    }).trim();
    const previous = process.env.ADMIN_PASSWORD;
    process.env.ADMIN_PASSWORD = hash;
    try {
      await expect(verifyAdminPassword("senha-de-teste-123")).resolves.toBe(true);
      await expect(verifyAdminPassword("outra-senha-123")).resolves.toBe(false);
      await expect(verifyAdminPassword("")).resolves.toBe(false);
    } finally {
      process.env.ADMIN_PASSWORD = previous;
    }
  });
});

describe("regra das 50 pessoas", () => {
  it("até 50 pessoas não fala de taxa extra", () => {
    const result = quote({ people: "50" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.extraPeopleFee).toBe(false);
    expect(result.message).not.toContain("a combinar");
  });

  it("acima de 50 pessoas mostra a taxa extra a combinar e mantém a mão de obra", () => {
    const result = quote({ people: "51", waiters: "0" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.extraPeopleFee).toBe(true);
    expect(result.total).toBe(1500);
    expect(result.message).toContain("Taxa extra por pessoa (acima de 50 pessoas): a combinar");
    expect(needsExtraPeopleFee(51)).toBe(true);
    expect(needsExtraPeopleFee(50)).toBe(false);
  });
});

describe("regra das 50 pessoas — casos normais", () => {
  it("30 pessoas com 2 garçons soma mão de obra sem taxa extra", () => {
    const result = quote({ people: "30", waiters: "2" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.extraPeopleFee).toBe(false);
    expect(result.message).toContain("Total da mão de obra");
    expect(result.message).not.toContain("Taxa extra");
  });
});
