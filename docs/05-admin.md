# Admin

A área existe para uma pessoa: o Léo, que mantém o site. Ela não tem cadastro de clientes. Na página pública, quem fala e quem responde no WhatsApp é o Rudnei.

## Como abrir

O endereço é `https://seu-dominio/` + `ADMIN_PATH`. No computador, com `npm run dev`, é `http://127.0.0.1:43123/` + o valor do `.env.local`.

Não há link na home, no rodapé, no sitemap nem no `robots.txt`. O caminho interno `/interno/painel` responde 404. O `proxy.ts` só entrega a tela quando o pedido bate com o `ADMIN_PATH`, e manda o cabeçalho `X-Robots-Tag: noindex, nofollow, noarchive`. A página também declara `noindex` nos metadados.

A leitura do cookie fica dentro de `<Suspense>` e chama `connection()` antes de `readSessionFromCookie`. A validade da sessão usa `Date.now()`. Sem essa espera, o prerender do Next 16 para com `blocking-prerender-current-time`.

O caminho precisa combinar com `^[a-z0-9][a-z0-9-]{15,62}[a-z0-9]$`. Menor que isso, o admin fica desligado.

## Senha e sessão

O login manda a senha para `POST /api/admin/login`. O servidor compara com scrypt e `timingSafeEqual` contra o hash de `ADMIN_PASSWORD`. Senha errada responde “Não foi possível entrar.”, sem dizer se o usuário existe — só existe uma senha.

Depois de acertar, o servidor grava o cookie `rsc_admin`:

- `HttpOnly` (o JavaScript da página não lê o valor);
- `SameSite=Strict`;
- `Secure` quando a conexão é HTTPS;
- validade de 12 horas;
- conteúdo assinado com HMAC-SHA256 usando `SESSION_SECRET`.

Cinco erros em 15 minutos, no mesmo IP, travam novas tentativas. O acerto zera a contagem daquele IP. O limite fica na memória da instância. Na Vercel cada instância conta a sua; para este uso, de uma pessoa, isso basta.

Sair chama `POST /api/admin/logout` e apaga o cookie.

Os valores de exemplo do repositório são recusados quando `NODE_ENV` é `production` ou quando `VERCEL=1`. Por isso o exemplo só entra com `npm run dev`.

## O que dá para fazer

Há quatro abas: Carrossel, Festas, Feedbacks e Seções.

- Publicar foto na aba aberta. O navegador (`lib/compress-image.ts`) aceita JPG, PNG ou WEBP até 10 MB, desenha num canvas de no máximo 1600 px no lado maior e manda JPEG até 2,5 MB. O servidor confere os bytes mágicos de novo e recusa SVG e arquivo grande.
- Até 30 fotos em cada categoria. Festas cheias não impedem um upload no carrossel.
- Descrição opcional, até 180 caracteres. Se ficar vazia, a legenda não aparece e o texto alternativo ganha uma frase genérica daquela categoria. Se for preenchida, a mesma frase vale como legenda e como texto alternativo.
- Subir, descer e apagar dentro da categoria. Apagar pede confirmação na própria lista. A ordem de uma categoria não mexe na outra.
- Ligar ou desligar o embaralhamento. Isso só existe no carrossel.
- Na aba Seções, ligar ou desligar cada bloco público: abertura, faixa de confiança, sobre, como funciona, eventos, serviços e preços, orçamento, depoimentos, carrossel, galeria, cada aba da galeria, área, perguntas e contato. Contato inclui a chamada final e o botão fixo de WhatsApp. O botão do topo permanece. A galeria some por inteiro se ela estiver desligada ou se as duas abas estiverem desligadas.

A lista de ids fica em `lib/sections.ts`. O padrão, quando o manifesto ainda não tem o campo, é tudo visível.

No computador, sem token, aparece “Salvando neste computador, na pasta data/photos.” Na Vercel com Blob, aparece que está salvando no Vercel Blob.
