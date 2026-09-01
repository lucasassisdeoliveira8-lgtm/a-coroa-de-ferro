using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

/// <summary>
/// Camera 2D top-down inspirada em Soul Knight.
///
/// Caracteristicas:
///  - Segue o jogador de forma suave (SmoothDamp), sem tremores.
///  - Nunca rotaciona e nunca muda o zoom sozinha.
///  - "Bias" vertical: o jogador fica levemente abaixo do centro da tela,
///    o que cria a sensacao de leve inclinacao vista de cima.
///  - Look-ahead: a camera desliza um pouco na direcao do movimento
///    (ou do mouse), mostrando mais do que vem pela frente.
///  - Limites de sala/mapa: trava nas bordas para nao mostrar o vazio.
///  - API publica para teleportar a camera quando o jogador entra no portal.
///
/// Coloque este script na Main Camera (Projection = Orthographic).
/// </summary>
[RequireComponent(typeof(Camera))]
[DisallowMultipleComponent]
[AddComponentMenu("Coroa de Ferro/Camera Follow 2D")]
public class CameraFollow2D : MonoBehaviour
{
    public enum LookAheadMode
    {
        Nenhum,
        Movimento,
        Mouse
    }

    // ------------------------------------------------------------------
    // Acesso rapido: CameraFollow2D.Instance
    // ------------------------------------------------------------------
    public static CameraFollow2D Instance { get; private set; }

    // ------------------------------------------------------------------
    [Header("Alvo")]
    [Tooltip("O Transform do jogador. Pode ser deixado vazio e definido em runtime com SetTarget().")]
    [SerializeField] private Transform target;

    [Tooltip("Se o alvo estiver vazio no Start, procura um objeto com esta Tag.")]
    [SerializeField] private string targetTagFallback = "Player";

    [Tooltip("Deslocamento fixo em relacao ao alvo (util se o pivo do sprite nao for o centro).")]
    [SerializeField] private Vector2 targetOffset = Vector2.zero;

    [Tooltip("Sobe a camera um pouco, deixando o jogador abaixo do centro. " +
             "E o que da a sensacao de 'leve inclinacao' do Soul Knight. 0.4 a 0.9 costuma ficar bom.")]
    [SerializeField, Range(-3f, 3f)] private float verticalBias = 0.6f;

    // ------------------------------------------------------------------
    [Header("Suavizacao")]
    [Tooltip("Tempo aproximado, em segundos, para a camera alcancar o alvo. " +
             "Menor = mais colada. Maior = mais preguicosa. 0.12 a 0.20 e o ponto doce.")]
    [SerializeField, Range(0.02f, 0.8f)] private float smoothTime = 0.16f;

    [Tooltip("Velocidade maxima da camera em unidades/segundo. Evita 'chicotadas' em teleportes curtos.")]
    [SerializeField] private float maxSpeed = 40f;

    [Tooltip("Raio, em unidades, onde o jogador pode se mexer sem a camera reagir. " +
             "Um valor pequeno (0.1 - 0.3) mata o micro-tremor de sprites e fisica.")]
    [SerializeField, Range(0f, 2f)] private float deadZoneRadius = 0.15f;

    // ------------------------------------------------------------------
    [Header("Zoom (fixo)")]
    [Tooltip("Metade da altura visivel em unidades do mundo. " +
             "7.5 mostra 15 unidades de altura (~30 de largura em 16:9).")]
    [SerializeField] private float orthographicSize = 7.5f;

    [Tooltip("Distancia da camera no eixo Z. Deve ser negativa em 2D.")]
    [SerializeField] private float zDistance = -10f;

    [Tooltip("Forca o tamanho ortografico todo frame. Deixe ligado para garantir zoom fixo.")]
    [SerializeField] private bool lockZoom = true;

    // ------------------------------------------------------------------
    [Header("Look-ahead (olhar a frente)")]
    [SerializeField] private LookAheadMode lookAheadMode = LookAheadMode.Movimento;

    [Tooltip("Quantas unidades a camera se adianta na direcao do movimento.")]
    [SerializeField, Range(0f, 6f)] private float lookAheadDistance = 1.8f;

    [Tooltip("Suavizacao do proprio look-ahead. Sempre maior que o smoothTime, senao vibra.")]
    [SerializeField, Range(0.05f, 1.5f)] private float lookAheadSmoothTime = 0.35f;

    [Tooltip("Velocidade minima do alvo para o look-ahead ligar. Evita deriva quando parado.")]
    [SerializeField] private float lookAheadMinSpeed = 0.5f;

    [Tooltip("Fracao da distancia ate o cursor usada como look-ahead. Somente no modo Mouse.")]
    [SerializeField, Range(0f, 1f)] private float mouseInfluence = 0.35f;

    // ------------------------------------------------------------------
    [Header("Limites de sala / mapa")]
    [Tooltip("Se ligado, a camera nunca mostra alem dos limites definidos.")]
    [SerializeField] private bool useBounds = true;

    [Tooltip("Limites atuais em coordenadas de mundo. Normalmente definidos por um CameraRoom2D.")]
    [SerializeField] private Bounds worldBounds = new Bounds(Vector3.zero, new Vector3(40f, 24f, 0f));

    // ------------------------------------------------------------------
    [Header("Debug")]
    [SerializeField] private bool desenharGizmos = true;

    // ------------------------------------------------------------------
    // Estado interno
    // ------------------------------------------------------------------
    private Camera _cam;
    private Transform _tr;
    private Vector2 _followVelocity;
    private Vector2 _lookAhead;
    private Vector2 _lookAheadVelocity;
    private Vector3 _lastTargetPosition;
    private Rigidbody2D _targetBody;
    private bool _hasLastPosition;
    private bool _snapPendente;

    public Transform Target => target;
    public Camera Cam => _cam;

    // ==================================================================
    // Ciclo de vida
    // ==================================================================
    private void Awake()
    {
        Instance = this;

        _tr = transform;
        _cam = GetComponent<Camera>();

        _cam.orthographic = true;
        _cam.orthographicSize = orthographicSize;

        // Camera 2D nunca rotaciona.
        _tr.rotation = Quaternion.identity;
    }

    private void OnDestroy()
    {
        if (Instance == this) Instance = null;
    }

    private void Start()
    {
        if (target == null && !string.IsNullOrEmpty(targetTagFallback))
        {
            GameObject encontrado = GameObject.FindWithTag(targetTagFallback);
            if (encontrado != null) target = encontrado.transform;
        }

        CacheTarget();

        // O snap real acontece no primeiro LateUpdate: assim os CameraRoom2D
        // da cena ja tiveram a chance de rodar o Start deles e aplicar limites.
        _snapPendente = true;
    }

    /// <summary>
    /// LateUpdate garante que o jogador ja terminou de se mover neste frame.
    /// Mover a camera em Update causa tremor visivel.
    /// </summary>
    private void LateUpdate()
    {
        if (lockZoom && !Mathf.Approximately(_cam.orthographicSize, orthographicSize))
            _cam.orthographicSize = orthographicSize;

        if (target == null) return;

        if (_snapPendente)
        {
            _snapPendente = false;
            SnapToTarget();
            return;
        }

        float dt = Time.deltaTime;
        if (dt <= 0f) return;

        AtualizarLookAhead(dt);

        Vector2 desejado = CalcularPontoDesejado();
        desejado = AplicarDeadZone(desejado);
        desejado = ClampAosLimites(desejado);

        Vector2 atual = new Vector2(_tr.position.x, _tr.position.y);
        Vector2 suave = Vector2.SmoothDamp(atual, desejado, ref _followVelocity, smoothTime, maxSpeed, dt);

        _tr.position = new Vector3(suave.x, suave.y, zDistance);
        _tr.rotation = Quaternion.identity;
    }

    // ==================================================================
    // Calculo
    // ==================================================================
    private Vector2 CalcularPontoDesejado()
    {
        Vector2 foco = (Vector2)target.position + targetOffset;
        foco.y += verticalBias;
        return foco + _lookAhead;
    }

    private void AtualizarLookAhead(float dt)
    {
        Vector2 alvoLookAhead = Vector2.zero;

        switch (lookAheadMode)
        {
            case LookAheadMode.Movimento:
                alvoLookAhead = LookAheadPorMovimento(dt);
                break;

            case LookAheadMode.Mouse:
                alvoLookAhead = LookAheadPorMouse();
                break;
        }

        _lookAhead = Vector2.SmoothDamp(_lookAhead, alvoLookAhead, ref _lookAheadVelocity,
                                        lookAheadSmoothTime, Mathf.Infinity, dt);
    }

    private Vector2 LookAheadPorMovimento(float dt)
    {
        Vector2 velocidade;

        if (_targetBody != null)
        {
#if UNITY_6000_0_OR_NEWER
            velocidade = _targetBody.linearVelocity;
#else
            velocidade = _targetBody.velocity;
#endif
        }
        else if (_hasLastPosition)
        {
            velocidade = ((Vector2)target.position - (Vector2)_lastTargetPosition) / dt;
        }
        else
        {
            velocidade = Vector2.zero;
        }

        _lastTargetPosition = target.position;
        _hasLastPosition = true;

        if (velocidade.sqrMagnitude < lookAheadMinSpeed * lookAheadMinSpeed)
            return Vector2.zero;

        return velocidade.normalized * lookAheadDistance;
    }

    private Vector2 LookAheadPorMouse()
    {
        Vector2 telaMouse;

#if ENABLE_INPUT_SYSTEM
        if (Mouse.current == null) return Vector2.zero;
        telaMouse = Mouse.current.position.ReadValue();
#else
        telaMouse = Input.mousePosition;
#endif

        Vector3 mundoMouse = _cam.ScreenToWorldPoint(
            new Vector3(telaMouse.x, telaMouse.y, Mathf.Abs(zDistance)));

        Vector2 direcao = (Vector2)mundoMouse - (Vector2)target.position;
        Vector2 offset = direcao * mouseInfluence;

        return Vector2.ClampMagnitude(offset, lookAheadDistance);
    }

    /// <summary>
    /// Ignora movimentos minusculos do alvo. Em vez de congelar a camera,
    /// persegue apenas o que passa do raio da dead zone: o resultado continua continuo.
    /// </summary>
    private Vector2 AplicarDeadZone(Vector2 desejado)
    {
        if (deadZoneRadius <= 0f) return desejado;

        Vector2 atual = new Vector2(_tr.position.x, _tr.position.y);
        Vector2 delta = desejado - atual;
        float distancia = delta.magnitude;

        if (distancia <= deadZoneRadius) return atual;

        return atual + delta / distancia * (distancia - deadZoneRadius);
    }

    private Vector2 ClampAosLimites(Vector2 posicao)
    {
        if (!useBounds) return posicao;

        float meiaAltura = _cam.orthographicSize;
        float meiaLargura = meiaAltura * _cam.aspect;

        float minX = worldBounds.min.x + meiaLargura;
        float maxX = worldBounds.max.x - meiaLargura;
        float minY = worldBounds.min.y + meiaAltura;
        float maxY = worldBounds.max.y - meiaAltura;

        // Se a sala for menor que a tela, centraliza no eixo em questao.
        posicao.x = (minX > maxX) ? worldBounds.center.x : Mathf.Clamp(posicao.x, minX, maxX);
        posicao.y = (minY > maxY) ? worldBounds.center.y : Mathf.Clamp(posicao.y, minY, maxY);

        return posicao;
    }

    private void CacheTarget()
    {
        _targetBody = null;
        _hasLastPosition = false;

        if (target == null) return;

        _targetBody = target.GetComponentInParent<Rigidbody2D>();
        _lastTargetPosition = target.position;
        _hasLastPosition = true;
    }

    // ==================================================================
    // API publica
    // ==================================================================

    /// <summary>Troca o alvo da camera. Use snap=true ao trocar de personagem ou de fase.</summary>
    public void SetTarget(Transform novoAlvo, bool snap = true)
    {
        target = novoAlvo;
        CacheTarget();
        if (snap)
        {
            _snapPendente = false;
            SnapToTarget();
        }
    }

    /// <summary>Coloca a camera exatamente sobre o alvo, zerando velocidade e look-ahead.</summary>
    public void SnapToTarget()
    {
        if (target == null) return;

        _lookAhead = Vector2.zero;
        _lookAheadVelocity = Vector2.zero;
        _followVelocity = Vector2.zero;

        Vector2 destino = (Vector2)target.position + targetOffset;
        destino.y += verticalBias;
        destino = ClampAosLimites(destino);

        _tr.position = new Vector3(destino.x, destino.y, zDistance);
        _tr.rotation = Quaternion.identity;
    }

    /// <summary>Move a camera instantaneamente para uma posicao do mundo (fim de um portal, por exemplo).</summary>
    public void TeleportTo(Vector3 posicaoMundo)
    {
        _lookAhead = Vector2.zero;
        _lookAheadVelocity = Vector2.zero;
        _followVelocity = Vector2.zero;

        Vector2 destino = ClampAosLimites(new Vector2(posicaoMundo.x, posicaoMundo.y + verticalBias));
        _tr.position = new Vector3(destino.x, destino.y, zDistance);
    }

    /// <summary>Define os limites da sala atual. Chamado pelo CameraRoom2D.</summary>
    public void SetBounds(Bounds novosLimites, bool snap = false)
    {
        worldBounds = novosLimites;
        useBounds = true;
        if (snap) SnapToTarget();
    }

    /// <summary>Libera a camera dos limites (areas abertas, cutscenes).</summary>
    public void ClearBounds()
    {
        useBounds = false;
    }

    /// <summary>Ajusta o zoom em tempo de design ou por script. Nao use em Update: o zoom deve ser fixo.</summary>
    public void SetOrthographicSize(float novoTamanho)
    {
        orthographicSize = Mathf.Max(0.1f, novoTamanho);
        if (_cam != null) _cam.orthographicSize = orthographicSize;
    }

    // ==================================================================
    // Editor
    // ==================================================================
    private void OnValidate()
    {
        if (_cam == null) _cam = GetComponent<Camera>();

        if (_cam != null)
        {
            _cam.orthographic = true;
            _cam.orthographicSize = Mathf.Max(0.1f, orthographicSize);
        }

        if (zDistance >= 0f) zDistance = -10f;

        // Look-ahead mais rapido que o follow gera vibracao. Nunca deixe passar.
        if (lookAheadSmoothTime < smoothTime) lookAheadSmoothTime = smoothTime;
    }

    private void OnDrawGizmosSelected()
    {
        if (!desenharGizmos) return;

        if (useBounds)
        {
            Gizmos.color = new Color(0.2f, 0.9f, 1f, 0.9f);
            Gizmos.DrawWireCube(worldBounds.center, new Vector3(worldBounds.size.x, worldBounds.size.y, 0.1f));
        }

        if (deadZoneRadius > 0f)
        {
            Gizmos.color = new Color(1f, 0.85f, 0.2f, 0.9f);
            Gizmos.DrawWireSphere(transform.position, deadZoneRadius);
        }

        if (target != null)
        {
            Gizmos.color = new Color(1f, 0.35f, 0.35f, 0.9f);
            Gizmos.DrawLine(target.position, transform.position);
        }
    }
}
