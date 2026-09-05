/* ==================================================================
   A Coroa de Ferro — service worker
   Faz o jogo instalar como aplicativo e abrir sem internet.
   Trocar VERSAO a cada publicação: isso apaga o cache antigo e
   garante que ninguém fique preso numa versão velha do jogo.
   ================================================================== */

const VERSAO = 'coroa-v9';
const ESSENCIAIS = ['./', './index.html', './icone.png', './manifest.json'];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(VERSAO)
      .then(c => c.addAll(ESSENCIAIS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => n !== VERSAO).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evento => {
  const req = evento.request;
  if (req.method !== 'GET') return;

  /* A página em si: tenta a rede primeiro, para quem está online sempre
     pegar a versão nova do jogo; se a rede falhar, serve a cópia guardada. */
  if (req.mode === 'navigate') {
    evento.respondWith(
      fetch(req)
        .then(resp => {
          const copia = resp.clone();
          caches.open(VERSAO).then(c => c.put('./index.html', copia));
          return resp;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  /* Ícone, manifesto, capa e as fontes do Google: cache primeiro,
     atualizando por baixo quando houver rede. */
  evento.respondWith(
    caches.match(req).then(guardado => {
      const rede = fetch(req).then(resp => {
        if (resp && (resp.ok || resp.type === 'opaque')) {
          const copia = resp.clone();
          caches.open(VERSAO).then(c => c.put(req, copia));
        }
        return resp;
      }).catch(() => guardado);
      return guardado || rede;
    })
  );
});
