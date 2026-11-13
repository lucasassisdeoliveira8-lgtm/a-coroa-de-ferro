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

**Arsenal novo (novembro de 2026).** O arsenal antigo (espada, besta, bodoque, berrante...)
foi aposentado inteiro. O novo tem 19 armas de três origens — **folclore brasileiro**,
**ferramentas do povo** e **máquinas tomadas da Coroa** — e 6 únicas novas.

| Arma | Origem | Tipo | Comportamento |
|---|---|---|---|
| Facão de Mato | povo | perto | corte largo e rápido |
| Marreta da Forja | máquina | perto | golpe lento + onda de choque no chão |
| Lança de Pesca | povo | perto | estoca; segurando, é arremessada e volta na corda |
| Cauda do Boitatá | folclore | perto | chicote de fogo que deixa brasa |
| Berimbau de Luta | povo | perto | o terceiro golpe seguido solta uma onda de som |
| Manopla de Engrenagens | máquina | perto | socos rápidos; três seguidos atordoam |
| Boleadeira | povo | longe | prende o inimigo atingido |
| Tarrafa | povo | longe | rede em leque que deixa lento |
| Arco do Curupira | folclore | longe | carrega; a flecha faz a curva e acerta pelas costas (×1,6) |
| Estilingue de Forquilha | povo | longe | pedras que quicam nas paredes |
| Canto da Iara | folclore | longe | onda que atravessa e empurra |
| Garrafada | povo | longe | cada frasco sai fogo, veneno ou fumaça |
| Ferradura em Brasa | folclore | longe | vai e volta deixando brasa |
| Cuia de Pimenta | povo | longe | nuvem em cone que queima |
| Penas do Uirapuru | folclore | longe | penas teleguiadas, uma por inimigo |
| Muiraquitã | folclore | especial | sapinhos de jade orbitam o herói |
| Autômato Desobediente | máquina | especial | drone que atira sozinho e às vezes "discorda" do alvo |
| Olho da Torre | máquina | especial | feixe contínuo |
| Pião de Ferro | povo | especial | lançado no chão, gira 4 s acertando quem chega perto |

Iniciais de cada herói (a primeira arma achada na jornada é sempre a parceira):
Duarte — Facão + Marreta · Jandira — Arco do Curupira + Lança · Bento — Berimbau + Canto
da Iara · Ondina — Garrafada + Cuia de Pimenta.

Destravadas pela Ordem: Cauda do Boitatá, Manopla, Ferradura, Penas do Uirapuru,
Muiraquitã, Autômato, Olho da Torre e Pião. Quem já tinha armas antigas destravadas
recebe o mesmo número no arsenal novo (migração automática do salvamento).

**Raridade na própria arma:** comum de ferro fosco, incomum com bronze, rara de aço com
runa, épica com brilho roxo, lendária dourada com aura e brilho na ponta. O elemento pinta
o fio da lâmina. Projéteis têm a forma da arma (flecha, pedra, rede, pena, frasco...) e as
armas de perto deixam rastro de golpe.

**Nomes:** o adjetivo entra depois da primeira palavra ("Facão Teimoso de Mato"); com
elemento, vira adjetivo de elemento ("Arco Gélido do Curupira"). Nada de "de... de... de".

**Únicas (sempre lendárias, no máximo duas por jornada, do mundo 2 em diante):** Facão do
Cangaceiro (derrubar acelera o próximo golpe), Arpão do Velho Chico (arremessado, puxa o
inimigo), Marreta do Ferreiro Sem Rei (choque maior e raio que pula), Boleadeira dos Pampas
(três de uma vez), Garrafada da Benzedeira (às vezes cura), O Autômato Que Disse Não
(escolhe o alvo mais perigoso e não erra).

Brasas e poças do mesmo tipo **não se somam** num inimigo (antes, dez brasas queimavam dez
vezes).

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
| Sócrates | Vida Examinada (+60% no 1º golpe) | Certeza Precoce (some a barra de vida) |
| Aristóteles | Meio-Termo (40–70% de vida: +25% dano, −15% recebido) | Desmedida (+20% cadência, −precisão) |
| Kant | Fim em Si (cura adianta a habilidade) | Cálculo Frio (+15% dano, cura trava em 60%) |
| Bauman | Laço Firme (escudo ao limpar sala) | Vínculo Líquido (−40% moedas, mercador +30%) |

### Revisão filosófica (novembro de 2026)

Um professor de filosofia leu os encontros e apontou perguntas e respostas que não se
sustentavam. A revisão seguiu três regras, que valem daqui em diante:

1. **Nenhuma citação inventada.** As frases da travessia atribuídas a Sócrates,
   Aristóteles, Kant e Bauman agora são todas reais e trazem a obra de onde vêm. Saíram,
   entre outras, "a excelência não é um ato, é um hábito" (é de Will Durant, não de
   Aristóteles) e "só sei que nada sei" (fórmula popular que não está em Platão).
2. **A resposta certa tem que ser a do próprio pensador**, não uma leitura moderna posta
   na boca dele. Por isso o encontro de Aristóteles sobre ferramentas virou o argumento da
   função (Ética a Nicômaco I.7): o próprio Aristóteles imaginou ferramentas que
   trabalhassem sozinhas, então "substituir quem usa" não era o erro dele.
3. **A resposta "meio" tem que ser meio certa**, não só errada de outro jeito.

Mudanças maiores: Kant 4 (a resposta certa era o próprio imperativo, um raciocínio
circular; agora são três regras concretas e o teste em dois degraus), Aristóteles 3
(argumento da função), Aristóteles 4 (a máquina pode ser amiga?), Bauman 1 (pergunta de
entendimento, não de nome), Bauman 2 (a resposta errada não condena mais sair de relação
que faz mal) e a terceira refutação final, que agora responde à frase da Coroa "não há
maldade em mim: há aritmética". O bônus de Sócrates deixou de se chamar "Dúvida Metódica",
expressão de Descartes, e virou "Vida Examinada" (Apologia 38a). O termo de Bauman em
Modernidade e Holocausto é "responsabilidade flutuante", não "irresponsabilidade".

## Inimigos-ideia (novembro de 2026)

Um por mundo, ligado a um pensador, nas fases 2 e 4 (primeira sala de combate). Levam o
selo do pensador na cabeça e, na primeira vez, um aviso com a regra.

- **Sofista de Bronze** (mundo 1, Sócrates) — a "certeza" segura todo golpe. Chegando perto,
  **E/USAR** abre uma pergunta com três opções; a pergunta socrática (pedir a definição,
  testar a coerência) quebra a certeza por 8 s e ele leva +50%. A errada cura 30% dele.
- **Desmedido de Ferro** (mundo 2, Aristóteles) — dois anéis no chão marcam o meio-termo
  (95–215 px). Dentro dele, +70% de dano. De longe, só 45%. Fugir enche a **fúria**
  (mais velocidade e dano); ficar na medida esvazia.
- **Calculista da Coroa** (mundo 3, Kant) — acorrenta até três inimigos e passa o dano para
  eles. **E/USAR** perto de um acorrentado **liberta** (some da luta, cura 1 coração, solta
  energia). Sem correntes, ele fica exposto.

## Ecos: escolhas com consequência

As respostas de cada mundo mudam o seguinte. Ao chegar num mundo novo aparece a tela
**"O que você disse ecoou"**. Resposta boa → Sócrates: aliado *Aprendiz de Atenas* (atira
perguntas o mundo inteiro); Aristóteles: *Oficina de Estagira* (forja na fase 1); Kant:
*Arquivo de Königsberg* (biblioteca na fase 1); Bauman: mercador 25% mais barato. Resposta
ruim → a ideia do mundo chega mais forte (Bauman: mercador 20% mais caro). "Meio" não muda
nada. O pensador seguinte abre a conversa lembrando da sua última resposta.

## Seis finais

1. **A Ordem de Ferro** — aceitar a oferta.
2. **A Mosca de Váldria** — aceitar com 4+ de sabedoria (Sócrates como moscardo, Apologia).
3. **Váldria Incerta** — recusar e derrubar a máquina.
4. **Váldria Reconstruída** — derrubar tendo libertado 2+ acorrentados e com 3+ respostas boas.
5. **A Coroa Nova** — derrubar depois de 2+ respostas ruins a mais que boas: você vira a coroa.
6. **A Coroa Refutada** (verdadeiro) — 5+ sabedoria e três argumentos certos.

O jogo guarda quais finais você já viu ("3 de 6 finais encontrados").

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
