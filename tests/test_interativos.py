import importlib.util
import unittest
from pathlib import Path

def carregar(nome):
    spec = importlib.util.spec_from_file_location(nome, Path('aulas/interativos') / (nome + '.py'))
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo

Cobrinha = carregar('cobrinha').Cobrinha
Tetris = carregar('tetris').Tetris
Aventura = carregar('rpg').Aventura
Eliza = carregar('eliza').Eliza

class TestCobrinha(unittest.TestCase):
    def test_movimento_e_crescimento(self):
        j = Cobrinha()
        j.comida = (6, 7)
        j.passo()
        self.assertEqual(j.corpo[0], (6, 7))
        self.assertEqual(len(j.corpo), 4)
        self.assertEqual(j.pontos, 1)
        self.assertNotIn(j.comida, j.corpo)

    def test_reversao_e_comandos_no_mesmo_passo(self):
        j = Cobrinha()
        j.virar(-1, 0)
        self.assertEqual(j.proxima, (1, 0))
        j.virar(0, -1)
        j.virar(-1, 0)
        j.passo()
        self.assertEqual(j.corpo[0], (5, 6))

    def test_parede_e_corpo(self):
        j = Cobrinha()
        j.corpo = [(15, 7), (14, 7)]
        j.passo()
        self.assertTrue(j.fim)
        j = Cobrinha()
        j.corpo = [(5, 7), (5, 6), (6, 6), (6, 7), (7, 7)]
        j.passo()
        self.assertTrue(j.fim)

    def test_cauda_que_desocupa(self):
        j = Cobrinha()
        j.corpo = [(5,7),(5,6),(6,6),(6,7)]
        j.comida = (0,0)
        j.passo()
        self.assertFalse(j.fim)

class TestTetris(unittest.TestCase):
    def test_paredes_rotacao_queda(self):
        j = Tetris()
        j.peca = [[1,1,1,1]]
        j.x = 0
        j.mover(-1)
        self.assertEqual(j.x, 0)
        j.girar()
        self.assertEqual(j.peca, [[1],[1],[1],[1]])
        j.soltar()
        self.assertEqual(sum(bool(v) for row in j.tabuleiro for v in row), 4)

    def test_limpa_linha_e_pontua(self):
        j = Tetris()
        j.tabuleiro[19] = [1]*6+[0]*4
        j.peca = [[1,1,1,1]]
        j.x, j.y = 6, 0
        j.soltar()
        self.assertEqual(j.linhas, 1)
        self.assertEqual(j.pontos, 100)
        self.assertEqual(j.tabuleiro, [[0]*10 for _ in range(20)])

    def test_fim_de_jogo_na_entrada(self):
        j = Tetris()
        j.tabuleiro[0] = [1]*10
        j.nova_peca()
        self.assertTrue(j.fim)
        antes = [row[:] for row in j.tabuleiro]
        j.soltar()
        self.assertEqual(j.tabuleiro, antes)

class TestRPG(unittest.TestCase):
    def test_chave_vitoria_e_reinicio(self):
        j = Aventura()
        j.escolher('floresta')
        j.escolher('bau')
        j.escolher('bau')
        self.assertEqual(j.inventario, ['chave'])
        j.escolher('torre')
        j.escolher('abrir')
        self.assertTrue(j.fim)
        self.assertIn('Vitória', j.mensagem)
        j.escolher('reiniciar')
        self.assertEqual(j.vida, 10)
        self.assertFalse(j.fim)
        self.assertEqual(j.inventario, [])

    def test_portao_trancado_derrota_e_descanso(self):
        j = Aventura()
        j.escolher('floresta')
        j.escolher('torre')
        j.escolher('abrir')
        self.assertFalse(j.fim)
        j.escolher('floresta')
        j.escolher('trilha')
        j.escolher('cidade')
        j.escolher('descansar')
        self.assertEqual(j.vida, 10)
        j.escolher('floresta')
        for _ in range(4):
            j.escolher('trilha')
        self.assertEqual(j.vida, 0)
        self.assertTrue(j.fim)

class TestEliza(unittest.TestCase):
    def test_padroes_reflexao_e_acentos(self):
        j = Eliza()
        self.assertEqual(j.responder('Eu preciso de minha família.'), 'Por que você precisa de sua família?')
        self.assertEqual(j.responder('EU ESTOU cansado!'), 'Há quanto tempo você está cansado?')
        self.assertIn('família', j.responder('Meu pai chegou'))
        self.assertNotIn('Olá!', j.responder('coisa'))
        self.assertIn('Olá!', j.responder('Oi!'))

    def test_encerramento(self):
        j = Eliza()
        self.assertIn('Até', j.responder('sair'))
        self.assertIn('encerrada', j.responder('oi'))

if __name__ == '__main__':
    unittest.main()
