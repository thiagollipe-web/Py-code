/* Aulas de Python e projetos interativos para Google Colab. */
(function(global){
"use strict";
const modules=[
  {
    "id": "inicio",
    "name": "O que é Python?",
    "tag": "01 • Comece aqui",
    "subtitle": "Comandos, texto e variáveis",
    "intro": "Python é uma linguagem de programação. Um programa é uma sequência de instruções que o computador executa. No Google Colab você escreve Python em células e clica em executar.",
    "challenge": "Troque o nome do aluno e faça o programa mostrar uma segunda mensagem.",
    "hints": [
      "O comando print mostra texto.",
      "Textos precisam ficar entre aspas.",
      "Uma variável guarda um valor e pode ser usada mais de uma vez."
    ],
    "steps": [
      {
        "code": "print(\"Olá, mundo!\")",
        "explain": "print() mostra uma mensagem na tela. As aspas marcam um texto."
      },
      {
        "code": "nome = \"Ana\"\nprint(nome)",
        "explain": "A variável nome guarda um texto. print(nome) usa o conteúdo da variável."
      },
      {
        "code": "nome = \"Ana\"\nprint(\"Olá,\", nome)",
        "explain": "O mesmo programa pode juntar texto e variável sem complicar o código."
      }
    ]
  },
  {
    "id": "listas",
    "name": "Listas Python",
    "tag": "02 • Coleções",
    "subtitle": "Guardar e percorrer valores",
    "intro": "Listas guardam vários elementos na mesma variável. Os índices começam em zero. Experimente alterar as frutas.",
    "challenge": "Crie uma lista de três animais, adicione um quarto com append e mostre o segundo item.",
    "hints": [
      "Use colchetes e separe os itens por vírgulas. Textos precisam de aspas.",
      "O método append adiciona um item ao final da lista.",
      "Conte as posições começando em zero. Qual é a segunda?"
    ],
    "steps": [
      {
        "code": "frutas = [\"maçã\", \"uva\", \"banana\"]\nprint(frutas)",
        "explain": "Uma lista aparece entre colchetes. Os três itens são textos."
      },
      {
        "code": "frutas = [\"maçã\", \"uva\", \"banana\"]\nprint(frutas[0])",
        "explain": "frutas[0] pega o primeiro elemento. Python começa a contar em zero."
      },
      {
        "code": "frutas = [\"maçã\", \"uva\"]\nfrutas.append(\"banana\")\nfor fruta in frutas:\n    print(fruta)",
        "explain": "append adiciona um elemento. for percorre cada item e print o mostra."
      }
    ]
  },
  {
    "id": "calculos",
    "name": "Cálculos e decisões",
    "tag": "03 • Lógica",
    "subtitle": "Variáveis, if e repetição",
    "intro": "Programar também é escolher caminhos: if decide, for repete, e os operadores fazem cálculos.",
    "challenge": "Altere a variável pontos para 3 e depois para 15. Explique a diferença de saída.",
    "hints": [
      "O operador >= significa maior ou igual.",
      "if só executa o bloco quando a condição é verdadeira.",
      "Os espaços antes de print indicam que ele está dentro do if."
    ],
    "steps": [
      {
        "code": "a = 4\nb = 3\nprint(a + b)",
        "explain": "+ soma. Guarde os números em variáveis simples para reaproveitar."
      },
      {
        "code": "pontos = 12\nif pontos >= 10:\n    print(\"Você passou de fase!\")\nelse:\n    print(\"Continue tentando!\")",
        "explain": "if verifica uma condição. else é o caminho contrário."
      },
      {
        "code": "for numero in range(1, 6):\n    print(numero)",
        "explain": "range(1, 6) produz 1, 2, 3, 4, 5. A repetição economiza linhas."
      }
    ]
  },
  {
    "id": "cobrinha",
    "name": "Cobrinha",
    "tag": "04 • Jogos",
    "subtitle": "Aprenda coordenadas e listas",
    "intro": "Cobrinha jogável com tabuleiro, alimento, pontuação e colisão. Na etapa 4, instale os widgets; na etapa 5, execute o programa inteiro, clique em Iniciar e use os botões de direção. Os primeiros exemplos continuam ensinando os fundamentos. A interface abre na saída do Colab, com uma sessão conectada; estes códigos não executam dentro do site.",
    "challenge": "Altere o intervalo de asyncio.sleep de 0.28 para 0.4 e compare a velocidade.",
    "hints": [
      "A cabeça é a posição de índice 0.",
      "Para andar, some 1 à coordenada x.",
      "Use inserir no início e remover no final para simular movimento."
    ],
    "steps": [
      {
        "code": "cobra = [(2, 2), (1, 2), (0, 2)]\nprint(cobra)",
        "explain": "Cada tupla (x, y) representa uma parte da cobrinha."
      },
      {
        "code": "cobra = [(2, 2), (1, 2), (0, 2)]\nx, y = cobra[0]\ncobra.insert(0, (x + 1, y))\ncobra.pop()\nprint(cobra)",
        "explain": "A nova cabeça vai para x+1. pop remove a última parte, mantendo o tamanho."
      },
      {
        "code": "cobra = [(2, 2), (1, 2), (0, 2)]\nfor passo in range(3):\n    x, y = cobra[0]\n    cobra.insert(0, (x + 1, y))\n    cobra.pop()\n    print(\"Passo\", passo + 1, cobra)",
        "explain": "for repete o movimento. O objetivo é compreender a regra antes do desenho."
      },
      {
        "code": "%pip install -q \"ipywidgets>=8.1,<9\"",
        "explain": "Preparação: execute esta célula no Google Colab. Se houver pedido de reinício, reinicie a sessão e execute a etapa seguinte. Esta instalação é comum aos quatro projetos.",
        "colabOnly": true
      },
      {
        "code": "import random\n\nclass Cobrinha:\n    def __init__(self, tamanho=16):\n        self.tamanho = tamanho\n        self.corpo = [(5, 7), (4, 7), (3, 7)]\n        self.direcao = (1, 0)\n        self.proxima = self.direcao\n        self.pontos = 0\n        self.fim = False\n        self.comida = self.sortear_comida()\n\n    def sortear_comida(self):\n        livres = [(x, y) for x in range(self.tamanho) for y in range(self.tamanho)\n                  if (x, y) not in self.corpo]\n        return random.choice(livres) if livres else None\n\n    def virar(self, dx, dy):\n        if (dx, dy) in [(1, 0), (-1, 0), (0, 1), (0, -1)]:\n            if (dx, dy) != (-self.direcao[0], -self.direcao[1]):\n                self.proxima = (dx, dy)\n\n    def passo(self):\n        if self.fim:\n            return\n        self.direcao = self.proxima\n        x, y = self.corpo[0]\n        cabeca = (x + self.direcao[0], y + self.direcao[1])\n        cresce = cabeca == self.comida\n        obstaculos = self.corpo if cresce else self.corpo[:-1]\n        if not (0 <= cabeca[0] < self.tamanho and 0 <= cabeca[1] < self.tamanho) or cabeca in obstaculos:\n            self.fim = True\n            return\n        self.corpo.insert(0, cabeca)\n        if cresce:\n            self.pontos += 1\n            self.comida = self.sortear_comida()\n            if self.comida is None:\n                self.fim = True\n        else:\n            self.corpo.pop()\n\nif __name__ == \"__main__\":\n    import asyncio\n    import ipywidgets as w\n    from IPython.display import display\n    try:\n        from google.colab import output\n        output.enable_custom_widget_manager()\n    except ImportError:\n        pass\n\n    # Encerra a partida anterior quando a célula é executada novamente.\n    if \"tarefa_cobrinha\" in globals():\n        tarefa_cobrinha.cancel()\n    jogo = Cobrinha()\n    rodando = False\n    painel = w.HTML()\n    iniciar = w.Button(description=\"Iniciar / Pausar\")\n    reiniciar = w.Button(description=\"Reiniciar\")\n\n    def desenhar():\n        blocos = \"\"\n        for i, (x, y) in enumerate(jogo.corpo):\n            cor = \"#a3e635\" if i == 0 else \"#22c55e\"\n            blocos += f'<rect x=\"{x*20+1}\" y=\"{y*20+1}\" width=\"18\" height=\"18\" rx=\"4\" fill=\"{cor}\"/>'\n        if jogo.comida is not None:\n            x, y = jogo.comida\n            blocos += f'<circle cx=\"{x*20+10}\" cy=\"{y*20+10}\" r=\"7\" fill=\"#fb7185\"/>'\n        estado = \"Fim de jogo — Reinicie\" if jogo.fim else (\"Jogando\" if rodando else \"Pausado — clique em Iniciar\")\n        painel.value = f'<p><b>Cobrinha | Pontos: {jogo.pontos}</b> | {estado}</p><svg viewBox=\"0 0 320 320\" width=\"320\" style=\"max-width:100%;background:#0f172a\">{blocos}</svg>'\n\n    def alternar(_):\n        global rodando\n        if not jogo.fim:\n            rodando = not rodando\n        desenhar()\n\n    def resetar(_):\n        global jogo, rodando\n        jogo = Cobrinha()\n        rodando = False\n        desenhar()\n\n    iniciar.on_click(alternar)\n    reiniciar.on_click(resetar)\n    botoes = []\n    for texto, dx, dy in [(\"↑\", 0, -1), (\"←\", -1, 0), (\"↓\", 0, 1), (\"→\", 1, 0)]:\n        b = w.Button(description=texto, layout=w.Layout(width=\"65px\", height=\"45px\"))\n        b.on_click(lambda _, dx=dx, dy=dy: jogo.virar(dx, dy))\n        botoes.append(b)\n\n    async def atualizar():\n        while True:\n            await asyncio.sleep(0.28)\n            if rodando and not jogo.fim:\n                jogo.passo()\n                desenhar()\n\n    display(w.VBox([painel, w.HBox(botoes), w.HBox([iniciar, reiniciar])]))\n    desenhar()\n    tarefa_cobrinha = asyncio.get_running_loop().create_task(atualizar())\n",
        "explain": "Cobrinha jogável com tabuleiro, alimento, pontuação e colisão. Na etapa 4, instale os widgets; na etapa 5, execute o programa inteiro, clique em Iniciar e use os botões de direção. Não use um arquivo .py no terminal para esta interface: ela depende do ambiente de notebook e, nos dois jogos de tabuleiro, do loop assíncrono do Colab.",
        "colabOnly": true,
        "interactive": true
      }
    ]
  },
  {
    "id": "pong",
    "name": "Ping-Pong",
    "tag": "05 • Jogos",
    "subtitle": "Bola e colisão",
    "intro": "O Pong é um ótimo primeiro projeto: posição, velocidade e um teste if para a bola rebater.",
    "challenge": "Na etapa 3, altere limite_direito para 6. Execute novamente e anote em quais passos a velocidade muda de sinal.",
    "hints": [
      "A velocidade pode ser 1 ou -1.",
      "Se a bola encostar no limite, inverta a velocidade.",
      "Teste o movimento com print a cada passo."
    ],
    "steps": [
      {
        "code": "bola = 0\nvelocidade = 1\nbola = bola + velocidade\nprint(bola)",
        "explain": "A posição aumenta quando a velocidade é positiva."
      },
      {
        "code": "bola = 4\nvelocidade = 1\nlimite_direito = 5\nbola = bola + velocidade\nif bola >= limite_direito:\n    bola = limite_direito\n    velocidade = -abs(velocidade)\nprint(\"Posição:\", bola)\nprint(\"Direção:\", velocidade)",
        "explain": "Primeiro movemos a bola de 4 para 5. Ao alcançar a borda, a velocidade passa a -1. Saída: Posição: 5 e Direção: -1."
      },
      {
        "code": "limite_esquerdo = 0\nlimite_direito = 5\nbola = 2\nvelocidade = 1\nfor tempo in range(1, 11):\n    bola = bola + velocidade\n    if bola >= limite_direito:\n        bola = limite_direito\n        velocidade = -abs(velocidade)\n    elif bola <= limite_esquerdo:\n        bola = limite_esquerdo\n        velocidade = abs(velocidade)\n    print(\"Passo\", tempo, \"posição\", bola, \"direção\", velocidade)",
        "explain": "A bola rebate nos dois limites. >= e <= também detectam quando um movimento ultrapassa a borda; ajustamos a posição para ficar dentro da quadra. É uma simulação textual, sem raquetes."
      }
    ]
  },
  {
    "id": "tetris",
    "name": "Tetris",
    "tag": "06 • Jogos",
    "subtitle": "Matrizes e peças",
    "intro": "Tetris jogável com sete peças, rotação, queda automática, remoção de linhas e pontuação. Execute a instalação da etapa 4 e o programa da etapa 5; clique em Iniciar e use os botões. Os primeiros exemplos continuam ensinando os fundamentos. A interface abre na saída do Colab, com uma sessão conectada; estes códigos não executam dentro do site.",
    "challenge": "Altere a pontuação de uma linha de 100 para 150 e complete uma linha.",
    "hints": [
      "A matriz é uma lista de linhas.",
      "Use 0 para espaço vazio e 1 para bloco.",
      "Um for dentro de outro for pode visitar cada número."
    ],
    "steps": [
      {
        "code": "peca = [[1, 1], [1, 1]]\nprint(peca)",
        "explain": "Uma peça é representada por duas linhas com dois blocos cada."
      },
      {
        "code": "peca = [[0, 1, 0], [1, 1, 1]]\nfor linha in peca:\n    print(linha)",
        "explain": "Cada sublista é uma linha da peça, percorrida com for."
      },
      {
        "code": "peca = [[0, 1, 0], [1, 1, 1]]\nfor linha in peca:\n    desenho = \"\"\n    for bloco in linha:\n        desenho += \"[]\" if bloco else \"  \"\n    print(desenho)",
        "explain": "Transformamos os números em desenho textual. A lógica é curta e funciona no Colab."
      },
      {
        "code": "%pip install -q \"ipywidgets>=8.1,<9\"",
        "explain": "Preparação: execute esta célula no Google Colab. Se houver pedido de reinício, reinicie a sessão e execute a etapa seguinte. Esta instalação é comum aos quatro projetos.",
        "colabOnly": true
      },
      {
        "code": "import random\n\nclass Tetris:\n    PECAS = [ [[1,1,1,1]], [[2,2],[2,2]], [[0,3,0],[3,3,3]],\n              [[0,4,4],[4,4,0]], [[5,5,0],[0,5,5]],\n              [[6,0,0],[6,6,6]], [[0,0,7],[7,7,7]] ]\n\n    def __init__(self):\n        self.tabuleiro = [[0]*10 for _ in range(20)]\n        self.pontos = 0\n        self.linhas = 0\n        self.fim = False\n        self.nova_peca()\n\n    def nova_peca(self):\n        self.peca = [linha[:] for linha in random.choice(self.PECAS)]\n        self.x = (10-len(self.peca[0]))//2\n        self.y = 0\n        if not self.cabe(self.peca, self.x, self.y):\n            self.fim = True\n\n    def cabe(self, peca, x, y):\n        for dy, linha in enumerate(peca):\n            for dx, valor in enumerate(linha):\n                if valor and (not 0 <= x+dx < 10 or not 0 <= y+dy < 20 or self.tabuleiro[y+dy][x+dx]):\n                    return False\n        return True\n\n    def mover(self, dx):\n        if not self.fim and self.cabe(self.peca, self.x+dx, self.y):\n            self.x += dx\n\n    def girar(self):\n        if self.fim:\n            return\n        girada = [list(linha) for linha in zip(*self.peca[::-1])]\n        for ajuste in [0, -1, 1, -2, 2]:\n            if self.cabe(girada, self.x+ajuste, self.y):\n                self.peca = girada\n                self.x += ajuste\n                return\n\n    def descer(self):\n        if self.fim:\n            return\n        if self.cabe(self.peca, self.x, self.y+1):\n            self.y += 1\n            return\n        for dy, linha in enumerate(self.peca):\n            for dx, valor in enumerate(linha):\n                if valor:\n                    self.tabuleiro[self.y+dy][self.x+dx] = valor\n        restantes = [linha for linha in self.tabuleiro if not all(linha)]\n        removidas = 20-len(restantes)\n        self.tabuleiro = [[0]*10 for _ in range(removidas)] + restantes\n        self.linhas += removidas\n        self.pontos += [0, 100, 300, 500, 800][removidas]\n        self.nova_peca()\n\n    def soltar(self):\n        if self.fim:\n            return\n        while self.cabe(self.peca, self.x, self.y+1):\n            self.y += 1\n        self.descer()\n\nif __name__ == \"__main__\":\n    import asyncio\n    import ipywidgets as w\n    from IPython.display import display\n    try:\n        from google.colab import output\n        output.enable_custom_widget_manager()\n    except ImportError:\n        pass\n    if \"tarefa_tetris\" in globals():\n        tarefa_tetris.cancel()\n    jogo_tetris = Tetris()\n    tetris_rodando = False\n    painel_tetris = w.HTML()\n    cores = [\"#0f172a\", \"#22d3ee\", \"#facc15\", \"#c084fc\", \"#4ade80\", \"#fb7185\", \"#60a5fa\", \"#fb923c\"]\n\n    def desenhar_tetris():\n        j = jogo_tetris\n        quadro = [linha[:] for linha in j.tabuleiro]\n        if not j.fim:\n            for dy, linha in enumerate(j.peca):\n                for dx, valor in enumerate(linha):\n                    if valor:\n                        quadro[j.y+dy][j.x+dx] = valor\n        blocos = \"\".join(f'<rect x=\"{x*20+1}\" y=\"{y*20+1}\" width=\"18\" height=\"18\" rx=\"2\" fill=\"{cores[v]}\"/>'\n                         for y, linha in enumerate(quadro) for x, v in enumerate(linha))\n        estado = \"Fim de jogo\" if j.fim else (\"Jogando\" if tetris_rodando else \"Pausado\")\n        painel_tetris.value = f'<p><b>Tetris | Pontos: {j.pontos} | Linhas: {j.linhas}</b> | {estado}</p><svg viewBox=\"0 0 200 400\" width=\"200\" style=\"max-width:100%;background:#1e293b\">{blocos}</svg>'\n\n    def acao_tetris(acao):\n        if not tetris_rodando or jogo_tetris.fim:\n            return\n        acao()\n        desenhar_tetris()\n\n    def pausar_tetris(_):\n        global tetris_rodando\n        if not jogo_tetris.fim:\n            tetris_rodando = not tetris_rodando\n        desenhar_tetris()\n\n    def reiniciar_tetris(_):\n        global jogo_tetris, tetris_rodando\n        jogo_tetris = Tetris()\n        tetris_rodando = False\n        desenhar_tetris()\n\n    controles = []\n    for texto, acao in [(\"←\", lambda: jogo_tetris.mover(-1)), (\"Girar\", lambda: jogo_tetris.girar()),\n                         (\"→\", lambda: jogo_tetris.mover(1)), (\"↓\", lambda: jogo_tetris.descer()),\n                         (\"Soltar\", lambda: jogo_tetris.soltar())]:\n        b = w.Button(description=texto, layout=w.Layout(width=\"65px\", height=\"42px\"))\n        b.on_click(lambda _, acao=acao: acao_tetris(acao))\n        controles.append(b)\n    pausa = w.Button(description=\"Iniciar / Pausar\")\n    pausa.on_click(pausar_tetris)\n    reset = w.Button(description=\"Reiniciar\")\n    reset.on_click(reiniciar_tetris)\n\n    async def atualizar_tetris():\n        while True:\n            await asyncio.sleep(max(0.15, 0.7-jogo_tetris.linhas*0.02))\n            if tetris_rodando and not jogo_tetris.fim:\n                jogo_tetris.descer()\n                desenhar_tetris()\n\n    display(w.VBox([painel_tetris, w.HBox(controles, layout=w.Layout(flex_flow=\"row wrap\")), w.HBox([pausa, reset])]))\n    desenhar_tetris()\n    tarefa_tetris = asyncio.get_running_loop().create_task(atualizar_tetris())\n",
        "explain": "Tetris jogável com sete peças, rotação, queda automática, remoção de linhas e pontuação. Execute a instalação da etapa 4 e o programa da etapa 5; clique em Iniciar e use os botões. Não use um arquivo .py no terminal para esta interface: ela depende do ambiente de notebook e, nos dois jogos de tabuleiro, do loop assíncrono do Colab.",
        "colabOnly": true,
        "interactive": true
      }
    ]
  },
  {
    "id": "rpg",
    "name": "RPG textual",
    "tag": "07 • Jogos",
    "subtitle": "Escolhas e histórias",
    "intro": "RPG interativo com botões de escolha, vida, inventário, derrota e vitória. Execute as etapas 4 e 5; encontre a chave na floresta e abra a torre. Os primeiros exemplos continuam ensinando os fundamentos. A interface abre na saída do Colab, com uma sessão conectada; estes códigos não executam dentro do site.",
    "challenge": "Acrescente um item ao baú e faça esse item aparecer na mochila.",
    "hints": [
      "Use uma variável escolha.",
      "A variável escolha guarda texto: compare com \"3\", entre aspas.",
      "Crie a lista inventario antes de usá-la e adicione o texto \"moeda\" com append."
    ],
    "steps": [
      {
        "code": "nome = \"Aventureiro\"\nvida = 10\nprint(nome, \"tem\", vida, \"de vida\")",
        "explain": "Uma ficha de personagem pode ser feita só com duas variáveis."
      },
      {
        "code": "inventario = [\"mapa\", \"espada\"]\nprint(\"Itens:\", inventario)",
        "explain": "A lista funciona como mochila do herói."
      },
      {
        "code": "inventario = [\"mapa\", \"espada\"]\nescolha = \"1\"\nif escolha == \"1\":\n    print(\"Você entrou na floresta.\")\nelif escolha == \"2\":\n    print(\"Você voltou à cidade.\")\nelse:\n    print(\"Escolha novamente.\")\nprint(\"Itens:\", inventario)",
        "explain": "O exemplo cria seu próprio inventário e não depende da etapa anterior. Altere escolha para \"1\" ou \"2\" para explorar os caminhos. Depois acrescente a opção \"3\" do desafio."
      },
      {
        "code": "%pip install -q \"ipywidgets>=8.1,<9\"",
        "explain": "Preparação: execute esta célula no Google Colab. Se houver pedido de reinício, reinicie a sessão e execute a etapa seguinte. Esta instalação é comum aos quatro projetos.",
        "colabOnly": true
      },
      {
        "code": "class Aventura:\n    def __init__(self):\n        self.local = \"cidade\"\n        self.vida = 10\n        self.inventario = []\n        self.fim = False\n        self.mensagem = \"Encontre a chave na floresta e abra o portão da torre.\"\n\n    def escolher(self, acao):\n        if acao == \"reiniciar\":\n            self.__init__()\n            return\n        if self.fim:\n            return\n        if self.local == \"cidade\":\n            if acao == \"floresta\":\n                self.local = \"floresta\"\n                self.mensagem = \"Há um baú sob uma árvore e uma trilha perigosa.\"\n            elif acao == \"descansar\":\n                self.vida = 10\n                self.mensagem = \"Você descansou. Vida recuperada!\"\n        elif self.local == \"floresta\":\n            if acao == \"bau\":\n                if \"chave\" not in self.inventario:\n                    self.inventario.append(\"chave\")\n                    self.mensagem = \"Você encontrou a chave da torre!\"\n                else:\n                    self.mensagem = \"O baú está vazio; a chave já está na mochila.\"\n            elif acao == \"trilha\":\n                self.vida = max(0, self.vida-3)\n                self.mensagem = \"Espinhos! Você perdeu 3 pontos de vida.\"\n                if self.vida == 0:\n                    self.fim = True\n                    self.mensagem = \"Sua aventura terminou. Clique em Reiniciar.\"\n            elif acao == \"torre\":\n                self.local = \"torre\"\n                self.mensagem = \"Um portão trancado protege o livro do conhecimento.\"\n            elif acao == \"cidade\":\n                self.local = \"cidade\"\n                self.mensagem = \"Você retornou à cidade.\"\n        elif self.local == \"torre\":\n            if acao == \"abrir\":\n                if \"chave\" in self.inventario:\n                    self.fim = True\n                    self.mensagem = \"Vitória! Você abriu o portão e recuperou o livro do conhecimento.\"\n                else:\n                    self.mensagem = \"Você precisa encontrar a chave na floresta.\"\n            elif acao == \"floresta\":\n                self.local = \"floresta\"\n                self.mensagem = \"Você voltou à floresta.\"\n\n    def opcoes(self):\n        if self.fim:\n            return []\n        return {\"cidade\": [(\"Entrar na floresta\", \"floresta\"), (\"Descansar\", \"descansar\")],\n                \"floresta\": [(\"Abrir baú\", \"bau\"), (\"Explorar trilha\", \"trilha\"), (\"Ir à torre\", \"torre\"), (\"Voltar à cidade\", \"cidade\")],\n                \"torre\": [(\"Abrir portão\", \"abrir\"), (\"Voltar à floresta\", \"floresta\")]}[self.local]\n\nif __name__ == \"__main__\":\n    import html\n    import ipywidgets as w\n    from IPython.display import display\n    try:\n        from google.colab import output\n        output.enable_custom_widget_manager()\n    except ImportError:\n        pass\n    aventura = Aventura()\n    painel_rpg = w.HTML()\n    escolhas_rpg = w.VBox()\n\n    def jogar_rpg(acao):\n        aventura.escolher(acao)\n        desenhar_rpg()\n\n    def desenhar_rpg():\n        a = aventura\n        painel_rpg.value = f'<h3>RPG — O livro do conhecimento</h3><p><b>Local:</b> {a.local} | <b>Vida:</b> {a.vida}/10</p><p><b>Mochila:</b> {html.escape(\", \".join(a.inventario) or \"vazia\")}</p><p>{html.escape(a.mensagem)}</p>'\n        botoes = []\n        for texto, acao in a.opcoes() + [(\"Reiniciar\", \"reiniciar\")]:\n            b = w.Button(description=texto, layout=w.Layout(width=\"220px\", height=\"40px\"))\n            b.on_click(lambda _, acao=acao: jogar_rpg(acao))\n            botoes.append(b)\n        escolhas_rpg.children = tuple(botoes)\n\n    display(w.VBox([painel_rpg, escolhas_rpg]))\n    desenhar_rpg()\n",
        "explain": "RPG interativo com botões de escolha, vida, inventário, derrota e vitória. Execute as etapas 4 e 5; encontre a chave na floresta e abra a torre. Não use um arquivo .py no terminal para esta interface: ela depende do ambiente de notebook e, nos dois jogos de tabuleiro, do loop assíncrono do Colab.",
        "colabOnly": true,
        "interactive": true
      }
    ]
  },
  {
    "id": "bot",
    "name": "Bot clássico ELIZA",
    "tag": "08 • IA sem LLM",
    "subtitle": "Palavras-chave, regras e menus",
    "intro": "ELIZA didática com conversa interativa, padrões de frases e reflexão de pronomes. Execute as etapas 4 e 5, digite uma mensagem e clique em Enviar. Os primeiros exemplos continuam ensinando os fundamentos. A interface abre na saída do Colab, com uma sessão conectada; estes códigos não executam dentro do site.",
    "challenge": "Acrescente uma regra para escola e teste com duas frases.",
    "hints": [
      "Converta o texto para minúsculas com lower().",
      "Use in para procurar um texto dentro de outro. A palavra procurada precisa de aspas.",
      "Coloque a regra mais específica antes da resposta padrão."
    ],
    "steps": [
      {
        "code": "frase = \"Oi professor\"\npalavras = frase.lower().split()\nif \"oi\" in palavras:\n    print(\"Olá! Vamos estudar Python?\")",
        "explain": "lower converte para minúsculas; split separa palavras por espaços. Procurar \"oi\" na lista evita confundir a saudação com parte da palavra \"coisa\". Neste primeiro exemplo, use palavras sem pontuação."
      },
      {
        "code": "import re\n\ndef responder(frase):\n    palavras = re.findall(r\"\\w+\", frase.lower())\n    if \"lista\" in palavras:\n        return \"Use [ ] para criar uma lista.\"\n    if \"oi\" in palavras:\n        return \"Olá, estudante!\"\n    return \"Me conte mais.\"\n\nprint(responder(\"como criar lista?\"))\nprint(responder(\"Oi!\"))\nprint(responder(\"coisa\"))",
        "explain": "re é um módulo da biblioteca padrão: não precisa de pip. Ele separa palavras mesmo com pontuação. A função responde a \"Oi!\", mas não confunde \"coisa\" com \"oi\"."
      },
      {
        "code": "import re\n\ndef bot(frase):\n    palavras = re.findall(r\"\\w+\", frase.lower())\n    if \"erro\" in palavras:\n        return \"Leia a última linha do erro.\"\n    if \"python\" in palavras:\n        return \"Python é uma linguagem de programação.\"\n    return \"Quer estudar listas ou jogos?\"\n\nperguntas = [\"O que é Python?\", \"Deu erro\"]\nfor pergunta in perguntas:\n    print(\"Você:\", pergunta)\n    print(\"Bot:\", bot(pergunta))",
        "explain": "Cada pergunta passa pela função. As regras reconhecem palavras completas, ignorando maiúsculas e pontuação. Este é um bot didático inspirado em regras clássicas, não a implementação original de ELIZA."
      },
      {
        "code": "%pip install -q \"ipywidgets>=8.1,<9\"",
        "explain": "Preparação: execute esta célula no Google Colab. Se houver pedido de reinício, reinicie a sessão e execute a etapa seguinte. Esta instalação é comum aos quatro projetos.",
        "colabOnly": true
      },
      {
        "code": "import re\nimport unicodedata\n\ndef normalizar(texto):\n    return \"\".join(c for c in unicodedata.normalize(\"NFD\", texto.lower()) if not unicodedata.combining(c))\n\ndef refletir(texto):\n    trocas = {\"eu\": \"você\", \"meu\": \"seu\", \"minha\": \"sua\", \"meus\": \"seus\", \"minhas\": \"suas\",\n              \"sou\": \"é\", \"estou\": \"está\", \"tenho\": \"tem\", \"voce\": \"eu\", \"seu\": \"meu\", \"sua\": \"minha\"}\n    return re.sub(r\"\\b\\w+\\b\", lambda m: trocas.get(normalizar(m.group()), m.group()), texto)\n\nclass Eliza:\n    def __init__(self):\n        self.encerrada = False\n        self.turno = 0\n\n    def responder(self, texto):\n        if self.encerrada:\n            return \"Conversa encerrada. Clique em Nova conversa.\"\n        texto = texto.strip()\n        if not texto:\n            return \"Escreva uma frase para começarmos.\"\n        n = normalizar(texto)\n        if n in [\"sair\", \"tchau\", \"adeus\"]:\n            self.encerrada = True\n            return \"Até mais! Obrigada pela conversa.\"\n        if re.search(r\"\\b(oi|ola)\\b\", n):\n            return \"Olá! Sou uma ELIZA didática, um programa de regras. Sobre o que quer conversar?\"\n        for padrao, resposta in [\n            (r\"\\beu preciso (.+)\", \"Por que você precisa {trecho}?\"),\n            (r\"\\beu sinto (.+)\", \"O que faz você sentir {trecho}?\"),\n            (r\"\\beu estou (.+)\", \"Há quanto tempo você está {trecho}?\"),\n            (r\"\\beu sou (.+)\", \"O que significa para você ser {trecho}?\"),\n            (r\"\\bporque (.+)\", \"Essa é a única razão: {trecho}?\"),\n        ]:\n            achado = re.search(padrao, n)\n            if achado:\n                # A normalização mantém os índices das letras portuguesas usuais.\n                trecho = texto[achado.start(1):achado.end(1)].rstrip(\".!?\")\n                trecho = refletir(trecho)\n                if \"precisa {trecho}\" in resposta and not re.match(r\"^(de|do|da|dos|das)\\b\", normalizar(trecho)):\n                    trecho = \"de \" + trecho\n                return resposta.format(trecho=trecho)\n        if re.search(r\"\\b(mae|pai|familia|irmao|irma)\\b\", n):\n            return \"Pode me contar mais sobre sua família?\"\n        if re.search(r\"\\b(python|programacao|codigo)\\b\", n):\n            return \"Que parte da programação você está aprendendo?\"\n        respostas = [\"Pode dar um exemplo?\", \"O que você pensa sobre isso?\", \"Conte um pouco mais.\"]\n        resposta = respostas[self.turno % len(respostas)]\n        self.turno += 1\n        return resposta\n\nif __name__ == \"__main__\":\n    import html\n    import ipywidgets as w\n    from IPython.display import display\n    try:\n        from google.colab import output\n        output.enable_custom_widget_manager()\n    except ImportError:\n        pass\n    eliza = Eliza()\n    historico_eliza = []\n    conversa_eliza = w.HTML()\n    entrada_eliza = w.Textarea(description=\"Você:\", placeholder=\"Digite sua mensagem…\", layout=w.Layout(width=\"95%\"))\n    enviar_eliza = w.Button(description=\"Enviar\")\n    nova_eliza = w.Button(description=\"Nova conversa\")\n\n    def atualizar_eliza():\n        conversa_eliza.value = '<h3>ELIZA didática</h3><p>Bot por regras inspirado em ELIZA. Não é uma LLM nem um serviço de aconselhamento.</p><div style=\"max-height:300px;overflow:auto\">' + \"\".join(\n            f'<p><b>{autor}:</b> {html.escape(texto)}</p>' for autor, texto in historico_eliza[-60:]) + '</div>'\n\n    def enviar_mensagem(_):\n        texto = entrada_eliza.value.strip()\n        if not texto:\n            return\n        historico_eliza.append((\"Você\", texto))\n        historico_eliza.append((\"ELIZA\", eliza.responder(texto)))\n        entrada_eliza.value = \"\"\n        atualizar_eliza()\n\n    def nova_conversa(_):\n        global eliza\n        eliza = Eliza()\n        historico_eliza.clear()\n        historico_eliza.append((\"ELIZA\", \"Olá! Digite uma frase. Para encerrar, escreva sair.\"))\n        entrada_eliza.value = \"\"\n        atualizar_eliza()\n\n    enviar_eliza.on_click(enviar_mensagem)\n    nova_eliza.on_click(nova_conversa)\n    display(w.VBox([conversa_eliza, entrada_eliza, w.HBox([enviar_eliza, nova_eliza])]))\n    nova_conversa(None)\n",
        "explain": "ELIZA didática com conversa interativa, padrões de frases e reflexão de pronomes. Execute as etapas 4 e 5, digite uma mensagem e clique em Enviar. Não use um arquivo .py no terminal para esta interface: ela depende do ambiente de notebook e, nos dois jogos de tabuleiro, do loop assíncrono do Colab.",
        "colabOnly": true,
        "interactive": true
      }
    ]
  },
  {
    "id": "colab",
    "name": "Minha primeira LLM no Colab",
    "tag": "09 • Projeto final",
    "subtitle": "LLM leve e responsável",
    "intro": "Esta etapa exige internet e uma sessão do Google Colab. O site continua sendo um tutor por regras: a LLM será executada somente no Colab. Começaremos carregando um modelo pequeno e limitado, sem treinar um modelo do zero. O SmolLM2-135M foi escolhido pelo tamanho; trabalha principalmente em inglês e pode responder mal em português. Cada etapa após a instalação contém seus próprios imports e carrega o modelo, sem depender de variáveis de outra célula.",
    "challenge": "No Colab, modifique a pergunta e compare a resposta da LLM com uma resposta do seu bot de regras. Registre três diferenças.",
    "hints": [
      "Primeiro execute a célula de instalação no Colab.",
      "Execute cada célula na ordem.",
      "Modelos pequenos podem produzir respostas incorretas: sempre teste."
    ],
    "steps": [
      {
        "code": "%pip install -q \"transformers==4.56.2\" torch",
        "explain": "Execute esta célula de instalação no Google Colab antes das etapas 2 ou 3. %pip instala no ambiente do notebook; não funciona em arquivo .py. Se o Colab pedir, reinicie a sessão e prossiga. Fixamos Transformers 4.56.2 para usar a mesma API da aula.",
        "colabOnly": true
      },
      {
        "code": "from transformers import pipeline\n\ngerador = pipeline(\n    \"text-generation\",\n    model=\"HuggingFaceTB/SmolLM2-135M-Instruct\",\n    device=-1,\n)\nprint(\"Modelo carregado na CPU.\")",
        "explain": "Após a instalação da etapa 1, esta célula importa a biblioteca e baixa o modelo. Funciona na CPU, sem exigir GPU. Saída esperada: Modelo carregado na CPU. O download inicial precisa de internet.",
        "colabOnly": true
      },
      {
        "code": "from transformers import pipeline\n\ngerador = pipeline(\n    \"text-generation\",\n    model=\"HuggingFaceTB/SmolLM2-135M-Instruct\",\n    device=-1,\n)\n\nmensagens = [\n    {\"role\": \"user\", \"content\": \"Explain a Python list in two short sentences.\"}\n]\nsaida = gerador(\n    mensagens,\n    max_new_tokens=80,\n    do_sample=False,\n    pad_token_id=gerador.tokenizer.eos_token_id,\n)\nresposta = saida[0][\"generated_text\"][-1][\"content\"]\nprint(resposta)",
        "explain": "Após instalar na etapa 1, cole este exemplo inteiro em uma célula. Ele carrega o modelo, envia a pergunta e mostra a resposta do assistente. A pergunta em inglês combina com o modelo; depois teste português e compare. Não existe uma resposta exata garantida.",
        "colabOnly": true
      }
    ]
  }
];
const byId=Object.fromEntries(modules.map(x=>[x.id,x]));
global.PyCodeCurriculo={modules,byId};
})(window);
