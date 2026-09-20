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

A proposta é oferecer um pequeno ambiente de programação que funciona **diretamente no navegador**, combinando **Python para a lógica** com **HTML/Canvas para a parte visual**. O aluno escreve Python, executa o programa e observa o resultado no terminal e na tela gráfica.

O projeto é especialmente voltado para atividades educacionais, introdução à lógica de programação, experimentação com Python e criação de pequenos protótipos e jogos 2D.

## 🧠 Como funciona

O fluxo do projeto é simples:

**Editor → Python → HTML/DOM + Canvas → Resultado**

O **Pyodide** fornece o runtime Python no navegador. O Py-Code cria uma ponte simples para elementos HTML e Canvas, permitindo que o aluno use Python para controlar a página e criar experiências gráficas.

## 🛠️ Tecnologias

| Tecnologia | Função |
|---|---|
| HTML5 | Estrutura da aplicação |
| CSS3 | Interface e responsividade |
| JavaScript | Controle da aplicação |
| Pyodide | Execução de Python no navegador |
| HTML Canvas | Área gráfica |
| GitHub Pages | Hospedagem |

## ✨ Recursos

### Editor Python
Editor leve no navegador, sem dependência externa de editor, com salvamento automático no navegador.

### Execução de código
O botão **EXECUTAR** executa o conteúdo do editor usando Pyodide.

### Console
Mensagens produzidas por `print()`, avisos e erros aparecem na área de saída.

### Python + HTML + Canvas
Python pode acessar elementos HTML e a tela gráfica por meio da ponte `js`. Isso permite criar interfaces, animações e jogos 2D simples usando Python para a lógica.

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
O layout foi ajustado para utilização também em smartphones e telas pequenas. O editor também aceita **Ctrl + Enter** para executar.

### PWA e offline
O shell da aplicação é armazenado em cache e pode abrir sem conexão depois do primeiro acesso. A execução de Python continua exigindo que os arquivos do Pyodide estejam disponíveis no navegador.

## 🎨 Identidade visual

A interface foi inspirada em **terminais e computadores clássicos**, usando tipografia monoespaçada, alto contraste e elementos em verde para reforçar a identidade de laboratório de programação.

O conceito visual do projeto é:

> **Código → Experimento → Resultado**

## 🌐 Aplicação online

O Py-Code é uma aplicação web estática e pode ser publicado no **GitHub Pages**.

O usuário acessa a página, o navegador carrega o Pyodide e o código Python é executado no próprio ambiente do navegador.

Não é necessário manter um servidor Python executando no backend para os programas básicos.

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
├── index.html
├── manifest.webmanifest
├── sw.js
├── assets/
│   └── py-code-banner.svg
└── README.md
```

## 🔮 Próximas evoluções

Entre as evoluções planejadas estão biblioteca de exercícios, salvamento local de projetos, APIs educativas para jogos 2D, eventos de teclado/toque e componentes visuais controlados por Python.

## 📄 Licença

Consulte o repositório para verificar a licença adotada pelo projeto e pelos componentes utilizados.

---

<p align="center">
  <strong>Py-Code</strong><br>
  <sub>Python para aprender, experimentar e criar direto no navegador.</sub>
</p>
