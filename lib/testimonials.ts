import { seedTestimonials } from "@/content/site";

export const TESTIMONIAL_LIMITS = { name: 80, text: 600, event: 120, max: 50 } as const;

export type Testimonial = {
  id: string;
  name: string;
  text: string;
  event: string;
  enabled: boolean;
  illustrative: boolean;
  createdAt: string;
};

export type TestimonialInput = { name?: unknown; text?: unknown; event?: unknown };

export type PublicTestimonial = Pick<Testimonial, "id" | "name" | "text" | "event" | "illustrative">;

const ID_PATTERN = /^[a-z0-9-]{1,64}$/i;

function clean(value: unknown, max: number): string {
  const text = typeof value === "string" ? value.trim().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n") : "";
  return text.slice(0, max);
}

export function defaultTestimonials(): Testimonial[] {
  return seedTestimonials.map((item) => ({
    id: item.id,
    name: item.name,
    text: item.text,
    event: item.event,
    enabled: true,
    illustrative: item.illustrative,
    createdAt: "2026-01-01T00:00:00.000Z",
  }));
}

function parseOne(value: unknown): Testimonial | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || !ID_PATTERN.test(record.id)) return null;
  const name = clean(record.name, TESTIMONIAL_LIMITS.name);
  const text = clean(record.text, TESTIMONIAL_LIMITS.text);
  if (!name || !text) return null;
  return {
    id: record.id,
    name,
    text,
    event: clean(record.event, TESTIMONIAL_LIMITS.event),
    enabled: record.enabled !== false,
    illustrative: record.illustrative === true,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : "2026-01-01T00:00:00.000Z",
  };
}

/** Campo ausente = manifesto antigo: entram os depoimentos iniciais. Lista vazia continua vazia. */
export function parseTestimonials(value: unknown): Testimonial[] {
  if (!Array.isArray(value)) return defaultTestimonials();
  return value.map(parseOne).filter((item): item is Testimonial => item !== null);
}

export function validateTestimonial(input: TestimonialInput): { name: string; text: string; event: string } {
  const name = clean(input.name, TESTIMONIAL_LIMITS.name + 1);
  const text = clean(input.text, TESTIMONIAL_LIMITS.text + 1);
  const event = clean(input.event, TESTIMONIAL_LIMITS.event + 1);
  if (!name) throw new Error("Escreva o nome do cliente.");
  if (!text) throw new Error("Escreva o texto do depoimento.");
  if (name.length > TESTIMONIAL_LIMITS.name) throw new Error(`O nome aceita até ${TESTIMONIAL_LIMITS.name} caracteres.`);
  if (text.length > TESTIMONIAL_LIMITS.text) throw new Error(`O texto aceita até ${TESTIMONIAL_LIMITS.text} caracteres.`);
  if (event.length > TESTIMONIAL_LIMITS.event) throw new Error(`Evento/data aceita até ${TESTIMONIAL_LIMITS.event} caracteres.`);
  return { name, text, event };
}

export function addTestimonial(list: Testimonial[], input: TestimonialInput, id: string, now: string): Testimonial[] {
  if (list.length >= TESTIMONIAL_LIMITS.max) {
    throw new Error(`Cabem até ${TESTIMONIAL_LIMITS.max} depoimentos. Apague um para adicionar outro.`);
  }
  const fields = validateTestimonial(input);
  return [...list, { id, ...fields, enabled: true, illustrative: false, createdAt: now }];
}

function find(list: Testimonial[], id: unknown): number {
  const index = typeof id === "string" ? list.findIndex((item) => item.id === id) : -1;
  if (index < 0) throw new Error("Depoimento não encontrado.");
  return index;
}

export function updateTestimonial(list: Testimonial[], id: unknown, input: TestimonialInput): Testimonial[] {
  const index = find(list, id);
  const fields = validateTestimonial(input);
  return list.map((item, i) => (i === index ? { ...item, ...fields, illustrative: false } : item));
}

export function toggleTestimonial(list: Testimonial[], id: unknown, enabled: unknown): Testimonial[] {
  if (typeof enabled !== "boolean") throw new Error("Diga se o depoimento fica visível ou não.");
  const index = find(list, id);
  return list.map((item, i) => (i === index ? { ...item, enabled } : item));
}

export function removeTestimonial(list: Testimonial[], id: unknown): Testimonial[] {
  const index = find(list, id);
  return list.filter((_, i) => i !== index);
}

export function publicTestimonials(list: Testimonial[]): PublicTestimonial[] {
  return list
    .filter((item) => item.enabled)
    .map(({ id, name, text, event, illustrative }) => ({ id, name, text, event, illustrative }));
}
