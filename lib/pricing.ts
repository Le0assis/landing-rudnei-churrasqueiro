export const LIMITS = {
  minPeople: 1,
  maxPeople: 500,
  includedPeople: 50,
  minWaiters: 0,
  maxWaiters: 20,
  maxYearsAhead: 2,
  maxPhotos: 30,
  maxUploadBytes: 2_500_000,
  maxSourceBytes: 10_000_000,
  maxEdge: 1600,
} as const;

export const WAITER_PRICE = 150;

export const SHARED_ITEMS = [
  "Canapé de pão de alho",
  "Choripán",
  "Chimichurri",
  "Creme de gorgonzola",
  "Salada de legumes",
] as const;

export const SERVICE_OPTIONS = {
  completo: {
    id: "completo",
    code: "Opção 01",
    name: "Churrasco Completo",
    labor: 1500,
    summary:
      "Eu cuido da brasa, das carnes e de uma mesa completa de acompanhamentos.",
    items: [
      "Arroz branco",
      "Farofa com bacon",
      "Vinagrete",
      "Mandioca na manteiga com bacon",
      "Sunomono",
      "Bifum",
    ],
  },
  assador: {
    id: "assador",
    code: "Opção 02",
    name: "Churrasco Assador",
    labor: 700,
    summary: "Eu assumo a brasa e as carnes nobres.",
    items: ["Brasa", "Carnes nobres"],
  },
} as const;

export type ServiceOptionId = keyof typeof SERVICE_OPTIONS;

export function isServiceOption(value: string): value is ServiceOptionId {
  return value === "completo" || value === "assador";
}
