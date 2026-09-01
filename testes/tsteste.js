const { chromium } = require('playwright');
const U='file:///root/CoroaDeFerro/web/jogo-a-coroa-de-ferro.html';
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox','--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport:{width:1280,height:760} });
  const erros=[]; pg.on('pageerror',e=>erros.push('PAGEERROR: '+e.message));
  pg.on('console',m=>{ if(m.type()==='error'&&!m.text().includes('TUNNEL')) erros.push(m.text()); });
  await pg.goto(U); await pg.waitForTimeout(800);
  await pg.click('#btnJogar'); await pg.waitForTimeout(300);
  await pg.click('#btnIniciar'); await pg.waitForTimeout(1200);

  // ---- travessia a pé ----
  await pg.evaluate(()=>{ S.dicaT=0; S.inimigos.length=0; S.salaLimpa=true; S.travaPorta=0; });
  const antes = await pg.evaluate(()=>S.sala);
  await pg.evaluate(()=>{
    const d = Object.keys(salaAtual().viz)[0];
    iniciarTravessia(d);
  });
  await pg.waitForTimeout(90);
  await pg.screenshot({path:'/root/CoroaDeFerro/trav-1.png'});
  await pg.waitForTimeout(260);
  await pg.screenshot({path:'/root/CoroaDeFerro/trav-2.png'});
  await pg.waitForTimeout(400);
  const dep = await pg.evaluate(()=>({sala:S.sala, trans:!!S.trans, x:Math.round(S.p.x), y:Math.round(S.p.y)}));
  console.log('travessia: sala', antes, '->', dep.sala, 'trans', dep.trans);

  // ---- cutscene do portal ----
  await pg.evaluate(()=>{ avancarFase(); });
  await pg.waitForTimeout(1900);
  await pg.screenshot({path:'/root/CoroaDeFerro/cutscene.png'});
  console.log('em cutscene:', await pg.evaluate(()=>S.emCutscene));
  console.log('frase:', await pg.evaluate(()=>el('cutFrase').textContent.slice(0,60)));
  await pg.mouse.click(640,700); await pg.waitForTimeout(900);
  console.log('depois:', await pg.evaluate(()=>({cut:S.emCutscene, fase:S.mundo+'-'+S.fase, pausado:S.pausado})));

  // ---- musica ----
  console.log('tema:', await pg.evaluate(()=>MUS.id), 'passo:', await pg.evaluate(()=>MUS.passo));
  console.log('ERROS:', erros.length?erros.slice(0,6):'nenhum');
  await b.close();
})();
