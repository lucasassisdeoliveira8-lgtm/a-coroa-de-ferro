# Como subir este repositório no GitHub

Há dois caminhos. O **caminho A** é pelo site, arrastando arquivos: não precisa instalar
nada, não precisa de terminal e não precisa de token. Comece por ele. O **caminho B**, por
linha de comando, só vale a pena depois, quando você já estiver mexendo no jogo com
frequência.

---

# Caminho A — pelo site, sem instalar nada

## A1. Criar o repositório

1. Entre em **https://github.com/new**
2. **Repository name**: `a-coroa-de-ferro`
3. **Description**: `Roguelike top-down brasileiro sobre ética e confiança em IA. Jogue no navegador.`
4. Marque **Public**
5. **Não marque nada** em "Initialize this repository with" — nem README, nem .gitignore,
   nem licença. Este pacote já traz os três, e marcar ali criaria conflito.
6. **Create repository**

Vai abrir uma página com instruções de terminal. **Ignore tudo isso.** Procure o link
azul no meio da página que diz **"uploading an existing file"** e clique nele.

> Se você já fechou essa página: entre no repositório e clique em
> **Add file → Upload files**.

## A2. Arrastar os arquivos

1. Descompacte o zip. Você vai ter uma pasta com o `index.html`, o `README.md` e as
   subpastas `src`, `testes`, `docs`, `ferramentas` e `unity`.
2. Abra a pasta, **selecione tudo o que está dentro dela** (`Ctrl+A` no Windows,
   `Cmd+A` no Mac) e arraste para a área de upload do GitHub.
3. Espere as barras de progresso terminarem. Vão aparecer os 30 arquivos.
4. Em **Commit changes**, escreva: `A Coroa de Ferro — jogo completo, versão 9`
5. Clique em **Commit changes**.

Pronto. Recarregue a página do repositório: está tudo lá, com o README formatado.

> **Se as subpastas não subirem junto** (alguns navegadores só aceitam arquivos soltos):
> suba primeiro os arquivos que estão na raiz, confirme, e depois repita o
> **Add file → Upload files** arrastando uma subpasta de cada vez. O repositório funciona
> mesmo só com os arquivos da raiz — as subpastas são o código-fonte e os testes.
>
> **Se as imagens do README aparecerem quebradas**: faltou a pasta `docs`. Suba ela e elas
> aparecem.
>
> **O arquivo `.gitignore` começa com ponto** e fica escondido em algumas configurações do
> Windows. Se ele não aparecer para arrastar, ative "Itens ocultos" na aba Exibir do
> Explorador de Arquivos. Ele não é essencial agora.

## A3. Ligar o GitHub Pages (link grátis e permanente)

1. No repositório: **Settings** → **Pages** (menu da esquerda)
2. Em **Source**, escolha **Deploy from a branch**
3. Branch: **main**, pasta: **/ (root)** → **Save**

Em um ou dois minutos o jogo fica no ar em:

```
https://lucasassisdeoliveira8-lgtm.github.io/a-coroa-de-ferro/
```

O `index.html` já está na raiz justamente para isso funcionar sem configuração nenhuma.

## A4. Editar depois, ainda pelo site

Para trocar um arquivo: abra ele no GitHub, clique no **lápis** (Edit), altere e confirme.
Para substituir por uma versão nova do seu computador: **Add file → Upload files** e
arraste por cima — o GitHub entende como atualização.

---

# Caminho B — pela linha de comando

Só depois de ter o Git instalado (https://git-scm.com). Abra o terminal **dentro da pasta
descompactada** e rode:

```bash
git init
git add .
git commit -m "A Coroa de Ferro — jogo completo, versão 9"
git branch -M main
git remote add origin https://github.com/lucasassisdeoliveira8-lgtm/a-coroa-de-ferro.git
git push -u origin main
```

**Se pedir usuário e senha e recusar**: o GitHub não aceita mais a senha da conta pela
linha de comando desde 2021. Você precisa de um token:

1. **Settings** (do seu perfil) → **Developer settings** → **Personal access tokens** →
   **Tokens (classic)** → **Generate new token (classic)**
2. Marque o escopo **`repo`**
3. Gere, **copie o token** (ele não aparece de novo) e use **no lugar da senha**.
   O usuário continua sendo o seu login do GitHub.

**Se disser `git: command not found`**: o Git não está instalado. Use o caminho A.

---

# Depois: ligar o repositório na Vercel (recomendado)

Isto resolve a limitação do Vercel Drop, que criava um projeto novo a cada envio. Depois de
conectado, **toda alteração no GitHub republica o jogo sozinho, no mesmo endereço**.

1. Entre em https://vercel.com/new
2. **Import Git Repository** → autorize o GitHub se ele pedir
3. Escolha `a-coroa-de-ferro`
4. Framework Preset: **Other**. Build Command e Output Directory: deixe em branco —
   é site estático, não tem build.
5. **Deploy**

> Você já tem um projeto criado pelo Drop (`a-coroa-de-ferro-web`). Este import cria um
> **segundo**. Vale apagar um dos dois para não ficar com dois endereços vivos:
> **Settings → General → Delete Project**.

---

# Deixar o repositório com cara de projeto

- **About** (engrenagem no topo direito): descrição, o link do jogo em **Website**, e os
  tópicos `game`, `roguelike`, `javascript`, `canvas`, `html5-game`, `philosophy`,
  `brazilian-folklore`, `educational-game`, `pt-br`
- **Social preview** (Settings → General): suba o `capa.png`. É a imagem que aparece
  quando alguém compartilha o link do repositório.
- **Releases** → **Create a new release**: tag `v9.0`, título "A Coroa de Ferro — versão 9",
  e anexe o zip do jogo. Assim qualquer pessoa baixa a versão pronta para rodar offline.

---

# O que tem dentro deste pacote

```
index.html            o jogo publicado, pronto para servir
capa.png              1200×630, imagem do link compartilhado
icone.png             512×512, ícone da aba e do atalho no celular
manifest.json         faz abrir em tela cheia no celular
robots.txt            libera a indexação
README.md             a vitrine do projeto
LICENSE               MIT, para o código
LICENSE-CONTEUDO.md   CC BY-NC-SA, para história, arte e trilha
.gitignore
package.json
COMO-SUBIR.md         este arquivo
src/coroa.html        a fonte que você edita
ferramentas/          check.js (sintaxe) e build.js (gera o index.html)
testes/               suíte em Playwright
unity/                a câmera 2D em C# que originou o projeto
docs/                 catálogo de armas e as imagens do README
```
