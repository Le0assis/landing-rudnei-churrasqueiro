<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Rudnei Sciole Churrasqueiro

Site de uma página, pt-BR, do churrasco de pai e filho do Gustavo em Marília-SP. Next.js 16 (App Router, `cacheComponents`), TypeScript, Tailwind 4, shadcn/ui, Framer Motion. Deploy pensado para a Vercel Hobby.

Leia o bloco do Next acima e os guias em `node_modules/next/dist/docs/` antes de mudar rota, cache ou proxy. Neste projeto:

- O arquivo de borda é `proxy.ts`, não `middleware.ts`.
- Dados frescos (fotos, cookie do admin) ficam dentro de `<Suspense>`. Não use `export const dynamic`. Não chame `new Date()` ou `Math.random()` no miolo estático da página.
- `GET` de fotos chama `connection()` em `lib/gallery.ts`.

## Onde mexer

- Textos: `content/site.ts`. Preços e cardápio: `lib/pricing.ts`. Telefone e Instagram: `lib/contact.ts`.
- Cálculo e mensagem do WhatsApp: `lib/quote.ts`. Testes em `tests/quote.test.ts` travam 1500, 700 e 150 de propósito.
- Fotos: interface `PhotoStore` em `lib/storage/`. Disco local sem token; Vercel Blob com `BLOB_READ_WRITE_TOKEN`. Na Vercel sem token, não grave em disco.
- Admin: caminho `ADMIN_PATH` (regex longa), hash scrypt em `ADMIN_PASSWORD`, cookie HMAC `rsc_admin`. Tela em `app/interno/painel`, alcançada só pelo proxy. Não crie link para ela.
- Não coloque `ADMIN_PATH` no `robots.txt` nem no sitemap. Isso publicaria o segredo. `/interno` e `/api/admin` podem continuar no disallow.
- Os segredos de `.env.example` são recusados com `NODE_ENV=production` ou `VERCEL=1` (`lib/samples.ts`). Se rotacionar o exemplo, atualize as constantes.
- 2023 e 2024 são “escolhido pelo público”. Não escreva prêmio, título, troféu ou campeão.
- Depoimentos em `content/site.ts` são ilustrativos. Não invente avaliação no schema.org (`components/seo/json-ld.tsx`).
- Logo em `components/landing/logo.tsx` é um desenho a partir da descrição (círculo preto, chama, chapéu), não o arquivo da gráfica.

## Comandos

`npm run dev` na porta 43123. O `allowedDevOrigins` do `next.config.ts` precisa incluir `127.0.0.1`: sem isso o dev server bloqueia o WebSocket e a página não hidrata. `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e` (Playwright; precisa de `.env.local`, criado por `npm run setup`).

Documentação para o Gustavo: `README.md` e `docs/`.

