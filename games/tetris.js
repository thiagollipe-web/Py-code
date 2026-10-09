// O tabuleiro é uma matriz. # é uma peça fixa e @ é a peça caindo.
const largura = 10, altura = 16;
const formas = [ [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]] ];
let tabuleiro, peca, x, y, pontos;
function cabe(px, py, forma) {
    return forma.every((linha, dy) => linha.every((bloco, dx) => !bloco ||
        (px+dx >= 0 && px+dx < largura && py+dy >= 0 && py+dy < altura && !tabuleiro[py+dy][px+dx])));
}
function novaPeca() {
    peca = formas[Math.floor(Math.random()*formas.length)].map(linha => [...linha]);
    x = Math.floor((largura - peca[0].length) / 2); y = 0;
    if (!cabe(x,y,peca)) terminou = true;
}
function reiniciar() {
    tabuleiro = Array.from({length:altura}, () => Array(largura).fill(0));
    pontos = 0; novaPeca();
}
function fixar() {
    peca.forEach((linha,dy) => linha.forEach((bloco,dx) => { if (bloco) tabuleiro[y+dy][x+dx] = 1; }));
    const restantes = tabuleiro.filter(linha => linha.some(bloco => bloco === 0));
    pontos += (altura - restantes.length) * 100;
    while (restantes.length < altura) restantes.unshift(Array(largura).fill(0));
    tabuleiro = restantes; novaPeca();
}
function atualizar() {
    if (cabe(x,y+1,peca)) y++;
    else fixar();
}
function comando(tecla) {
    if (tecla === 'ArrowLeft' && cabe(x-1,y,peca)) x--;
    if (tecla === 'ArrowRight' && cabe(x+1,y,peca)) x++;
    if (tecla === 'ArrowDown') atualizar();
    if (tecla === 'ArrowUp') {
        const girada = peca[0].map((_,coluna) => peca.map(linha => linha[coluna]).reverse());
        if (cabe(x,y,girada)) peca = girada;
    }
    if (tecla === ' ') {
        while (cabe(x,y+1,peca)) y++;
        fixar();
    }
}
function desenhar() {
    const desenho = tabuleiro.map(linha => linha.map(bloco => bloco ? '#' : '.'));
    if (!terminou) peca.forEach((linha,dy) => linha.forEach((bloco,dx) => { if (bloco) desenho[y+dy][x+dx] = '@'; }));
    return moldura(desenho.map(linha => linha.join(''))) + '\nPontos: ' + pontos + '\n' + (terminou ? 'FIM DE JOGO: o tabuleiro encheu.' : 'Cima: girar | Baixo: descer\nEsquerda/direita: mover | Espaco: soltar');
}
