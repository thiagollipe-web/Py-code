# 🐍 Py-Code

> **Um ambiente educacional para escrever, executar e experimentar Python diretamente no navegador.**

<p align="center">
  <img src="https://raw.githubusercontent.com/thiagollipe-web/Py-code/main/assets/py-code-banner.svg" alt="Py-Code" width="900">
</p>

<p align="center">
  <a href="https://thiagollipe-web.github.io/Py-code/"><strong>🚀 Abrir o Py-Code Online</strong></a>
</p>

## 🎯 Finalidade

O **Py-Code** foi criado para tornar o aprendizado e a experimentação com Python mais simples e acessíveis.

A proposta é oferecer um pequeno ambiente de programação que funciona **diretamente no navegador**, permitindo escrever código Python, executar o programa e visualizar a saída textual e os desenhos produzidos no Canvas.

O projeto é especialmente voltado para atividades educacionais, introdução à lógica de programação, experimentação com Python e criação de pequenos protótipos e jogos 2D.

## 🧠 Como funciona

O fluxo do projeto é simples:

**Editor de código → Pyodide → Python no navegador → Console + Canvas**

O **Pyodide** permite executar Python no ambiente do navegador. A aplicação também cria uma ponte entre Python e elementos HTML/JavaScript, possibilitando que os programas manipulem o Canvas.

## 🛠️ Tecnologias

| Tecnologia | Função |
|---|---|
| HTML5 | Estrutura da aplicação |
| CSS3 | Interface e responsividade |
| JavaScript | Controle da aplicação |
| CodeMirror | Editor com realce de sintaxe |
| Pyodide | Execução de Python no navegador |
| HTML Canvas | Área gráfica |
| GitHub Pages | Hospedagem |

## ✨ Recursos

### Editor Python
Editor no navegador com realce de sintaxe para escrever programas em Python.

### Execução de código
O botão **EXECUTAR** executa o conteúdo do editor usando Pyodide.

### Console
Mensagens produzidas por `print()`, avisos e erros aparecem na área de saída.

### Canvas
Python pode acessar a tela gráfica por meio de JavaScript.

Exemplo:

```python
from js import document

canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")

ctx.fillStyle = "#00ff66"
ctx.fillRect(100, 100, 100, 100)
```

### Download
O código pode ser baixado como arquivo `.py`.

### Tema
A interface possui tema escuro e tema claro.

### Mobile
O layout foi ajustado para utilização também em smartphones e telas pequenas.

## 🎨 Identidade visual

A interface foi inspirada em **terminais e computadores clássicos**, usando tipografia monoespaçada, alto contraste e elementos em verde para reforçar a identidade de laboratório de programação.

O conceito visual do projeto é:

> **Código → Experimento → Resultado**

## 🌐 Aplicação online

O Py-Code é uma aplicação web estática e pode ser publicado no **GitHub Pages**.

O usuário acessa a página, o navegador carrega o Pyodide e o código Python é executado no próprio ambiente do navegador.

Para os exemplos básicos, não é necessário manter um servidor Python executando no backend.

## 📱 Uso educacional

O projeto pode ser utilizado para trabalhar:

- variáveis;
- condicionais;
- loops;
- funções;
- algoritmos;
- lógica de programação;
- programação gráfica;
- prototipagem de jogos simples.

A ideia é reduzir a barreira inicial de instalação e permitir que o aluno comece a programar diretamente pelo navegador.

## 🚀 Executando localmente

Como o projeto é estático, pode ser servido por qualquer servidor HTTP simples.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois:

```
http://localhost:8000
```

## ⚠️ Limitações

O Py-Code não pretende substituir uma instalação completa do Python para aplicações de desktop ou backend.

A execução depende do navegador e do carregamento dos recursos do Pyodide. Algumas bibliotecas que dependem de componentes nativos específicos podem não funcionar da mesma forma que em um ambiente Python convencional.

## 📂 Estrutura

```
Py-code/
├── Index.html
├── assets/
│   └── py-code-banner.svg
└── .github/
    └── workflows/
        └── pages.yml
```

## 🔮 Próximas evoluções

Entre as evoluções planejadas estão exemplos prontos, biblioteca de exercícios, salvamento local de projetos, projetos gráficos e recursos voltados para aulas de programação.

## 📄 Licença

Consulte o repositório para verificar a licença adotada pelo projeto e pelos componentes utilizados.

---

<p align="center">
  <strong>Py-Code</strong><br>
  <sub>Python para aprender, experimentar e criar direto no navegador.</sub>
</p>
