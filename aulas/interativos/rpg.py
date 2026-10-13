class Aventura:
    def __init__(self):
        self.local = "cidade"
        self.vida = 10
        self.inventario = []
        self.fim = False
        self.mensagem = "Encontre a chave na floresta e abra o portão da torre."

    def escolher(self, acao):
        if acao == "reiniciar":
            self.__init__()
            return
        if self.fim:
            return
        if self.local == "cidade":
            if acao == "floresta":
                self.local = "floresta"
                self.mensagem = "Há um baú sob uma árvore e uma trilha perigosa."
            elif acao == "descansar":
                self.vida = 10
                self.mensagem = "Você descansou. Vida recuperada!"
        elif self.local == "floresta":
            if acao == "bau":
                if "chave" not in self.inventario:
                    self.inventario.append("chave")
                    self.mensagem = "Você encontrou a chave da torre!"
                else:
                    self.mensagem = "O baú está vazio; a chave já está na mochila."
            elif acao == "trilha":
                self.vida = max(0, self.vida-3)
                self.mensagem = "Espinhos! Você perdeu 3 pontos de vida."
                if self.vida == 0:
                    self.fim = True
                    self.mensagem = "Sua aventura terminou. Clique em Reiniciar."
            elif acao == "torre":
                self.local = "torre"
                self.mensagem = "Um portão trancado protege o livro do conhecimento."
            elif acao == "cidade":
                self.local = "cidade"
                self.mensagem = "Você retornou à cidade."
        elif self.local == "torre":
            if acao == "abrir":
                if "chave" in self.inventario:
                    self.fim = True
                    self.mensagem = "Vitória! Você abriu o portão e recuperou o livro do conhecimento."
                else:
                    self.mensagem = "Você precisa encontrar a chave na floresta."
            elif acao == "floresta":
                self.local = "floresta"
                self.mensagem = "Você voltou à floresta."

    def opcoes(self):
        if self.fim:
            return []
        return {"cidade": [("Entrar na floresta", "floresta"), ("Descansar", "descansar")],
                "floresta": [("Abrir baú", "bau"), ("Explorar trilha", "trilha"), ("Ir à torre", "torre"), ("Voltar à cidade", "cidade")],
                "torre": [("Abrir portão", "abrir"), ("Voltar à floresta", "floresta")]}[self.local]

if __name__ == "__main__":
    import html
    import ipywidgets as w
    from IPython.display import display
    try:
        from google.colab import output
        output.enable_custom_widget_manager()
    except ImportError:
        pass
    aventura = Aventura()
    painel_rpg = w.HTML()
    escolhas_rpg = w.VBox()

    def jogar_rpg(acao):
        aventura.escolher(acao)
        desenhar_rpg()

    def desenhar_rpg():
        a = aventura
        painel_rpg.value = f'<h3>RPG — O livro do conhecimento</h3><p><b>Local:</b> {a.local} | <b>Vida:</b> {a.vida}/10</p><p><b>Mochila:</b> {html.escape(", ".join(a.inventario) or "vazia")}</p><p>{html.escape(a.mensagem)}</p>'
        botoes = []
        for texto, acao in a.opcoes() + [("Reiniciar", "reiniciar")]:
            b = w.Button(description=texto, layout=w.Layout(width="220px", height="40px"))
            b.on_click(lambda _, acao=acao: jogar_rpg(acao))
            botoes.append(b)
        escolhas_rpg.children = tuple(botoes)

    display(w.VBox([painel_rpg, escolhas_rpg]))
    desenhar_rpg()
