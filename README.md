# Py-Code

> Um terminal Python leve, colorido e pensado para uso offline.

O Py-Code é um pequeno ambiente para escrever e executar Python localmente no navegador, usando cache local do runtime.

## Interface

A proposta é deliberadamente simples:

**editor Python → executar → terminal**

Não há designer, canvas, blocos ou painel gráfico. A interface é um terminal de programação com cores para diferenciar código, saída, informações, avisos e erros.

## Recursos

- editor Python simples;
- execução no navegador com Pyodide;
- Web Worker para manter o runtime separado da interface;
- terminal de saída;
- mensagens de erro;
- botão PARAR;
- botão REINICIAR para recuperar o runtime após uma falha;
- limite de tempo para processos travados;
- salvamento automático do código no navegador;
- Ctrl + Enter para executar;
- indentação com Tab;
- download do programa como `.py`;
- layout responsivo para computador e celular;
- PWA;
- runtime Pyodide empacotado no build do GitHub Pages;
- execução sem CDN durante o uso;
- shell e biblioteca Python em cache local.

## Exemplo

    print("Olá, mundo!")

    for numero in range(5):
        print("Número:", numero)

## Jogos e gráficos

A interface principal é apenas terminal. Quando o programa define `atualizar()` ou registra
cenas com `cena(...)`, o Py-Code abre `jogo.html` em outra aba e desenha em um Canvas de
320x180 coordenadas lógicas.

API disponível no Python: `limpar()`, `retangulo()`, `circulo()`, `linha()`, `texto()`,
`Sprite` / `criar_sprite()`, `colisao()`, `aplicar_gravidade()`, `somar_pontos()`,
`mostrar_pontos()`, `pressionado()`, `tocar()`, `cena()`, `mudar_cena()` e
`cena_atual_nome()`.

Exemplo mínimo:

    jogador = Sprite(20, 80, 20, 20, "#00ff66")

    def atualizar():
        limpar("#001018")
        if pressionado("ArrowRight"):
            jogador.mover(2, 0)
        jogador.gravidade(0.3)
        jogador.no_chao(160)
        jogador.desenhar()

O Python roda em um Web Worker e **não enxerga o DOM**: `document` e `window` não estão
disponíveis. Para desenhar, use a API acima.

Não há integração com pygame.

## Arquitetura

    index.html
       ↓
    Web Worker
       ↓
    Pyodide
       ↓
    Python
       ↓
    terminal

O código Python é executado localmente no navegador. O projeto não precisa de um servidor Python próprio.

## Publicação

O projeto pode ser publicado como site estático no GitHub Pages:

https://thiagollipe-web.github.io/Py-code/

## Estrutura

    Py-code/
    ├── index.html
    ├── jogo.html
    ├── diagnostico.html
    ├── pycode-worker.js
    ├── pycode_worker.py
    ├── professor-bot.js
    ├── code-audit.js
    ├── runtime-diagnostics.js
    ├── aws-code-library.js
    ├── sw.js
    ├── manifest.webmanifest
    ├── .github/workflows/pages.yml
    ├── assets/
    │   ├── py-code-banner.svg
    │   ├── icon-192.png
    │   └── icon-512.png
    ├── pyodide/ (gerado no build do Pages)
    ├── AUDITORIA.md
    └── README.md

## Testes

`tests/test_navegador.py` executa o projeto em Chromium e valida runtime, terminal,
jogo em Canvas, Service Worker e modo offline:

    pip install playwright && playwright install chromium
    python -m http.server 8765 --directory .
    python tests/test_navegador.py

O teste precisa do runtime em `./pyodide/` — o mesmo conteúdo que o workflow do Pages
baixa do release oficial do Pyodide.

## Limitação

O runtime Pyodide é baixado durante o build do GitHub Pages e publicado dentro de `pyodide/` junto com o editor. O navegador não precisa buscar Pyodide em CDN para executar os programas. O Service Worker coloca o shell e o runtime local em cache para uso posterior sem conexão.

---

**Py-Code — Python simples, direto no terminal.**
## Professor Bot

- tutor local integrado ao editor;
- dicas progressivas e desafios;
- leitura de erros reais do runtime;
- referências para exemplos da AWS Code Library;
- execução local sem dependência de um servidor de IA remoto.
