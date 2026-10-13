(function(){
'use strict';
let python,loading,timer,active,paused=true,busy=false;
const $=id=>document.getElementById(id);
async function runtime(){
 if(python)return python;
 if(!loading)loading=(async()=>{await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js';script.onload=resolve;script.onerror=()=>reject(new Error('Não foi possível baixar Python. Confira a conexão e tente novamente.'));document.head.append(script)});python=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});return python})().catch(e=>{loading=null;throw e});
 return loading;
}
function stop(){clearInterval(timer);paused=true;$('gamePause').textContent='Iniciar';}
function snapshot(){return JSON.parse(python.runPython('import json\njson.dumps(vars(partida), ensure_ascii=False)'))}
function draw(){
 const s=snapshot(),canvas=$('gameCanvas'),ctx=canvas.getContext('2d');ctx.fillStyle='#0f172a';ctx.fillRect(0,0,canvas.width,canvas.height);
 const colors=['#0f172a','#22d3ee','#facc15','#c084fc','#4ade80','#fb7185','#60a5fa','#fb923c'];
 if(active==='cobrinha'){
  s.corpo.forEach(([x,y],i)=>{ctx.fillStyle=i?'#22c55e':'#a3e635';ctx.fillRect(x*20+1,y*20+1,18,18)});
  if(s.comida){ctx.fillStyle='#fb7185';ctx.fillRect(s.comida[0]*20+3,s.comida[1]*20+3,14,14)}
  $('gameStatus').textContent='Pontos: '+s.pontos+(s.fim?' · Fim de jogo':paused?' · Pausado':' · Jogando');
 }else if(active==='tetris'){
  const grid=s.tabuleiro.map(row=>row.slice());if(!s.fim)s.peca.forEach((row,dy)=>row.forEach((v,dx)=>{if(v)grid[s.y+dy][s.x+dx]=v}));
  grid.forEach((row,y)=>row.forEach((v,x)=>{ctx.fillStyle=colors[v];ctx.fillRect(x*20+1,y*20+1,18,18)}));
  $('gameStatus').textContent='Pontos: '+s.pontos+' · Linhas: '+s.linhas+(s.fim?' · Fim de jogo':paused?' · Pausado':' · Jogando');
 }else if(active==='rpg'){
  $('gameStatus').textContent='Local: '+s.local+' · Vida: '+s.vida+'/10 · Mochila: '+(s.inventario.join(', ')||'vazia');$('gameStory').textContent=s.mensagem;
  $('gameControls').replaceChildren();const options=JSON.parse(python.runPython('json.dumps(partida.opcoes())'));options.forEach(([label,value])=>button(label,()=>action('escolher',value)));
 }
 if(s.fim)stop();
}
function button(label,fn){const b=document.createElement('button');b.className='button outline';b.type='button';b.textContent=label;b.onclick=fn;$('gameControls').append(b)}
function action(method,value){if(!python||busy)return;if((active==='cobrinha'||active==='tetris')&&paused)return;python.globals.set('entrada_jogo',value??'');const commands={virar:'partida.virar(*entrada_jogo.split(","))',mover:'partida.mover(int(entrada_jogo))',girar:'partida.girar()',descer:'partida.descer()',soltar:'partida.soltar()',escolher:'partida.escolher(entrada_jogo)'};if(method==='virar')python.runPython('partida.virar(*map(int, entrada_jogo.split(",")))');else python.runPython(commands[method]);draw();}
function reset(){stop();python.runPython('partida = '+({cobrinha:'Cobrinha',tetris:'Tetris',rpg:'Aventura',bot:'Eliza'}[active])+'()');$('gameChatLog').replaceChildren();draw();}
function message(who,text){const p=document.createElement('p');p.textContent=who+': '+text;$('gameChatLog').append(p);while($('gameChatLog').children.length>60)$('gameChatLog').firstChild.remove();p.scrollIntoView({block:'nearest'});}
window.PyCodeGames={close(){stop();$('gamePanel').hidden=true},async open(id){
 if(busy)return;stop();busy=true;active=id;$('gamePanel').hidden=false;$('gamePanel').scrollIntoView({behavior:'smooth',block:'start'});$('gameStatus').textContent='Carregando Python… O primeiro acesso precisa de internet.';$('gameControls').replaceChildren();$('gameStory').textContent='';$('gameChatLog').replaceChildren();
 $('gameCanvas').hidden=!['cobrinha','tetris'].includes(id);$('gameChatForm').hidden=id!=='bot';$('gamePause').hidden=!['cobrinha','tetris'].includes(id);$('gameReset').disabled=true;$('gamePause').disabled=true;
 try{await runtime();python.runPython(window.PyCodeGameSources[id]);python.runPython('partida = '+({cobrinha:'Cobrinha',tetris:'Tetris',rpg:'Aventura',bot:'Eliza'}[id])+'()');$('gameCanvas').width=id==='tetris'?200:320;$('gameCanvas').height=id==='tetris'?400:320;
 if(id==='cobrinha')for(const [label,value] of [['↑','0,-1'],['←','-1,0'],['↓','0,1'],['→','1,0']])button(label,()=>action('virar',value));
 if(id==='tetris')for(const [label,method,value] of [['←','mover','-1'],['Girar','girar'],['→','mover','1'],['↓','descer'],['Soltar','soltar']])button(label,()=>action(method,value));
 draw();if(id==='bot'){$('gameStatus').textContent='ELIZA · conversa por regras em Python';message('ELIZA','Olá! Digite uma frase e clique em Enviar.');}
 $('gameReset').disabled=false;$('gamePause').disabled=false;
 }catch(e){$('gameStatus').textContent='Não foi possível iniciar: '+e.message;}finally{busy=false;}
 }};
$('gamePause').onclick=()=>{if(!python||busy)return;if(snapshot().fim)return;paused=!paused;$('gamePause').textContent=paused?'Iniciar':'Pausar';clearInterval(timer);if(!paused)timer=setInterval(()=>{try{python.runPython(active==='cobrinha'?'partida.passo()':'partida.descer()');draw()}catch(e){stop();$('gameStatus').textContent=e.message}},active==='cobrinha'?280:700);draw()};
$('gameReset').onclick=reset;$('gameClose').onclick=()=>{stop();$('gamePanel').hidden=true};
$('gameChatForm').onsubmit=e=>{e.preventDefault();if(!python||busy)return;const input=$('gameChatInput'),text=input.value.trim();if(!text)return;python.globals.set('mensagem_usuario',text);message('Você',text);message('ELIZA',python.runPython('partida.responder(mensagem_usuario)'));input.value=''};
window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();
