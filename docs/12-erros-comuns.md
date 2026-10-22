# Erros comuns

## `node` não é reconhecido

O instalador não entrou no PATH ou o terminal estava aberto antes da instalação. Feche o terminal, abra outro. No Windows, se continuar, reinstale o Node 22 LTS com **Add to PATH**.

## `npm install` termina com erro de versão do Node

O `package.json` pede `node >= 20.9`. Node 18 não roda o Next.js 16. Instale o 22 LTS.

## A página abre, mas clique, menu e orçamento não fazem nada

O Next.js bloqueou o canal de desenvolvimento. O aviso no terminal fala de `allowedDevOrigins` e de `127.0.0.1`. Abra [http://127.0.0.1:43123](http://127.0.0.1:43123) e mantenha `allowedDevOrigins` no `next.config.ts` com `127.0.0.1` e `localhost`. Reinicie o `npm run dev` depois de mexer nisso.

## A página não abre em `localhost:3000`

Este projeto usa a porta **43123**: [http://127.0.0.1:43123](http://127.0.0.1:43123). O comando é `npm run dev`.

## `EADDRINUSE` ou porta em uso

Já existe um `npm run dev`. Aperte `Ctrl+C` na outra janela. Se não achar, no macOS ou Linux: `lsof -i :43123`. No Windows PowerShell: `netstat -ano | findstr 43123` e encerre esse processo, ou mude a porta nos scripts e no `.env.local`.

## Admin responde “Essa página não existe”

- `ADMIN_PATH` vazio, com letra maiúscula estranha, com barra, ou com menos de 17 caracteres.
- Você está em `npm start` ou na Vercel com o caminho de exemplo. Gere outro.
- Esqueceu de reiniciar o `npm run dev` depois de mudar o `.env.local`.

## “Não foi possível entrar”

A senha digitada não corresponde ao hash. O texto `churrasco-local-apenas` só vale para o hash que está no `.env.example`. Se você gerou outro hash, use a senha nova.

## “Muitas tentativas”

Cinco erros em 15 minutos. Espere, ou reinicie o `npm run dev` (a contagem está na memória).

## “A área administrativa não está configurada neste ambiente”

`ADMIN_PASSWORD` não começa com `scrypt:` (alguém colou a senha pura), o hash foi cortado na hora de copiar, `SESSION_SECRET` é curto, ou os valores de exemplo foram para a Vercel.

## Foto não envia no computador

Veja a frase vermelha. As mais comuns: arquivo que não é JPG/PNG/WEBP, original acima de 10 MB, ou resultado ainda grande demais. Tente outra foto.

## Foto não envia na Vercel

Falta `BLOB_READ_WRITE_TOKEN` ou o deploy aconteceu antes de a variável existir. Crie o Blob e faça redeploy. A tela do admin mostra a explicação quando o armazenamento está desconfigurado.

## A home não mostra a foto que acabei de enviar

Atualize a página. A lista não fica presa num build antigo, mas a aba pode estar mostrando a visita anterior. Confira também se “Embaralhar” não fez a foto nova não ser a primeira: a abertura usa a primeira da ordem salva; o carrossel pode começar em outra.

## Teste de ponta não acha o navegador

Rode `npx playwright install chromium`. No Linux, `npx playwright install --with-deps chromium`.

## Teste de ponta não acha `ADMIN_PATH`

Falta `.env.local`. Rode `npm run setup`.

## `next build` reclama de segredo de exemplo

Isso é esperado se você buildar em modo de produção com o `.env.example`. Para publicar, use segredos novos nas variáveis da Vercel. O `npm run dev` continua aceitando o exemplo.

## Cookie não gruda em HTTP de produção

`npm start` local em `http://` não marca o cookie como `Secure` se o endereço for HTTP, então o login pode funcionar. Em HTTPS (Vercel) o cookie vai `Secure`. Se um proxy mentir o protocolo, o navegador pode recusar o cookie. Na Vercel o `x-forwarded-proto` já vem `https`.
