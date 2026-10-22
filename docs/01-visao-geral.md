# Visão geral

O Rudnei Sciole Churrasqueiro é um site de uma página. O Rudnei atende há cinco anos em Marília-SP e na região, com o Léo, filho e assistente. O visitante lê a história, escolhe entre duas opções de mão de obra e manda um orçamento pelo WhatsApp. As fotos e a lista do que aparece na página vêm de um armazenamento que o site consulta em toda visita. Quem mexe no código e na área escondida é o Léo.

## Pastas

| Caminho | Função |
| --- | --- |
| `app/page.tsx` | Monta a home |
| `app/layout.tsx` | Fonte, idioma `pt-BR` e metadados |
| `app/api/` | Lista pública de fotos, arquivo local e rotas do admin |
| `app/interno/painel/` | Tela real do admin. O visitante não abre esse caminho: o `proxy.ts` responde 404 |
| `proxy.ts` | Reescreve o `ADMIN_PATH` para a tela interna |
| `components/landing/` | Seções visíveis |
| `components/admin/` | Login, fotos por categoria e seções visíveis |
| `lib/sections.ts` | Quais blocos da página podem ser ligados ou desligados |
| `components/ui/` | Botão, campo e sanfona do shadcn/ui |
| `content/site.ts` | Textos da página |
| `content/gallery.ts` | Ilustrações de espera |
| `lib/pricing.ts` | Preços e listas do cardápio |
| `lib/quote.ts` | Cálculo e mensagem do WhatsApp |
| `lib/storage/` | Disco local ou Vercel Blob |
| `public/placeholders/` | JPGs ilustrativos |
| `data/photos/` | Fotos reais no computador. Não vai para o Git |
| `tests/` | Testes de unidade |
| `e2e/` | Teste de fumaça no navegador |

## Ordem da página

1. Abertura com o título “Churrasco de pai e filho em Marília, há 5 anos” e o WhatsApp.
2. Faixa de confiança: 5 anos, escolhido pelo público em 2023 e em 2024, Marília e região, indicação.
3. História de pai e filho, em primeira pessoa.
4. Como funciona: escolha, lista, compra feita por ele, dia do evento.
5. Tipos de evento.
6. As duas opções, o que entra nas duas e o garçom.
7. Orçamento rápido.
8. Depoimentos ilustrativos, marcados para edição.
9. Carrossel.
10. Galeria, com as abas Festas e Feedbacks.
11. Área atendida.
12. Perguntas frequentes.
13. Chamada final e rodapé, com a nota de privacidade.

O botão de WhatsApp fica fixo embaixo no celular e flutuante no desktop.

## Tom

O texto fala como o Rudnei: primeira pessoa, família, sem prometer o que não foi combinado. O Léo aparece quando o assunto é o filho, sempre como “Léo, filho e assistente”. “Escolhido pelo público” em 2023 e 2024 não é descrito como prêmio, título ou campeonato. Não há nota inventada nem depoimento apresentado como real.
