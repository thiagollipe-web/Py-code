const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function game(id){
 const window={};vm.runInNewContext(fs.readFileSync('ascii-games.js','utf8'),{window});
 const html=window.PyCodeASCII[id].match(/jogo = r"""([\s\S]+?)"""/)[1];
 const script=html.match(/<script>([\s\S]+?)<\/script>/)[1];
 const elements={};const listeners={};let next=0;const timers=new Map();
 const element=id=>elements[id]??={textContent:'',addEventListener:(name,fn)=>{listeners[id+':'+name]=fn},focus(){},dataset:{}};
 const context=vm.createContext({document:{getElementById:element,querySelectorAll:()=>[],addEventListener:(n,f)=>{listeners[n]=f},hidden:false},window:{addEventListener:(n,f)=>{listeners[n]=f}},setInterval:f=>{timers.set(++next,f);return next},clearInterval:i=>timers.delete(i),console});
 vm.runInContext(script,context);const run=s=>vm.runInContext(s,context);
 return {run,elements,listeners,timers};
}
for(const id of ['cobrinha','pong','tetris','rpg'])test(id+' initializes, renders, restarts and pauses without duplicate timers',()=>{
 const g=game(id);assert.ok(g.elements.tela.textContent.includes('\n'),'must render real newlines');assert.equal(g.timers.size,0);g.elements.inicio.onclick();g.elements.inicio.onclick();assert.equal(g.timers.size,id==='rpg'?0:1);assert.equal(g.run('rodando'),true);g.elements.pausa.onclick();assert.equal(g.timers.size,0);assert.equal(g.run('rodando'),false);
});
test('snake wraps, rejects reverse and only turns once per tick',()=>{const g=game('cobrinha');g.run('iniciar(); cobra=[[19,5],[18,5]];direcao=[1,0];comida=[10,1];atualizar()');assert.equal(g.run('cobra[0][0]'),0);g.run('comando("ArrowLeft")');assert.equal(g.run('direcao[0]'),1);g.run('comando("ArrowUp");comando("ArrowLeft")');assert.equal(g.run('direcao[1]'),-1);g.run('atualizar();comando("ArrowLeft")');assert.equal(g.run('direcao[0]'),-1)});
test('snake grows and never places food inside body',()=>{const g=game('cobrinha');g.run('iniciar();comida=[6,5];atualizar()');assert.equal(g.run('pontos'),10);assert.equal(g.run('cobra.length'),3);assert.equal(g.run('cobra.some(p=>p[0]===comida[0]&&p[1]===comida[1])'),false)});
test('snake victory uses occupied board, not overlapping body length',()=>{const g=game('cobrinha');assert.equal(g.run('cobra=Array.from({length:200},()=>[0,0]);terminou=false;sortearComida()!==null'),true);assert.equal(g.run('terminou'),false);g.run('cobra=Array.from({length:200},(_,i)=>[i%20,Math.floor(i/20)]);sortearComida()');assert.equal(g.run('terminou'),true)});
test('Pong bounces and scores for a missed paddle',()=>{const g=game('pong');g.run('iniciar();bolaX=2;bolaY=jogador-1;vx=-1;vy=1;atualizar()');assert.equal(g.run('vx'),1);g.run('bolaX=0;bolaY=0;vx=-1;vy=1;atualizar()');assert.equal(g.run('rival'),1);g.run('rival=4;bolaX=0;bolaY=0;vx=-1;vy=1;atualizar();mostrar()');assert.equal(g.run('terminou'),true);assert.equal(g.timers.size,0)});
test('Tetris clears a complete line and blocks moves outside grid',()=>{const g=game('tetris');g.run('iniciar();tabuleiro[15]=Array(10).fill(1);tabuleiro[15][9]=0;peca=[[1]];x=9;y=15;fixar()');assert.equal(g.run('pontos'),100);assert.equal(g.run('tabuleiro.every(l=>l.every(v=>v===0))'),true);assert.equal(g.run('cabe(-1,0,[[1]])'),false);g.run('peca=[[1,1,1]];x=0;y=0;comando("ArrowUp")');assert.equal(g.run('peca.length'),3)});
test('Tetris ends when a new piece cannot spawn',()=>{const g=game('tetris');g.run('iniciar();tabuleiro=Array.from({length:altura},()=>Array(largura).fill(1));novaPeca();mostrar()');assert.equal(g.run('terminou'),true);assert.equal(g.timers.size,0)});
test('RPG blocks a locked door and has a reachable key and exit',()=>{
 const g=game('rpg');g.run('iniciar();x=13;y=6;comando("ArrowDown")');assert.equal(g.run('y'),6);assert.equal(g.run('terminou'),false);g.run('iniciar()');
 const map=JSON.parse(g.run('JSON.stringify(mapa)'));const moves=[['ArrowRight',1,0],['ArrowLeft',-1,0],['ArrowDown',0,1],['ArrowUp',0,-1]];
 const queue=[{x:1,y:1,key:false,path:[]}],seen=new Set();let route;
 while(queue.length){const n=queue.shift(),tag=[n.x,n.y,n.key].join(',');if(seen.has(tag))continue;seen.add(tag);if(map[n.y][n.x]==='D'&&n.key){route=n.path;break}for(const [k,dx,dy] of moves){const x=n.x+dx,y=n.y+dy,t=map[y]?.[x];if(t&&t!=='#'&&(t!=='D'||n.key))queue.push({x,y,key:n.key||t==='K',path:[...n.path,k]})}}
 assert.ok(route,'key and exit must be reachable');for(const k of route)g.run('comando('+JSON.stringify(k)+')');assert.equal(g.run('terminou'),true);assert.equal(g.run('chave'),true);
});
test('keyboard events prevent scrolling and stop modifying a paused game',()=>{const g=game('rpg');g.run('iniciar()');let prevented=false;g.listeners['tela:keydown']({key:'ArrowRight',preventDefault(){prevented=true}});assert.equal(prevented,true);assert.equal(g.run('x'),2);g.elements.pausa.onclick();g.listeners['tela:keydown']({key:'ArrowRight',preventDefault(){}});assert.equal(g.run('x'),2)});
