const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  const pg = await b.newPage({ viewport:{width:1200,height:760} });
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto('file:///root/CoroaDeFerro/web/jogo-a-coroa-de-ferro.html'); await pg.waitForTimeout(800);
  await pg.click('#btnJogar'); await pg.waitForTimeout(200);
  await pg.click('#btnIniciar'); await pg.waitForTimeout(1000);
  // grafos: a sala 0 nunca pode ter inimigos, e o grafo sempre tem que gerar
  console.log(await pg.evaluate(()=>{
    const cont={}, tam={}; let falhas=0;
    for(let j=0;j<400;j++){
      S.baralhoOpcional=[];
      for(let m=1;m<=3;m++) for(let f=1;f<=5;f++){
        const g=gerarGrafo(m,f);
        if (g.salas.length<2) falhas++;
        cont[g.salas[0].tipo]=(cont[g.salas[0].tipo]||0)+1;
        tam[g.salas.length]=(tam[g.salas.length]||0)+1;
      }
    }
    return 'tipo da 1a sala: '+JSON.stringify(cont)+'\nsalas por fase: '+JSON.stringify(tam)+'\nfalhas de geração: '+falhas;
  }));
  // entrar de fato numa fase de cada mundo e conferir que não tem ninguém
  console.log(await pg.evaluate(()=>{
    const linhas=[];
    for (const [m,f] of [[1,2],[1,5],[2,1],[2,4],[3,3],[3,5]]){
      S.mundo=m; S.fase=f; S.sala=0;
      S.grafo=gerarGrafo(m,f);
      entrarSala(null,true);
      linhas.push(m+'-'+f+': sala '+salaAtual().tipo+' · inimigos '+S.inimigos.length+
        ' · perigos '+S.perigos.length+' · limpa '+S.salaLimpa+' · portas '+Object.keys(S.mapa.portas).length);
    }
    return linhas.join('\n');
  }));
  await pg.evaluate(()=>{ S.mundo=2; S.fase=1; S.sala=0; S.grafo=gerarGrafo(2,1); entrarSala(null,true);
    el('aviso').classList.remove('on'); });
  await pg.waitForTimeout(1200);
  await pg.evaluate(()=>{S.pausado=true;});
  await pg.screenshot({path:'/root/CoroaDeFerro/chegada.png'});
  console.log('ERROS:', err.length?err.slice(0,4):'nenhum');
  await b.close();
})();
