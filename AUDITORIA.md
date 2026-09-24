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

A documentação oficial do Pyodide informa que o conjunto mínimo `pyodide-core` é muito menor que a distribuição completa, e que é possível hospedar os arquivos localmente. A distribuição completa é superior a 200 MB; o core é a alternativa adequada quando o objetivo é reduzir o tamanho inicial.

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


## Auditoria e correções executadas em 24/09/2026

Apliquei o prompt de auditoria ao estado atual do repositório e corrigi os problemas encontrados.

### Problemas corrigidos

- O Worker passou a rejeitar apenas o identificador Python document quando ele aparece fora de strings e comentários, evitando falso positivo em textos.
- Mensagens de Workers antigos agora são ignoradas na interface principal, evitando condições de corrida durante PARAR/reinício.
- O jogo ganhou watchdog de frame para interromper um atualizar() que bloquear o Worker.
- A chave do jogo fica preservada no localStorage até o jogo realmente iniciar, permitindo recuperação após falha do runtime.
- Os temporizadores do jogo agora são encerrados corretamente em sucesso, erro, comunicação e saída da página.
- O diagnóstico passou a usar a mesma versão do Worker e a verificar também WASM e biblioteca padrão local.
- O runtime-diagnostics.js deixou de procurar elementos do index.html dentro de diagnostico.html.
- O Service Worker passou a lidar apenas com GET e a usar rede primeiro para navegação quando há conexão, mantendo fallback para cache offline.
- A versão de cache foi atualizada para py-code-v37.
- A auditoria local de código foi ajustada para reduzir falsos positivos com comentários inline.
- O Professor Bot passou a explicar especificamente o erro de DOM dentro do Worker.
- README e este relatório foram alinhados com a arquitetura atual.
- O workflow do GitHub Pages recebeu validações automáticas de JavaScript, Python, JSON, referências do runtime e invariantes do modo offline.

### Testes automatizados

O workflow de publicação no commit final foi executado com sucesso.

Run: 36037335782

Resultados:

- Preparação do site: OK.
- Pyodide 314.0.7 empacotado localmente: OK.
- node --check nos arquivos JavaScript: OK.
- Verificação do JavaScript inline em index.html, jogo.html e diagnostico.html: OK.
- python3 -m py_compile pycode_worker.py: OK.
- Validação do manifest.webmanifest: OK.
- Verificação das referências do Worker v37: OK.
- Verificação do cache py-code-v37: OK.
- Verificação de referência de CDN do Pyodide nas fontes do projeto: OK.
- Build do GitHub Pages: OK.
- Deploy do GitHub Pages: OK.

### Limitações ainda existentes

A execução neste ambiente não permitiu abrir o site publicado em um navegador real e interagir com Chrome/Android/iOS. Portanto, ainda não considero comprovados por teste de navegador os comportamentos de Cache Storage, atualização do Service Worker, touch/mobile e execução efetivamente offline após desligar a rede.

Também confirmei que a ANABEL autônoma não está implementada no repositório atual. Não existem as funções autonomousSearch ou researchCode, nem adaptadores reais de pesquisa GitHub/Stack Overflow/documentação.

Para manter o Py-Code estritamente offline, a ANABEL não deve pesquisar a web diretamente dentro da aplicação estática. Essa parte precisa ser separada como recurso online opcional ou substituída por uma base de conhecimento local.