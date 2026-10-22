# SEO, acesso e privacidade

## Busca, com foco em Marília

`app/layout.tsx` define título e descrição em português, com Marília-SP, mais `metadataBase` para os links absolutos. O Open Graph sai de `app/opengraph-image.tsx` (1200×630). O idioma da página é `pt-BR`. Há `geo.region` `BR-SP` e `geo.placename` Marília.

`components/seo/json-ld.tsx` publica um `FoodEstablishment` (endereço em Marília-SP, telefone, Instagram, faixa de mão de obra) e um `FAQPage` com as perguntas reais. Não há `aggregateRating`: os depoimentos da página são ilustrativos e não entram no schema.

`app/sitemap.ts` lista só a home. `app/robots.ts` libera a home e fecha `/interno` e `/api/admin`.

`NEXT_PUBLIC_SITE_URL` precisa estar certo **antes** do build de produção, porque o Next embute variáveis `NEXT_PUBLIC_` nessa hora. Se ficar vazio, o código tenta `VERCEL_PROJECT_PRODUCTION_URL` e depois `VERCEL_URL`.

As imagens usam `next/image`, com `sizes` e prioridade só na foto da abertura. Fotos do Blob estão em `images.remotePatterns` (`*.public.blob.vercel-storage.com`). Fotos locais passam por `/placeholders` e `/api/media`.

## Acesso

- Um único `h1`.
- Link “Ir para o conteúdo”.
- Rótulos nos campos, erros com `role="alert"` e `aria-invalid`.
- Botões de pelo menos 44 px nos controles principais.
- Carrossel com nome, botão de pausa e teclado.
- Contraste de creme sobre o fundo escuro; o botão laranja usa texto marrom escuro.
- `prefers-reduced-motion` desliga o autoplay e o brilho animado.
- O selo decorativo é `aria-hidden`; o nome do negócio está no texto ao lado.

## Privacidade (LGPD enxuta)

O rodapé, âncora `#privacidade`, diz em linguagem direta:

- não há anúncio nem cookie de rastreamento;
- o orçamento não é gravado no site: o botão só abre o WhatsApp;
- o cookie `rsc_admin` existe só para a sessão de quem administra as fotos;
- a conversa segue no WhatsApp, com a política de lá;
- quem responde é o Gustavo, no (14) 99627-2725.

Não há formulário que grave nome, e-mail ou IP em banco. O limite de login guarda o IP na memória da instância por 15 minutos e depois esquece.
