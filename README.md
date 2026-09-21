# Py-Code

> Um terminal Python leve, colorido e executado diretamente no navegador.

O Py-Code é um pequeno ambiente para escrever e executar Python sem instalar Python no computador.

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
- limite de tempo para processos travados;
- salvamento automático do código no navegador;
- Ctrl + Enter para executar;
- indentação com Tab;
- download do programa como `.py`;
- layout responsivo para computador e celular;
- PWA;
- shell da aplicação em cache.

## Exemplo

    print("Olá, mundo!")

    for numero in range(5):
        print("Número:", numero)

## Jogos e gráficos

O runtime Python ainda contém uma pequena API experimental para jogos e Canvas no Worker. A interface atual, porém, é propositalmente apenas um terminal. O foco desta versão é manter o ambiente leve e estável para programação textual.

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
    ├── pycode-worker.js
    ├── pycode_worker.py
    ├── sw.js
    ├── manifest.webmanifest
    ├── assets/
    │   └── py-code-banner.svg
    └── README.md

## Limitação

O primeiro carregamento do Pyodide depende dos arquivos do runtime disponíveis no navegador. Depois do carregamento da aplicação, o shell do Py-Code pode ser armazenado pelo Service Worker.

---

**Py-Code — Python simples, direto no terminal.**