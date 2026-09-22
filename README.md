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
    ├── .github/workflows/pages.yml
    └── pyodide/ (gerado no build do Pages)
    ├── assets/
    │   └── py-code-banner.svg
    └── README.md

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
