# A Coroa de Ferro — publicação

## NO AR

### 🎮 https://a-coroa-de-ferro.vercel.app

Verificado por requisição anônima: o jogo carrega, o menu aparece, a capa é servida, e as
meta tags de Open Graph batem com o domínio real. Deploy `dpl_BPta59TLgZitQFxnCdgLR1obsQQg`,
estado **READY**, alvo production, a partir do commit `ede89c6`.

### 📦 https://github.com/lucasassisdeoliveira8-lgtm/a-coroa-de-ferro

Público, README renderizando com imagens, descrição e Website preenchidos, 30 arquivos,
todas as subpastas.

**Os dois estão ligados**: cada commit no GitHub republica o jogo sozinho, sempre no mesmo
endereço. Acabou a necessidade de reenviar arquivo.

| | |
|---|---|
| Time Vercel | `lucas-franceschi-assis-de-oliveira` (`team_LoHa4D7ZjQ2gxKTkP2VNrmvB`), hobby |
| Projeto | `a-coroa-de-ferro` (`prj_QaOCI4lrVSEplZtPUTAMQ97GdDn1`) |
| Domínio de produção | `a-coroa-de-ferro.vercel.app` |
| Painel | https://vercel.com/lucas-franceschi-assis-de-oliveira/a-coroa-de-ferro |

**Sempre divulgar o domínio de produção.** As URLs geradas de deploy (as compridas, com
hash) são protegidas por Vercel Authentication no plano Hobby e redirecionam para
`vercel.com/login`.

---

## Pendências opcionais

- **`ferramentas/check.js`** — grava em `/tmp/bundle.js`, que não existe no Windows, então
  `npm run check` falha no computador do Lucas. `npm run gerar` funciona normalmente.
- **`testes/tut.js`** — a bíblia lista oito testes e o repositório tem sete; esse nunca
  subiu no arrasto e não há cópia para recriar.

Resolvidos: `.gitignore` criado, `build.js` corrigido (caminhos relativos, constante
`SITE`, Open Graph, registro do service worker, quebra de linha final) e **GitHub Pages
ativado** — segundo endereço em https://lucasassisdeoliveira8-lgtm.github.io/a-coroa-de-ferro/

---

## O bug que travou o deploy (resolvido)

O `package.json` que montei tinha um script chamado **`build`**. A Vercel roda
`npm run build` sozinha sempre que encontra esse nome — mesmo com o campo Build Command
vazio no painel. Esse script chamava `ferramentas/build.js`, que tinha caminho absoluto do
contêiner (`/root/CoroaDeFerro/web/coroa.html`), inexistente no servidor. Log real:

```
Error: ENOENT ... open '/root/CoroaDeFerro/web/coroa.html'
    at /vercel/path0/ferramentas/build.js:2:14
Error: Command "npm run build" exited with 1
```

**Correção aplicada**: renomear o script de `build` para `gerar`. Sem esse nome, a Vercel
não tenta compilar e publica os arquivos como site estático — que é o correto, porque o
`index.html` já vai pronto no repositório.

**Regra permanente**: neste projeto, nunca criar um script chamado `build` no
`package.json`. Para regerar o `index.html` depois de editar o jogo: `npm run gerar`.

---

## Fluxo de trabalho daqui em diante

1. Editar `src/coroa.html`
2. `npm run gerar` (regera o `index.html`; o endereço do site está numa constante `SITE`
   no topo do `ferramentas/build.js`)
3. Se o jogo mudou de verdade, trocar `VERSAO` no topo do `sw.js`
   (`coroa-v9` → `coroa-v10`) e commitar junto
4. Commitar no GitHub — pelo site ou por Git
5. A Vercel republica sozinha em 1–2 minutos

---

## Como trabalhamos (combinado com o Lucas)

**Toda mudança no jogo é publicada na mesma sessão.** Não deixar alteração parada
esperando: editar, regerar, commitar e conferir o site no ar antes de dar a tarefa por
encerrada. Não são dois lugares para atualizar — a Vercel observa o GitHub e republica
sozinha; publicar é commitar no `main` e depois abrir o site para confirmar.

Como o Claude escreve no repositório: só pela extensão do Chrome, com o Lucas logado no
GitHub. A rede da sessão bloqueia CLI da Vercel e escrita pela API do GitHub (ver seção
abaixo). Quando a extensão estiver fora do ar, entregar os arquivos prontos e avisar.

Mudanças no `src/coroa.html` precisam ser cirúrgicas — trocar um valor, uma função, um
bloco. O caminho seguro é buscar o arquivo do próprio repositório pelo navegador, aplicar
a troca ali e conferir que o resultado bate com o testado no contêiner antes de colar.
Reescrever o arquivo inteiro não dá: são 337 KB e não há como enviar arquivo do contêiner
para a máquina do Lucas.

---

## Service worker e instalação como aplicativo

O `sw.js` na raiz é o que faz o jogo instalar como app e abrir sem internet. O registro
dele é injetado pelo `build.js`, então sai pronto no `index.html` a cada `npm run gerar`.
A versão offline de arquivo único não leva o registro, de propósito — arquivo solto não
tem servidor.

**Ao publicar versão nova: trocar `VERSAO` no topo do `sw.js`.** `coroa-v9` →
`coroa-v10` e assim por diante.

Não é emergência. A página usa rede primeiro, então quem está online recebe o jogo novo
com ou sem a troca; o ícone e o manifesto vêm do cache e se atualizam por baixo, no
máximo aparecendo velhos uma vez. Trocar o número é higiene: apaga o cache antigo na
hora em vez de deixar sobras no aparelho.

Verificado no ar em 04/09/2026: service worker registrado, ativo e controlando a página,
cache `coroa-v9` com a raiz, o `index.html`, o ícone e o manifesto.

**Divulgar e instalar sempre pelo endereço da Vercel.** O `manifest.json` aponta para a
raiz, e no GitHub Pages o jogo mora numa subpasta — lá o ícone, a capa e a instalação
não funcionam, embora o jogo rode.

---

## O que esta sessão não conseguiu fazer, e por quê

Vale registrar para não se tentar de novo:

- **Deploy pela CLI da Vercel**: a rede do contêiner bloqueia todos os hosts `vercel.com`.
  A CLI instala, mas login e deploy falham com `fetch failed`.
- **`deploy_to_vercel` (MCP)**: exige o conteúdo dos arquivos inline na chamada; o
  `index.html` tem 340 KB.
- **Qualquer escrita no GitHub**: o proxy da sessão bloqueia endpoints de repositórios não
  pré-configurados — testado com token válido, token falso e sem token, e até um repositório
  público de terceiros dá 403. **Não é problema de credencial**: um token pessoal do usuário
  não resolveria. A mensagem de erro cita uma ferramenta `add_repo`, que não existe nesta
  sessão.

**O que funciona daqui**: as ferramentas MCP de leitura da Vercel (projetos, deploys,
domínios, logs de build, proteção) e o WebFetch anônimo para conferir o que está no ar.
Foi assim que o bug do build foi diagnosticado a partir do log real.

---

## Materiais de apoio publicados

- **Arsenal de Váldria** — catálogo das 25 armas:
  https://claude.ai/code/artifact/5e8d4aa0-4684-403e-86de-9794ee4b9c0b
- **Ética em Váldria** — dossiê para apresentação escolar:
  https://claude.ai/code/artifact/5b9fe665-ba97-4cb2-bfdc-5a52f9d2abbe
- **Jogo como artifact** (privado, serve para testar):
  https://claude.ai/code/artifact/38b4fd9f-e700-4bce-8abe-0272259781d2
