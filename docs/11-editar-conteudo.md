# Editar conteúdo

Quase tudo que o Rudnei diria na página está em `content/site.ts`. O Léo edita esse arquivo. Preços e itens do cardápio estão em `lib/pricing.ts` para o formulário e os testes usarem o mesmo número. Os nomes “Rudnei” e “Léo, filho e assistente” vêm de `lib/contact.ts` (`OWNER_NAME`, `OWNER_FULL_NAME`, `ASSISTANT_LABEL`).

## Textos

| Constante | O que é |
| --- | --- |
| `slogans` | As quatro frases combinadas, inclusive o lema do logo |
| `hero` | Título e parágrafo da abertura |
| `trustItems` | A faixa logo abaixo da abertura |
| `story` | História |
| `steps` | Os quatro passos |
| `events` | Tipos de evento |
| `seedTestimonials` | Só os depoimentos iniciais, usados enquanto o manifesto não tem a lista. Para mudar depoimentos, use a aba Depoimentos do admin |
| `faqs` | Perguntas e respostas. Entram também no schema.org |
| `area` | Marília e região |
| `privacy` | Nota do rodapé |

Não escreva “prêmio”, “premiado”, “troféu” ou “campeão” para 2023 e 2024. A frase combinada é “escolhido pelo público”.

## Contato

`lib/contact.ts`: nome, telefone exibido, telefone `5514996272725` (sem pontuação, com 55), e Instagram. Se o número mudar, mude os dois formatos juntos.

## Preços

`lib/pricing.ts`:

- `SERVICE_OPTIONS.completo.labor` e `assador.labor`
- `items` de cada opção
- `SHARED_ITEMS`
- `WAITER_PRICE`
- `LIMITS` (pessoas, garçons, fotos, tamanho de arquivo)

Os testes em `tests/quote.test.ts` esperam 1500, 700 e 150. Se o preço mudar de verdade, atualize o teste para o número novo. Isso é intencional: o teste existe para ninguém alterar o valor sem perceber.

## Fotos e seções

Pela área de admin, não por commit. Veja `docs/05-admin.md`.

Carrossel, Choripán, Festas e Clientes são categorias do mesmo manifesto. A aba Seções grava quais blocos a home desenha. Para criar um bloco novo que também possa ser escondido, acrescente o id em `lib/sections.ts` e a condição em `app/page.tsx`. Sem isso, o bloco fica sempre no HTML.

Para trocar só a ilustração de espera, substitua o JPG em `public/placeholders/` mantendo o nome, ou rode `npm run placeholders` e edite `content/gallery.ts` se mudar largura, altura ou texto alternativo.

## Logo

Substitua o SVG em `components/landing/logo.tsx`. Mantenha o nome acessível no texto ao lado (“Rudnei Sciole” / “Churrasqueiro”), não só dentro da imagem.
