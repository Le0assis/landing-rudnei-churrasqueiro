# Editar conteúdo

Quase tudo que o Gustavo diria na página está em `content/site.ts`. Preços e itens do cardápio estão em `lib/pricing.ts` para o formulário e os testes usarem o mesmo número.

## Textos

| Constante | O que é |
| --- | --- |
| `slogans` | As quatro frases combinadas, inclusive o lema do logo |
| `hero` | Título e parágrafo da abertura |
| `trustItems` | A faixa logo abaixo da abertura |
| `story` | História |
| `steps` | Os quatro passos |
| `events` | Tipos de evento |
| `testimonials` | Cartões ilustrativos. Troque `quote`, `name` e `context`. A faixa “Depoimento ilustrativo” some só se você também tirar esse aviso do componente `components/landing/testimonials.tsx` quando o texto for real |
| `faqs` | Perguntas e respostas. Entram também no schema.org |
| `area` | Marília e região |
| `privacy` | Nota do rodapé |

Não escreva “prêmio”, “premiado”, “troféu” ou “campeão” para 2023 e 2024. A frase combinada é “escolhido pelo público”.

## Contato

`lib/contact.ts`: nome, telefone exibido, telefone `5514996272725` (sem pontuação, com 55), Instagram e o nome do Buffet Amigos da Pizza Marília. Se o número mudar, mude os dois formatos juntos.

## Preços

`lib/pricing.ts`:

- `SERVICE_OPTIONS.completo.labor` e `assador.labor`
- `items` de cada opção
- `SHARED_ITEMS`
- `WAITER_PRICE`
- `LIMITS` (pessoas, garçons, fotos, tamanho de arquivo)

Os testes em `tests/quote.test.ts` esperam 1500, 700 e 150. Se o preço mudar de verdade, atualize o teste para o número novo. Isso é intencional: o teste existe para ninguém alterar o valor sem perceber.

## Fotos

Pela área de admin, não por commit. Veja `docs/05-admin.md`.

Para trocar só a ilustração de espera, substitua o JPG em `public/placeholders/` mantendo o nome, ou rode `npm run placeholders` e edite `content/gallery.ts` se mudar largura, altura ou texto alternativo.

## Logo

Substitua o SVG em `components/landing/logo.tsx`. Mantenha o nome acessível no texto ao lado (“Rudnei Sciole” / “Churrasqueiro”), não só dentro da imagem.
