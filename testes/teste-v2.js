const { chromium } = require('playwright');
const U='file:///root/CoroaDeFerro/web/jogo-a-coroa-de-ferro.html';
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  const erros=[];
  const pg = await b.newPage({ viewport:{width:1440,height:820} });
  pg.on('pageerror',e=>erros.push('PAGEERROR: '+e.message));
  pg.on('console',m=>{ if(m.type()==='error'&&!m.text().includes('TUNNEL')) erros.push(m.text()); });
  await pg.goto(U); await pg.waitForTimeout(600);
  await pg.click('#btnJogar'); await pg.waitForTimeout(200);
  await pg.click('#btnIniciar'); await pg.waitForTimeout(900);

  const vistos = {};
  let passos=0;
  while (passos++ < 320){
    const st = await pg.evaluate(()=>({tela:S.tela, rodando:S.rodando, cut:S.emCutscene, trans:!!S.trans}));
    if (!st.rodando) break;
    if (st.cut){ await pg.waitForTimeout(1600); await pg.keyboard.press('Space'); await pg.waitForTimeout(500); continue; }
    if (st.trans){ await pg.waitForTimeout(700); continue; }
    if (st.tela==='dialogo'){
      const esp = await pg.evaluate(()=>!!(dlgAtual&&dlgAtual.especial));
      if (esp) break;
      await pg.click('#dlgOps .op'); await pg.waitForTimeout(200);
      await pg.click('#dlgSeguir'); await pg.waitForTimeout(250); continue;
    }
    if (st.tela==='painel'){ const c=await pg.$('#pnCorpo .carta'); if(c){ await c.click(); await pg.waitForTimeout(250);} 
      else { await pg.evaluate(()=>{fecharPainel(); S.pausado=false;}); } continue; }
    const info = await pg.evaluate(()=>({tipo:salaAtual().tipo, limpa:S.salaLimpa, portal:S.portalAberto, fase:S.mundo+'-'+S.fase}));
    vistos[info.tipo]=(vistos[info.tipo]||0)+1;
    // resolve a sala
    await pg.evaluate(()=>{
      S.inimigos.slice().forEach(e=> e.chefe? matarChefe(e) : matarInimigo(e));
      S.baus.forEach(b=>abrirBau(b));
      if (S.desafio && !S.desafio.fim){ S.desafio.t = S.desafio.dur; }
      S.moedas = 500;
      if (S.pedestais.length) comprarPedestal(S.pedestais[0]);
      if (S.npc && S.npc.tipo==='filosofo' && !S.npc.usado) encontroFilosofico();
    });
    await pg.waitForTimeout(700);
    if (await pg.evaluate(()=>S.tela==='dialogo')) continue;
    if (await pg.evaluate(()=>S.tela==='painel')) continue;
    const dep = await pg.evaluate(()=>({portal:S.portalAberto, limpa:S.salaLimpa}));
    if (dep.portal){
      await pg.evaluate(()=>{ S.p.x=S.portal.x; S.p.y=S.portal.y; });
      await pg.waitForTimeout(120); await pg.keyboard.press('e'); await pg.waitForTimeout(400);
      continue;
    }
    if (!dep.limpa){ await pg.waitForTimeout(400); continue; }
    const foi = await pg.evaluate(()=>{
      const sala=salaAtual(), m=S.mapa;
      const ds=Object.keys(sala.viz).filter(d=>!S.grafo.salas[sala.viz[d]].visto);
      const d = ds[0] || Object.keys(sala.viz)[0];
      if(!d) return false;
      const pt=m.portas[d]; S.p.x=pt.x; S.p.y=pt.y; return true;
    });
    await pg.waitForTimeout(500);
    if (!foi) break;
  }
  console.log('SALAS VISITADAS:', JSON.stringify(vistos));
  console.log('CHEGOU EM:', await pg.evaluate(()=>S.mundo+'-'+S.fase+' tela '+S.tela));
  await pg.screenshot({path:'/root/CoroaDeFerro/v2-final.png'});
  if (await pg.evaluate(()=>S.tela==='dialogo')){
    const ops=await pg.$$('#dlgOps .op');
    console.log('OPÇÕES FINAIS:', ops.length, await pg.evaluate(()=>S.sabedoria));
    await ops[ops.length-2].click(); await pg.waitForTimeout(700);
    console.log('LUTA:', await pg.evaluate(()=>S.boss?S.boss.nome:'—'));
    await pg.waitForTimeout(2500);
    await pg.screenshot({path:'/root/CoroaDeFerro/v2-coroa.png'});
    await pg.evaluate(()=>matarChefe(S.boss)); await pg.waitForTimeout(1400);
    if (await pg.evaluate(()=>S.tela==='painel')){ const c=await pg.$('#pnCorpo .carta'); if(c) await c.click(); }
    await pg.waitForTimeout(500);
    await pg.evaluate(()=>{ if(S.portal){S.p.x=S.portal.x; S.p.y=S.portal.y;} });
    await pg.keyboard.press('e'); await pg.waitForTimeout(900);
    console.log('FINAL:', await pg.evaluate(()=>document.getElementById('pnTitulo').textContent));
  }
  console.log('ERROS:', erros.length?erros.slice(0,8):'nenhum');
  await b.close();
})();
