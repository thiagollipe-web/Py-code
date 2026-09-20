"""Py-Code Game Engine
Scratch em Python: lógica textual + HTML/Canvas.
API educacional para jogos 2D simples.
"""

from js import document, window

canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")

cenas = {}
cena_atual = None
pontuacao = 0


def limpar(cor="#000000"):
    ctx.fillStyle = cor
    ctx.fillRect(0, 0, canvas.width, canvas.height)


def retangulo(x, y, largura, altura, cor="#00ff66"):
    ctx.fillStyle = cor
    ctx.fillRect(x, y, largura, altura)


def circulo(x, y, raio, cor="#00ff66"):
    ctx.fillStyle = cor
    ctx.beginPath()
    ctx.arc(x, y, raio, 0, 6.283185307179586)
    ctx.fill()


def linha(x1, y1, x2, y2, cor="#00ff66", espessura=2):
    ctx.strokeStyle = cor
    ctx.lineWidth = espessura
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()


def texto(valor, x, y, cor="#00ff66", tamanho=16):
    ctx.fillStyle = cor
    ctx.font = f"{tamanho}px monospace"
    ctx.fillText(str(valor), x, y)


def pressionado(tecla):
    return bool(window.pycode_pressed(str(tecla)))


def tocar(frequencia=440, duracao=0.12, tipo="square", volume=0.05):
    window.pycode_sound(float(frequencia), float(duracao), str(tipo), float(volume))


def somar_pontos(valor=1):
    global pontuacao
    pontuacao += int(valor)
    return pontuacao


def zerar_pontos():
    global pontuacao
    pontuacao = 0
    return pontuacao


def pontos():
    return pontuacao


def mostrar_pontos(x=8, y=20, cor="#ffffff", tamanho=16):
    texto(f"Pontos: {pontuacao}", x, y, cor, tamanho)


def dentro_da_tela(objeto):
    return (
        objeto.x >= 0
        and objeto.y >= 0
        and objeto.x + objeto.largura <= canvas.width
        and objeto.y + objeto.altura <= canvas.height
    )


def limitar_na_tela(objeto):
    objeto.x = max(0, min(objeto.x, canvas.width - objeto.largura))
    objeto.y = max(0, min(objeto.y, canvas.height - objeto.altura))
    return objeto


def colisao(a, b):
    return (
        a.x < b.x + b.largura
        and a.x + a.largura > b.x
        and a.y < b.y + b.altura
        and a.y + a.altura > b.y
    )


def aplicar_gravidade(objeto, forca=0.5, limite=12):
    objeto.vy = min(objeto.vy + forca, limite)
    objeto.y += objeto.vy
    return objeto


class Sprite:
    def __init__(
        self,
        x=0,
        y=0,
        largura=24,
        altura=24,
        cor="#00ff66",
        imagem_url=None,
    ):
        self.x = float(x)
        self.y = float(y)
        self.largura = float(largura)
        self.altura = float(altura)
        self.cor = cor
        self.vx = 0.0
        self.vy = 0.0
        self.imagem = None
        self.chao = False

        if imagem_url:
            self.imagem = window.pycode_image(str(imagem_url))

    def desenhar(self):
        if self.imagem is not None and self.imagem.complete:
            ctx.drawImage(
                self.imagem,
                self.x,
                self.y,
                self.largura,
                self.altura,
            )
        else:
            retangulo(
                self.x,
                self.y,
                self.largura,
                self.altura,
                self.cor,
            )

    def mover(self, dx=0, dy=0):
        self.x += float(dx)
        self.y += float(dy)
        return self

    def velocidade(self, vx=0, vy=0):
        self.vx = float(vx)
        self.vy = float(vy)
        return self

    def atualizar(self, gravidade=0):
        self.x += self.vx
        self.y += self.vy
        if gravidade:
            self.vy += float(gravidade)
        return self

    def pular(self, forca=8):
        if self.chao:
            self.vy = -abs(float(forca))
            self.chao = False
            return True
        return False

    def gravidade(self, forca=0.5, limite=12):
        aplicar_gravidade(self, forca, limite)
        return self

    def colide(self, outro):
        return colisao(self, outro)

    def limite(self):
        limitar_na_tela(self)
        return self

    def no_chao(self, y):
        piso = float(y)
        if self.y + self.altura >= piso:
            self.y = piso - self.altura
            self.vy = 0
            self.chao = True
            return True
        self.chao = False
        return False

    def imagem_url(self, url):
        self.imagem = window.pycode_image(str(url))
        return self


def criar_sprite(x=0, y=0, largura=24, altura=24, cor="#00ff66", imagem=None):
    return Sprite(x, y, largura, altura, cor, imagem)


def cena(nome, iniciar=None, atualizar=None):
    cenas[str(nome)] = {
        "iniciar": iniciar,
        "atualizar": atualizar,
    }


def mudar_cena(nome):
    global cena_atual
    nome = str(nome)
    if nome not in cenas:
        raise ValueError(f"Cena não encontrada: {nome}")
    cena_atual = nome
    inicio = cenas[nome]["iniciar"]
    if callable(inicio):
        inicio()


def cena_atual_nome():
    return cena_atual


def __pycode_frame__():
    if cena_atual in cenas:
        funcao = cenas[cena_atual]["atualizar"]
        if callable(funcao):
            funcao()
            return

    funcao = globals().get("atualizar")
    if callable(funcao) and funcao is not __pycode_frame__:
        funcao()


__pycode_engine_names = set(globals())


def reiniciar_programa():
    global cenas, cena_atual, pontuacao

    for nome in list(globals()):
        if nome not in __pycode_engine_names:
            del globals()[nome]

    cenas = {}
    cena_atual = None
    pontuacao = 0
