"""Testes de navegador do Py-Code.

Executa o projeto de verdade em Chromium e valida runtime Python, terminal,
API de jogos, Service Worker e modo offline.

Uso:
    pip install playwright && playwright install chromium
    python -m http.server 8765 --directory .   # na raiz do repositório
    python tests/test_navegador.py             # BASE=http://localhost:8765

O runtime precisa estar em ./pyodide/ (o mesmo conteúdo que o workflow do
GitHub Pages publica).
"""

import json
import os
import sys
import time

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:8765")

falhas = []


def checar(nome, condicao, detalhe=""):
    if condicao:
        print(f"ok   {nome}")
    else:
        print(f"FALHA {nome} {detalhe}")
        falhas.append(nome)


def executar(page, codigo):
    page.evaluate(
        "(c)=>{const t=document.getElementById('code');t.value=c;"
        "t.dispatchEvent(new Event('input'));}",
        codigo,
    )
    page.click("#run")
    page.wait_for_function("()=>!window.__pyCodeRuntimeStatus().running", timeout=90000)
    return page.evaluate("()=>document.getElementById('terminal').innerText")


PROGRAMA = """import math, json, random
print("PY-CODE OK")
x = 2 + 3
print(x)
print("maior" if x > 4 else "menor")
for i in range(3):
    print("i", i)
valores = [1, 2, 3]
dados = {"a": 1}
print(valores, dados)
print(math.sqrt(16), json.dumps(dados), type(random.random()))
try:
    1 / 0
except ZeroDivisionError as erro:
    print("excecao ok:", erro)
"""

JOGO = """jogador = Sprite(20, 80, 20, 20, "#00ff66")
inimigo = Sprite(260, 80, 20, 20, "#ff3355")

def atualizar():
    limpar("#001018")
    if pressionado("ArrowRight"):
        jogador.mover(2, 0)
    jogador.gravidade(0.3)
    jogador.no_chao(160)
    jogador.limite()
    jogador.desenhar()
    inimigo.desenhar()
    retangulo(0, 160, 320, 20, "#224466")
    circulo(160, 40, 10, "#ffcc00")
    if colisao(jogador, inimigo):
        somar_pontos(1)
    mostrar_pontos()
    texto("PY-CODE", 200, 20, "#ffffff", 12)
"""


def main():
    erros_console = []
    with sync_playwright() as p:
        navegador = p.chromium.launch()
        contexto = navegador.new_context()
        page = contexto.new_page()
        page.on("pageerror", lambda e: erros_console.append(str(e)[:300]))
        page.goto(BASE + "/index.html")
        page.wait_for_function(
            "()=>window.__pyCodeRuntimeStatus && window.__pyCodeRuntimeStatus().ready",
            timeout=180000,
        )
        checar("runtime pronto", True)

        saida = executar(page, PROGRAMA)
        checar("programa básico", "PY-CODE OK" in saida and "excecao ok" in saida)

        executar(page, "guardado = 42")
        saida = executar(page, "print('leak?', 'guardado' in dir())")
        checar("sem vazamento de estado", "leak? False" in saida)

        saida = executar(page, "print('a'")
        checar("erro de sintaxe legível", "SyntaxError" in saida and "_pyodide" not in saida)
        saida = executar(page, "print('depois do erro ok')")
        checar("execução após erro", "depois do erro ok" in saida)

        saida = executar(page, "")
        checar("código vazio avisado", "vazio" in saida)

        saida = executar(page, "print('documentacao de um texto')")
        checar("palavra 'documentacao' permitida", "documentacao de um texto" in saida)

        saida = executar(page, "document.getElementById('x')")
        checar("uso real de DOM recusado", "Web Worker" in saida)

        estado = page.evaluate("()=>window.__pyCodeRuntimeStatus()")
        checar("service worker no controle", estado["serviceWorkerControlled"])

        chave = page.evaluate(
            "(c)=>{const k='pycode_teste';localStorage.setItem(k,c);return k;}", JOGO
        )
        jogo = contexto.new_page()
        jogo.on("pageerror", lambda e: erros_console.append("jogo: " + str(e)[:300]))
        jogo.goto(BASE + "/jogo.html#" + chave)
        jogo.wait_for_function(
            "()=>document.getElementById('status').textContent.includes('RODANDO')",
            timeout=120000,
        )
        jogo.keyboard.down("ArrowRight")
        time.sleep(1.5)
        jogo.keyboard.up("ArrowRight")
        pintado = jogo.evaluate(
            "()=>{const c=document.getElementById('canvas');"
            "const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;"
            "let n=0;for(let i=0;i<d.length;i+=4){if(d[i]||d[i+1]||d[i+2])n++;}return n;}"
        )
        checar("canvas desenhado", pintado > 0, f"pixels={pintado}")
        jogo.reload()
        jogo.wait_for_function(
            "()=>document.getElementById('status').textContent.includes('RODANDO')",
            timeout=120000,
        )
        checar("jogo sobrevive à recarga", True)

        contexto.set_offline(True)
        offline = contexto.new_page()
        offline.on("pageerror", lambda e: erros_console.append("offline: " + str(e)[:300]))
        try:
            offline.goto(BASE + "/index.html")
            offline.wait_for_function(
                "()=>window.__pyCodeRuntimeStatus && window.__pyCodeRuntimeStatus().ready",
                timeout=180000,
            )
            saida = executar(offline, "print('offline ok')")
            checar("execução offline", "offline ok" in saida)
        except Exception as erro:  # noqa: BLE001
            checar("execução offline", False, str(erro)[:200])
        contexto.set_offline(False)

        checar("sem erros de console", not erros_console, json.dumps(erros_console)[:300])
        navegador.close()

    if falhas:
        print("\nFalhas:", ", ".join(falhas))
        sys.exit(1)
    print("\nTodos os testes passaram.")


main()
