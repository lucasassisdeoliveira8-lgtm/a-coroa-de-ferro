# Câmera 2D Top-Down — A Coroa de Ferro

Câmera inspirada em Soul Knight: vista de cima, sem rotação, zoom fixo,
acompanhamento suave e um leve deslocamento vertical que dá a sensação
de inclinação.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `CameraFollow2D.cs` | O coração. Vai na Main Camera. |
| `CameraRoom2D.cs` | Define os limites de câmera de cada sala. |
| `CameraPortal2D.cs` | Portal de troca de fase (1-1 → 1-2 → … → 3-5). |
| `ScreenFader.cs` | Fade preto opcional durante a troca de fase. |

Copie os quatro para `Assets/Scripts/Camera/` no seu projeto Unity.

---

## Passo a passo (URP 2D)

### 1. A câmera

1. Selecione a **Main Camera**.
2. No componente `Camera`:
   - **Projection**: `Orthographic`
   - **Size**: `7.5`
   - **Clear Flags / Background Type**: `Solid Color` (evita rastro de sprite nas bordas)
3. Position Z = `-10`.
4. Rotation = `0, 0, 0` — **não** incline a câmera de verdade. Em 2D isso quebra
   o sorting dos sprites. A "inclinação" do Soul Knight vem da **arte**, não da câmera.
5. Adicione o componente **Camera Follow 2D**.
6. Arraste o jogador para o campo **Target** (ou deixe vazio e marque o jogador
   com a Tag `Player` — o script acha sozinho).

### 2. Os limites de sala

Para cada sala da fase:

1. GameObject vazio no centro da sala → nome tipo `Sala_1-1_Limites`.
2. Adicione **Box Collider 2D** e marque **Is Trigger**.
3. Ajuste o tamanho até cobrir o chão jogável.
4. Adicione **Camera Room 2D**.
5. Na primeira sala da fase, marque **Aplicar No Start**.

O gizmo azul no Scene View mostra exatamente até onde a câmera vai chegar.

### 3. O portal

1. GameObject no portal, com **Collider 2D** marcado como **Is Trigger**.
2. Adicione **Camera Portal 2D**.
3. Dois jeitos de usar:
   - **Mesma cena**: preencha `Destino` (ponto de spawn da próxima sala) e
     `Sala De Destino` (o `CameraRoom2D` de lá).
   - **Cena nova / sala procedural**: deixe `Destino` vazio e ligue o seu
     gerenciador de fases no evento `Ao Atravessar`.

### 4. O fade (opcional)

GameObject vazio chamado `ScreenFader` + componente **Screen Fader**. Só isso.
Ele monta o próprio Canvas em runtime e sobrevive à troca de cena.

---

## Valores recomendados

| Campo | Valor | Por quê |
|---|---|---|
| `Vertical Bias` | `0.6` | Jogador um pouco abaixo do centro = "leve inclinação". |
| `Smooth Time` | `0.16` | Colada o bastante para mirar, suave o bastante para não enjoar. |
| `Dead Zone Radius` | `0.15` | Mata o micro-tremor de física sem parecer travada. |
| `Orthographic Size` | `7.5` | ~30 × 15 unidades visíveis em 16:9. Boa leitura de sala. |
| `Look Ahead Distance` | `1.8` | Mostra o que vem pela frente sem desorientar. |
| `Look Ahead Smooth Time` | `0.35` | **Sempre maior que o Smooth Time**, senão vibra. |
| `Max Speed` | `40` | Teto de segurança para dashes e knockback. |

Se o seu personagem corre muito rápido, suba `Look Ahead Distance` para `2.5`
e `Smooth Time` para `0.12`.

---

## Por que não treme

Cinco decisões no código evitam tremor — vale saber, para não desfazer sem querer:

1. **`LateUpdate`**, não `Update`. A câmera só se move depois que o jogador
   já terminou de andar naquele frame.
2. **`SmoothDamp`**, não `Lerp`. `Lerp` com `deltaTime` varia conforme o FPS;
   `SmoothDamp` guarda velocidade e chega macio, sempre igual.
3. **Dead zone contínua**. Em vez de congelar a câmera dentro do raio, ela
   persegue só o que ultrapassa o raio. Não existe o "liga/desliga" que causa soluço.
4. **Look-ahead mais lento que o follow**. Se o look-ahead reagisse mais rápido
   que a câmera, os dois brigariam e o resultado seria vibração.
5. **Zoom travado**. `orthographicSize` é reescrito todo frame com um valor
   constante — nada no jogo consegue mexer no zoom por acidente.

### Se ainda tremer

- Está usando `Rigidbody2D` no jogador? Coloque **Interpolate = Interpolate**
  no Rigidbody. É a causa nº 1 de tremor em 2D.
- Está usando **Pixel Perfect Camera**? Ela faz snap de pixel, e snap + suavização
  brigam. Ou desligue o componente, ou aumente o `Dead Zone Radius` para `0.3`.
- Sprites com `Filter Mode = Point` e `Compression = None` evitam "cintilação"
  de borda durante o movimento.

---

## Chamando por script

```csharp
// Trocar de personagem (Cavaleiro → Arqueira → Monge → Alquimista)
CameraFollow2D.Instance.SetTarget(novoPersonagem.transform, snap: true);

// Entrou na sala do boss: limites novos, sem deslizar até lá
CameraFollow2D.Instance.SetBounds(salaDoBoss.CalcularLimites(), snap: true);

// Portal levou para outra fase
CameraFollow2D.Instance.TeleportTo(pontoDeSpawn.position);

// Área aberta (bioma de mata, por exemplo): sem limites
CameraFollow2D.Instance.ClearBounds();
```

---

## Próximos passos naturais

Quando a câmera estiver no ponto, os ganchos mais úteis para o seu jogo são:

- **Camera shake** para impacto de boss — deixei de fora de propósito, porque
  você pediu sem tremores. Quando quiser, o lugar certo é somar um offset de
  ruído **depois** do `SmoothDamp`, dentro do `LateUpdate`, nunca antes.
- **Zoom-out momentâneo** na entrada do boss. Anime `orthographicSize` com
  `SetOrthographicSize()` numa coroutine e volte ao valor original — nunca em `Update`.
- **Foco em diálogo**: quando o jogador falar com Sócrates, Kant, Aristóteles ou
  Bauman, use `SetTarget()` num Transform vazio entre o jogador e o filósofo,
  e volte para o jogador ao fim da conversa.
