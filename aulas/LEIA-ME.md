# Py-Code — Aulas e projetos interativos

No site, selecione Cobrinha, Tetris, RPG ou Bot ELIZA e clique em **Abrir projeto jogável no Colab**. Execute a célula de instalação, depois execute a célula completa. Os botões aparecem na saída do notebook. Cobrinha e Tetris começam pausados: clique em **Iniciar / Pausar**. Mantenha a sessão conectada.

Na aula, a etapa 4 prepara ipywidgets e a etapa 5 contém o programa completo. As etapas iniciais são exemplos dos fundamentos, não partidas completas. Os projetos usam Python para as regras e ipywidgets para a interface. Não exigem Pygame, janela de desktop ou GPU.

- Cobrinha: direção por botões, alimento, crescimento, pontuação, colisões e reinício.
- Tetris: sete peças, giro com ajuste nas bordas, queda automática, botão Soltar, remoção de linhas e pontuação.
- RPG: escolhas por botões, mochila, chave, descanso, derrota, vitória e reinício.
- ELIZA: caixa de mensagem, reconhecimento de frases, reflexão de pronomes, encerramento e nova conversa. É uma versão didática inspirada em ELIZA, por regras.

Os notebooks individuais estão em `interativos/`. O notebook `Py_Code_Aulas_Corrigidas.ipynb` reúne todas as aulas. Os exemplos .py fora de `interativos/` são exercícios textuais executáveis em Python 3. As interfaces interativas são destinadas ao Colab/Jupyter, não ao terminal.

Verificação: 41 testes Node passaram; 11 testes Python passaram; os widgets reais foram instanciados e seus botões e temporizadores foram exercitados localmente. A renderização visual e a conexão dos widgets na sessão real do Google Colab não foram verificadas neste ambiente.
