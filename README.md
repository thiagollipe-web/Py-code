# Py-Code · Aprenda com a Py

Site responsivo de aulas guiadas de Python, com a Py, uma cobrinha professora em um popup acessível. A prática acontece no Google Colab: a página não contém editor nem executor Python e não baixa Pyodide.

## Aprendizagem

Nove trilhas: primeiros comandos, listas, cálculos, lógica de Cobrinha, Pong, Tetris, RPG textual, bot de regras inspirado em ELIZA e introdução a uma LLM pequena no Colab. As trilhas de jogos terminam com jogos ASCII interativos: Cobrinha, Ping-Pong contra o computador, Tetris e RPG de exploração. As duas primeiras etapas ensinam desenhos e lógica em Python; a terceira é uma célula Python que exibe HTML/JavaScript num iframe isolado. JavaScript recebe as teclas e anima o ASCII no navegador do Colab; não é um jogo escrito somente em Python. Exemplos curtos, explicações por linha, pistas graduais e desafios que o aluno constrói.

A Py é um tutor local determinístico, **não uma LLM**. Usa contexto da aula, conceitos, perguntas de compreensão e pistas sobre erros colados do Colab. Não executa nem valida código, não compreende qualquer pergunta e não fornece avaliação automática das reflexões. As etapas são marcadas pelo aluno, e progresso e reflexões ficam apenas neste navegador. O chat fica em memória e não é enviado a um servidor.

## Executar e verificar

Sem dependências de produção ou build. Sirva a pasta com `python3 -m http.server 8000` e abra `http://localhost:8000`.

`node --test tests/*.test.cjs` verifica o tutor e executa os 20 exemplos básicos com `python3`, comparando saídas. A LLM exige a mesma sessão para as etapas sequenciais: a interface permite copiar todas até a etapa atual. Veja `AUDITORIA_2026-10-09.md` para correções e limites da verificação. O workflow publica somente os arquivos da experiência guiada, sem o antigo runtime. Os arquivos legados continuam no histórico/pasta de origem, fora da publicação.

O service worker guarda a interface e as aulas após um primeiro acesso bem-sucedido em HTTPS/localhost. O Colab e o download do modelo exigem internet; a trilha de LLM depende de pacotes externos e dos recursos da sessão. O bot continua disponível sem serviços de IA remotos.

Site: https://thiagollipe-web.github.io/Py-code/


## Jogos ASCII no Colab

1. Abra uma trilha e selecione a etapa 3.
2. Use **Abrir notebook do jogo no Colab**, ou copie a célula inteira para um notebook Python 3.
3. Execute a célula, clique em **Iniciar / reiniciar** e depois no desenho para receber as setas.
4. Use as setas ou os botões de toque. Tetris gira com cima e solta a peça com espaço.
5. Use **Pausar / continuar**; reiniciar substitui o temporizador, sem acelerar o jogo.

Cobrinha: modo livre, atravessa bordas e corpo; comida nunca nasce sobre o corpo. Pong: vença com 5 pontos. Tetris: complete linhas. RPG: encontre K e alcance D. Não é necessário instalar pacotes nos notebooks do Colab.

Fontes editáveis: `games/*.js`. `node scripts/build-ascii.cjs` gera `ascii-games.js` e `notebooks/*-ascii.ipynb`; não edite esses arquivos gerados separadamente. O workflow verifica a sincronização. Os notebooks também podem ser baixados e abertos em um ambiente Jupyter que permita saída HTML com scripts.

Verificação ASCII: testes em Node exercitam o JavaScript incorporado, movimento, pontuação, limites, rotação, linhas, caminho até chave/porta, controles e reinício de timers. A sintaxe Python e a igualdade entre notebooks e células das aulas são verificadas. Esses testes não substituem a execução numa sessão real do Colab, que não foi realizada neste ambiente.
