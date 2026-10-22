import { WHATSAPP_E164 } from "@/lib/contact";
import { formatBrl } from "@/lib/format";
import {
  LIMITS,
  SERVICE_OPTIONS,
  WAITER_PRICE,
  isServiceOption,
  type ServiceOptionId,
} from "@/lib/pricing";

export type QuoteField = "option" | "people" | "date" | "city" | "waiters";

export type QuoteInput = {
  option: string;
  people: string;
  date: string;
  city: string;
  waiters: string;
  today?: string;
};

export type QuoteSuccess = {
  ok: true;
  option: ServiceOptionId;
  optionCode: string;
  optionName: string;
  people: number;
  date: string;
  dateLabel: string;
  city: string;
  waiters: number;
  labor: number;
  waiterTotal: number;
  total: number;
  message: string;
  url: string;
};

export type QuoteFailure = {
  ok: false;
  errors: Partial<Record<QuoteField, string>>;
};

const CITY_PATTERN = /^[\p{L}][\p{L}\s.'-]{1,59}$/u;

export function saoPauloToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function calculateLaborTotal(option: ServiceOptionId, waiters: number): number {
  if (!isServiceOption(option)) {
    throw new Error("Opção inválida.");
  }

  if (
    !Number.isInteger(waiters) ||
    waiters < LIMITS.minWaiters ||
    waiters > LIMITS.maxWaiters
  ) {
    throw new Error("Quantidade de garçons inválida.");
  }

  return SERVICE_OPTIONS[option].labor + waiters * WAITER_PRICE;
}

export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function buildWhatsAppMessage(input: {
  optionCode: string;
  optionName: string;
  people: number;
  dateLabel: string;
  city: string;
  waiters: number;
  labor: number;
  total: number;
}): string {
  const waiterLine =
    input.waiters === 0 ? "Garçons: nenhum" : `Garçons: ${input.waiters}`;
  const breakdown =
    input.waiters === 0
      ? `(${input.optionName} ${formatBrl(input.labor)}, sem garçom)`
      : `(${input.optionName} ${formatBrl(input.labor)} + ${input.waiters} × ${formatBrl(WAITER_PRICE)} de garçom)`;

  return [
    "Olá! Vim pelo site do Rudnei Sciole Churrasqueiro e quero um orçamento.",
    "",
    `Opção: ${input.optionCode} — ${input.optionName}`,
    `Pessoas: ${input.people}`,
    `Data: ${input.dateLabel}`,
    `Cidade: ${input.city}`,
    waiterLine,
    "",
    `Total da mão de obra: ${formatBrl(input.total)}`,
    breakdown,
    "",
    "Os alimentos não entram nesse valor. Vocês montam a lista pelo número de pessoas e compram sem custo extra. Eu mando um Pix aproximado das compras, e a diferença a gente acerta na mão de obra.",
  ].join("\n");
}

export function buildWhatsAppUrl(message: string, phone = WHATSAPP_E164): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const GENERAL_WHATSAPP_MESSAGE =
  "Olá! Vim pelo site do Rudnei Sciole Churrasqueiro e quero falar sobre um churrasco.";

export function generalWhatsAppUrl(): string {
  return buildWhatsAppUrl(GENERAL_WHATSAPP_MESSAGE);
}

function parseInteger(value: string, min: number, max: number): number | null {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const number = Number(trimmed);
  if (!Number.isInteger(number) || number < min || number > max) return null;
  return number;
}

function parseDate(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function addYears(isoDate: string, years: number): string {
  const [year, month, day] = isoDate.split("-");
  return `${String(Number(year) + years).padStart(4, "0")}-${month}-${day}`;
}

export function createQuote(input: QuoteInput): QuoteSuccess | QuoteFailure {
  const errors: QuoteFailure["errors"] = {};
  const today = input.today ?? saoPauloToday();

  if (!isServiceOption(input.option)) {
    errors.option = "Escolha o Churrasco Completo ou o Churrasco Assador.";
  }

  const people = parseInteger(input.people, LIMITS.minPeople, LIMITS.maxPeople);
  if (people === null) {
    errors.people = `Informe o número de pessoas, de ${LIMITS.minPeople} a ${LIMITS.maxPeople}.`;
  }

  const date = parseDate(input.date);
  if (!date) {
    errors.date = "Informe uma data válida.";
  } else if (date < today) {
    errors.date = "Escolha hoje ou uma data futura.";
  } else if (date > addYears(today, LIMITS.maxYearsAhead)) {
    errors.date = "Essa data está longe demais. Confere o ano?";
  }

  const city = input.city.trim().replace(/\s+/g, " ");
  if (!CITY_PATTERN.test(city)) {
    errors.city = "Informe a cidade do evento.";
  }

  const waiters = parseInteger(input.waiters, LIMITS.minWaiters, LIMITS.maxWaiters);
  if (waiters === null) {
    errors.waiters = `Informe os garçons de ${LIMITS.minWaiters} a ${LIMITS.maxWaiters}. Se não quiser, deixe 0.`;
  }

  if (
    !isServiceOption(input.option) ||
    people === null ||
    date === null ||
    waiters === null ||
    !CITY_PATTERN.test(city) ||
    Object.keys(errors).length > 0
  ) {
    return { ok: false, errors };
  }

  const service = SERVICE_OPTIONS[input.option];
  const total = calculateLaborTotal(input.option, waiters);
  const dateLabel = formatLongDate(date);
  const message = buildWhatsAppMessage({
    optionCode: service.code,
    optionName: service.name,
    people,
    dateLabel,
    city,
    waiters,
    labor: service.labor,
    total,
  });

  return {
    ok: true,
    option: input.option,
    optionCode: service.code,
    optionName: service.name,
    people,
    date,
    dateLabel,
    city,
    waiters,
    labor: service.labor,
    waiterTotal: waiters * WAITER_PRICE,
    total,
    message,
    url: buildWhatsAppUrl(message),
  };
}
