# Py-Code Academia

Plataforma educativa e responsiva para aprender Python com aulas guiadas e um Professor Bot clássico, **baseado em regras (não é uma LLM)**.

## Trilhas

1. O que é Python?
2. Listas Python
3. Cálculos e decisões
4. Cobrinha
5. Ping-Pong
6. Tetris
7. RPG textual
8. Bot clássico ELIZA
9. Primeira LLM leve no Google Colab

Cada módulo inclui exemplos pequenos e progressivos, explicações, dicas e desafios. Os jogos são protótipos **textuais de lógica**, não versões gráficas completas. O aluno pode executar código Python simples no próprio site usando o Pyodide local. A atividade final com SmolLM2-135M-Instruct é executada **no Google Colab**, requer internet e instalação de dependências.

O Professor Bot usa reconhecimento de palavras-chave, contexto da aula e pistas progressivas. Ele não substitui um professor nem resolve atividades automaticamente.

## Publicação

O GitHub Pages publica os arquivos estáticos. O workflow prepara a distribuição local do Pyodide. Depois da primeira visita conectada e do armazenamento pelo navegador, o ambiente pode funcionar offline; o Colab não é offline.

Site: https://thiagollipe-web.github.io/Py-code/

Principais arquivos: `index.html`, `curriculo.js`, `tutor.js`, `academia.js`, `pycode-worker.js`, `pycode_worker.py`, `sw.js`.
