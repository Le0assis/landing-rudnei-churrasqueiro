# Segurança

A área de fotos é pequena de propósito. Estas são as proteções que existem hoje.

## Caminho

`ADMIN_PATH` é obscuridade, não a trava principal. A trava é a senha. Mesmo assim:

- o caminho não é linkado;
- não entra no sitemap;
- não entra no `robots.txt`, porque um `Disallow` publicaria o endereço;
- `/interno` e `/api/admin` entram no `robots.txt`, porque esses caminhos são fixos e não são o segredo;
- a resposta do caminho secreto pede para não indexar.

## Senha

- Guardada só como hash scrypt (`scrypt:sal:hash`), gerado por `scripts/hash-password.mjs`.
- Comparação com `timingSafeEqual`.
- Senha vazia ou maior que 200 caracteres nem chega a calcular o hash.
- O hash de exemplo do repositório é recusado em produção.

## Cookie

Ver `docs/05-admin.md`. O valor é `payload.assinatura`. A assinatura é HMAC. Token expirado, adulterado ou assinado com outro segredo não entra.

Pedidos que mudam dados (`POST` e `DELETE` do admin) exigem cabeçalho `Origin` igual ao `Host`. Isso corta pedido forjado de outro site. O `SameSite=Strict` ajuda no mesmo sentido.

## Upload

- Tipo conferido pelos primeiros bytes, não pelo nome do arquivo.
- Tamanho máximo 2,5 MB depois da compressão.
- Id é UUID. O nome original do arquivo é ignorado.
- SVG é recusado, para não servir um arquivo que o navegador execute.
- No disco, o caminho é resolvido e precisa continuar dentro de `data/photos/files`.

## Limites

- Login: 5 tentativas a cada 15 minutos por IP.
- Upload: 20 a cada 15 minutos por IP.
- Reordenar: 60 a cada 15 minutos por IP.
- Ligar ou desligar seção: 60 a cada 15 minutos por IP.

O IP vem do primeiro valor de `X-Forwarded-For` ou de `X-Real-Ip`. Na Vercel esse cabeçalho é preenchido pela plataforma.

## O que isto não é

Não há painel de clientes, não há senha de visitante e não há análise de acesso. Não coloque segredo em `content/`, em `NEXT_PUBLIC_` nem neste `docs/`.
