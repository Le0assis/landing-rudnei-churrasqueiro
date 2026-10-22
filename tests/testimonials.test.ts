import { describe, expect, it } from "vitest";
import { parseManifest } from "@/lib/storage/manifest";
import {
  TESTIMONIAL_LIMITS,
  addTestimonial,
  defaultTestimonials,
  parseTestimonials,
  publicTestimonials,
  removeTestimonial,
  toggleTestimonial,
  updateTestimonial,
  type Testimonial,
} from "@/lib/testimonials";

const NOW = "2026-10-22T12:00:00.000Z";

function base(): Testimonial[] {
  return addTestimonial([], { name: "Ana", text: "Tudo muito bom.", event: "Aniversário" }, "a1", NOW);
}

describe("depoimentos no manifesto", () => {
  it("manifesto antigo, sem o campo, recebe os depoimentos iniciais", () => {
    const parsed = parseManifest({ shuffle: true, photos: [] });
    expect(parsed.testimonials).toEqual(defaultTestimonials());
    expect(parsed.testimonials.length).toBeGreaterThan(0);
    expect(parsed.testimonials.every((item) => item.enabled && item.illustrative)).toBe(true);
  });

  it("lista vazia salva continua vazia e item quebrado é descartado", () => {
    expect(parseManifest({ testimonials: [] }).testimonials).toEqual([]);
    const parsed = parseTestimonials([
      { id: "ok-1", name: " Bia ", text: " Ótimo ", enabled: false },
      { id: "sem-texto", name: "X" },
      { id: "../mal", name: "X", text: "Y" },
      "lixo",
    ]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({ id: "ok-1", name: "Bia", text: "Ótimo", event: "", enabled: false });
  });
});

describe("editar depoimentos", () => {
  it("adiciona com nome e texto obrigatórios e evento opcional", () => {
    const list = base();
    expect(list[0]).toEqual({
      id: "a1",
      name: "Ana",
      text: "Tudo muito bom.",
      event: "Aniversário",
      enabled: true,
      illustrative: false,
      createdAt: NOW,
    });
    expect(() => addTestimonial(list, { name: "", text: "oi" }, "x", NOW)).toThrow(/nome/);
    expect(() => addTestimonial(list, { name: "Zé", text: "  " }, "x", NOW)).toThrow(/texto/);
    expect(() =>
      addTestimonial(list, { name: "Zé", text: "x".repeat(TESTIMONIAL_LIMITS.text + 1) }, "x", NOW),
    ).toThrow(/até 600/);
    expect(addTestimonial(list, { name: "Zé", text: "Bom" }, "z", NOW)[1]?.event).toBe("");
  });

  it("limita a quantidade", () => {
    let list: Testimonial[] = [];
    for (let i = 0; i < TESTIMONIAL_LIMITS.max; i += 1) list = addTestimonial(list, { name: "N", text: "T" }, `t${i}`, NOW);
    expect(() => addTestimonial(list, { name: "N", text: "T" }, "extra", NOW)).toThrow(/até 50/);
  });

  it("edita, tira a marca de ilustrativo e não muda o original", () => {
    const seeds = defaultTestimonials();
    const id = seeds[0]!.id;
    const next = updateTestimonial(seeds, id, { name: "Carlos", text: "Carne no ponto.", event: "" });
    expect(next[0]).toMatchObject({ name: "Carlos", text: "Carne no ponto.", illustrative: false, enabled: true });
    expect(seeds[0]!.name).toBe("Nome do cliente");
    expect(() => updateTestimonial(seeds, "nao-existe", { name: "a", text: "b" })).toThrow(/não encontrado/);
  });

  it("liga, desliga e apaga", () => {
    const off = toggleTestimonial(base(), "a1", false);
    expect(off[0]?.enabled).toBe(false);
    expect(publicTestimonials(off)).toEqual([]);
    expect(() => toggleTestimonial(off, "a1", "sim")).toThrow(/visível/);
    const on = toggleTestimonial(off, "a1", true);
    expect(publicTestimonials(on)).toEqual([
      { id: "a1", name: "Ana", text: "Tudo muito bom.", event: "Aniversário", illustrative: false },
    ]);
    expect(removeTestimonial(on, "a1")).toEqual([]);
    expect(() => removeTestimonial(on, "b2")).toThrow(/não encontrado/);
  });
});
