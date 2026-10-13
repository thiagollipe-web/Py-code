# Py-Code — construção dos projetos

As aulas do site ensinam o mesmo programa Python dos notebooks de Cobrinha, Tetris, RPG e ELIZA. Cada trecho é extraído do arquivo completo em `aulas/interativos/`.

1. Execute a instalação da primeira etapa em uma célula separada do Colab.
2. Acrescente os trechos na ordem em outra célula, mantendo todos os recuos. Os fragmentos não são programas independentes.
3. Execute o programa depois de reunir as partes. Como alternativa, copie o bloco completo da última etapa.
4. Cobrinha e Tetris começam pausados: clique em Iniciar / Pausar. Mantenha a sessão conectada.

As etapas explicam estado, regras, interface e eventos. Os notebooks também mostram essas explicações e mantêm uma célula final executável. O site apresenta e ensina Python; a execução interativa ocorre no Colab.

Para atualizar as aulas depois de modificar os programas, rode `node scripts/sync-project-lessons.cjs` na raiz do repositório. Os testes verificam que a união dos trechos é exatamente igual ao código completo e ao notebook.
