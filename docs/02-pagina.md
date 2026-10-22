# A página

A home é `app/page.tsx`. O cabeçalho, o formulário, o carrossel e as perguntas são componentes de cliente porque reagem ao toque. O resto é desenhado no servidor.

As fotos da abertura, da história e do carrossel passam por `<Suspense>`. O texto da página aparece na hora. A foto entra em seguida, lendo o armazenamento naquela visita. Com `cacheComponents` ligado no `next.config.ts`, esse é o jeito do Next.js 16 deixar uma parte estática e outra fresca.

## Visual

Fundo quase preto (`#100c0a`), chama (`#ff5a1f`), brasa clara (`#ffb15a`) e creme (`#f4ecdf`). Os títulos grandes usam Bebas Neue. Os rótulos usam Oswald. O texto corrido usa Outfit. As citações usam Literata em itálico. As fontes vêm do `next/font` em `app/layout.tsx`, então não há pedido extra ao Google no navegador do visitante.

O movimento usa Framer Motion no carrossel. O brilho da abertura é CSS. Quem pede menos movimento no sistema não vê o autoplay nem a animação das brasas.

Botões e campos vêm do shadcn/ui (`components/ui`), no tema escuro definido em `app/globals.css`.

## Selo

`components/landing/logo.tsx` desenha um círculo preto, chama laranja e chapéu de cozinheiro, a partir da descrição do logo. Não é o arquivo original da gráfica. Quando o Gustavo tiver o SVG oficial, substitua esse componente e, se quiser, o `app/icon.svg`.

## Fotos de espera

Enquanto não há upload, `content/gallery.ts` aponta para `public/placeholders/*.jpg`. Cada arquivo tem a frase “IMAGEM ILUSTRATIVA” na própria imagem, e a página ainda coloca uma faixa “Imagem ilustrativa”. O texto alternativo também diz que não é foto do evento.

Para gerar de novo as ilustrações:

```bash
npm run placeholders
```

Isso usa a biblioteca `sharp` e o script `scripts/generate-placeholders.mjs`.

## Estados

- Carregando: blocos escuros no lugar da foto, com um texto só para leitor de tela.
- Sem fotos reais: ilustrações e a faixa.
- Falha ao ler o armazenamento: a abertura usa a ilustração e o carrossel mostra um aviso para atualizar a página. O Instagram continua linkado.
- Erro inesperado de uma rota: `app/error.tsx`.
- Endereço inexistente: `app/not-found.tsx`.
