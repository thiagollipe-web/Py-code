// A bola O rebate nas raquetes |. Vença ao marcar 5 pontos.
const largura = 28, altura = 12;
let jogador, computador, bolaX, bolaY, vx, vy, pontos, rival, passos;
function servir(sentido) {
    bolaX = Math.floor(largura / 2); bolaY = Math.floor(altura / 2);
    vx = sentido; vy = 1;
}
function reiniciar() {
    jogador = computador = 5; pontos = rival = passos = 0; servir(1);
}
function comando(tecla) {
    if (tecla === 'ArrowUp') jogador = Math.max(1, jogador - 1);
    if (tecla === 'ArrowDown') jogador = Math.min(altura - 2, jogador + 1);
}
function atualizar() {
    passos++;
    if (passos % 2 === 0) computador = Math.max(1, Math.min(altura - 2, computador + Math.sign(bolaY - computador)));
    bolaX += vx; bolaY += vy;
    if (bolaY <= 0 || bolaY >= altura - 1) vy = -vy;
    if (bolaX === 1 && vx < 0 && Math.abs(bolaY - jogador) <= 1) vx = 1;
    if (bolaX === largura - 2 && vx > 0 && Math.abs(bolaY - computador) <= 1) vx = -1;
    if (bolaX < 0) { rival++; servir(1); }
    if (bolaX >= largura) { pontos++; servir(-1); }
    terminou = pontos >= 5 || rival >= 5;
}
function desenhar() {
    const linhas = [];
    for (let y = 0; y < altura; y++) {
        let linha = '';
        for (let x = 0; x < largura; x++) {
            if (x === bolaX && y === bolaY) linha += 'O';
            else if ((x === 1 && Math.abs(y-jogador) <= 1) || (x === largura-2 && Math.abs(y-computador) <= 1)) linha += '|';
            else linha += x === Math.floor(largura/2) ? ':' : ' ';
        }
        linhas.push(linha);
    }
    return moldura(linhas) + '\nVoce: ' + pontos + ' | Computador: ' + rival + '\n' + (terminou ? (pontos >= 5 ? 'VOCE VENCEU!' : 'FIM DE JOGO. Tente novamente!') : 'Setas para cima/baixo: mover a raquete');
}
