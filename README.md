# Py-Code · Aprenda com a Py

Site responsivo de aulas guiadas de Python, com a Py, uma cobrinha professora em um popup acessível. A prática acontece no Google Colab: a página não contém editor nem executor Python e não baixa Pyodide.

## Aprendizagem

Nove trilhas: primeiros comandos, listas, cálculos, lógica de Cobrinha, Pong, Tetris, RPG textual, bot de regras inspirado em ELIZA e introdução a uma LLM pequena no Colab. Os jogos são exercícios textuais, não jogos gráficos completos. Exemplos curtos, explicações por linha, pistas graduais e desafios que o aluno constrói.

A Py é um tutor local determinístico, **não uma LLM**. Usa contexto da aula, conceitos, perguntas de compreensão e pistas sobre erros colados do Colab. Não executa nem valida código, não compreende qualquer pergunta e não fornece avaliação automática das reflexões. As etapas são marcadas pelo aluno, e progresso e reflexões ficam apenas neste navegador. O chat fica em memória e não é enviado a um servidor.

## Executar e verificar

Sem dependências de produção ou build. Sirva a pasta com `python3 -m http.server 8000` e abra `http://localhost:8000`.

`node --test tests/tutor.test.cjs` verifica comportamento do tutor. O workflow publica somente os arquivos da experiência guiada, sem o antigo runtime. Os arquivos legados continuam no histórico/pasta de origem, fora da publicação.

O service worker guarda a interface e as aulas após um primeiro acesso bem-sucedido em HTTPS/localhost. O Colab e o download do modelo exigem internet; a trilha de LLM depende de pacotes externos e dos recursos da sessão. O bot continua disponível sem serviços de IA remotos.

Site: https://thiagollipe-web.github.io/Py-code/
