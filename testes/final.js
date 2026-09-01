const { chromium } = require('playwright');
const U='file:///root/CoroaDeFerro/web/jogo-a-coroa-de-ferro.html';
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  const erros=[];
  const pg = await b.newPage({ viewport:{width:1440,height:820} });
  pg.on('pageerror',e=>erros.push('PAGEERROR: '+e.message));
  pg.on('console',m=>{ if(m.type()==='error'&&!m.text().includes('TUNNEL')) erros.push(m.text()); });
  await pg.goto(U); await pg.waitForTimeout(900);
  await pg.screenshot({path:'/root/CoroaDeFerro/f-menu.png'});
  await pg.click('#btnJogar'); await pg.waitForTimeout(700);
  await pg.screenshot({path:'/root/CoroaDeFerro/f-selecao.png'});
  await pg.click('#btnTestar'); await pg.waitForTimeout(1600);
  await pg.screenshot({path:'/root/CoroaDeFerro/f-habilidade.png'});
  await pg.click('#pnAcoes .btn'); await pg.waitForTimeout(400);
  await pg.click('#btnIniciar'); await pg.waitForTimeout(900);

  for (const tipo of ['ferreiro','altar','biblioteca','arena','filosofo']){
    await pg.evaluate((t)=>{
      S.grafo=gerarGrafo(S.mundo,S.fase);
      S.grafo.salas[0].tipo=t; S.sala=0;
      S.grafo.salas.forEach(x=>{x.mapa=null;x.limpa=false;x.visto=false;});
      entrarSala(null,false);
      S.moedas=600; S.p.x=S.npc?S.npc.x:S.p.x; S.p.y=S.npc?S.npc.y+60:S.p.y;
    }, tipo);
    await pg.waitForTimeout(700);
    await pg.keyboard.press('e'); await pg.waitForTimeout(600);
    const tela = await pg.evaluate(()=>S.tela);
    await pg.screenshot({path:`/root/CoroaDeFerro/f-${tipo}.png`});
    console.log('sala', tipo, '->', tela);
    if (tela==='painel'){ await pg.evaluate(()=>{ const b2=document.querySelector('#pnAcoes .btn'); if(b2) b2.click(); }); }
    if (tela==='dialogo'){
      await pg.click('#dlgOps .op'); await pg.waitForTimeout(400);
      await pg.screenshot({path:'/root/CoroaDeFerro/f-prova.png'});
      const pv = await pg.$('#btnProva');
      console.log('  prova oferecida:', !!pv);
      if (pv) await pv.click();
      await pg.waitForTimeout(300);
      await pg.click('#dlgSeguir');
    }
    await pg.waitForTimeout(400);
  }
  // chefes
  for (const [m,f] of [[1,5],[2,5]]){
    await pg.evaluate(([mm,ff])=>{ S.mundo=mm; S.fase=ff; S.grafo=gerarGrafo(mm,ff);
      S.sala=S.grafo.salas.findIndex(x=>x.tipo==='chefe');
      S.grafo.salas.forEach(x=>{x.mapa=null;x.limpa=false;x.visto=false;});
      entrarSala(null,false); }, [m,f]);
    await pg.waitForTimeout(2600);
    await pg.screenshot({path:`/root/CoroaDeFerro/f-chefe${m}.png`});
    console.log('chefe', m, await pg.evaluate(()=>S.boss?S.boss.nome+' hp '+Math.round(S.boss.hp):'—'));
  }
  const fps = await pg.evaluate(async ()=> await new Promise(r=>{ let n=0; const t0=performance.now();
    function fq(){ n++; if(performance.now()-t0<1000) requestAnimationFrame(fq); else r(n); } requestAnimationFrame(fq); }));
  console.log('FPS desktop:', fps);

  const pgm = await b.newPage({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
  pgm.on('pageerror',e=>erros.push('MOBILE: '+e.message));
  await pgm.goto(U); await pgm.waitForTimeout(700);
  await pgm.tap('#btnJogar'); await pgm.waitForTimeout(500);
  await pgm.screenshot({path:'/root/CoroaDeFerro/f-mobile-sel.png'});
  await pgm.tap('#btnIniciar'); await pgm.waitForTimeout(1200);
  await pgm.screenshot({path:'/root/CoroaDeFerro/f-mobile.png'});
  const fpsm = await pgm.evaluate(async ()=> await new Promise(r=>{ let n=0; const t0=performance.now();
    function fq(){ n++; if(performance.now()-t0<1000) requestAnimationFrame(fq); else r(n); } requestAnimationFrame(fq); }));
  console.log('FPS celular:', fpsm, '| zoom', await pgm.evaluate(()=>ZOOM.toFixed(2)));
  console.log('ERROS:', erros.length?erros.slice(0,8):'nenhum');
  await b.close();
})();
