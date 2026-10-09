// @ é o herói, K é a chave, D é a porta e # é uma parede.
const mapaInicial = [
    '################',
    '#@.....#.......#',
    '#.###..#..###..#',
    '#...#.....#K...#',
    '###.#..#..###..#',
    '#......#.......#',
    '#..########.#..#',
    '#...........#D.#',
    '################'
];
const largura = mapaInicial[0].length, altura = mapaInicial.length;
const teclas = {ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0]};
let mapa, x, y, chave, passos, mensagem;
function reiniciar() {
    mapa = mapaInicial.map(linha => linha.split('')); x = 1; y = 1;
    mapa[y][x] = '.'; chave = false; passos = 0; mensagem = 'Encontre K e depois alcance D.';
}
function comando(tecla) {
    const direcao = teclas[tecla]; if (!direcao) return;
    const nx = x+direcao[0], ny = y+direcao[1];
    const destino = mapa[ny]?.[nx];
    if (!destino || destino === '#') { mensagem = 'Parede! Procure outro caminho.'; return; }
    if (destino === 'D' && !chave) { mensagem = 'A porta precisa da chave K.'; return; }
    x = nx; y = ny; passos++;
    if (destino === 'K') { chave = true; mapa[y][x] = '.'; mensagem = 'Chave encontrada! Procure a porta D.'; }
    if (destino === 'D') { terminou = true; mensagem = 'VOCE VENCEU! O tesouro e seu.'; }
}
function atualizar() {} // Este jogo avança a cada tecla, sem movimento automático.
function desenhar() {
    const desenho = mapa.map(linha => [...linha]); desenho[y][x] = '@';
    return desenho.map(linha => linha.join('')).join('\n') + '\nChave: ' + (chave ? 'sim' : 'nao') + ' | Passos: ' + passos + '\n' + mensagem + '\nSetas: caminhar | # parede | K chave | D saida';
}
