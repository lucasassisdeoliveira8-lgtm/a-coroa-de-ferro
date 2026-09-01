const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  for (const heroi of ['cavaleiro','arqueira','monge','alquimista']){
    const pg = await b.newPage({ viewport:{width:1100,height:700} });
    const err=[]; pg.on('pageerror',e=>err.push(e.message));
    await pg.goto('file:///root/CoroaDeFerro/web/jogo-a-coroa-de-ferro.html'); await pg.waitForTimeout(600);
    await pg.evaluate(h=>{ iniciarRun(HEROIS.find(x=>x.id===h)); }, heroi);
    await pg.waitForTimeout(600);
    // bot: mira no inimigo mais perto e atira sem parar, 3 salas de combate
    const res = await pg.evaluate(async (h)=>{
      const log=[];
      for (let sala=0; sala<3; sala++){
        S.grafo=gerarGrafo(1,3); S.grafo.salas[0].tipo='combate'; S.sala=0;
        S.grafo.salas.forEach(x=>{x.mapa=null;x.limpa=false;x.visto=false;});
        entrarSala(null,false);
        S.p.vida=S.p.vidaMax;
        let minE=S.p.energiaMax, secas=0, t=0;
        while (S.inimigos.length && t<60){
          await new Promise(r=>setTimeout(r,16));
          t+=0.016*3;
          const alvo=S.inimigos.filter(e=>!e.morto).sort((a,b)=>dist(S.p.x,S.p.y,a.x,a.y)-dist(S.p.x,S.p.y,b.x,b.y))[0];
          if(!alvo) break;
          S.p.ang=Math.atan2(alvo.y-S.p.y, alvo.x-S.p.x);
          const d=dist(S.p.x,S.p.y,alvo.x,alvo.y);
          // se a arma da mão é de perto, chega junto; se é de longe, mantém distância
          const w=arma();
          const querPerto = w.melee;
          const alvoD = querPerto?34:220;
          const passo=(d-alvoD)*0.02;
          S.p.x+=Math.cos(S.p.ang)*passo; S.p.y+=Math.sin(S.p.ang)*passo;
          // troca para a melee quando a energia acaba
          // sem energia: vai para a arma mais barata que tiver
          if (w.custo && S.p.energia < w.custo*2){
            let melhor=S.p.slot, cm=w.custo;
            S.p.armas.forEach((a,i)=>{ if(a.custo<cm){ cm=a.custo; melhor=i; } });
            if (melhor!==S.p.slot) alternarSlot(melhor);
          } else if (S.p.energia > S.p.energiaMax*.7){
            let melhor=S.p.slot, cM=w.custo;
            S.p.armas.forEach((a,i)=>{ if(a.custo>cM){ cM=a.custo; melhor=i; } });
            if (melhor!==S.p.slot) alternarSlot(melhor);
          }
          if (S.p.habCd<=0 && S.inimigos.length>2) usarHabilidade();
          if (S.p.tiroCd<=0) disparar(1);
          // recolhe itens perto
          S.itens.slice().forEach(it=>{ if(dist(S.p.x,S.p.y,it.x,it.y)<70) coletar(it); });
          minE=Math.min(minE,S.p.energia);
          if (S.p.energia<1) secas++;
          if (S.p.vida<=0) break;
        }
        log.push('sala'+sala+': inimigos restantes '+S.inimigos.length+' vida '+S.p.vida+'/'+S.p.vidaMax+
          ' energia '+Math.round(S.p.energia)+'/'+S.p.energiaMax+' mínima '+Math.round(minE)+' quadros secos '+secas);
        if (S.p.vida<=0) break;
      }
      return log.join('\n');
    }, heroi);
    console.log('--- '+heroi+' ---\n'+res+(err.length?'\nERROS: '+err[0]:''));
    await pg.close();
  }
  await b.close();
})();
