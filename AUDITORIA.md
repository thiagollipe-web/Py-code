# Auditoria técnica — Py-Code

Data: 24/09/2026
Escopo: runtime Pyodide local, Web Worker, terminal, API de jogos/Canvas, Professor Bot,
auditoria local de código, Service Worker, manifesto PWA e publicação no GitHub Pages.

Método: leitura completa do repositório + execução real em Chromium (Playwright) servindo
o projeto por HTTP, com Pyodide 314.0.7 extraído em `./pyodide/` como no build do Pages.

## Arquitetura verificada

```
index.html (editor + terminal)
  └── Web Worker (pycode-worker.js, type: module)
        └── Pyodide local ./pyodide/pyodide.mjs   (sem CDN em tempo de execução)
              └── pycode_worker.py (engine: desenho, sprites, cenas, pontos, som)
                    ├── mensagens de texto  → terminal do index.html
                    └── comandos de desenho → jogo.html → Canvas 320x180
```

O Python roda em Worker e **não tem acesso ao DOM**. `document` e `window` não são APIs
disponíveis para o programa do usuário; o Worker recusa esse uso com uma mensagem que
aponta a API correta.

## Bugs encontrados e corrigidos

| # | Bug | Causa | Arquivo | Correção |
|---|-----|-------|---------|----------|
| 1 | Todo jogo quebrava com `DataCloneError` e o Canvas ficava preto | `postMessage` recebia um `dict` Python, que não é estruturado-clonável | `pycode_worker.py` | Conversão com `to_js(..., dict_converter=Object.fromEntries)` |
| 2 | Erros mostravam centenas de linhas de pilha JS/WASM e quadros internos do Pyodide | o texto do erro era despejado cru no terminal | `pycode-worker.js` | `limparPilha()` remove a pilha JS, descarta quadros de `/lib/python*` e `_pyodide`, renomeia `<exec>` para `programa.py` e remove o prefixo `PythonError:` |
| 3 | Texto comum com a palavra “documentacao” era recusado como uso de DOM | teste `\bdocument\b` sobre o código bruto | `pycode-worker.js` | strings e comentários são removidos antes da checagem, que passou a exigir `document.`/`window.` ou import direto |
| 4 | Execuções simultâneas podiam se sobrepor | ausência de guarda no Worker | `pycode-worker.js` | flag `executando` + aviso ao usuário |
| 5 | Código vazio executava e terminava sem explicação | nenhum tratamento | `pycode-worker.js` | mensagem orientando escrever um programa |
| 6 | Falha fatal no boot deixava EXECUTAR bloqueado sem saída | não havia caminho de recuperação | `index.html` | botão REINICIAR recria o Worker |
| 7 | Jogos baseados em `cena(...)` não eram detectados e rodavam no terminal | detecção exigia `def atualizar(` | `index.html` | `jogoDetectado()` também aceita `cena(...)`, ignorando strings/comentários |
| 8 | Primeira cena registrada não ficava ativa: jogo abria vazio até `mudar_cena()` | `cena()` só registrava | `pycode_worker.py` | a primeira cena registrada vira a cena ativa e seu `iniciar` é chamado |
| 9 | `jogo.html` não mostrava `print()` nem erros do programa | mensagens de texto eram ignoradas | `jogo.html` | painel `#saida` com stdout, stderr, avisos e erros |
| 10 | Canvas borrado em telas densas e sem reagir a rotação/resize | buffer fixo 320x180 | `jogo.html` | `ajustarCanvas()` com `devicePixelRatio`, escala inteira e eventos `resize`/`orientationchange` |
| 11 | Recarregar `jogo.html` perdia o código (lido e apagado do `localStorage`) | chave consumida uma única vez | `jogo.html` | cópia em `sessionStorage`, permitindo F5 |
| 12 | `cache.addAll` derrubava a instalação inteira do Service Worker se um único arquivo faltasse | instalação atômica | `sw.js` | cache arquivo a arquivo, tolerante a falha, com runtime separado do app shell |
| 13 | Deploy novo continuava servindo a versão em cache | estratégia cache-first para tudo | `sw.js`, `index.html` | rede-primeiro para HTML/JS/PY/JSON, cache como reserva offline; `skipWaiting`/`clients.claim` e recarga em `controllerchange` |
| 14 | PWA sem ícones | manifesto sem `icons` | `manifest.webmanifest`, `assets/` | ícones 192/512 (incluindo `maskable`) adicionados |
| 15 | Auditoria local e Professor Bot acusavam erro em código correto | contagem de delimitadores e testes de fim de linha sobre strings/comentários e sobre linhas de continuação | `code-audit.js`, `professor-bot.js` | análise sobre o código sem strings/comentários, controle de profundidade de parênteses e confirmação da pista também na linha original |
| 16 | Professor Bot reanalisava o editor num `setInterval` sem parada | intervalo nunca liberado | `professor-bot.js` | reação ao evento `input` do editor e `clearInterval` em `pagehide` |
| 17 | Build podia publicar o site sem um arquivo do shell e só quebrar no navegador | ausência de verificação | `.github/workflows/pages.yml` | passo que valida os arquivos obrigatórios em `_site` |

## Testes executados (Chromium, projeto servido por HTTP)

Terminal e runtime:
- `print`, operadores, `if/else`, `for`, `while`, funções, listas, dicionários;
- `math`, `json`, `random`;
- exceções (`try/except`) e `SyntaxError` legível;
- execução repetida, execução após erro, execução após PARAR e após recarregar;
- ausência de vazamento de variáveis entre execuções (`NameError` esperado);
- código vazio, uso real de `document`, e a palavra “documentacao” dentro de string;
- laço infinito interrompido por PARAR e pelo limite de tempo.

Jogos:
- jogo completo com `Sprite`, gravidade, chão, limites, colisão, pontuação, `retangulo`,
  `circulo`, `linha`, `texto` e teclado — Canvas desenhado, sem erros de console;
- jogo com duas cenas e troca por tecla, incluindo `tocar()`;
- abertura automática de `jogo.html` a partir do EXECUTAR;
- botões de toque, `resize` para viewport de celular e recarga da página do jogo.

Plataforma:
- Service Worker instalado, cache `py-code-v37` com 21 entradas, cliente controlado;
- modo offline real do navegador: página, Worker e Pyodide carregados do cache e
  `print()` executado sem rede;
- Professor Bot ativo e conectado ao editor;
- nenhum erro de console ou `pageerror` em nenhum dos cenários.

## Bugs restantes / limitações conhecidas

- **Primeira visita exige rede.** O runtime é publicado junto do site, mas só entra em
  cache depois do primeiro carregamento. Não há empacotamento para uso offline “desde a
  instalação”.
- **`atualizar()` no terminal.** Um programa que usa a API gráfica sem `def atualizar()`
  e sem `cena()` recebe apenas um aviso; a heurística de detecção é textual e pode errar
  em casos construídos dinamicamente (`globals()["atualizar"] = ...`).
- **Sem áudio em iOS antes de um toque.** `tocar()` depende do desbloqueio do
  `AudioContext` pelo gesto do usuário.
- **Professor Bot é heurístico**, não um LLM: explica conceitos e erros a partir de regras
  locais.
- **ANABEL não existe no repositório.** Não há pesquisa web, agente remoto ou execução de
  código obtido da internet. Qualquer afirmação nesse sentido é apenas proposta.
- **pygame não está integrado.** A API de jogos é própria do Py-Code.
- Não há suíte de testes versionada no repositório; a validação desta auditoria foi feita
  com scripts Playwright fora do repositório.

## Recomendações arquiteturais

1. Versionar os testes de navegador (Playwright) e rodá-los em CI antes do deploy.
2. Centralizar a versão dos assets (`?v=NN`) em um único ponto gerado no build, em vez de
   repetir o número em `index.html`, `jogo.html` e `sw.js`.
3. Extrair a heurística compartilhada (remover strings/comentários, detectar jogo) para um
   módulo único usado por `index.html`, `code-audit.js` e `professor-bot.js`.
4. Substituir a detecção textual de jogo por um sinal explícito do runtime (o Worker sabe
   se `atualizar`/cenas existem depois de executar o código).
5. Transportar os comandos de desenho em lote por frame, ou em um buffer binário, se o
   número de primitivas crescer.
6. Publicar o runtime com hash no nome e cache imutável, evitando invalidações manuais.
