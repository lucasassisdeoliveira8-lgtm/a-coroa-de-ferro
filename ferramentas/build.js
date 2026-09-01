const fs=require('fs');
const src=fs.readFileSync('/root/CoroaDeFerro/web/coroa.html','utf8');
const titulo=(src.match(/<title>(.*?)<\/title>/)||[])[1]||'A Coroa de Ferro';
const out=`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="description" content="Roguelike top-down sobre uma maquina que decidiu que a liberdade humana e a causa do caos.">
<meta name="theme-color" content="#100E0C">
<style>*,*::before,*::after{box-sizing:border-box}body{margin:0}img,canvas{display:block;max-width:100%}</style>
</head>
<body>
${src}
</body>
</html>`;
fs.writeFileSync('/root/CoroaDeFerro/web/jogo-a-coroa-de-ferro.html',out);
console.log('standalone gerado:', out.length, 'bytes —', titulo);
