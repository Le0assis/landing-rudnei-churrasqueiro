# Carrossel

A seção “Fotos dos eventos” está em `components/landing/gallery.tsx`. A lista chega do servidor por `lib/gallery.ts`, que chama `connection()` para a leitura acontecer na visita, não na hora do build.

## De onde vêm as fotos

1. Se existir `BLOB_READ_WRITE_TOKEN`, a lista é o arquivo `gallery/manifest.json` no Vercel Blob.
2. Se não existir token e o processo não for a Vercel, a lista é `data/photos/manifest.json`.
3. Na Vercel sem token, o armazenamento está desconfigurado: o site mostra as ilustrações e o admin explica o que falta.
4. Lista vazia: ilustrações.
5. Erro de leitura: aviso no carrossel, ilustração na abertura.

A API pública `GET /api/photos` devolve a mesma lista, com `Cache-Control: no-store`.

## Movimento

- Autoplay a cada 4,5 segundos, se houver mais de uma foto.
- Pausa ao passar o mouse, ao focar, quando a aba fica escondida, e no botão Pausar / Continuar.
- Arrastar para o lado, botões Anterior e Próxima, bolinhas e setas do teclado quando a região está focada.
- Sem autoplay se o sistema pede movimento reduzido.

Se a opção “Embaralhar a ordem a cada visita” estiver ligada (é o padrão), o servidor embaralha a ordem antes de enviar. A foto da abertura continua sendo a primeira da ordem salva, para a imagem principal não pular. Com a opção desligada, o carrossel segue a ordem dos botões subir e descer.

Trocar foto não pede um novo deploy: a próxima visita lê o manifesto de novo.

## Galeria

A seção “Quem estava na festa” está em `components/landing/album.tsx`. São duas abas:

- **Festas**: fotos da equipe e dos clientes em cada evento.
- **Clientes**: fotos com os clientes nos eventos.

As fotos dessas abas usam as categorias `festas` e `clientes` do mesmo manifesto. Não há ilustração de espera aqui: uma aba sem foto mostra só uma frase. Inventar um print de cliente seria um depoimento falso.

A grade é de duas colunas no celular, três em telas médias e quatro no desktop. O toque abre um lightbox com a foto inteira, a legenda (se houver), Fechar, Anterior e Próxima. Esc fecha. As setas do teclado trocam a foto. Dá para arrastar para o lado. O foco volta para o botão que abriu.

Se a galeria estiver desligada, ou se as duas abas estiverem desligadas, a seção não entra na página e o menu não mostra “Galeria”. Uma aba desligada some; a outra continua.
