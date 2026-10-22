# Armazenamento

Há uma interface só, `PhotoStore`, em `lib/storage/types.ts`:

- `list`
- `add`
- `remove`
- `reorder` (só dentro de uma categoria)
- `setShuffle`
- `setSections`

`lib/storage/index.ts` escolhe a implementação:

| Situação | Onde grava |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` preenchido | Vercel Blob (`lib/storage/blob.ts`) |
| Sem token, fora da Vercel | Disco (`lib/storage/local.ts`) |
| Vercel sem token | Nada. Leitura devolve ilustrações. Gravação explica como configurar |

O manifesto é um JSON `{ shuffle, sections, photos }`. Cada foto tem id, descrição, legenda, categoria (`carrossel`, `festas` ou `feedbacks`), tamanho, tipo, data, caminho e, no Blob, a URL pública. Foto antiga, sem categoria, é lida como carrossel e sem legenda. `sections` é um mapa de id para `true` ou `false`. Id ausente fica visível. Os ids estão em `lib/sections.ts`.

O limite é 30 fotos por categoria, não 30 no total.

## Disco, para desenvolver

- Arquivos: `data/photos/files/<id>.jpg`
- Lista: `data/photos/manifest.json`
- A home não lê a pasta direto. `GET /api/media/<id>` entrega o arquivo com `X-Content-Type-Options: nosniff` e cache longo, porque o id muda se a foto for outra.
- A pasta de arquivos está no `.gitignore`, menos o `.gitkeep`.

O disco da função da Vercel não serve: ele é só de leitura, fora de `/tmp`, e o `/tmp` some. Não use a pasta `data/photos` como plano de publicação.

## Vercel Blob, o recomendado

É o encaixe natural do plano gratuito da Vercel: um store, um token, sem cartão se você ficar no Hobby. As fotos deste site, já reduzidas, ficam bem abaixo do espaço inicial do Blob.

Como ligar:

1. No projeto da Vercel, Storage → Create → Blob.
2. A variável `BLOB_READ_WRITE_TOKEN` é criada para você.
3. Redeploy.
4. Envie uma foto pela área escondida e atualize a home.

O código grava:

- `gallery/files/<id>.jpg` (ou png/webp), público, com nome estável;
- `gallery/manifest.json`, reescrito a cada mudança, com cache de 60 segundos.

A leitura do manifesto pede a URL com um parâmetro de hora e `cache: "no-store"`, para a visita seguinte ver a lista nova. Se o manifesto falhar logo depois do upload do arquivo, o arquivo recém-criado é apagado.

Não commite o token. Não coloque o token em variável `NEXT_PUBLIC_`.

## Trocar de armazenamento no futuro

Quem for implementar outro provedor (Cloudinary, Supabase Storage) cria uma classe com a mesma interface e um ramo em `storageKind()`. A página e o admin não precisam saber o provedor.
