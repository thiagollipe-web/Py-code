# Auditoria técnica — Py-Code

Data: 20/09/2026
Estado: pós-correção arquitetural

## Correções implementadas

- Runtime Python movido para **Web Worker**.
- Pyodide carregado dentro do Worker, retirando a execução Python do thread principal.
- stdout e stderr do Pyodide encaminhados para o console visual.
- Botão **PARAR** criado.
- PARAR encerra o Worker e cria um novo runtime.
- Timeout de 8 segundos para a execução inicial, evitando travamento permanente por código inicial infinito.
- Game loop limitado a aproximadamente 30 FPS.
- Controle de frames com `frameBusy` e confirmação `frame_done`, evitando chamadas Python sobrepostas.
- Teclado da IDE separado do teclado do jogo quando o textarea está focado.
- Controles touch continuam usando Pointer Events e limpeza de teclas no blur.
- API HTML foi retirada do DOM principal: blocos HTML agora usam APIs controladas `definir_status()` e `mostrar_texto_html()`.
- Service Worker atualizado para `py-code-v7` e passou a cachear os arquivos do Worker e da engine.
- O modo textual Python foi preservado.
- A paleta de blocos foi preservada.

## Validação estática

- JavaScript principal: OK.
- JavaScript do Worker: OK.
- JavaScript do Service Worker: OK.
- Worker criado pelo aplicativo: OK.
- stdout/stderr configurados: OK.
- PARAR presente: OK.
- timeout presente: OK.
- sincronização `frame_done`: OK.
- cache dos arquivos do Worker: OK.

## Limitações que permanecem

1. Não foi possível executar Chrome/Android/iOS real nesta sessão. Portanto touch, áudio, PWA e carregamento real do Pyodide ainda precisam de teste manual/automatizado em navegador.
2. Os blocos ainda são snippets. Eles não possuem AST, encaixe estrutural, parâmetros visuais ou sincronização bloco → Python por modelo estruturado.
3. O editor ainda é um textarea; falta syntax highlighting, números de linha, autoindentação inteligente e destaque da linha com erro.
4. Não existe ainda sistema de múltiplos projetos, IndexedDB ou importação/exportação `.pycode.json`.
5. Delta time ainda não foi incorporado à API de sprites.
6. O runtime Pyodide completo continua sendo baixado externamente; o Service Worker não garante Python totalmente offline.
7. O timeout protege a execução inicial. O game loop fica deliberadamente contínuo até PARAR.
8. O isolamento impede que o Python bloqueie a interface principal, mas o Worker ainda tem acesso às APIs que a engine disponibiliza. A API educacional deve continuar sendo controlada.

## Próxima etapa

A próxima mudança estrutural deve ser o **sistema de blocos estruturados**: cada bloco deve possuir tipo, parâmetros, filhos e gerador determinístico de Python. A paleta atual pode permanecer como camada de compatibilidade enquanto essa arquitetura é introduzida.

