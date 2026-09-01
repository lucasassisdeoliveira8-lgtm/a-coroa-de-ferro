const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  const pg = await b.newPage({ viewport:{width:900,height:600} });
  pg.on('pageerror',e=>console.log('PAGEERROR:',e.message));
  await pg.goto('file:///root/CoroaDeFerro/web/jogo-a-coroa-de-ferro.html'); await pg.waitForTimeout(700);
  await pg.click('#btnJogar'); await pg.waitForTimeout(200);
  await pg.click('#btnIniciar'); await pg.waitForTimeout(900);
  console.log(await pg.evaluate(()=>{
    // jornada realista: ~18 armas oferecidas, nível subindo de 1 a 15
    const totalPorRar={}, porMundo={1:{},2:{},3:{}}, seq=[];
    const JOR=500;
    for(let j=0;j<JOR;j++){
      S.travaRara=0; S.unicasVistas=[];
      const linha=[];
      for(let m=1;m<=3;m++) for(let f=1;f<=5;f++){
        const nivel=(m-1)*5+f;
        const quantas = (f===1||f===3)?1:(Math.random()<.5?1:0);
        for(let k=0;k<quantas;k++){
          const w=armaAleatoria(nivel);
          totalPorRar[w.raridade.id]=(totalPorRar[w.raridade.id]||0)+1;
          porMundo[m][w.raridade.id]=(porMundo[m][w.raridade.id]||0)+1;
          linha.push(w.raridade.id[0]);
        }
      }
      if(j<3) seq.push(linha.join(''));
    }
    const pc=(o)=>{const t=Object.values(o).reduce((a,b)=>a+b,0); return RARIDADES.map(r=>r.nome+' '+Math.round((o[r.id]||0)/t*100)+'%').join(' · ');};
    return 'jornada inteira: '+pc(totalPorRar)+'\n'+
      [1,2,3].map(m=>'  mundo '+m+': '+pc(porMundo[m])).join('\n')+
      '\nexemplos de sequência (c/i/r/e/l): '+seq.join('  |  ');
  }));
  // quantas épicas+ por jornada
  console.log(await pg.evaluate(()=>{
    const hist={};
    for(let j=0;j<500;j++){
      S.travaRara=0; S.unicasVistas=[];
      let fortes=0;
      for(let m=1;m<=3;m++) for(let f=1;f<=5;f++){
        const nivel=(m-1)*5+f;
        const q=(f===1||f===3)?1:(Math.random()<.5?1:0);
        for(let k=0;k<q;k++){ const w=armaAleatoria(nivel);
          if(['epica','lendaria'].includes(w.raridade.id)) fortes++; }
      }
      hist[fortes]=(hist[fortes]||0)+1;
    }
    return 'armas épicas ou lendárias por jornada: '+JSON.stringify(hist);
  }));
  await b.close();
})();
