# A página

A home é `app/page.tsx`. O cabeçalho, o formulário, o carrossel e as perguntas são componentes de cliente porque reagem ao toque. O resto é desenhado no servidor.

O miolo da home (menu, seções e botão fixo) passa por um `<Suspense>`. O link “Ir para o conteúdo” e o schema.org ficam de fora. Dentro do suspense, `loadGallery` chama `connection()` e lê o manifesto: fotos e quais seções estão ligadas. Com `cacheComponents` ligado no `next.config.ts`, esse é o jeito do Next.js 16 deixar uma parte estática e outra fresca. Seção desligada não é desenhada e o menu também não aponta para ela.

## Visual

A paleta continua a mesma família: fundo quase preto (`#0c0908`), chama mais saturada (`#ff4d00`), brasa (`#ffc14a`) e creme (`#fff6ea`). Títulos ganham um brilho leve, os cartões de preço e a foto principal um halo, e os botões principais um pulso de sombra. O texto do botão laranja continua marrom escuro, para o contraste não cair. Os títulos grandes usam Bebas Neue. Os rótulos usam Oswald. O texto corrido usa Outfit. As citações usam Literata em itálico. As fontes vêm do `next/font` em `app/layout.tsx`, então não há pedido extra ao Google no navegador do visitante.

O movimento usa Framer Motion no carrossel, na troca de aba da galeria e no lightbox. O brilho da abertura e o pulso dos botões são CSS. Quem pede menos movimento no sistema não vê o autoplay, a animação das brasas nem o pulso dos botões.

Botões e campos vêm do shadcn/ui (`components/ui`), no tema escuro definido em `app/globals.css`.

## Selo

`components/landing/logo.tsx` desenha um círculo preto, chama laranja e chapéu de cozinheiro, a partir da descrição do logo. Não é o arquivo original da gráfica. Quando o Léo tiver o SVG oficial, substitua esse componente e, se quiser, o `app/icon.svg`.

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
- Falha ao ler o armazenamento: a abertura usa a ilustração e o carrossel mostra um aviso para atualizar a página. O Instagram continua linkado. A galeria de festas e feedbacks fica vazia nesse caso, sem inventar print de cliente.
- Galeria sem foto ainda: a aba existe, com uma frase dizendo que as fotos entram ali. Não há imagem falsa de feedback.
- Erro inesperado de uma rota: `app/error.tsx`.
- Endereço inexistente: `app/not-found.tsx`.
