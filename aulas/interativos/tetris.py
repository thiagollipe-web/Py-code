import random

class Tetris:
    PECAS = [ [[1,1,1,1]], [[2,2],[2,2]], [[0,3,0],[3,3,3]],
              [[0,4,4],[4,4,0]], [[5,5,0],[0,5,5]],
              [[6,0,0],[6,6,6]], [[0,0,7],[7,7,7]] ]

    def __init__(self):
        self.tabuleiro = [[0]*10 for _ in range(20)]
        self.pontos = 0
        self.linhas = 0
        self.fim = False
        self.nova_peca()

    def nova_peca(self):
        self.peca = [linha[:] for linha in random.choice(self.PECAS)]
        self.x = (10-len(self.peca[0]))//2
        self.y = 0
        if not self.cabe(self.peca, self.x, self.y):
            self.fim = True

    def cabe(self, peca, x, y):
        for dy, linha in enumerate(peca):
            for dx, valor in enumerate(linha):
                if valor and (not 0 <= x+dx < 10 or not 0 <= y+dy < 20 or self.tabuleiro[y+dy][x+dx]):
                    return False
        return True

    def mover(self, dx):
        if not self.fim and self.cabe(self.peca, self.x+dx, self.y):
            self.x += dx

    def girar(self):
        if self.fim:
            return
        girada = [list(linha) for linha in zip(*self.peca[::-1])]
        for ajuste in [0, -1, 1, -2, 2]:
            if self.cabe(girada, self.x+ajuste, self.y):
                self.peca = girada
                self.x += ajuste
                return

    def descer(self):
        if self.fim:
            return
        if self.cabe(self.peca, self.x, self.y+1):
            self.y += 1
            return
        for dy, linha in enumerate(self.peca):
            for dx, valor in enumerate(linha):
                if valor:
                    self.tabuleiro[self.y+dy][self.x+dx] = valor
        restantes = [linha for linha in self.tabuleiro if not all(linha)]
        removidas = 20-len(restantes)
        self.tabuleiro = [[0]*10 for _ in range(removidas)] + restantes
        self.linhas += removidas
        self.pontos += [0, 100, 300, 500, 800][removidas]
        self.nova_peca()

    def soltar(self):
        if self.fim:
            return
        while self.cabe(self.peca, self.x, self.y+1):
            self.y += 1
        self.descer()

if __name__ == "__main__":
    import asyncio
    import ipywidgets as w
    from IPython.display import display
    try:
        from google.colab import output
        output.enable_custom_widget_manager()
    except ImportError:
        pass
    if "tarefa_tetris" in globals():
        tarefa_tetris.cancel()
    jogo_tetris = Tetris()
    tetris_rodando = False
    painel_tetris = w.HTML()
    cores = ["#0f172a", "#22d3ee", "#facc15", "#c084fc", "#4ade80", "#fb7185", "#60a5fa", "#fb923c"]

    def desenhar_tetris():
        j = jogo_tetris
        quadro = [linha[:] for linha in j.tabuleiro]
        if not j.fim:
            for dy, linha in enumerate(j.peca):
                for dx, valor in enumerate(linha):
                    if valor:
                        quadro[j.y+dy][j.x+dx] = valor
        blocos = "".join(f'<rect x="{x*20+1}" y="{y*20+1}" width="18" height="18" rx="2" fill="{cores[v]}"/>'
                         for y, linha in enumerate(quadro) for x, v in enumerate(linha))
        estado = "Fim de jogo" if j.fim else ("Jogando" if tetris_rodando else "Pausado")
        painel_tetris.value = f'<p><b>Tetris | Pontos: {j.pontos} | Linhas: {j.linhas}</b> | {estado}</p><svg viewBox="0 0 200 400" width="200" style="max-width:100%;background:#1e293b">{blocos}</svg>'

    def acao_tetris(acao):
        if not tetris_rodando or jogo_tetris.fim:
            return
        acao()
        desenhar_tetris()

    def pausar_tetris(_):
        global tetris_rodando
        if not jogo_tetris.fim:
            tetris_rodando = not tetris_rodando
        desenhar_tetris()

    def reiniciar_tetris(_):
        global jogo_tetris, tetris_rodando
        jogo_tetris = Tetris()
        tetris_rodando = False
        desenhar_tetris()

    controles = []
    for texto, acao in [("←", lambda: jogo_tetris.mover(-1)), ("Girar", lambda: jogo_tetris.girar()),
                         ("→", lambda: jogo_tetris.mover(1)), ("↓", lambda: jogo_tetris.descer()),
                         ("Soltar", lambda: jogo_tetris.soltar())]:
        b = w.Button(description=texto, layout=w.Layout(width="65px", height="42px"))
        b.on_click(lambda _, acao=acao: acao_tetris(acao))
        controles.append(b)
    pausa = w.Button(description="Iniciar / Pausar")
    pausa.on_click(pausar_tetris)
    reset = w.Button(description="Reiniciar")
    reset.on_click(reiniciar_tetris)

    async def atualizar_tetris():
        while True:
            await asyncio.sleep(max(0.15, 0.7-jogo_tetris.linhas*0.02))
            if tetris_rodando and not jogo_tetris.fim:
                jogo_tetris.descer()
                desenhar_tetris()

    display(w.VBox([painel_tetris, w.HBox(controles, layout=w.Layout(flex_flow="row wrap")), w.HBox([pausa, reset])]))
    desenhar_tetris()
    tarefa_tetris = asyncio.get_running_loop().create_task(atualizar_tetris())
