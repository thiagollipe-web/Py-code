/* Exemplos didáticos; instalação da LLM exige Google Colab e internet. */
(function(global){
"use strict";
const modules=[
  {
    "id": "inicio",
    "name": "O que é Python?",
    "tag": "01 • Comece aqui",
    "subtitle": "Comandos, texto e variáveis",
    "intro": "Python é uma linguagem de programação. Um programa é uma sequência de instruções que o computador executa. No Google Colab você escreve Python em células e clica em executar.",
    "challenge": "Troque o nome do aluno e faça o programa mostrar uma segunda mensagem.",
    "hints": [
      "O comando print mostra texto.",
      "Textos precisam ficar entre aspas.",
      "Uma variável guarda um valor e pode ser usada mais de uma vez."
    ],
    "steps": [
      {
        "code": "print(\"Olá, mundo!\")",
        "explain": "print() mostra uma mensagem na tela. As aspas marcam um texto."
      },
      {
        "code": "nome = \"Ana\"\nprint(nome)",
        "explain": "A variável nome guarda um texto. print(nome) usa o conteúdo da variável."
      },
      {
        "code": "nome = \"Ana\"\nprint(\"Olá,\", nome)",
        "explain": "O mesmo programa pode juntar texto e variável sem complicar o código."
      }
    ]
  },
  {
    "id": "listas",
    "name": "Listas Python",
    "tag": "02 • Coleções",
    "subtitle": "Guardar e percorrer valores",
    "intro": "Listas guardam vários elementos na mesma variável. Os índices começam em zero. Experimente alterar as frutas.",
    "challenge": "Crie uma lista de três animais, adicione um quarto com append e mostre o segundo item.",
    "hints": [
      "Use colchetes e separe os itens por vírgulas. Textos precisam de aspas.",
      "O método append adiciona um item ao final da lista.",
      "Conte as posições começando em zero. Qual é a segunda?"
    ],
    "steps": [
      {
        "code": "frutas = [\"maçã\", \"uva\", \"banana\"]\nprint(frutas)",
        "explain": "Uma lista aparece entre colchetes. Os três itens são textos."
      },
      {
        "code": "frutas = [\"maçã\", \"uva\", \"banana\"]\nprint(frutas[0])",
        "explain": "frutas[0] pega o primeiro elemento. Python começa a contar em zero."
      },
      {
        "code": "frutas = [\"maçã\", \"uva\"]\nfrutas.append(\"banana\")\nfor fruta in frutas:\n    print(fruta)",
        "explain": "append adiciona um elemento. for percorre cada item e print o mostra."
      }
    ]
  },
  {
    "id": "calculos",
    "name": "Cálculos e decisões",
    "tag": "03 • Lógica",
    "subtitle": "Variáveis, if e repetição",
    "intro": "Programar também é escolher caminhos: if decide, for repete, e os operadores fazem cálculos.",
    "challenge": "Altere a variável pontos para 3 e depois para 15. Explique a diferença de saída.",
    "hints": [
      "O operador >= significa maior ou igual.",
      "if só executa o bloco quando a condição é verdadeira.",
      "Os espaços antes de print indicam que ele está dentro do if."
    ],
    "steps": [
      {
        "code": "a = 4\nb = 3\nprint(a + b)",
        "explain": "+ soma. Guarde os números em variáveis simples para reaproveitar."
      },
      {
        "code": "pontos = 12\nif pontos >= 10:\n    print(\"Você passou de fase!\")\nelse:\n    print(\"Continue tentando!\")",
        "explain": "if verifica uma condição. else é o caminho contrário."
      },
      {
        "code": "for numero in range(1, 6):\n    print(numero)",
        "explain": "range(1, 6) produz 1, 2, 3, 4, 5. A repetição economiza linhas."
      }
    ]
  },
  {
    "id": "cobrinha",
    "name": "Cobrinha",
    "tag": "04 • Jogos",
    "subtitle": "Aprenda coordenadas e listas",
    "intro": "Antes de desenhar a cobrinha, crie sua lógica com uma lista de posições (x, y). Nesta trilha, o Colab mostra os movimentos como texto: o foco é aprender a lógica, sem janela gráfica.",
    "challenge": "Faça a cobrinha dar dois passos para a direita e mostre a cabeça.",
    "hints": [
      "A cabeça é a posição de índice 0.",
      "Para andar, some 1 à coordenada x.",
      "Use inserir no início e remover no final para simular movimento."
    ],
    "steps": [
      {
        "code": "cobra = [(2, 2), (1, 2), (0, 2)]\nprint(cobra)",
        "explain": "Cada tupla (x, y) representa uma parte da cobrinha."
      },
      {
        "code": "cobra = [(2, 2), (1, 2), (0, 2)]\nx, y = cobra[0]\ncobra.insert(0, (x + 1, y))\ncobra.pop()\nprint(cobra)",
        "explain": "A nova cabeça vai para x+1. pop remove a última parte, mantendo o tamanho."
      },
      {
        "code": "cobra = [(2, 2), (1, 2), (0, 2)]\nfor passo in range(3):\n    x, y = cobra[0]\n    cobra.insert(0, (x + 1, y))\n    cobra.pop()\n    print(\"Passo\", passo + 1, cobra)",
        "explain": "for repete o movimento. O objetivo é compreender a regra antes do desenho."
      }
    ]
  },
  {
    "id": "pong",
    "name": "Ping-Pong",
    "tag": "05 • Jogos",
    "subtitle": "Bola e colisão",
    "intro": "O Pong é um ótimo primeiro projeto: posição, velocidade e um teste if para a bola rebater.",
    "challenge": "Na etapa 3, altere limite_direito para 6. Execute novamente e anote em quais passos a velocidade muda de sinal.",
    "hints": [
      "A velocidade pode ser 1 ou -1.",
      "Se a bola encostar no limite, inverta a velocidade.",
      "Teste o movimento com print a cada passo."
    ],
    "steps": [
      {
        "code": "bola = 0\nvelocidade = 1\nbola = bola + velocidade\nprint(bola)",
        "explain": "A posição aumenta quando a velocidade é positiva."
      },
      {
        "code": "bola = 4\nvelocidade = 1\nlimite_direito = 5\nbola = bola + velocidade\nif bola >= limite_direito:\n    bola = limite_direito\n    velocidade = -abs(velocidade)\nprint(\"Posição:\", bola)\nprint(\"Direção:\", velocidade)",
        "explain": "Primeiro movemos a bola de 4 para 5. Ao alcançar a borda, a velocidade passa a -1. Saída: Posição: 5 e Direção: -1."
      },
      {
        "code": "limite_esquerdo = 0\nlimite_direito = 5\nbola = 2\nvelocidade = 1\nfor tempo in range(1, 11):\n    bola = bola + velocidade\n    if bola >= limite_direito:\n        bola = limite_direito\n        velocidade = -abs(velocidade)\n    elif bola <= limite_esquerdo:\n        bola = limite_esquerdo\n        velocidade = abs(velocidade)\n    print(\"Passo\", tempo, \"posição\", bola, \"direção\", velocidade)",
        "explain": "A bola rebate nos dois limites. >= e <= também detectam quando um movimento ultrapassa a borda; ajustamos a posição para ficar dentro da quadra. É uma simulação textual, sem raquetes."
      }
    ]
  },
  {
    "id": "tetris",
    "name": "Tetris",
    "tag": "06 • Jogos",
    "subtitle": "Matrizes e peças",
    "intro": "Tetris pode começar com uma matriz: uma lista que contém outras listas. Cada número corresponde a um espaço vazio ou ocupado.",
    "challenge": "Monte uma nova peça 2 × 2 usando 1 para quadrados ocupados.",
    "hints": [
      "A matriz é uma lista de linhas.",
      "Use 0 para espaço vazio e 1 para bloco.",
      "Um for dentro de outro for pode visitar cada número."
    ],
    "steps": [
      {
        "code": "peca = [[1, 1], [1, 1]]\nprint(peca)",
        "explain": "Uma peça é representada por duas linhas com dois blocos cada."
      },
      {
        "code": "peca = [[0, 1, 0], [1, 1, 1]]\nfor linha in peca:\n    print(linha)",
        "explain": "Cada sublista é uma linha da peça, percorrida com for."
      },
      {
        "code": "peca = [[0, 1, 0], [1, 1, 1]]\nfor linha in peca:\n    desenho = \"\"\n    for bloco in linha:\n        desenho += \"[]\" if bloco else \"  \"\n    print(desenho)",
        "explain": "Transformamos os números em desenho textual. A lógica é curta e funciona no Colab."
      }
    ]
  },
  {
    "id": "rpg",
    "name": "RPG textual",
    "tag": "07 • Jogos",
    "subtitle": "Escolhas e histórias",
    "intro": "Um RPG textual pode funcionar com variáveis, inventário, escolhas e if. Não precisa instalar nenhuma biblioteca.",
    "challenge": "Adicione a opção 3, que encontra uma moeda e guarda o item no inventário.",
    "hints": [
      "Use uma variável escolha.",
      "A variável escolha guarda texto: compare com \"3\", entre aspas.",
      "Crie a lista inventario antes de usá-la e adicione o texto \"moeda\" com append."
    ],
    "steps": [
      {
        "code": "nome = \"Aventureiro\"\nvida = 10\nprint(nome, \"tem\", vida, \"de vida\")",
        "explain": "Uma ficha de personagem pode ser feita só com duas variáveis."
      },
      {
        "code": "inventario = [\"mapa\", \"espada\"]\nprint(\"Itens:\", inventario)",
        "explain": "A lista funciona como mochila do herói."
      },
      {
        "code": "inventario = [\"mapa\", \"espada\"]\nescolha = \"1\"\nif escolha == \"1\":\n    print(\"Você entrou na floresta.\")\nelif escolha == \"2\":\n    print(\"Você voltou à cidade.\")\nelse:\n    print(\"Escolha novamente.\")\nprint(\"Itens:\", inventario)",
        "explain": "O exemplo cria seu próprio inventário e não depende da etapa anterior. Altere escolha para \"1\" ou \"2\" para explorar os caminhos. Depois acrescente a opção \"3\" do desafio."
      }
    ]
  },
  {
    "id": "bot",
    "name": "Bot clássico ELIZA",
    "tag": "08 • IA sem LLM",
    "subtitle": "Palavras-chave, regras e menus",
    "intro": "Antes das LLMs, vários chatbots usavam regras. Um chatbot de palavras-chave não entende tudo: ele procura padrões e entrega uma resposta programada.",
    "challenge": "Acrescente uma regra para a palavra lista que responda com uma dica sobre colchetes.",
    "hints": [
      "Converta o texto para minúsculas com lower().",
      "Use in para procurar um texto dentro de outro. A palavra procurada precisa de aspas.",
      "Coloque a regra mais específica antes da resposta padrão."
    ],
    "steps": [
      {
        "code": "frase = \"Oi professor\"\npalavras = frase.lower().split()\nif \"oi\" in palavras:\n    print(\"Olá! Vamos estudar Python?\")",
        "explain": "lower converte para minúsculas; split separa palavras por espaços. Procurar \"oi\" na lista evita confundir a saudação com parte da palavra \"coisa\". Neste primeiro exemplo, use palavras sem pontuação."
      },
      {
        "code": "import re\n\ndef responder(frase):\n    palavras = re.findall(r\"\\w+\", frase.lower())\n    if \"lista\" in palavras:\n        return \"Use [ ] para criar uma lista.\"\n    if \"oi\" in palavras:\n        return \"Olá, estudante!\"\n    return \"Me conte mais.\"\n\nprint(responder(\"como criar lista?\"))\nprint(responder(\"Oi!\"))\nprint(responder(\"coisa\"))",
        "explain": "re é um módulo da biblioteca padrão: não precisa de pip. Ele separa palavras mesmo com pontuação. A função responde a \"Oi!\", mas não confunde \"coisa\" com \"oi\"."
      },
      {
        "code": "import re\n\ndef bot(frase):\n    palavras = re.findall(r\"\\w+\", frase.lower())\n    if \"erro\" in palavras:\n        return \"Leia a última linha do erro.\"\n    if \"python\" in palavras:\n        return \"Python é uma linguagem de programação.\"\n    return \"Quer estudar listas ou jogos?\"\n\nperguntas = [\"O que é Python?\", \"Deu erro\"]\nfor pergunta in perguntas:\n    print(\"Você:\", pergunta)\n    print(\"Bot:\", bot(pergunta))",
        "explain": "Cada pergunta passa pela função. As regras reconhecem palavras completas, ignorando maiúsculas e pontuação. Este é um bot didático inspirado em regras clássicas, não a implementação original de ELIZA."
      }
    ]
  },
  {
    "id": "colab",
    "name": "Minha primeira LLM no Colab",
    "tag": "09 • Projeto final",
    "subtitle": "LLM leve e responsável",
    "intro": "Esta etapa exige internet e uma sessão do Google Colab. O site continua sendo um tutor por regras: a LLM será executada somente no Colab. Começaremos carregando um modelo pequeno e limitado, sem treinar um modelo do zero. O SmolLM2-135M foi escolhido pelo tamanho; trabalha principalmente em inglês e pode responder mal em português. Cada etapa após a instalação contém seus próprios imports e carrega o modelo, sem depender de variáveis de outra célula.",
    "challenge": "No Colab, modifique a pergunta e compare a resposta da LLM com uma resposta do seu bot de regras. Registre três diferenças.",
    "hints": [
      "Primeiro execute a célula de instalação no Colab.",
      "Execute cada célula na ordem.",
      "Modelos pequenos podem produzir respostas incorretas: sempre teste."
    ],
    "steps": [
      {
        "code": "%pip install -q \"transformers==4.56.2\" torch",
        "explain": "Execute esta célula de instalação no Google Colab antes das etapas 2 ou 3. %pip instala no ambiente do notebook; não funciona em arquivo .py. Se o Colab pedir, reinicie a sessão e prossiga. Fixamos Transformers 4.56.2 para usar a mesma API da aula.",
        "colabOnly": true
      },
      {
        "code": "from transformers import pipeline\n\ngerador = pipeline(\n    \"text-generation\",\n    model=\"HuggingFaceTB/SmolLM2-135M-Instruct\",\n    device=-1,\n)\nprint(\"Modelo carregado na CPU.\")",
        "explain": "Após a instalação da etapa 1, esta célula importa a biblioteca e baixa o modelo. Funciona na CPU, sem exigir GPU. Saída esperada: Modelo carregado na CPU. O download inicial precisa de internet.",
        "colabOnly": true
      },
      {
        "code": "from transformers import pipeline\n\ngerador = pipeline(\n    \"text-generation\",\n    model=\"HuggingFaceTB/SmolLM2-135M-Instruct\",\n    device=-1,\n)\n\nmensagens = [\n    {\"role\": \"user\", \"content\": \"Explain a Python list in two short sentences.\"}\n]\nsaida = gerador(\n    mensagens,\n    max_new_tokens=80,\n    do_sample=False,\n    pad_token_id=gerador.tokenizer.eos_token_id,\n)\nresposta = saida[0][\"generated_text\"][-1][\"content\"]\nprint(resposta)",
        "explain": "Após instalar na etapa 1, cole este exemplo inteiro em uma célula. Ele carrega o modelo, envia a pergunta e mostra a resposta do assistente. A pergunta em inglês combina com o modelo; depois teste português e compare. Não existe uma resposta exata garantida.",
        "colabOnly": true
      }
    ]
  }
];
const byId=Object.fromEntries(modules.map(x=>[x.id,x]));
global.PyCodeCurriculo={modules,byId};
})(window);
