const fs=require('fs');
const src=fs.readFileSync(process.argv[2],'utf8');
const re=/<script>([\s\S]*?)<\/script>/g;
let m,out='';
while((m=re.exec(src))) out+=m[1]+'\n';
fs.writeFileSync('/tmp/bundle.js',out);
console.log('js bytes:',out.length);
