using System.Collections;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// Fade preto simples para as transicoes de portal.
/// Cria o proprio Canvas em runtime: basta ter UM objeto com este script na cena
/// (ou deixar que o CameraPortal2D funcione sem ele, sem fade).
///
/// Setup rapido:
///   1. Crie um GameObject vazio chamado "ScreenFader".
///   2. Adicione este script. Pronto.
/// </summary>
[AddComponentMenu("Coroa de Ferro/Screen Fader")]
public class ScreenFader : MonoBehaviour
{
    public static ScreenFader Instance { get; private set; }

    [SerializeField] private Color corDoFade = Color.black;

    [Tooltip("Ordem do Canvas. Deixe alto para o fade ficar acima do HUD.")]
    [SerializeField] private int sortingOrder = 999;

    [Tooltip("Mantem o fader entre cenas.")]
    [SerializeField] private bool naoDestruirAoCarregar = true;

    private CanvasGroup _grupo;
    private Coroutine _rotinaAtual;

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
        if (naoDestruirAoCarregar) DontDestroyOnLoad(gameObject);

        Construir();
    }

    private void OnDestroy()
    {
        if (Instance == this) Instance = null;
    }

    private void Construir()
    {
        Canvas canvas = gameObject.GetComponent<Canvas>();
        if (canvas == null) canvas = gameObject.AddComponent<Canvas>();

        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvas.sortingOrder = sortingOrder;

        if (gameObject.GetComponent<CanvasScaler>() == null)
            gameObject.AddComponent<CanvasScaler>();

        _grupo = gameObject.GetComponent<CanvasGroup>();
        if (_grupo == null) _grupo = gameObject.AddComponent<CanvasGroup>();

        _grupo.alpha = 0f;
        _grupo.blocksRaycasts = false;
        _grupo.interactable = false;

        GameObject painel = new GameObject("Painel", typeof(RectTransform), typeof(Image));
        painel.transform.SetParent(transform, false);

        RectTransform rt = painel.GetComponent<RectTransform>();
        rt.anchorMin = Vector2.zero;
        rt.anchorMax = Vector2.one;
        rt.offsetMin = Vector2.zero;
        rt.offsetMax = Vector2.zero;

        Image img = painel.GetComponent<Image>();
        img.color = corDoFade;
        img.raycastTarget = false;
    }

    /// <summary>Escurece a tela.</summary>
    public Coroutine FadeOut(float duracao)
    {
        return Executar(1f, duracao);
    }

    /// <summary>Clareia a tela.</summary>
    public Coroutine FadeIn(float duracao)
    {
        return Executar(0f, duracao);
    }

    private Coroutine Executar(float alvo, float duracao)
    {
        if (_rotinaAtual != null) StopCoroutine(_rotinaAtual);
        _rotinaAtual = StartCoroutine(Animar(alvo, duracao));
        return _rotinaAtual;
    }

    private IEnumerator Animar(float alvo, float duracao)
    {
        float inicio = _grupo.alpha;

        if (duracao <= 0f)
        {
            _grupo.alpha = alvo;
            _grupo.blocksRaycasts = alvo > 0.01f;
            _rotinaAtual = null;
            yield break;
        }

        _grupo.blocksRaycasts = true;

        float t = 0f;
        while (t < duracao)
        {
            // unscaledDeltaTime para o fade funcionar mesmo com o jogo pausado.
            t += Time.unscaledDeltaTime;
            _grupo.alpha = Mathf.Lerp(inicio, alvo, Mathf.Clamp01(t / duracao));
            yield return null;
        }

        _grupo.alpha = alvo;
        _grupo.blocksRaycasts = alvo > 0.01f;
        _rotinaAtual = null;
    }
}
