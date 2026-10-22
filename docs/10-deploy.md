# Deploy na Vercel

O site foi feito para o plano Hobby. Não há banco. A única peça de fora é o Vercel Blob, para as fotos.

## Antes

1. Código no Git, sem `.env.local` e sem `data/photos/manifest.json`.
2. Segredos novos, diferentes do `.env.example`. O de exemplo é recusado quando `VERCEL=1`.
3. `NEXT_PUBLIC_SITE_URL` com `https` e sem barra no final.

## Importar

1. [https://vercel.com/new](https://vercel.com/new) → importe o repositório.
2. Framework Next.js. Build `next build`. Sem comando de install especial: `npm install` basta.
3. Em Environment Variables, para Production:

| Nome | Exemplo do que colocar |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://seu-dominio.vercel.app` ou o domínio próprio |
| `ADMIN_PATH` | saída de `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"` |
| `ADMIN_PASSWORD` | linha `scrypt:...` de `npm run admin:hash` |
| `SESSION_SECRET` | saída de `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |

4. Storage → Create → Blob. Confira se `BLOB_READ_WRITE_TOKEN` ficou disponível em Production.
5. Deploy.

Se o token foi criado depois, use Redeploy. Variável nova não entra na função que já está no ar.

## Domínio

Em Settings → Domains, aponte o domínio. Atualize `NEXT_PUBLIC_SITE_URL` para esse domínio e faça outro deploy, para o Open Graph e o sitemap usarem o endereço certo.

## Conferir

- A home abre no celular.
- O título fala de Marília.
- O botão de WhatsApp abre conversa com o (14) 99627-2725.
- `https://seu-dominio/robots.txt` não mostra o `ADMIN_PATH`.
- `https://seu-dominio/SEU_ADMIN_PATH` pede senha.
- Uma foto enviada aparece na home ao atualizar, sem outro commit.

## O que não fazer

- Não marque o Blob token como `NEXT_PUBLIC`.
- Não reuse a senha `churrasco-local-apenas`.
- Não tente gravar as fotos no disco da Vercel.
