# Testes

Três checagens estáticas e duas de comportamento.

```bash
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
```

`lint` é o ESLint com a configuração do Next.js 16. `typecheck` é `tsc --noEmit`. Os dois precisam passar sem aviso tratado como erro no ESLint (`--max-warnings` não está no script; o padrão do ESLint deste projeto já falha em erro).

## Unidade (`tests/`)

`tests/quote.test.ts`

- Completo sem garçom: R$ 1.500.
- Cada garçom soma R$ 150. Dois garçons no completo: R$ 1.800.
- Assador: R$ 700, e a soma com garçons.
- Mudar a quantidade de pessoas não muda o total, mas muda a mensagem.
- Garçom negativo, fracionário, acima de 20 ou ausente: erro.
- Opção desconhecida: erro.
- Mensagem completa, com data “20 de dezembro de 2026”, Pix, e o link `wa.me/5514996272725` cujo texto decodificado é a própria mensagem.
- Assador sem garçom explica “nenhum” e “sem garçom”.
- Formulário vazio ou inválido devolve erros em português e não calcula.
- Data passada e data a mais de dois anos falham. O dia informado como “hoje” passa.
- O script `npm run admin:hash` e `verifyAdminPassword` aceitam a mesma senha e recusam outra.

`tests/security.test.ts`

- O caminho de exemplo funciona em desenvolvimento e é recusado em produção.
- Caminho curto é recusado. Um caminho longo válido passa.
- Cookie assinado é aceito; adulteração, outro segredo e expiração são recusados.
- A página do admin chama `connection()` antes de ler a sessão, para o relógio não cair no prerender.
- A sexta tentativa de login no mesmo intervalo é bloqueada; limpar a chave libera.
- Bytes de JPEG, PNG e WEBP são reconhecidos. SVG e arquivo curto não.

`tests/gallery-sections.test.ts`

- A abertura começa com “Sou o Rudnei Sciole” e cita “meu filho, o Léo, filho e assistente”. A faixa de destaques tem 5 anos, Pai e filho, 2023 e 2024 e Só mão de obra. O atendimento no rodapé é do Rudnei.
- O nome antigo da conta não aparece no site nem na documentação.
- Seção ausente ou com valor inválido continua visível. Seção desconhecida é recusada.
- Galeria some se estiver desligada ou se as duas abas estiverem desligadas. O menu perde História e Fotos quando esses blocos estão desligados.
- Foto antiga, sem categoria, entra no carrossel e sem legenda.
- Reordenar Festas não troca a ordem do carrossel nem dos clientes.
- O limite de 30 fotos vale por categoria.
- Legenda vazia não vira texto. Legenda preenchida vira o texto alternativo.

`tests/testimonials.test.ts`

- Manifesto sem `testimonials` recebe os depoimentos iniciais; lista vazia salva continua vazia; item quebrado é descartado.
- Adicionar exige nome e texto, evento é opcional, há limite de tamanho e de quantidade (50).
- Editar tira a marca de ilustrativo; ligar/desligar muda o que vai para a página; apagar remove; id desconhecido é recusado.

## Navegador (`e2e/smoke.spec.ts`)

Sobe `npm run dev` na porta 43123 se ela estiver livre (`reuseExistingServer`). Lê `.env.local`.

- A home tem o título combinado, “escolhido pelo público” e não usa as palavras prêmio, premiado, troféu ou campeão.
- O orçamento do completo com 40 pessoas e 2 garçons mostra R$ 1.800,00 e o link do WhatsApp contém pessoas, cidade e a frase de que os alimentos não entram.
- O assador com zero garçons mostra R$ 700,00.
- Uma pergunta da sanfona abre.
- O HTML da home não contém o `ADMIN_PATH`.
- `robots.txt` fecha `/interno` e `/api/admin` e não contém o caminho secreto.
- O sitemap também não.
- `/interno/painel` responde 404.
- `GET /api/admin/photos` sem cookie responde 401.
- A página secreta tem `noindex`.
- Senha errada mostra o erro genérico.
- A senha de exemplo entra, publica a ilustração `brasa.jpg` com uma descrição de teste, a API pública passa a listar essa foto, e apagar volta ao estado vazio.
- No viewport de celular o WhatsApp fixo aparece e o flutuante não. No desktop, o contrário.

O teste de upload grava em `data/photos` e apaga em seguida. Se ele quebrar no meio, apague `data/photos/manifest.json` e os arquivos em `data/photos/files/` antes de repetir, senão a home deixa de mostrar só as ilustrações.

A senha usada nesse teste é a do exemplo local. Não use essa senha publicada.
