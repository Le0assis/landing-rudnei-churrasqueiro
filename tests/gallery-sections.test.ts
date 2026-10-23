import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { altFor, cleanCaption } from "@/lib/admin-photos";
import { hero, privacy, story, trustItems } from "@/content/site";
import { ASSISTANT_LABEL, ASSISTANT_NAME, OWNER_NAME } from "@/lib/contact";
import { LIMITS } from "@/lib/pricing";
import {
  defaultSections,
  isPublicSectionVisible,
  parseSections,
  toggleSection,
  visibleNav,
} from "@/lib/sections";
import { assertCanAdd, parseManifest, photoCategory, reorderPhotos } from "@/lib/storage/manifest";
import type { GalleryManifest, PhotoCategory, StoredPhoto } from "@/lib/storage/types";

function photo(category: PhotoCategory, id: string, caption = ""): StoredPhoto {
  return {
    id,
    alt: caption || "Churrasco do Rudnei Sciole Churrasqueiro em Marília",
    caption,
    category,
    width: 800,
    height: 600,
    bytes: 1200,
    contentType: "image/jpeg",
    createdAt: "2026-01-01T00:00:00.000Z",
    url: null,
    pathname: `${id}.jpg`,
  };
}

function manifest(photos: StoredPhoto[], sections = defaultSections()): GalleryManifest {
  return { shuffle: true, photos, sections, testimonials: [] };
}

describe("voz pública", () => {
  it("coloca o Rudnei na frente e o Léo só como filho e assistente", () => {
    expect(hero.lead.startsWith("Sou o Rudnei Sciole")).toBe(true);
    expect(hero.lead).toContain(`meu filho, o ${ASSISTANT_NAME}`);
    expect(hero.title).toContain("Marília");
    expect(story.paragraphs.join(" ")).toContain(`meu filho, o ${ASSISTANT_NAME}`);
    expect(story.paragraphs.join(" ")).not.toContain("meu pai");
    expect(trustItems.map((item) => item.value)).toEqual(["5 anos", "Pai e filho", "2023 e 2024", "Só mão de obra"]);
    expect(story.paragraphs.join(" ")).toContain("escolhido pelo público");
    expect(OWNER_NAME).toBe("Rudnei");
    expect(privacy.paragraphs[1]).toContain(ASSISTANT_LABEL);
    expect(privacy.paragraphs[2]).toContain(`Quem responde pelo atendimento é o ${OWNER_NAME}`);
    expect(privacy.paragraphs[2]).toContain("(14) 99627-2725");
  });

  it("não deixa o nome antigo no site, na documentação nem nos comentários", () => {
    const roots = ["app", "components", "content", "lib", "docs", "e2e", "README.md", "AGENTS.md"];
    const hits: string[] = [];
    for (const root of roots) {
      for (const file of filesUnder(root)) {
        if (!/\.(ts|tsx|md|mjs|css)$/.test(file)) continue;
        const text = readFileSync(file, "utf8");
        if (text.includes("Gustavo")) hits.push(file);
      }
    }
    expect(hits).toEqual([]);
  });
});

describe("seções", () => {
  it("começa com tudo visível e ignora valor que não é booleano", () => {
    const sections = parseSections({ hero: false, galeria: false, faq: "não", extra: true });
    expect(sections.hero).toBe(false);
    expect(sections.galeria).toBe(false);
    expect(sections.faq).toBe(true);
    expect(sections.contato).toBe(true);
    expect(defaultSections().sobre).toBe(true);
  });

  it("recusa seção desconhecida e valor que não é ligado ou desligado", () => {
    const sections = defaultSections();
    expect(() => toggleSection(sections, "rodape", false)).toThrow(/Seção desconhecida/);
    expect(() => toggleSection(sections, "hero", "não")).toThrow(/visível/);
    expect(toggleSection(sections, "hero", false).hero).toBe(false);
    expect(sections.hero).toBe(true);
  });

  it("esconde a galeria inteira, uma aba, e o link do menu", () => {
    const sections = defaultSections();
    sections["galeria-clientes"] = false;
    expect(isPublicSectionVisible(sections, "galeria-festas")).toBe(true);
    expect(isPublicSectionVisible(sections, "galeria-clientes")).toBe(false);
    expect(isPublicSectionVisible(sections, "galeria")).toBe(true);

    sections.galeria = false;
    expect(isPublicSectionVisible(sections, "galeria")).toBe(false);
    expect(isPublicSectionVisible(sections, "galeria-festas")).toBe(false);

    const onlyTabsOff = defaultSections();
    onlyTabsOff["galeria-festas"] = false;
    onlyTabsOff["galeria-clientes"] = false;
    expect(isPublicSectionVisible(onlyTabsOff, "galeria")).toBe(false);

    const hiddenStory = defaultSections();
    hiddenStory.sobre = false;
    hiddenStory.carrossel = false;
    const labels = visibleNav(hiddenStory).map((link) => link.label);
    expect(labels).not.toContain("História");
    expect(labels).not.toContain("Fotos");
    expect(labels).toContain("Galeria");
    expect(labels).toContain("Opções");
  });
});

describe("manifesto de fotos", () => {
  it("trata foto antiga como carrossel, sem legenda, e seção ausente como visível", () => {
    const parsed = parseManifest({
      shuffle: false,
      photos: [
        {
          id: "foto-antiga",
          alt: "Picanha na brasa",
          width: 1000,
          height: 800,
          bytes: 40,
          contentType: "image/jpeg",
          createdAt: "2024-05-01T00:00:00.000Z",
          url: null,
          pathname: "foto-antiga.jpg",
        },
      ],
      sections: { depoimentos: false },
    });

    expect(parsed.shuffle).toBe(false);
    expect(parsed.photos[0]?.category).toBe("carrossel");
    expect(parsed.photos[0]?.caption).toBe("");
    expect(parsed.photos[0]?.alt).toBe("Picanha na brasa");
    expect(parsed.sections.depoimentos).toBe(false);
    expect(parsed.sections.hero).toBe(true);
  });

  it("guarda categoria e legenda e descarta foto incompleta", () => {
    const parsed = parseManifest({
      photos: [
        { id: "quebrada" },
        {
          id: "festa-1",
          alt: "Equipe na grelha",
          caption: "  Aniversário em Marília  ",
          category: "festas",
          width: 1200,
          height: 900,
          bytes: 80,
          contentType: "image/jpeg",
          createdAt: "2026-02-02T00:00:00.000Z",
          url: "https://example.com/festa.jpg",
          pathname: "festa-1.jpg",
        },
      ],
    });
    expect(parsed.photos).toHaveLength(1);
    expect(parsed.photos[0]?.category).toBe("festas");
    expect(parsed.photos[0]?.caption).toBe("Aniversário em Marília");
  });

  it("reordena só a categoria pedida", () => {
    const current = manifest([
      photo("carrossel", "c1"),
      photo("festas", "f1", "Mesa"),
      photo("carrossel", "c2"),
      photo("clientes", "b1", "Recado"),
      photo("festas", "f2", "Brasa"),
    ]);
    const next = reorderPhotos(current, ["f2", "f1"], "festas");
    expect(next.photos.map((item) => item.id)).toEqual(["c1", "f2", "c2", "b1", "f1"]);
    expect(() => reorderPhotos(current, ["f1"], "festas")).toThrow(/cada foto uma vez/);
    expect(() => reorderPhotos(current, ["f1", "c1"], "festas")).toThrow(/não existe/);
  });

  it("limita a contagem dentro da categoria", () => {
    const festas = Array.from({ length: LIMITS.maxPhotos }, (_, index) => photo("festas", `f${index}`));
    const current = manifest([...festas, photo("carrossel", "c1")]);
    expect(() => assertCanAdd(current, "festas")).toThrow(/Festas aceita até 30/);
    expect(() => assertCanAdd(current, "carrossel")).not.toThrow();
    const fullCarousel = manifest(
      Array.from({ length: LIMITS.maxPhotos }, (_, index) => photo("carrossel", `c${index}`)),
    );
    expect(() => assertCanAdd(fullCarousel, "carrossel")).toThrow(/O carrossel aceita até 30/);
  });
});

describe("legenda", () => {
  it("é opcional, curta, e vira o texto alternativo quando existe", () => {
    expect(cleanCaption("  oi   mundo  ")).toBe("oi mundo");
    expect(cleanCaption("x".repeat(200))).toHaveLength(180);
    expect(cleanCaption(null)).toBe("");
    expect(altFor("carrossel", "")).toContain("Rudnei Sciole");
    expect(altFor("festas", "")).toContain("festa");
    expect(altFor("clientes", "Com a família")).toBe("Com a família");
  });
});

function filesUnder(root: string): string[] {
  const full = path.join(process.cwd(), root);
  if (statSync(full).isFile()) return [full];
  const found: string[] = [];
  for (const entry of readdirSync(full)) {
    const next = path.join(full, entry);
    if (statSync(next).isDirectory()) found.push(...filesUnder(path.relative(process.cwd(), next)));
    else found.push(next);
  }
  return found;
}

describe("clientes e choripán", () => {
  it("lê a categoria antiga feedbacks como clientes", () => {
    expect(photoCategory({ category: "feedbacks" })).toBe("clientes");
    expect(photoCategory({ category: "choripan" })).toBe("choripan");
    expect(photoCategory({ category: "outra" })).toBe("carrossel");
  });

  it("lê a chave antiga galeria-feedbacks e liga o choripán por padrão", () => {
    const parsed = parseSections({ "galeria-feedbacks": false });
    expect(parsed["galeria-clientes"]).toBe(false);
    expect(parsed.choripan).toBe(true);
    const off = defaultSections();
    off.choripan = false;
    expect(visibleNav(off).map((link) => link.label)).not.toContain("Choripán");
    expect(visibleNav(defaultSections()).map((link) => link.label)).toContain("Choripán");
  });
});

describe("hamburgueria", () => {
  it("liga por padrão e some quando desligada", () => {
    expect(defaultSections().hamburguer).toBe(true);
    expect(parseSections({}).hamburguer).toBe(true);
    const off = toggleSection(defaultSections(), "hamburguer", false);
    expect(isPublicSectionVisible(off, "hamburguer")).toBe(false);
    expect(isPublicSectionVisible(defaultSections(), "hamburguer")).toBe(true);
    expect(parseSections({ hamburguer: false }).hamburguer).toBe(false);
  });
});
