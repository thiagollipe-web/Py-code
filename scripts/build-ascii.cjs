// Gera as células e notebooks a partir de uma única fonte dos jogos.
const fs=require('node:fs');
const config={cobrinha:['Cobrinha ASCII',200],pong:['Ping-Pong ASCII',160],tetris:['Tetris ASCII',500],rpg:['RPG ASCII',0]};
const output={};
for(const [id,[title,speed]] of Object.entries(config)){
 const core=fs.readFileSync(`games/${id}.js`,'utf8');
 const html=`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<style>body{margin:0;background:#111;color:#a6ff99;padding:12px;font:14px monospace}pre{font:clamp(11px,3vw,17px)/1.2 monospace;white-space:pre;overflow:auto;outline:none;max-width:100%;margin:12px 0}pre:focus{outline:2px solid #a6ff99;outline-offset:3px}button{background:#223b22;color:#caffbc;border:1px solid #75956b;border-radius:5px;padding:9px;margin:3px;cursor:pointer;touch-action:manipulation}button:focus-visible{outline:2px solid white}#status{font-size:12px}h2{font-size:16px}</style>
<h2>${title}</h2><button id="inicio">Iniciar / reiniciar</button><button id="pausa">Pausar / continuar</button><span id="status" role="status">Toque em Iniciar.</span>
<pre id="tela" tabindex="0" aria-label="${title}. Clique aqui e use as setas."></pre>
<div aria-label="Controles de toque"><button data-key="ArrowUp" aria-label="Cima">Cima</button><button data-key="ArrowDown" aria-label="Baixo">Baixo</button><button data-key="ArrowLeft" aria-label="Esquerda">Esq.</button><button data-key="ArrowRight" aria-label="Direita">Dir.</button>${id==='tetris'?'<button data-key=" " aria-label="Soltar peça">Soltar</button>':''}</div>
<script>
'use strict';
const tela=document.getElementById('tela'), status=document.getElementById('status');
let tempo=null, rodando=false, terminou=false;
function moldura(linhas){const borda='+'+'-'.repeat(linhas[0].length)+'+';return borda+'\\n'+linhas.map(l=>'|'+l+'|').join('\\n')+'\\n'+borda;}
${core}
function mostrar(){tela.textContent=desenhar();if(terminou){parar();status.textContent='Partida encerrada. Toque em Iniciar para jogar outra vez.';}}
function parar(){clearInterval(tempo);tempo=null;rodando=false;}
function continuar(){if(terminou)return;parar();rodando=true;status.textContent='Jogando. Clique no desenho para usar as setas.';${speed?`tempo=setInterval(()=>{atualizar();mostrar();},${speed});`:''}tela.focus();}
function iniciar(){parar();terminou=false;reiniciar();mostrar();continuar();}
function receber(tecla){if(!rodando||terminou)return;comando(tecla);mostrar();}
tela.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)){e.preventDefault();receber(e.key);}});
document.querySelectorAll('[data-key]').forEach(b=>b.onclick=()=>{receber(b.dataset.key);tela.focus();});
document.getElementById('inicio').onclick=iniciar;
document.getElementById('pausa').onclick=()=>{if(rodando){parar();status.textContent='Pausado.';}else continuar();};
window.addEventListener('pagehide',parar);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&rodando){parar();status.textContent='Pausado. Toque em continuar.';}});
reiniciar();mostrar();
</script></html>`;
 // raw string prevents Python from converting JavaScript \n escapes into invalid literals.
 const code=`from IPython.display import HTML, display\nfrom html import escape\n\n# Python mostra a saída; JavaScript anima o ASCII e recebe as setas.\njogo = r"""${html}"""\n\ndisplay(HTML('<iframe title="${title}" sandbox="allow-scripts" style="width:100%;height:620px;border:0" srcdoc="' + escape(jogo, quote=True) + '"></iframe>'))`;
 output[id]=code;
 const notebook={nbformat:4,nbformat_minor:5,metadata:{kernelspec:{display_name:'Python 3',language:'python',name:'python3'},language_info:{name:'python'},colab:{name:`${id}-ascii.ipynb`}},cells:[{cell_type:'markdown',id:'intro-'+id,metadata:{},source:[`# ${title}\nExecute a célula, clique em **Iniciar** e depois no desenho. Use as setas ou botões.\n\nPython exibe HTML; JavaScript controla o jogo no navegador. Não precisa instalar pacotes.\n\nA cobrinha atravessa as bordas e o próprio corpo. O Tetris usa blocos ASCII, o Pong é contra o computador e o RPG pede uma chave para abrir a porta.`]},{cell_type:'code',id:'game-'+id,execution_count:null,metadata:{},outputs:[],source:code.split('\n').map((l,i,a)=>l+(i<a.length-1?'\n':''))}]};
 fs.writeFileSync(`notebooks/${id}-ascii.ipynb`,JSON.stringify(notebook,null,2)+'\n');
}
fs.writeFileSync('ascii-games.js','/* Gerado por scripts/build-ascii.cjs. */\nwindow.PyCodeASCII = '+JSON.stringify(output,null,2)+';\n');
