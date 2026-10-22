# Rudnei Sciole Churrasqueiro

Site do churrasco de pai e filho do Gustavo, em Marília-SP e região. A página apresenta a história, as duas opções de mão de obra, um orçamento que abre o WhatsApp com a mensagem pronta e um carrossel de fotos. As fotos entram por uma página escondida, sem precisar publicar o site de novo.

Este guia é para quem está começando. Siga na ordem. Cada comando é para colar no terminal.

## O que você vai ter no final

- O site no computador, em [http://127.0.0.1:43123](http://127.0.0.1:43123).
- O mesmo site pronto para publicar de graça na Vercel.
- Uma área só sua para colocar e apagar fotos do carrossel.

A documentação de cada parte fica na pasta [`docs/`](docs/01-visao-geral.md).

## 1. O que instalar

Você precisa de três programas:

| Programa | Versão | Para que serve |
| --- | --- | --- |
| Git | 2.40 ou mais novo | Baixar o projeto |
| Node.js | 22 LTS (mínimo 20.9.0) | Rodar o site. O Next.js 16 não aceita Node 18 |
| npm | 10 ou mais novo | Instalar as bibliotecas. Já vem com o Node |

O projeto usa Next.js `16.4.2`, React `19.3.0`, Tailwind CSS `4` e TypeScript `5`. Você não instala isso um por um: o comando `npm install` lê o `package.json` e baixa as versões certas.

Confira depois, em qualquer sistema:

```bash
git --version
node -v
npm -v
```

O `node -v` precisa mostrar `v20.9` ou maior. O ideal é `v22`, por exemplo `v22.23.4`.

### Windows

1. Instale o Git em [https://git-scm.com/download/win](https://git-scm.com/download/win). Nas perguntas do instalador, pode aceitar o padrão. Marque a opção que adiciona o Git ao PATH, se ela aparecer.
2. Instale o Node.js 22 LTS em [https://nodejs.org/](https://nodejs.org/). Baixe o instalador Windows (.msi) de 64 bits. Na instalação, deixe marcada a opção **Add to PATH**.
3. Feche e abra de novo o **PowerShell** (não precisa ser administrador).
4. Rode `git --version`, `node -v` e `npm -v`.

Se o PowerShell disser que `node` não é reconhecido, reinicie o computador e tente de novo. O instalador só passa a valer em janelas novas.

### macOS

1. Abra o Terminal (Aplicativos → Utilitários → Terminal).
2. Se o Mac pedir as ferramentas de linha de comando, aceite.
3. Instale o Node.js 22 LTS pelo instalador em [https://nodejs.org/](https://nodejs.org/), ou, se você já usa Homebrew:

```bash
brew install node@22 git
```

4. Rode `git --version`, `node -v` e `npm -v`.

### Linux

No Ubuntu, Debian e derivados:

```bash
sudo apt update
sudo apt install -y git curl ca-certificates
```

Instale o Node.js 22 pelo site [https://nodejs.org/](https://nodejs.org/) (arquivo Linux) ou pelo NodeSource. Um caminho simples, se você usa `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# feche e abra o terminal
nvm install 22
nvm use 22
```

No Fedora:

```bash
sudo dnf install -y git
```

Depois instale o Node 22 pelo site oficial ou pelo `nvm`, como acima. Rode `node -v` e confirme que é 20.9 ou maior.

## 2. Baixar o projeto

Se a pasta já está aberta no Cursor, pule para o passo 3.

Se você já publicou o código num repositório Git:

```bash
git clone URL_DO_REPOSITORIO rudnei-sciole
cd rudnei-sciole
```

Troque `URL_DO_REPOSITORIO` pelo endereço que o GitHub (ou outro serviço) mostra no botão Code. No PowerShell do Windows o comando é o mesmo.

## 3. Instalar as bibliotecas do projeto

Dentro da pasta do projeto:

```bash
npm install
```

Isso cria a pasta `node_modules`. Não envie essa pasta para o Git: ela já está no `.gitignore`.

## 4. Criar o arquivo de ambiente

```bash
npm run setup
```

Esse comando copia `.env.example` para `.env.local` só se o `.env.local` ainda não existir. O `.env.local` fica no seu computador e não deve ir para o Git.

Os valores de exemplo servem **apenas** para `npm run dev`. Em produção (`npm start` e Vercel) o site recusa o caminho, a senha e o segredo de exemplo de propósito.

### Cada variável

Abra `.env.local` num editor de texto.

`NEXT_PUBLIC_SITE_URL`  
Endereço público do site, sem barra no final. No computador deixe `http://127.0.0.1:43123`. Na Vercel, troque pelo domínio real, por exemplo `https://rudneisciole.com.br`. Esse valor entra no link de compartilhamento (Open Graph) e no mapa do site.

`ADMIN_PATH`  
O pedaço secreto do endereço da área de fotos. Só letras minúsculas, números e hífen, com no mínimo 17 caracteres. Não use `admin`, `fotos` ou o seu nome. O site não coloca esse caminho no menu, no sitemap nem no `robots.txt` — se colocasse no `robots.txt`, estaria publicando o segredo.

Gere outro assim, em qualquer sistema:

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Cole o resultado em `ADMIN_PATH`, sem aspas e sem espaço.

`ADMIN_PASSWORD`  
Não é a senha. É um hash scrypt dela. A senha do exemplo local está escrita mais abaixo, na seção do admin, e também no comentário do `.env.example`. Para criar o hash de uma senha nova:

```bash
npm run admin:hash
```

O programa pede a senha e imprime uma linha que começa com `scrypt:`. Copie a linha inteira para `ADMIN_PASSWORD`. A senha precisa ter pelo menos 10 caracteres. Ela não aparece de novo: se perder, gere outro hash.

Se preferir mandar a senha pelo teclado sem o modo interativo, uma quebra de linha no final é removida. No PowerShell:

```powershell
"uma-senha-longa" | npm run admin:hash
```

No bash:

```bash
printf '%s' 'uma-senha-longa' | npm run admin:hash
```

`SESSION_SECRET`  
Segredo que assina o cookie de login. Mínimo de 32 caracteres. Não é a senha do admin. Gere outro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

`BLOB_READ_WRITE_TOKEN`  
Deixe vazio no computador. As fotos ficam na pasta `data/photos`. Na Vercel, este token é obrigatório. O passo a passo está na seção 8 e em [`docs/06-armazenamento.md`](docs/06-armazenamento.md).

## 5. Rodar no computador

```bash
npm run dev
```

Abra [http://127.0.0.1:43123](http://127.0.0.1:43123).

O servidor escuta na porta **43123**, não na 3000. Para parar, aperte `Ctrl+C` no terminal.

Enquanto as fotos reais não forem enviadas, o carrossel mostra ilustrações com a faixa **Imagem ilustrativa**.

## 6. Entrar na área de fotos

1. Veja o valor de `ADMIN_PATH` no `.env.local`.
2. Abra `http://127.0.0.1:43123/` + esse valor. Exemplo de formato, não use este se você já trocou o caminho: `http://127.0.0.1:43123/cole-o-caminho-aqui`.
3. A senha do arquivo de exemplo, só para o modo de desenvolvimento, é `churrasco-local-apenas`.

Essa página não tem link em lugar nenhum do site. Se o caminho estiver curto, vazio ou for o exemplo numa publicação de produção, o endereço responde como página inexistente.

Dentro da área você pode:

- enviar JPG, PNG ou WEBP (o navegador reduz a imagem antes);
- escrever uma descrição, que vira o texto alternativo da foto;
- subir ou descer a ordem;
- apagar, com uma confirmação;
- ligar ou desligar “Embaralhar a ordem a cada visita”.

Detalhes em [`docs/05-admin.md`](docs/05-admin.md).

## 7. Testes

Com o site parado ou não: o teste de ponta sobe o servidor sozinho se a porta 43123 estiver livre.

```bash
npm run lint
npm run typecheck
npm test
```

O teste do navegador pede o Chromium uma vez:

```bash
npx playwright install chromium
npm run test:e2e
```

No Linux, se o Chromium reclamar de biblioteca faltando:

```bash
npx playwright install --with-deps chromium
```

`npm test` confere o cálculo da mão de obra, a mensagem do WhatsApp, o hash da senha, o cookie de sessão, o limite de tentativas e o tipo do arquivo de imagem. `npm run test:e2e` abre a home, preenche o orçamento, confere que o caminho secreto não aparece no site nem no `robots.txt`, entra na área de fotos e testa o botão de WhatsApp no celular e no desktop.

## 8. Publicar na Vercel

1. Envie o código para um repositório Git (GitHub, por exemplo). Não envie `.env.local`.
2. Entre em [https://vercel.com](https://vercel.com) e importe o repositório. Framework: Next.js. Não precisa mudar o comando de build (`next build`).
3. Antes do primeiro deploy, em **Settings → Environment Variables**, crie valores **novos** (não copie o exemplo):
   - `NEXT_PUBLIC_SITE_URL` = `https://seu-dominio`
   - `ADMIN_PATH` = um caminho novo, gerado pelo comando da seção 4
   - `ADMIN_PASSWORD` = um hash novo, gerado por `npm run admin:hash`
   - `SESSION_SECRET` = um segredo novo, de pelo menos 32 caracteres
4. Crie um Blob store: no projeto da Vercel, **Storage → Create → Blob**. O plano Hobby (gratuito) serve para este site. A Vercel cria `BLOB_READ_WRITE_TOKEN`. Confirme que a variável está ligada a Production (e Preview, se quiser testar fotos num deploy de teste).
5. Faça o deploy. Se você adicionou o token depois do primeiro deploy, clique em **Redeploy** para a função passar a enxergar a variável.
6. Abra o domínio, confira a home e entre em `https://seu-dominio/SEU_ADMIN_PATH`.
7. Envie as fotos reais. O carrossel lê a lista em cada visita. Não precisa de outro deploy para trocar foto.

O plano gratuito da Vercel não grava arquivo no disco da função. Por isso, sem o Blob, a área de fotos avisa que o armazenamento não está configurado e o site continua mostrando as ilustrações.

Mais detalhes em [`docs/10-deploy.md`](docs/10-deploy.md).

## 9. Trocar fotos, preços e textos

| O que mudar | Onde |
| --- | --- |
| Frases da página, perguntas, depoimentos | `content/site.ts` |
| Telefone, Instagram, nome do parceiro | `lib/contact.ts` |
| Preços, cardápio e limites do orçamento | `lib/pricing.ts` |
| Fotos do carrossel | área escondida, não um arquivo do Git |
| Ilustrações de espera | `public/placeholders/` e `content/gallery.ts` |
| Desenho do selo (chama e chapéu) | `components/landing/logo.tsx` |

Depois de mudar texto ou preço no código, rode `npm run dev` de novo (ou faça um deploy). Foto enviada pela área escondida não precisa de deploy.

O guia campo a campo está em [`docs/11-editar-conteudo.md`](docs/11-editar-conteudo.md).

## 10. Erros comuns

A lista completa, com o que a mensagem significa, está em [`docs/12-erros-comuns.md`](docs/12-erros-comuns.md). Os mais frequentes:

- **`node` não encontrado:** feche o terminal, abra de novo, ou reinstale o Node marcando Add to PATH.
- **A área de fotos abre como “página não existe”:** o `ADMIN_PATH` está vazio, curto, ou você está em produção com o valor de exemplo. Gere outro e reinicie o `npm run dev`.
- **“Não foi possível entrar”:** a senha não é a do hash. Lembre que o exemplo `churrasco-local-apenas` só vale para o hash que veio no `.env.example`.
- **“A área administrativa não está configurada”:** `ADMIN_PASSWORD` não é um hash `scrypt:...`, ou `SESSION_SECRET` tem menos de 32 caracteres, ou você publicou os valores de exemplo.
- **A foto não sobe na Vercel:** falta `BLOB_READ_WRITE_TOKEN`. Crie o Blob store e faça redeploy.
- **Porta 43123 ocupada:** pare o outro `npm run dev`, ou troque a porta nos scripts `dev` e `start` do `package.json`, em `NEXT_PUBLIC_SITE_URL` e em `playwright.config.ts`.

## Onde ler mais

- [Visão geral](docs/01-visao-geral.md)
- [A página](docs/02-pagina.md)
- [Orçamento e WhatsApp](docs/03-orcamento-whatsapp.md)
- [Carrossel](docs/04-carrossel.md)
- [Admin](docs/05-admin.md)
- [Armazenamento](docs/06-armazenamento.md)
- [Segurança](docs/07-seguranca.md)
- [SEO, acesso e privacidade](docs/08-seo-acessibilidade-lgpd.md)
- [Testes](docs/09-testes.md)
- [Deploy](docs/10-deploy.md)
- [Editar conteúdo](docs/11-editar-conteudo.md)
- [Erros comuns](docs/12-erros-comuns.md)
