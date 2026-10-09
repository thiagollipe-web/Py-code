// Gera as células e notebooks a partir de uma única fonte dos jogos.
const fs=require('node:fs');
const config={cobrinha:['Cobrinha ASCII',200],pong:['Ping-Pong ASCII',160],tetris:['Tetris ASCII',500],rpg:['RPG ASCII',0]};
const output={};
for(const [id,[title,speed]] of Object.entries(config)){
 const core=fs.readFileSync(`games/${id}.js`,'utf8');
 const markup=`<b>${title}</b><p><button data-action="restart">Reiniciar</button> <button data-action="pause">Pausar / continuar</button></p><span role="status"></span><pre tabindex="0" aria-label="Jogo ASCII: use as setas" style="font:14px/1.2 monospace;overflow:auto;outline:1px solid #486;padding:6px"></pre><div><button data-key="ArrowUp">Cima</button><button data-key="ArrowDown">Baixo</button><button data-key="ArrowLeft">Esquerda</button><button data-key="ArrowRight">Direita</button>${id==='tetris'?'<button data-key=" ">Soltar</button>':''}</div>`;
 const script=`(() => {
// O painel fica na saída desta célula, sem iframe dentro de iframe.
const painel = document.createElement('div');
painel.style = 'background:#111;color:#a6ff99;padding:12px;max-width:100%;font:14px monospace';
painel.innerHTML = ${JSON.stringify(markup)};
document.body.appendChild(painel);
const tela = painel.querySelector('pre'), aviso = painel.querySelector('[role="status"]');
let tempo = null, rodando = false, terminou = false;
function moldura(linhas) {
    const borda = '+' + '-'.repeat(linhas[0].length) + '+';
    return [borda, ...linhas.map(l => '|' + l + '|'), borda].join(String.fromCharCode(10));
}
${core}
function parar() { clearInterval(tempo); tempo = null; rodando = false; }
function mostrar() {
    tela.textContent = desenhar();
    if (terminou) { parar(); aviso.textContent = 'Fim da partida. Use Reiniciar.'; }
}
function continuar() {
    if (terminou) return;
    parar(); rodando = true;
    aviso.textContent = 'Clique no desenho e use as setas, ou toque nos botoes.';
    ${speed?`tempo = setInterval(() => { if (!painel.isConnected) { parar(); return; } atualizar(); mostrar(); }, ${speed});`:''}
    tela.focus();
}
function iniciar() { parar(); terminou = false; reiniciar(); mostrar(); continuar(); }
function receber(tecla) { if (rodando && !terminou) { comando(tecla); mostrar(); } }
tela.onkeydown = e => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
        e.preventDefault(); receber(e.key);
    }
};
painel.querySelectorAll('[data-key]').forEach(b => b.onclick = () => { receber(b.dataset.key); tela.focus(); });
painel.querySelector('[data-action="restart"]').onclick = iniciar;
painel.querySelector('[data-action="pause"]').onclick = () => {
    if (rodando) { parar(); aviso.textContent = 'Pausado.'; } else continuar();
};
window.addEventListener('pagehide', parar, {once:true});
iniciar();
})();`;
 const code=`from IPython.display import Javascript, display\n\n# Execute esta célula inteira. Clique no desenho e use as setas.\n# Python exibe a saída; JavaScript controla o jogo no navegador.\ndisplay(Javascript(r"""${script}"""))`;
 output[id]=code;
 const notebook={nbformat:4,nbformat_minor:5,metadata:{kernelspec:{display_name:'Python 3',language:'python',name:'python3'},language_info:{name:'python'},colab:{name:`${id}-ascii.ipynb`}},cells:[{cell_type:'markdown',id:'intro-'+id,metadata:{},source:[`# ${title}\nExecute a célula, clique no desenho. O jogo começa automaticamente. Use as setas ou botões.\n\nPython exibe HTML; JavaScript controla o jogo no navegador. Não precisa instalar pacotes.\n\nA cobrinha atravessa as bordas e o próprio corpo. O Tetris usa blocos ASCII, o Pong é contra o computador e o RPG pede uma chave para abrir a porta.`]},{cell_type:'code',id:'game-'+id,execution_count:null,metadata:{},outputs:[],source:code.split('\n').map((l,i,a)=>l+(i<a.length-1?'\n':''))}]};
 fs.writeFileSync(`notebooks/${id}-ascii.ipynb`,JSON.stringify(notebook,null,2)+'\n');
}
fs.writeFileSync('ascii-games.js','/* Gerado por scripts/build-ascii.cjs. */\nwindow.PyCodeASCII = '+JSON.stringify(output,null,2)+';\n');
