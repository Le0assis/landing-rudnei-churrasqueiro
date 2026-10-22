# Admin

A área de fotos existe para uma pessoa: o Gustavo. Ela não tem cadastro de clientes.

## Como abrir

O endereço é `https://seu-dominio/` + `ADMIN_PATH`. No computador, com `npm run dev`, é `http://127.0.0.1:43123/` + o valor do `.env.local`.

Não há link na home, no rodapé, no sitemap nem no `robots.txt`. O caminho interno `/interno/painel` responde 404. O `proxy.ts` só entrega a tela quando o pedido bate com o `ADMIN_PATH`, e manda o cabeçalho `X-Robots-Tag: noindex, nofollow, noarchive`. A página também declara `noindex` nos metadados.

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

- Publicar foto. O navegador (`lib/compress-image.ts`) aceita JPG, PNG ou WEBP até 10 MB, desenha num canvas de no máximo 1600 px no lado maior e manda JPEG até 2,5 MB. O servidor confere os bytes mágicos de novo e recusa SVG e arquivo grande.
- Até 30 fotos.
- Descrição opcional, até 180 caracteres. Se ficar vazia, o texto padrão é “Churrasco do Rudnei Sciole Churrasqueiro em Marília”.
- Subir, descer e apagar. Apagar pede confirmação na própria lista.
- Ligar ou desligar o embaralhamento.

No computador, sem token, aparece “Salvando neste computador, na pasta data/photos.” Na Vercel com Blob, aparece que está salvando no Vercel Blob.
