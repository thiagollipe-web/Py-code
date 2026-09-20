# Auditoria técnica — Py-Code

Data da auditoria: 20/09/2026
Branch auditada: main

## Escopo

A auditoria cobre estrutura do repositório, HTML, CSS, JavaScript, runtime Python/Pyodide, mini-engine, blocos, controles de toque, áudio, loop de animação, PWA/cache e documentação.

## Resultado dos testes

| Área | Resultado |
|---|---|
| Sintaxe JavaScript | OK — validada com `new Function()` sobre o script atual |
| Sintaxe Python | OK — validada com `python -m py_compile` |
| Estrutura HTML principal | OK — uma abertura e um fechamento de `main` |
| Paleta de blocos | OK — categorias e inserção presentes |
| Drag & drop | Implementado no código; teste manual em navegador não executado nesta auditoria |
| Teclado | Implementado; teste manual em navegador não executado nesta auditoria |
| Controles de toque | Implementados; teste manual em dispositivo não executado nesta auditoria |
| Áudio Web Audio | Implementado |
| Canvas | Integração implementada; teste visual em navegador não executado nesta auditoria |
| Loop de jogo | Implementado com proteção contra sobreposição; teste de execução real não executado |
| Reset entre execuções | Implementado |
| Service Worker | Validado por inspeção estrutural; instalação/atualização não foi testada em navegador real |
| Cache da engine | OK — `pycode.py` está no shell |
| Referências antigas a CodeMirror | Removidas |
| Referências antigas a Personagem | Removidas |
| Blocos com nomes inexistentes | Corrigidos |
| Checks CI | Não há checks automatizados configurados no commit auditado |

## Correções realizadas durante a auditoria

1. Corrigida a estrutura/sintaxe do JavaScript da paleta de blocos.
2. Removidas quebras de linha literais que estavam entrando no código JavaScript.
3. Corrigidos blocos de cena, colisão e pulo para serem exemplos executáveis e autocontidos.
4. Removidas referências obsoletas ao CodeMirror e `Personagem`.
5. Implementado isolamento entre execuções para impedir que funções, sprites, cenas e pontuação de um programa contaminem a execução seguinte.
6. Corrigido o reset para preservar a própria rotina `reiniciar_programa()`.
7. Ajustado o layout para reduzir dependência de alturas fixas da janela.
8. Atualizado o cache do Service Worker para `py-code-v6`.
9. Atualizada a documentação e o manifesto.

## Riscos ainda abertos

### Alta prioridade

**Blocos ainda são snippets, não blocos encaixáveis.**
A paleta gera/injeta trechos de Python. Não existe ainda um modelo de bloco com entradas, encaixe estrutural, conexão de comandos ou AST própria. Portanto, o projeto já tem uma paleta visual, mas ainda não é um equivalente técnico do editor de blocos do Scratch.

**Sem suíte automatizada de testes.**
A sintaxe foi verificada, mas não existe CI que execute testes de runtime, integração Pyodide, Canvas, toque e áudio em navegador real.

### Média prioridade

**Pyodide é uma dependência externa.**
O Service Worker cacheia a aplicação e `pycode.py`, mas não os arquivos completos do runtime Pyodide. O funcionamento offline do Python não é garantido.

**Execução de Python compartilha o contexto da página.**
O programa do aluno pode acessar `document` e `window`. Isso é útil para a proposta Python + HTML, mas significa que código não confiável deve ser tratado como código com acesso à página.

**Loop baseado em `requestAnimationFrame` chama Python a cada frame.**
Programas pesados ou loops infinitos ainda podem congelar a interface. O editor não possui limite de tempo ou mecanismo de interrupção de execução Python.

**Blocos condicionais podem gerar código sintaticamente válido, porém pedagogicamente inadequado.**
Exemplo: aumentar pontuação dentro de uma colisão que permanece verdadeira pode somar pontos a cada frame.

### Baixa prioridade

**Editor sem syntax highlighting e sem números de linha.**
Funcional para começar, mas ainda abaixo da experiência esperada de uma IDE educacional.

**Drag & drop não é a experiência principal em dispositivos móveis.**
O clique para inserir funciona melhor no celular.

**Sistema de sprites ainda é básico.**
Há posição, velocidade, cor e imagem, mas ainda não há animação por frames, sprite sheet, rotação, escala, camadas ou estados.

## Conclusão técnica

O Py-Code está em estado funcional de protótipo evoluído para um laboratório de Python + Canvas. A base está coerente e os principais problemas de sintaxe, referências obsoletas, reset de execução e integração dos blocos foram corrigidos.

A próxima evolução arquitetural não deve ser adicionar mais dezenas de snippets. O passo correto é criar um **modelo de blocos estruturados**, no qual cada bloco possui tipo, parâmetros e relações de encaixe, e o sistema gera Python a partir dessa estrutura. Isso permitirá aproximar de fato o Py-Code da ideia de "Scratch em Python" sem abandonar o código textual.
