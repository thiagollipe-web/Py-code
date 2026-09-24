# Auditoria técnica — Py-Code

Data: 24/09/2026
Estado: terminal Python + jogos em aba separada + modo offline

## Arquitetura

```
Editor
  ↓
Web Worker
  ↓
Pyodide local
  ↓
Python
  ├── Terminal
  └── jogo.html → Canvas
```

A interface principal continua sendo somente terminal. Jogos abrem em uma aba separada.

## Runtime offline

O projeto usa Pyodide 314.0.7. O workflow do GitHub Pages baixa o pacote de runtime durante o build e publica os arquivos em `pyodide/`. Durante o uso, o Worker importa `./pyodide/pyodide.mjs` e usa esse diretório como `indexURL`:

- pyodide.js
- pyodide.mjs
- pyodide.asm.mjs
- pyodide.asm.wasm
- python_stdlib.zip
- pyodide-lock.json
- package.json

O Worker não acessa CDN para executar Python. Ele importa `./pyodide/pyodide.mjs` localmente. O Service Worker mantém o shell e os arquivos locais em Cache Storage para uso posterior sem conexão.

## Verificações estáticas

- JavaScript de `index.html`: OK.
- JavaScript de `pycode-worker.js`: OK.
- JavaScript de `jogo.html`: OK.
- JavaScript de `sw.js`: OK.
- JSON do manifesto: OK.
- Worker local: OK.
- `loadPyodide()`: presente.
- `setStdout()`: presente.
- `setStderr()`: presente.
- Cache do runtime: presente.
- Editor e terminal: presentes.
- Canvas na interface principal: removido.
- Blocos na interface principal: removidos.
- Jogo em aba separada: presente.

## Limitação real

“Offline” significa que a execução do Python não depende de CDN e que, depois de o shell e o runtime terem sido armazenados localmente pelo navegador, o aplicativo pode continuar funcionando sem conexão. Na publicação atual, os arquivos do Pyodide já são empacotados no artefato do GitHub Pages; ainda assim, o usuário precisa obter a aplicação pelo menos uma vez para receber esses arquivos.

A documentação oficial do Pyodide informa que o conjunto mínimo `pyodide-core` é muito menor que a distribuição completa, e que é possível hospedar os arquivos localmente. A distribuição completa é superior a 200 MB; o core é a alternativa adequada quando o objetivo é reduzir o tamanho inicial. citeturn951547search1

## Teste de navegador

A sessão atual validou os arquivos estaticamente, mas não executou o aplicativo em Chrome/Android/iOS neste ambiente. Portanto, o comportamento final do Service Worker, Cache Storage e execução offline precisa ser confirmado em navegador real.

## Teste recomendado

1. Abrir o Py-Code e aguardar `PYTHON LOCAL • PRONTO`.
2. Executar `print("offline")`.
3. Confirmar que o Service Worker está ativo.
4. Desligar a internet.
5. Recarregar a página.
6. Executar novamente.
7. Abrir `diagnostico.html` e repetir os testes do runtime quando houver conexão, caso seja necessário investigar uma falha.

