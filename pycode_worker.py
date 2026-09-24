"""Engine Py-Code executada no Web Worker.
A engine não acessa o DOM. Ela envia comandos gráficos para a thread principal.
"""
from js import Object, self
from pyodide.ffi import to_js

CANVAS_LARGURA = 320
CANVAS_ALTURA = 180
cenas = {}
cena_atual = None
pontuacao = 0

def _cmd(tipo, **dados):
    payload = {"type": tipo}
    payload.update(dados)
    self.postMessage(to_js(payload, dict_converter=Object.fromEntries))

class CanvasProxy:
    def fill(self, cor):
        _cmd("fill", color=str(cor))
    def rect(self,x,y,w,h,cor):
        _cmd("rect",x=float(x),y=float(y),w=float(w),h=float(h),color=str(cor))
    def circle(self,x,y,r,cor):
        _cmd("circle",x=float(x),y=float(y),r=float(r),color=str(cor))
    def line(self,x1,y1,x2,y2,cor,espessura=2):
        _cmd("line",x1=float(x1),y1=float(y1),x2=float(x2),y2=float(y2),color=str(cor),width=float(espessura))
    def text(self,v,x,y,cor,tamanho=16):
        _cmd("text",value=str(v),x=float(x),y=float(y),color=str(cor),size=int(tamanho))

canvas = CanvasProxy()

def limpar(cor="#000000"): canvas.fill(cor)
def retangulo(x,y,largura,altura,cor="#00ff66"): canvas.rect(x,y,largura,altura,cor)
def circulo(x,y,raio,cor="#00ff66"): canvas.circle(x,y,raio,cor)
def linha(x1,y1,x2,y2,cor="#00ff66",espessura=2): canvas.line(x1,y1,x2,y2,cor,espessura)
def texto(valor,x,y,cor="#00ff66",tamanho=16): canvas.text(valor,x,y,cor,tamanho)

def definir_status(valor):
    _cmd("html_status", value=str(valor))

def mostrar_texto_html(valor):
    _cmd("html_text", value=str(valor))
def pressionado(tecla): return bool(self.pycode_pressed(str(tecla)))
def tocar(frequencia=440,duracao=0.12,tipo="square",volume=0.05): self.pycode_sound(float(frequencia),float(duracao),str(tipo),float(volume))

def somar_pontos(valor=1):
    global pontuacao
    pontuacao += int(valor)
    return pontuacao
def zerar_pontos():
    global pontuacao
    pontuacao = 0
    return pontuacao
def pontos(): return pontuacao
def mostrar_pontos(x=8,y=20,cor="#ffffff",tamanho=16): texto(f"Pontos: {pontuacao}",x,y,cor,tamanho)

def colisao(a,b):
    return a.x < b.x+b.largura and a.x+a.largura > b.x and a.y < b.y+b.altura and a.y+a.altura > b.y

def aplicar_gravidade(objeto,forca=0.5,limite=12):
    objeto.vy=min(objeto.vy+forca,limite);objeto.y+=objeto.vy;return objeto

class Sprite:
    def __init__(self,x=0,y=0,largura=24,altura=24,cor="#00ff66",imagem_url=None):
        self.x=float(x);self.y=float(y);self.largura=float(largura);self.altura=float(altura)
        self.cor=cor;self.vx=0.0;self.vy=0.0;self.chao=False;self.imagem_url_value=imagem_url
    def desenhar(self):
        if self.imagem_url_value: _cmd("image",url=str(self.imagem_url_value),x=self.x,y=self.y,w=self.largura,h=self.altura)
        else: retangulo(self.x,self.y,self.largura,self.altura,self.cor)
    def mover(self,dx=0,dy=0): self.x+=float(dx);self.y+=float(dy);return self
    def velocidade(self,vx=0,vy=0): self.vx=float(vx);self.vy=float(vy);return self
    def atualizar(self,gravidade=0):
        self.x+=self.vx;self.y+=self.vy
        if gravidade:self.vy+=float(gravidade)
        return self
    def pular(self,forca=8):
        if self.chao:self.vy=-abs(float(forca));self.chao=False;return True
        return False
    def gravidade(self,forca=0.5,limite=12): return aplicar_gravidade(self,forca,limite)
    def colide(self,outro): return colisao(self,outro)
    def limite(self):
        self.x=max(0,min(self.x,CANVAS_LARGURA-self.largura));self.y=max(0,min(self.y,CANVAS_ALTURA-self.altura));return self
    def no_chao(self,y):
        piso=float(y)
        if self.y+self.altura>=piso:self.y=piso-self.altura;self.vy=0;self.chao=True;return True
        self.chao=False;return False

def criar_sprite(x=0,y=0,largura=24,altura=24,cor="#00ff66",imagem=None): return Sprite(x,y,largura,altura,cor,imagem)
def cena(nome,iniciar=None,atualizar=None):
    global cena_atual
    nome=str(nome)
    cenas[nome]={"iniciar":iniciar,"atualizar":atualizar}
    # A primeira cena registrada vira a cena ativa; sem isso o jogo abre vazio
    # até alguém chamar mudar_cena().
    if cena_atual is None:
        cena_atual=nome
        if callable(iniciar): iniciar()
def mudar_cena(nome):
    global cena_atual
    nome=str(nome)
    if nome not in cenas: raise ValueError(f"Cena não encontrada: {nome}")
    cena_atual=nome
    if callable(cenas[nome]["iniciar"]): cenas[nome]["iniciar"]()
def cena_atual_nome(): return cena_atual

def __pycode_frame__():
    if cena_atual in cenas and callable(cenas[cena_atual]["atualizar"]):
        cenas[cena_atual]["atualizar"]();return
    funcao=globals().get("atualizar")
    if callable(funcao) and funcao is not __pycode_frame__: funcao()

# Snapshot dos nomes que pertencem à engine. O próprio conjunto precisa
# permanecer protegido para que múltiplas execuções funcionem.
__pycode_engine_names=set(globals())
__pycode_engine_names.add("__pycode_engine_names")

def reiniciar_programa():
    global cenas,cena_atual,pontuacao
    protegidos=__pycode_engine_names
    for nome in list(globals()):
        if nome not in protegidos:
            del globals()[nome]
    cenas={}
    cena_atual=None
    pontuacao=0

__pycode_engine_names.add("reiniciar_programa")
