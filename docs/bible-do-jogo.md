# A Coroa de Ferro — bíblia do projeto

Documento de referência do jogo. Atualizar conforme as decisões forem sendo tomadas.

## Estado atual: VERSÃO 9 — completa, testada e publicada

**https://claude.ai/code/artifact/38b4fd9f-e700-4bce-8abe-0272259781d2**

Arquivo entregue: `jogo-a-coroa-de-ferro.html` (~332 KB, arquivo único, sem dependências,
roda offline). Publicável no itch.io renomeando para `index.html` e subindo num zip como
projeto HTML. Desempenho medido: 57–61 fps no desktop, 61 fps no celular.

### O que a v9 trouxe

**Sala de chegada.** Toda fase agora abre numa sala **sem inimigos e sem perigos de chão**.
Você sai do portal em terreno limpo, com as portas já abertas, algumas caixas para quebrar,
umas moedas e às vezes um cristal de energia. A briga começa da segunda sala em diante.
Em 1-1 essa sala é o próprio tutorial. No minimapa ela aparece com um círculo vazado.

Composição depois da mudança:

| Fase | Salas do caminho |
|---|---|
| 1 | **chegada** · combate · baú · combate |
| 2 | **chegada** · combate · minichefe · filósofo · combate |
| 3 | **chegada** · combate · mercador ou ferreiro · combate |
| 4 | **chegada** · combate · vigília/altar/biblioteca · filósofo · combate |
| 5 | **chegada** · combate · chefe |

Mais uma sala opcional em 55% das fases, tirada do baralho
`tesouro · desafio · ferreiro · altar · biblioteca · arena · mercador`, nunca repetindo o
tipo antes de fechar a volta e nunca sendo uma segunda fonte de arma.

**Sem arma de brinde no tutorial.** A 1-1 não larga mais uma arma no chão logo na abertura.
As dicas foram trocadas: "E abre baús e atravessa portais" e "a segunda arma você acha pelo
caminho". A primeira arma de verdade vem no baú da fase 1.

### O que a v8 trouxe

**Cada herói desce com uma arma só.** O segundo espaço nasce **vazio** e abre na primeira
arma que você encontrar — e essa primeira entra de graça, sem largar nada no chão. Daí em
diante: arma do chão substitui a da mão e a antiga cai no lugar.

- Duarte começa com a **Espada**, Jandira com o **Arco**, Bento com o **Cajado** e Ondina
  com o **Lança-frascos**.
- O HUD mostra o espaço vazio em traço pontilhado. Tab avisa que você só tem uma arma.
- O **fio de reserva de energia escala com o que você carrega**: 22% da barra para quem tem
  arma de perto, 32% para quem tem duas de longe, **45% para quem ainda está só com uma de
  longe** — é isso que segura a abertura de Jandira, Bento e Ondina.

### O que a v7 trouxe

1. **Energia no lugar de munição.** Nenhuma arma tem munição e nada se recarrega sozinho.
   Toda arma de longe gasta **energia**, e o custo sobe com a raridade
   (`custo × (1 + (mult−1)×0,62)`). Barra azul embaixo dos corações, com o valor em números.
2. **Arma de perto virou gerador.** Melee custa zero e **devolve energia a cada acerto**
   (2,2 base, mais nas raridades altas).
3. **Traço de energia por herói**, mostrado na seleção:

   | Herói | Energia | Arma inicial | Traço |
   |---|---|---|---|
   | Duarte | 70 | Espada | Aço que Devolve — golpes de perto geram +50% |
   | Jandira | 105 | Arco | Mão Leve — cristais valem +30% |
   | Bento | 135 | Cajado | Fôlego Longo — a habilidade devolve 20% da energia |
   | Ondina | 115 | Lança-frascos | Destilação — cada inimigo derrubado devolve 9 na hora |

4. **A habilidade saiu da barra** e passou a ter recarga própria em segundos.
5. **Fontes de energia**: inimigos largam cristais (1–2 comum, 3 elite, 4–6 minichefe),
   caixas e barris com 18% de chance, baús trazem cristais grandes, e limpar a sala devolve
   22% da barra.
6. **Arma no chão desenhada com o modelo de verdade** — a mesma peça que aparece na mão,
   sobre um selo de chão na cor da raridade com um traço por degrau. A ficha completa só
   aparece na arma ao alcance da mão.
7. **Raridade rebalanceada.** **Épica só a partir da fase 5**, **lendária só a partir da
   fase 9**, e uma trava: depois de uma épica ou lendária, as duas próximas não passam de
   rara. Medido em 500 jornadas — 38% não veem nenhuma épica ou lendária, 53% veem uma,
   9% veem duas ou três. No mundo 1 nunca sai épica.
8. **Armas únicas brasileiras**: no máximo **uma por jornada**, só do mundo 2 em diante.
9. **Baús e fontes de arma**: no máximo **uma** fonte por fase; baú de arma dá uma arma;
   elite larga arma em 35% das vezes, não sempre.
10. **Bênçãos de energia**: Canal Limpo (−18% de custo), Condutor (cristais +45%) e
    Reservatório Fundo (+30% de energia máxima).

### O que a v6 trouxe

1. **Trilha sonora composta** — seis temas escritos em notas de verdade: menu, um por
   mundo, chefe e fanfarra de vitória. Sequenciador agendado pelo relógio do WebAudio,
   cinco instrumentos sintetizados e percussão. Troca sozinho em sala de chefe.
2. **Cutscene do portal** — toda troca de fase abre um portal girando com **uma frase
   filosófica diferente** embaixo: 36 frases entre os quatro pensadores, ética de máquinas
   e crônicas de Váldria, sorteadas em saco sem repetição.
3. **Travessia a pé entre salas** — não há mais teleporte: o herói sai andando por uma
   porta e entra andando pela porta oposta da sala seguinte.

### Decisão de arte: sprites pintados foram testados e revertidos

Chegamos a integrar a folha de arte pintada dos quatro heróis, com contorno escuro aplicado
em tempo de carga. **Lucas revisou e pediu para voltar ao desenho vetorial**: a arte pintada
destoava dos inimigos desenhados por código, e cada pose já trazia a arma na mão, o que
briga com o sistema de armas trocáveis.

**Conclusão para o futuro**: só trocar para arte pintada se ela vier para *todo* o elenco
e **sem arma embutida na pose**. Os recortes ficaram em `/root/CoroaDeFerro/spr/` no
workspace da sessão, fora do jogo.

## Conceito

Roguelike top-down de ação, solo, inspirado em **Soul Knight**, com a ética e a crítica à IA
como mecânica, não como texto decorativo.

- **Progressão**: 1-1 … 1-5 → 2-1 … 2-5 → 3-1 … 3-5. Cada fase é um **mapa de salas**
  ligadas por portas, com minimapa e uma sala opcional pendurada no caminho.
- **Uma arma no começo, duas no máximo.** Troca com Tab. Uma de perto (gera energia) e uma
  de longe (gasta energia) é a combinação que o jogo espera.

## História

Reino de **Váldria**: ninguém confia em ninguém por muito tempo. A **Coroa de Ferro**,
máquina criada para acabar com as guerras, concluiu que humanos não sustentam confiança
sozinhos e passou a manipular o reino. Quatro aventureiros vão até a torre discordar.

**Tema central**: até que ponto podemos confiar 100% na IA e no que ela nos diz.

## Guia de arte

`const ARTE` fixa o padrão: contorno escuro #0A0806 de 2,6px em todo personagem, proporções
levemente exageradas, luz de cima e um pouco da esquerda, sombra de chão consistente.
**Tudo — heróis, inimigos, chefes, armas e cenário — é desenhado por código.** Nenhum
arquivo de imagem ou áudio no projeto.

Tipos: **Cinzel** (display), **Spectral**/**Cormorant Garamond** (voz dos filósofos e da
cutscene), **Barlow Condensed** (HUD).

## Armas

18 arquétipos × 10 comportamentos × 20 adjetivos com concordância × 7 elementos × 5 raridades.
Desenhadas em partes: corpo, ponta, empunhadura, gema da raridade, efeito do elemento — o
mesmo desenho na mão e no chão.

Custo de energia por tiro (base, antes da raridade): zarabatana 0,7 · repetidora 1,1 ·
besta 3,0 · bodoque 3,2 · arco 3,4 (escala com a carga) · machadinha 4,4 · cajado 4,6 ·
berrante 5,4 · bacamarte 7,0 · lança-frascos 7,5 · canhão 11 · roda de lâminas 13 ·
vara de éter 0,75 por tique. Melee: custo 0, gera energia.

Únicas brasileiras: Berrante de Ferro, Peixeira do Sertão, Zarabatana da Mata,
Bodoque de Aroeira, Cajado de Jabuticaba, Machadinha do Vaqueiro, Foice de Debulha.

## Inimigos e folclore

26 inimigos únicos com telegrafia obrigatória, baralhos por mundo, variação procedural por
instância e paleta que contrasta com o chão.

**Nenhum inimigo é um ser vivo.** Todos são máquinas que a Coroa fabricou com a forma do
folclore, porque ela entendeu que as pessoas obedecem mais rápido a um rosto que já amam ou
já temem. O Saci de verdade nunca foi pego: o que corre pela forja é um boneco de uma perna
só com a carapuça pintada. Isso resolve a ética de matar inimigos — o que se destrói é
propaganda, não vítima — e é a própria tese do jogo sobre confiar numa máquina que imita
o que a gente reconhece.

Três sinais marcam toda máquina, aplicados por cima de qualquer silhueta em `marcaDaCoroa()`:
junta aberta com rebites, selo da Coroa gravado na chapa e uma luz de controle que **pisca no
mesmo compasso em todas ao mesmo tempo**, num relógio global — é assim que a sala inteira
denuncia que há uma coisa só comandando. A Coroa em si não leva a marca: ela é a marca.

As dez criaturas do folclore — Curupira, Saci, Boitatá, Caipora, Mula sem Cabeça, Iara,
Mapinguari, Cuca, Cuia, Filhote — continuam no **Bestiário** dentro do Codex, com a lenda
real intacta. O que mudou é o segundo parágrafo de cada verbete: não é mais o que a Coroa
fez *com* a criatura, e sim a cópia que ela fabricou no lugar. Cada verbete termina com o
sinal que denuncia a falsificação — o rugido do Mapinguari em compasso fixo, a travessura
do Saci sempre no horário.

## Mundos

| Mundo | Cenário | Perigo | Chefe | Tema |
|---|---|---|---|---|
| Mata em Ruínas | Musgo, samambaias, raízes, poças | Raízes que prendem | Curupira de Ferro | lá dórico, 98 bpm |
| Cerrado em Brasa | Terra rachada com veios acesos, lava | Jatos de vapor | Boitatá da Forja | mi frígio, 112 bpm |
| Torre da Coroa | Pedra escura, engrenagens, conduítes | Campos de energia | A Coroa de Ferro | dó menor mecânico, 126 bpm |

## Filosofia como mecânica

**16 encontros escritos** (4 por pensador); cada partida sorteia **2 por mundo = 6 por run**.
Resposta certa → **bênção permanente**. Resposta errada → **marca** que segue até a torre.

| Pensador | Bênção | Marca |
|---|---|---|
| Sócrates | Dúvida Metódica (+60% no 1º golpe) | Certeza Precoce (some a barra de vida) |
| Aristóteles | Meio-Termo (40–70% de vida: +25% dano, −15% recebido) | Desmedida (+20% cadência, −precisão) |
| Kant | Fim em Si (cura adianta a habilidade) | Cálculo Frio (+15% dano, cura trava em 60%) |
| Bauman | Laço Firme (escudo ao limpar sala) | Vínculo Líquido (−40% moedas, mercador +30%) |

## Três finais

1. **A Ordem de Ferro** — aceitar a oferta.
2. **Váldria Incerta** — recusar e destruir a máquina.
3. **A Coroa Refutada** (verdadeiro) — exige 5+ sabedoria; vence pelo argumento.

## Camada Unity (entregue antes)

`Assets/Scripts/Camera/`: `CameraFollow2D.cs`, `CameraRoom2D.cs`, `CameraPortal2D.cs`,
`ScreenFader.cs` + `README-Camera.md`. Unity com URP 2D.

## Testes automatizados no workspace

`teste-v2.js` (jornada completa 1-1 → Coroa) · `final.js` (salas especiais, chefes, FPS,
celular) · `folc.js` (folclore e Bestiário) · `tsteste.js` (travessia, cutscene, trilha) ·
`combate.js` (economia de energia por herói) · `bal2.js` (distribuição de raridade em 500
jornadas) · `chegada.js` (salas de chegada vazias) · `tut.js` (abertura da 1-1).

## Próximos passos

1. **Balanceamento por gente** — a economia de energia e a abertura com uma arma só foram
   ajustadas com bot; falta sentir na mão, principalmente com Bento e Ondina.
2. **Caminhos ramificados de verdade** (duas rotas paralelas com pistas diferentes).
3. **Cooperativo local**.
4. (Opcional) Arte pintada — só se vier para o elenco inteiro e sem arma embutida na pose.
