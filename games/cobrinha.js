// As coordenadas são [x, y]. As bordas se conectam pelo operador %.
const largura = 20, altura = 10;
const teclas = {ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0]};
let cobra, direcao, comida, pontos, virou;
function sortearComida() {
    const livres = [];
    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            if (!cobra.some(p => p[0] === x && p[1] === y)) livres.push([x,y]);
        }
    }
    if (!livres.length) { terminou = true; return null; }
    return livres[Math.floor(Math.random() * livres.length)];
}
function reiniciar() {
    cobra = [[5,5],[4,5]];
    direcao = [1,0]; pontos = 0; virou = false;
    comida = sortearComida();
}
function comando(tecla) {
    const nova = teclas[tecla];
    if (!nova || virou) return;
    if (nova[0] === -direcao[0] && nova[1] === -direcao[1]) return;
    direcao = nova; virou = true;
}
function atualizar() {
    const x = (cobra[0][0] + direcao[0] + largura) % largura;
    const y = (cobra[0][1] + direcao[1] + altura) % altura;
    cobra.unshift([x,y]); virou = false;
    if (comida && x === comida[0] && y === comida[1]) {
        pontos += 10; comida = sortearComida();
    } else cobra.pop();
    // Modo livre: passar pelo próprio corpo não encerra a partida.
}
function desenhar() {
    const linhas = [];
    for (let y = 0; y < altura; y++) {
        let linha = '';
        for (let x = 0; x < largura; x++) {
            if (cobra[0][0] === x && cobra[0][1] === y) linha += '@';
            else if (cobra.some(p => p[0] === x && p[1] === y)) linha += 'o';
            else if (comida && comida[0] === x && comida[1] === y) linha += '*';
            else linha += ' ';
        }
        linhas.push(linha);
    }
    return moldura(linhas) + '\nPontos: ' + pontos + (terminou ? ' | VOCE VENCEU!' : '\nSetas: mover | bordas infinitas | sem colisao');
}
