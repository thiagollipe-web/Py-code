"""Mini-engine educacional do Py-Code.
Python controla a lógica; HTML/Canvas mostra o resultado.
"""

from js import document, window

canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")


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
    return bool(window.pycode_pressed(tecla))


def colisao(a, b):
    return (
        a.x < b.x + b.largura
        and a.x + a.largura > b.x
        and a.y < b.y + b.altura
        and a.y + a.altura > b.y
    )


class Personagem:
    def __init__(self, x=0, y=0, largura=24, altura=24, cor="#00ff66"):
        self.x = x
        self.y = y
        self.largura = largura
        self.altura = altura
        self.cor = cor

    def desenhar(self):
        retangulo(self.x, self.y, self.largura, self.altura, self.cor)

    def mover(self, dx, dy):
        self.x += dx
        self.y += dy

    def colide(self, outro):
        return colisao(self, outro)
