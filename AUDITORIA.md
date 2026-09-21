# Auditoria técnica — Py-Code

Data: 21/09/2026
Estado: terminal Python + execução gráfica em aba separada

## Resultado da verificação

O repositório principal foi revisado diretamente no GitHub.

### Estrutura atual

- `index.html`: interface, editor, terminal e controles.
- `pycode-worker.js`: carregamento do Pyodide e execução Python no Web Worker.
- `pycode_worker.py`: engine Python experimental.
- `sw.js`: cache da aplicação.
- `manifest.webmanifest`: manifesto PWA.

### Verificações estáticas

- JavaScript de `index.html`: OK.
- JavaScript de `pycode-worker.js`: OK.
- JavaScript de `sw.js`: OK.
- JSON do manifesto: OK.
- Referência do Worker: OK.
- Carregamento de `pycode_worker.py`: OK.
- `stdout` e `stderr`: presentes.
- `runPythonAsync`: presente.
- PARAR com encerramento do Worker: presente.
- Timeout de execução: presente.
- Editor e terminal: presentes.
- Canvas na interface: removido.
- Sistema de blocos na interface: removido.
- Registro do Service Worker: presente.

### Problemas corrigidos nesta auditoria

0. O erro `TypeError: i.bind is not a function` foi localizado na configuração de `stdout`/`stderr` passada ao `loadPyodide()`. O Pyodide aceita diretamente uma função nesses campos; a versão anterior passava um objeto `{batched: ...}` e isso provocava a falha durante a inicialização. A configuração foi corrigida.
6. O `index.html` tinha sido simplificado para terminal, mas o Service Worker não estava mais sendo registrado. Corrigido.
7. O manifesto ainda descrevia blocos, HTML e Canvas, embora a interface atual fosse somente terminal. Corrigido.
8. O arquivo `AUDITORIA.md` ainda documentava a arquitetura visual anterior, incluindo blocos e cache v7. Atualizado.
9. O arquivo `README.md` foi alinhado com a proposta de terminal.
5. A execução gráfica em `jogo.html` iniciava o loop antes da conclusão do código do usuário e não marcava a execução como modo de jogo no Worker. Corrigido: o Worker agora envia `game_ready` e só então aceita frames.

1. O `index.html` tinha sido simplificado para terminal, mas o Service Worker não estava mais sendo registrado. Corrigido.
2. O manifesto ainda descrevia blocos, HTML e Canvas, embora a interface atual fosse somente terminal. Corrigido.
3. O arquivo `AUDITORIA.md` ainda documentava a arquitetura visual anterior, incluindo blocos e cache v7. Atualizado.
4. O arquivo `README.md` foi alinhado com a proposta de terminal.

### Ponto crítico restante

O runtime Pyodide é carregado de um CDN externo dentro do Worker. Isso significa que a execução do Python ainda depende do carregamento dos arquivos do Pyodide. O Service Worker atual guarda o shell e os arquivos do projeto, mas não transforma o Pyodide inteiro em um runtime offline.

### Teste de navegador

A análise feita nesta sessão é estática sobre os arquivos publicados e o estado do GitHub. Não é uma execução real em Chrome, Edge, Android ou iOS. Portanto, carregamento efetivo do Pyodide, execução real do Python e comportamento de cache precisam ser confirmados no navegador.

## Conclusão técnica

A arquitetura atual está coerente com a proposta de um terminal Python leve:

```
Editor
  ↓
Web Worker
  ↓
Pyodide
  ↓
Python
  ↓
Terminal
```

A execução gráfica usa `jogo.html` em uma aba separada quando o código contém APIs de jogo/Canvas. O teste real em navegador ainda é necessário.
