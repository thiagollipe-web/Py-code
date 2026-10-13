import random

class Cobrinha:
    def __init__(self, tamanho=16):
        self.tamanho = tamanho
        self.corpo = [(5, 7), (4, 7), (3, 7)]
        self.direcao = (1, 0)
        self.proxima = self.direcao
        self.pontos = 0
        self.fim = False
        self.comida = self.sortear_comida()

    def sortear_comida(self):
        livres = [(x, y) for x in range(self.tamanho) for y in range(self.tamanho)
                  if (x, y) not in self.corpo]
        return random.choice(livres) if livres else None

    def virar(self, dx, dy):
        if (dx, dy) in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            if (dx, dy) != (-self.direcao[0], -self.direcao[1]):
                self.proxima = (dx, dy)

    def passo(self):
        if self.fim:
            return
        self.direcao = self.proxima
        x, y = self.corpo[0]
        cabeca = (x + self.direcao[0], y + self.direcao[1])
        cresce = cabeca == self.comida
        obstaculos = self.corpo if cresce else self.corpo[:-1]
        if not (0 <= cabeca[0] < self.tamanho and 0 <= cabeca[1] < self.tamanho) or cabeca in obstaculos:
            self.fim = True
            return
        self.corpo.insert(0, cabeca)
        if cresce:
            self.pontos += 1
            self.comida = self.sortear_comida()
            if self.comida is None:
                self.fim = True
        else:
            self.corpo.pop()

if __name__ == "__main__":
    import asyncio
    import ipywidgets as w
    from IPython.display import display
    try:
        from google.colab import output
        output.enable_custom_widget_manager()
    except ImportError:
        pass

    # Encerra a partida anterior quando a célula é executada novamente.
    if "tarefa_cobrinha" in globals():
        tarefa_cobrinha.cancel()
    jogo = Cobrinha()
    rodando = False
    painel = w.HTML()
    iniciar = w.Button(description="Iniciar / Pausar")
    reiniciar = w.Button(description="Reiniciar")

    def desenhar():
        blocos = ""
        for i, (x, y) in enumerate(jogo.corpo):
            cor = "#a3e635" if i == 0 else "#22c55e"
            blocos += f'<rect x="{x*20+1}" y="{y*20+1}" width="18" height="18" rx="4" fill="{cor}"/>'
        if jogo.comida is not None:
            x, y = jogo.comida
            blocos += f'<circle cx="{x*20+10}" cy="{y*20+10}" r="7" fill="#fb7185"/>'
        estado = "Fim de jogo — Reinicie" if jogo.fim else ("Jogando" if rodando else "Pausado — clique em Iniciar")
        painel.value = f'<p><b>Cobrinha | Pontos: {jogo.pontos}</b> | {estado}</p><svg viewBox="0 0 320 320" width="320" style="max-width:100%;background:#0f172a">{blocos}</svg>'

    def alternar(_):
        global rodando
        if not jogo.fim:
            rodando = not rodando
        desenhar()

    def resetar(_):
        global jogo, rodando
        jogo = Cobrinha()
        rodando = False
        desenhar()

    iniciar.on_click(alternar)
    reiniciar.on_click(resetar)
    botoes = []
    for texto, dx, dy in [("↑", 0, -1), ("←", -1, 0), ("↓", 0, 1), ("→", 1, 0)]:
        b = w.Button(description=texto, layout=w.Layout(width="65px", height="45px"))
        b.on_click(lambda _, dx=dx, dy=dy: jogo.virar(dx, dy))
        botoes.append(b)

    async def atualizar():
        while True:
            await asyncio.sleep(0.28)
            if rodando and not jogo.fim:
                jogo.passo()
                desenhar()

    display(w.VBox([painel, w.HBox(botoes), w.HBox([iniciar, reiniciar])]))
    desenhar()
    tarefa_cobrinha = asyncio.get_running_loop().create_task(atualizar())
