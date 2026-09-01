using UnityEngine;

/// <summary>
/// Define os limites de camera de uma sala.
///
/// Como usar:
///   1. Crie um GameObject vazio no centro da sala (ex.: "Sala_1-1_Limites").
///   2. Adicione um BoxCollider2D e marque "Is Trigger".
///   3. Ajuste o tamanho do collider ate cobrir o chao jogavel da sala.
///   4. Adicione este script.
///
/// Quando o jogador entra no trigger, a camera passa a respeitar esses limites.
/// Salas menores que a tela sao automaticamente centralizadas.
/// </summary>
[RequireComponent(typeof(BoxCollider2D))]
[AddComponentMenu("Coroa de Ferro/Camera Room 2D")]
public class CameraRoom2D : MonoBehaviour
{
    [Tooltip("Tag do jogador que ativa esta sala.")]
    [SerializeField] private string playerTag = "Player";

    [Tooltip("Se ligado, a camera pula direto para a nova posicao ao entrar. " +
             "Bom para salas separadas por porta; ruim para salas conectadas por corredor.")]
    [SerializeField] private bool snapAoEntrar = false;

    [Tooltip("Se ligado, aplica os limites assim que a cena carrega (util na sala inicial da fase).")]
    [SerializeField] private bool aplicarNoStart = false;

    [Tooltip("Margem extra (em unidades) alem do collider. Negativa aperta a camera.")]
    [SerializeField] private float margem = 0f;

    private BoxCollider2D _box;

    private void Awake()
    {
        _box = GetComponent<BoxCollider2D>();
        _box.isTrigger = true;
    }

    private void Start()
    {
        if (aplicarNoStart) Aplicar(true);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag(playerTag)) return;
        Aplicar(snapAoEntrar);
    }

    /// <summary>Envia os limites desta sala para a camera. Pode ser chamado por script.</summary>
    public void Aplicar(bool snap)
    {
        CameraFollow2D cam = CameraFollow2D.Instance;
        if (cam == null) return;

        cam.SetBounds(CalcularLimites(), snap);
    }

    /// <summary>Limites em coordenadas de mundo, ja considerando escala e margem.</summary>
    public Bounds CalcularLimites()
    {
        if (_box == null) _box = GetComponent<BoxCollider2D>();

        Vector3 escala = transform.lossyScale;
        Vector2 tamanho = new Vector2(
            Mathf.Abs(_box.size.x * escala.x) + margem * 2f,
            Mathf.Abs(_box.size.y * escala.y) + margem * 2f);

        Vector3 centro = transform.TransformPoint(_box.offset);

        return new Bounds(new Vector3(centro.x, centro.y, 0f), new Vector3(tamanho.x, tamanho.y, 0.1f));
    }

    private void OnDrawGizmos()
    {
        BoxCollider2D box = _box != null ? _box : GetComponent<BoxCollider2D>();
        if (box == null) return;

        Bounds b = CalcularLimites();
        Gizmos.color = new Color(0.2f, 0.9f, 1f, 0.55f);
        Gizmos.DrawWireCube(b.center, new Vector3(b.size.x, b.size.y, 0.1f));
    }
}
