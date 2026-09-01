using System.Collections;
using UnityEngine;
using UnityEngine.Events;

/// <summary>
/// Portal de troca de fase / sala (1-1 -> 1-2 -> ... -> 1-5 boss).
///
/// Funciona em dois modos:
///
///   1. Destino na mesma cena (destino preenchido)
///      Move o jogador para o ponto de destino, reposiciona a camera
///      instantaneamente e aplica os limites da nova sala.
///
///   2. Sem destino (destino vazio)
///      Apenas dispara o evento aoAtravessar, onde voce chama o seu
///      gerenciador de fases (carregar cena, gerar sala procedural, etc.).
///
/// Coloque num GameObject com Collider2D marcado como "Is Trigger".
/// </summary>
[RequireComponent(typeof(Collider2D))]
[AddComponentMenu("Coroa de Ferro/Camera Portal 2D")]
public class CameraPortal2D : MonoBehaviour
{
    [Header("Destino")]
    [Tooltip("Ponto onde o jogador reaparece. Deixe vazio para usar apenas o evento.")]
    [SerializeField] private Transform destino;

    [Tooltip("Limites de camera da sala de destino. Opcional.")]
    [SerializeField] private CameraRoom2D salaDeDestino;

    [Header("Ativacao")]
    [SerializeField] private string playerTag = "Player";

    [Tooltip("Impede que o portal dispare duas vezes seguidas.")]
    [SerializeField] private float cooldown = 0.75f;

    [Header("Fade (opcional)")]
    [Tooltip("Se ligado e existir um ScreenFader na cena, escurece a tela durante a troca.")]
    [SerializeField] private bool usarFade = true;
    [SerializeField, Range(0.05f, 1.5f)] private float duracaoFade = 0.25f;

    [Header("Eventos")]
    [Tooltip("Disparado no meio da transicao, com a tela escura. Use para carregar a proxima fase.")]
    public UnityEvent aoAtravessar;

    private bool _emTransicao;
    private float _proximoUsoPermitido;

    private void Reset()
    {
        Collider2D col = GetComponent<Collider2D>();
        if (col != null) col.isTrigger = true;
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (_emTransicao) return;
        if (Time.time < _proximoUsoPermitido) return;
        if (!other.CompareTag(playerTag)) return;

        StartCoroutine(Atravessar(other.transform));
    }

    private IEnumerator Atravessar(Transform jogador)
    {
        _emTransicao = true;

        ScreenFader fader = usarFade ? ScreenFader.Instance : null;

        if (fader != null)
            yield return fader.FadeOut(duracaoFade);

        // Move o jogador.
        if (destino != null)
        {
            Rigidbody2D corpo = jogador.GetComponentInParent<Rigidbody2D>();
            if (corpo != null)
            {
                corpo.position = destino.position;
#if UNITY_6000_0_OR_NEWER
                corpo.linearVelocity = Vector2.zero;
#else
                corpo.velocity = Vector2.zero;
#endif
            }
            else
            {
                jogador.position = destino.position;
            }
        }

        // Avisa o resto do jogo (carregar cena, gerar sala, tocar musica...).
        aoAtravessar?.Invoke();

        // Reposiciona a camera sem deslizar pelo mapa inteiro.
        CameraFollow2D cam = CameraFollow2D.Instance;
        if (cam != null)
        {
            if (salaDeDestino != null)
                cam.SetBounds(salaDeDestino.CalcularLimites(), false);

            cam.SnapToTarget();
        }

        // Espera um frame para a fisica e a camera assentarem antes de clarear.
        yield return null;

        if (fader != null)
            yield return fader.FadeIn(duracaoFade);

        _proximoUsoPermitido = Time.time + cooldown;
        _emTransicao = false;
    }

    private void OnDrawGizmos()
    {
        Gizmos.color = new Color(0.35f, 0.85f, 1f, 0.9f);
        Gizmos.DrawWireSphere(transform.position, 0.5f);

        if (destino != null)
        {
            Gizmos.DrawLine(transform.position, destino.position);
            Gizmos.DrawWireCube(destino.position, Vector3.one * 0.4f);
        }
    }
}
