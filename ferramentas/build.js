/* ==================================================================
   A Coroa de Ferro — gerador do index.html
   Uso:  npm run gerar
   Lê  src/coroa.html  e escreve  index.html  na raiz do repositório.
   Nunca chamar este script de "build" no package.json: a Vercel roda
   "npm run build" sozinha e tentaria compilar um site que já vai pronto.
   ================================================================== */

const fs = require('fs');
const path = require('path');

/* ---- endereço do site -------------------------------------------
   Trocar só esta linha se o domínio mudar. É daqui que saem og:url,
   og:image e twitter:image, que fazem a capa aparecer quando o link
   é mandado no WhatsApp, Discord ou X.
   ----------------------------------------------------------------- */
const SITE = 'https://a-coroa-de-ferro.vercel.app';

const RAIZ = path.join(__dirname, '..');
const ENTRADA = path.join(RAIZ, 'src', 'coroa.html');
const SAIDA = path.join(RAIZ, 'index.html');
const SAIDA_OFFLINE = path.join(RAIZ, 'jogo-a-coroa-de-ferro.html');

const src = fs.readFileSync(ENTRADA, 'utf8');
const titulo = (src.match(/<title>(.*?)<\/title>/) || [])[1] || 'A Coroa de Ferro';

/* O src começa com <title> e os <link> das fontes: isso pertence ao
   <head>. Corta no primeiro <style> e manda a primeira parte para cima. */
const corte = src.indexOf('<style');
const cabecaDoSrc = corte > 0 ? src.slice(0, corte).trim() : '';
const corpoDoSrc = corte > 0 ? src.slice(corte) : src;

const DESC = 'Roguelike top-down brasileiro sobre confiar (ou não) em uma máquina. ' +
  'Váldria, folclore, filosofia e uma coroa de ferro que decidiu proteger o reino de si mesmo.';

const cabeca = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="description" content="${DESC}">
<meta name="theme-color" content="#0B0908">
<meta name="author" content="Lucas Franceschi Assis de Oliveira">
<link rel="icon" href="/icone.png" type="image/png">
<link rel="apple-touch-icon" href="/icone.png">
<link rel="manifest" href="/manifest.json">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="A Coroa de Ferro">
<meta property="og:type" content="website">
<meta property="og:site_name" content="A Coroa de Ferro">
<meta property="og:title" content="A Coroa de Ferro">
<meta property="og:description" content="Uma máquina concluiu que a liberdade humana é a causa do caos. Você vai até a torre discordar. Roguelike top-down com folclore brasileiro e filosofia como mecânica.">
<meta property="og:image" content="${SITE}/capa.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${SITE}/">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="A Coroa de Ferro">
<meta name="twitter:description" content="Roguelike top-down com folclore brasileiro e filosofia como mecânica. Jogue no navegador, de graça.">
<meta name="twitter:image" content="${SITE}/capa.png">
<style>*,*::before,*::after{box-sizing:border-box}body{margin:0}img,canvas{display:block;max-width:100%}</style>
${cabecaDoSrc}`;

const paginaWeb = `<!doctype html>
<html lang="pt-BR">
<head>
${cabeca}
</head>
<body>
${corpoDoSrc}
</body>
</html>`;

/* Versão offline: sem ícone, manifesto e capa, que dependem do servidor. */
const paginaOffline = paginaWeb
  .replace(/^.*rel="(icon|apple-touch-icon|manifest)".*$/gm, '')
  .replace(/^.*(og:|twitter:).*$/gm, '')
  .replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(SAIDA, paginaWeb);
fs.writeFileSync(SAIDA_OFFLINE, paginaOffline);

console.log('index.html gerado:', paginaWeb.length, 'bytes —', titulo, '—', SITE);
console.log('jogo-a-coroa-de-ferro.html (offline):', paginaOffline.length, 'bytes');
