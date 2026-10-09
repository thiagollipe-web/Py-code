# Varredura Py-Code — 9 de outubro de 2026

Base: `5669f34` (main, após integração da proposta #3).

## Problemas reproduzidos e corrigidos

- **Pong, etapa 2:** a bola permanecia em 4, portanto o teste da borda 5 nunca invertia a velocidade. Agora a posição avança antes da colisão, e a saída é `Direção: -1`.
- **RPG, etapa 3:** o desafio usa inventário, mas copiar somente a etapa final não definia essa variável. O exemplo agora inicializa a lista, evitando `NameError` ao acrescentar um item.
- **LLM:** as células 2 e 3 dependem de estado da mesma sessão. A interface agora informa essa dependência e oferece cópia de todas as etapas até a atual, sem entregar a solução do desafio. A instalação continua sendo específica do Colab; não é código para executar diretamente num arquivo `.py`.
- **Tutor:** “erro no Colab” abria instruções de uso em vez de investigação; termos específicos como `len` e `while` perdiam para palavras genéricas; perguntas sobre `if` eram tratadas como código inválido; atribuições em blocos de uma linha eram marcadas incorretamente; código colado recebia respostas genéricas; a mudança de assunto era confundida com resposta ao quiz; respostas numéricas negadas recebiam confirmação; nomes de erros dentro de strings eram interpretados como erros reais. Regras e prioridade foram corrigidas com regressões.
- **Cópia:** a sequência completa agora tem uma área somente leitura para seleção manual caso o navegador negue acesso à área de transferência. Os recuos são preservados.
- **Atualização:** arquivos publicados e service worker usam a versão 41. A chave de progresso foi preservada.

## Evidências

`node --test tests/*.test.cjs`: **46 testes aprovados**. Inclui execução real dos 24 exemplos básicos com Python 3 isolado e comparação com saídas esperadas; uso do inventário; dependências e sintaxe das células Python da LLM; 19 testes do tutor. Regressões foram demonstradas falhando antes das correções.

Verificação adicional com JSDOM: navegação nas 27 etapas, cópia exata dos exemplos, dicas, sequência da LLM, cópia negada com seleção manual, popup, Escape e diagnóstico no chat passaram. A API de clipboard foi substituída por sucesso/rejeição controlados nesse teste; não comprova permissões num dispositivo real.

Verificação estática: todos os arquivos JavaScript da raiz, scripts inline dos HTML, sintaxe dos arquivos Python, JSON do manifesto e recursos locais referenciados no index passaram. `git diff --check` passou. Arquivos legados não publicados foram verificados apenas quanto à sintaxe.

## Limites

Não foi executado o download/inferência do modelo nem uma sessão real do Google Colab: este ambiente não tem torch/transformers. As células Python da LLM foram analisadas quanto à sintaxe, e a API de pipeline/chat foi conferida nas referências oficiais abaixo. Isso não comprova compatibilidade de uma sessão específica do Colab.

Não houve inspeção visual em navegador real nesta varredura. Os jogos continuam sendo exercícios de lógica com saída textual, sem janela gráfica. A Py é um tutor heurístico, não um interpretador Python nem uma LLM.

Referências verificadas:
- https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct
- https://huggingface.co/docs/transformers/main_classes/pipelines

## Revisão de programas completos e ELIZA

- Jogos e ELIZA abrem diretamente em Programa completo; etapas preparatórias continuam acessíveis.
- Saída dos jogos simplificada para `display(Javascript(...))`, sem iframe aninhado, com início automático e controles de pausa/reinício.
- ELIZA agora mantém conversa com `input`, padrões, reflexão de possessivos e saída por `sair`; não é uma LLM.
- 57 testes automatizados passaram, incluindo execução real de exemplos Python e diálogo da ELIZA.
- Chromium real: quatro jogos renderizados; animação dos três jogos temporizados, pausa, controles e reinício verificados; viewport de 375px sem transbordamento da página. RPG funciona por turnos.
- Site em Chromium: cinco trilhas abrem o programa completo; texto da área de transferência é idêntico ao código exibido; link de notebook visível.
- Limites: nenhuma sessão real do Colab foi executada; download/inferência da trilha de LLM não executados. Jogos usam JavaScript para interação, apresentado por uma célula Python.
