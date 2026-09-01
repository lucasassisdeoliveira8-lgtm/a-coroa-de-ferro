const { chromium } = require('playwright');
const U='file:///root/CoroaDeFerro/web/jogo-a-coroa-de-ferro.html';
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  const pg = await b.newPage({ viewport:{width:1400,height:820} });
  const erros=[]; pg.on('pageerror',e=>erros.push('PAGEERROR: '+e.message));
  pg.on('console',m=>{ if(m.type()==='error'&&!m.text().includes('TUNNEL')) erros.push(m.text()); });
  await pg.goto(U); await pg.waitForTimeout(700);
  await pg.click('#btnJogar'); await pg.waitForTimeout(200);
  await pg.click('#btnIniciar'); await pg.waitForTimeout(900);

  await pg.evaluate(()=>{
    S.grafo = gerarGrafo(1,2);
    S.grafo.salas[0].tipo='combate'; S.sala=0;
    S.grafo.salas.forEach(x=>{x.mapa=null;x.limpa=false;x.visto=false;});
    entrarSala(null,false);
    S.inimigos.length=0; S.perigos.length=0; S.props.length=0; S.balas.length=0;
    const c=S.mapa.centro;
    const folc=['curupira','saci','cuia','filhote','caipora','mula','iara','mapinguari','cuca'];
    folc.forEach((n,i)=>{
      const e=criarInimigo(n, c.x + ((i%5)-2)*150, c.y + (Math.floor(i/5)-.5)*200);
      e.telT=0; e.acao=null;
    });
    // deixa a Iara cantando e o Mapinguari rugindo para ver os estados
    S.inimigos.forEach(e=>{ if(e.tipo==='iara') e.cantando=99; if(e.tipo==='mapinguari'){ e.telT=99; e.telMax=99; e.acao='rugido'; } });
    S.pausado=true;
  });
  await pg.waitForTimeout(400);
  await pg.evaluate(()=>{ S.pausado=false; });
  await pg.waitForTimeout(900);
  await pg.evaluate(()=>{ S.pausado=true; });
  await pg.screenshot({path:'/root/CoroaDeFerro/folclore.png'});
  console.log('desenhados:', await pg.evaluate(()=>S.inimigos.map(e=>e.tipo).join(' ')));
  console.log('bestiario salvo:', await pg.evaluate(()=>(META.bestiario||[]).length));

  // Codex — aba do bestiário
  await pg.evaluate(()=>{ S.pausado=false; abrirCodex(()=>mostrarTela('menu')); });
  await pg.waitForTimeout(300);
  await pg.evaluate(()=>{ cdxAba='folclore'; renderCodex(); });
  await pg.waitForTimeout(300);
  await pg.screenshot({path:'/root/CoroaDeFerro/bestiario-codex.png'});
  console.log('entradas visíveis:', await pg.evaluate(()=>document.querySelectorAll('.fol-item').length));

  // comportamentos rodando de verdade
  await pg.evaluate(()=>{
    mostrarTela('jogo');
    S.inimigos.length=0;
    const c=S.mapa.centro;
    ['caipora','mula','iara','mapinguari','cuca'].forEach((n,i)=>
      criarInimigo(n, c.x+((i%3)-1)*180, c.y+(Math.floor(i/3)-.5)*170));
  });
  await pg.waitForTimeout(4000);
  console.log('estados:', await pg.evaluate(()=>S.inimigos.map(e=>
    e.tipo+(e.cantando>0?'/cantando':'')+(e.disparada>0?'/disparada':'')+(e.carga>0?'/investida':'')).join(' ')));
  console.log('vida:', await pg.evaluate(()=>S.p.vida+'/'+S.p.vidaMax));
  await pg.screenshot({path:'/root/CoroaDeFerro/folclore-acao.png'});
  console.log('ERROS:', erros.length?erros.slice(0,6):'nenhum');
  await b.close();
})();
