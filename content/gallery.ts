import type { PublicPhoto } from "@/lib/storage/types";

// Fotos reais que acompanham o site. Entram quando o admin ainda não tem fotos
// na categoria correspondente. As fotos enviadas pelo admin sempre têm prioridade.
const real = (photo: Omit<PublicPhoto, "caption" | "placeholder">): PublicPhoto => ({
  ...photo,
  caption: "",
  placeholder: false,
});

// Carrossel. A primeira vai na abertura e a segunda na seção Sobre.
export const placeholderPhotos: PublicPhoto[] = [
  real({
    id: "seed-rudnei-fumaca",
    url: "/photos/rudnei-fumaca-1920.webp",
    alt: "Rudnei Sciole cuidando da carne na churrasqueira, com a fumaça subindo, em um evento ao ar livre.",
    width: 1920,
    height: 1844,
  }),
  real({
    id: "seed-rudnei-legumes",
    url: "/photos/rudnei-legumes-1920.webp",
    alt: "Rudnei Sciole cortando legumes ao lado da grelha com pimentões, abobrinha e cebola roxa sobre a brasa.",
    width: 1920,
    height: 1903,
  }),
  real({
    id: "seed-churrasqueira-fumaca",
    url: "/gallery/rudnei-na-churrasqueira-fumaca.webp",
    alt: "Rudnei Sciole na churrasqueira durante uma festa, entre a fumaça da brasa.",
    width: 640,
    height: 640,
  }),
  real({
    id: "seed-chimichurri",
    url: "/gallery/carne-chimichurri-travessa.webp",
    alt: "Travessa de carne fatiada com chimichurri, servida em uma festa.",
    width: 361,
    height: 640,
  }),
];

export const seedFestas: PublicPhoto[] = [
  placeholderPhotos[2],
  real({
    id: "seed-hamburguer",
    url: "/gallery/hamburguer-artesanal-luvas-pretas.webp",
    alt: "Hambúrguer artesanal montado por mãos com luvas pretas, em um evento.",
    width: 640,
    height: 640,
  }),
  placeholderPhotos[3],
];

export const seedClientes: PublicPhoto[] = [
  real({
    id: "seed-cliente-terraco",
    url: "/gallery/rudnei-com-cliente-terraco.webp",
    alt: "Rudnei Sciole ao lado de um cliente, no terraço de uma festa.",
    width: 640,
    height: 640,
  }),
];
