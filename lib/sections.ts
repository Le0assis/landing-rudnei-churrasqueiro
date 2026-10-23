export const SECTION_IDS = [
  "hero",
  "confianca",
  "sobre",
  "choripan",
  "como-funciona",
  "eventos",
  "servicos",
  "orcamento",
  "hamburguer",
  "depoimentos",
  "carrossel",
  "galeria",
  "galeria-festas",
  "galeria-clientes",
  "area",
  "faq",
  "contato",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type SectionSettings = Record<SectionId, boolean>;

export const SECTION_CATALOG: readonly {
  id: SectionId;
  label: string;
  hint: string;
  nested?: boolean;
}[] = [
  { id: "hero", label: "Abertura", hint: "Título, foto principal e chamada para o WhatsApp." },
  {
    id: "confianca",
    label: "Faixa de confiança",
    hint: "5 anos, pai e filho, escolhido pelo público em 2023 e 2024, só mão de obra.",
  },
  { id: "sobre", label: "Sobre", hint: "A história do Rudnei com o Léo, filho e assistente." },
  {
    id: "choripan",
    label: "Choripán",
    hint: "O bloco de destaque do carro-chefe, com a foto da categoria Choripán.",
  },
  { id: "como-funciona", label: "Como funciona", hint: "Os quatro passos, da escolha até o dia do evento." },
  {
    id: "eventos",
    label: "Eventos",
    hint: "Família, amigos, aniversário, casamento, empresa e formatura.",
  },
  { id: "servicos", label: "Serviços e preços", hint: "Completo, Assador e o que entra nas duas opções." },
  { id: "orcamento", label: "Orçamento", hint: "Formulário que abre o WhatsApp com a mensagem pronta." },
  { id: "hamburguer", label: "Hamburgada", hint: "Alternativa ao churrasco, com valor a combinar pelo WhatsApp." },
  { id: "depoimentos", label: "Depoimentos", hint: "Comentários de clientes, editados na aba Depoimentos." },
  { id: "carrossel", label: "Carrossel", hint: "A seção “Fotos dos eventos”." },
  {
    id: "galeria",
    label: "Galeria",
    hint: "A seção com as abas Festas e Clientes. Desligada, as duas abas somem juntas.",
  },
  {
    id: "galeria-festas",
    label: "Aba Festas",
    hint: "Fotos da equipe e dos clientes em cada evento.",
    nested: true,
  },
  {
    id: "galeria-clientes",
    label: "Aba Clientes",
    hint: "Fotos com os clientes nos eventos.",
    nested: true,
  },
  { id: "area", label: "Área atendida", hint: "Marília e região." },
  { id: "faq", label: "Perguntas", hint: "As dúvidas que o Rudnei sempre explica." },
  {
    id: "contato",
    label: "Contato",
    hint: "Chamada final e o botão fixo de WhatsApp. O botão do topo continua.",
  },
];

export const NAV_LINKS = [
  { href: "#historia", label: "História", section: "sobre" },
  { href: "#choripan", label: "Choripán", section: "choripan" },
  { href: "#como-funciona", label: "Como funciona", section: "como-funciona" },
  { href: "#opcoes", label: "Opções", section: "servicos" },
  { href: "#orcamento", label: "Orçamento", section: "orcamento" },
  { href: "#fotos", label: "Fotos", section: "carrossel" },
  { href: "#galeria", label: "Galeria", section: "galeria" },
] as const satisfies readonly { href: string; label: string; section: SectionId }[];

export type NavLink = { href: string; label: string };

export function isSectionId(value: unknown): value is SectionId {
  return typeof value === "string" && (SECTION_IDS as readonly string[]).includes(value);
}

export function defaultSections(): SectionSettings {
  return Object.fromEntries(SECTION_IDS.map((id) => [id, true])) as SectionSettings;
}

export function parseSections(value: unknown): SectionSettings {
  const sections = defaultSections();
  if (!value || typeof value !== "object") return sections;
  const record = value as Record<string, unknown>;
  // Nome antigo da aba Clientes, gravado antes da troca.
  if (typeof record["galeria-feedbacks"] === "boolean") sections["galeria-clientes"] = record["galeria-feedbacks"];
  for (const id of SECTION_IDS) {
    if (typeof record[id] === "boolean") sections[id] = record[id];
  }
  return sections;
}

export function toggleSection(sections: SectionSettings, id: unknown, enabled: unknown): SectionSettings {
  if (!isSectionId(id)) throw new Error("Seção desconhecida.");
  if (typeof enabled !== "boolean") throw new Error("Informe se a seção fica visível.");
  return { ...sections, [id]: enabled };
}

export function isPublicSectionVisible(sections: SectionSettings, id: SectionId): boolean {
  if (!sections[id]) return false;
  if (id === "galeria" || id === "galeria-festas" || id === "galeria-clientes") {
    if (!sections.galeria) return false;
  }
  if (id === "galeria") {
    return sections["galeria-festas"] || sections["galeria-clientes"];
  }
  return true;
}

export function visibleNav(sections: SectionSettings): NavLink[] {
  return NAV_LINKS.filter((item) => isPublicSectionVisible(sections, item.section)).map((item) => ({
    href: item.href,
    label: item.label,
  }));
}
