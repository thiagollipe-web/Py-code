# Auditoria técnica — Py-Code

Data: 21/09/2026
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

O projeto usa Pyodide 314.0.7. Os arquivos essenciais são obtidos do CDN oficial durante a preparação inicial e armazenados no Cache Storage do próprio Py-Code:

- pyodide.js
- pyodide.mjs
- pyodide.asm.mjs
- pyodide.asm.wasm
- python_stdlib.zip
- pyodide-lock.json
- package.json

O Worker não acessa mais o CDN diretamente. Ele solicita `./pyodide/pyodide.js`. O Service Worker intercepta essa URL: primeiro procura no cache local; se não existir, busca a cópia oficial, armazena e entrega ao Worker.

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
- Botão `PREPARAR OFFLINE`: presente.
- Editor e terminal: presentes.
- Canvas na interface principal: removido.
- Blocos na interface principal: removidos.
- Jogo em aba separada: presente.

## Limitação real

“Offline” aqui significa **offline após a preparação do runtime**. Um dispositivo que nunca abriu o Py-Code conectado ainda não possui os arquivos Pyodide no Cache Storage. Para funcionar sem internet desde a primeira abertura, os arquivos do Pyodide teriam de ser empacotados no próprio aplicativo, aumentando significativamente o tamanho do projeto.

A documentação oficial do Pyodide informa que o conjunto mínimo `pyodide-core` é muito menor que a distribuição completa, e que é possível hospedar os arquivos localmente. A distribuição completa é superior a 200 MB; o core é a alternativa adequada quando o objetivo é reduzir o tamanho inicial. citeturn951547search1

## Teste de navegador

A sessão atual validou os arquivos estaticamente, mas não executou o aplicativo em Chrome/Android/iOS neste ambiente. Portanto, o comportamento final do Service Worker, Cache Storage e execução offline precisa ser confirmado em navegador real.

## Próximo teste

1. Abrir o Py-Code conectado.
2. Aguardar `PYTHON PRONTO`.
3. Clicar em `PREPARAR OFFLINE`.
4. Executar `print("offline")`.
5. Desligar a internet.
6. Recarregar a página.
7. Executar novamente.

