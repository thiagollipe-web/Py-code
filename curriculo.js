/* Aulas guiadas: fundamentos e programas completos para copiar. */
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
    "name": "Cobrinha ASCII",
    "tag": "04 • Jogos",
    "subtitle": "Setas, comida e bordas infinitas",
    "intro": "Construa uma cobrinha desenhada com caracteres: @ é a cabeça, o é o corpo e * é a comida. Primeiro entenda o desenho em Python; depois jogue no Colab. Na versão interativa, Python exibe a saída e JavaScript recebe as setas.",
    "challenge": "No jogo da etapa 3, troque o tamanho do tabuleiro ou o intervalo de movimento. Explique como o operador % permite atravessar as bordas.",
    "hints": [
      "largura e altura controlam o tabuleiro.",
      "O intervalo em setInterval controla a velocidade, em milissegundos.",
      "(x + movimento + largura) % largura faz a posição voltar ao início."
    ],
    "steps": [
      {
        "code": "largura = 10\nprint(\"+\" + \"-\" * largura + \"+\")\nprint(\"|\" + \" \" * largura + \"|\")\nprint(\"+\" + \"-\" * largura + \"+\")",
        "explain": "Python usa repetição de strings para desenhar uma linha. + e - formam a borda; o espaço representa uma casa vazia."
      },
      {
        "code": "largura = 10\nx = 9\nx = (x + 1) % largura\nlinha = [\" \"] * largura\nlinha[x] = \"@\"\nprint(\"|\" + \"\".join(linha) + \"|\")",
        "explain": "A cabeça sai da última coluna e volta à primeira. % calcula o resto e mantém x dentro do tabuleiro."
      },
      {
        "code": global.PyCodeASCII.cobrinha,
        "explain": "Jogo completo: copie toda esta célula para o Colab e execute. Ele começa automaticamente. Clique no desenho e use as setas ou botões. Python chama Javascript para receber as teclas e desenhar o ASCII. As etapas 1 e 2 são exercícios preparatórios; não são o jogo completo.",
        "colabOnly": true,
        "asciiGame": true
      }
    ],
    "defaultStep": 2
  },
  {
    "id": "pong",
    "name": "Ping-Pong ASCII",
    "tag": "05 • Jogos",
    "subtitle": "Raquetes, bola e placar de verdade",
    "intro": "Um Pong jogável contra o computador. | representa as raquetes e O representa a bola. Use as setas para cima e para baixo. Primeiro desenhe o campo; a etapa 3 une movimento, colisões e pontuação.",
    "challenge": "Altere a pontuação necessária para vencer e a velocidade do jogo. Identifique quais condições fazem a bola rebater.",
    "hints": [
      "O placar aumenta quando a bola sai pela lateral.",
      "vx e vy guardam as direções horizontal e vertical.",
      "Procure a comparação com 5 e o intervalo de setInterval."
    ],
    "steps": [
      {
        "code": "print(\"+------------+\")\nprint(\"| |        | |\")\nprint(\"| |   O    | |\")\nprint(\"| |        | |\")\nprint(\"+------------+\")",
        "explain": "Caracteres em fonte monoespaçada formam a quadra. Cada caractere ocupa uma posição do desenho."
      },
      {
        "code": "bola = 4\nvelocidade = 1\nbola = bola + velocidade\nif bola >= 5:\n    velocidade = -1\nprint(\"Direção:\", velocidade)",
        "explain": "A bola avança até a borda. Ao inverter o sinal da velocidade, ela se move para o lado oposto no próximo passo."
      },
      {
        "code": global.PyCodeASCII.pong,
        "explain": "Jogo completo: copie toda esta célula para o Colab e execute. Ele começa automaticamente. Clique no desenho e use as setas ou botões. Python chama Javascript para receber as teclas e desenhar o ASCII. As etapas 1 e 2 são exercícios preparatórios; não são o jogo completo.",
        "colabOnly": true,
        "asciiGame": true
      }
    ],
    "defaultStep": 2
  },
  {
    "id": "tetris",
    "name": "Tetris ASCII",
    "tag": "06 • Jogos",
    "subtitle": "Peças que caem, giram e completam linhas",
    "intro": "Empilhe peças ASCII: @ marca a peça em movimento, # marca blocos fixos e . indica espaços vazios. Na etapa 3, use as setas para mover e girar; espaço solta a peça. Linhas completas desaparecem.",
    "challenge": "Mude o intervalo de queda ou os pontos por linha. Explique como o programa reconhece uma linha completa.",
    "hints": [
      "O tabuleiro é uma lista de linhas em JavaScript, semelhante às listas de Python.",
      "Uma linha completa não possui nenhum zero.",
      "cabe verifica as bordas e os blocos já ocupados antes de mover ou girar."
    ],
    "steps": [
      {
        "code": "peca = [\".@.\", \"@@@\"]\nfor linha in peca:\n    print(linha)",
        "explain": "Cada texto é uma linha da peça T. @ ocupa uma casa e . representa um espaço vazio."
      },
      {
        "code": "linha = [1, 1, 1, 1]\nif all(linha):\n    print(\"Linha completa!\")\nelse:\n    print(\"Ainda faltam blocos.\")",
        "explain": "all verifica se todos os valores são verdadeiros. Com 1 para bloco e 0 para vazio, descobrimos se a linha está completa."
      },
      {
        "code": global.PyCodeASCII.tetris,
        "explain": "Jogo completo: copie toda esta célula para o Colab e execute. Ele começa automaticamente. Clique no desenho e use as setas ou botões. Python chama Javascript para receber as teclas e desenhar o ASCII. As etapas 1 e 2 são exercícios preparatórios; não são o jogo completo.",
        "colabOnly": true,
        "asciiGame": true
      }
    ],
    "defaultStep": 2
  },
  {
    "id": "rpg",
    "name": "RPG ASCII",
    "tag": "07 • Jogos",
    "subtitle": "Explore, encontre a chave e abra a porta",
    "intro": "Controle @ num labirinto ASCII. # é uma parede, K é a chave e D é a porta. Procure a chave antes de sair. As setas ou os botões de toque movem o personagem na etapa 3.",
    "challenge": "Edite o mapa para criar um novo caminho. Mantenha uma passagem até a chave e até a porta, com todas as linhas do mesmo tamanho.",
    "hints": [
      "Cada string de mapaInicial é uma linha do cenário.",
      "Não coloque paredes fechando todos os acessos à chave.",
      "chave começa como false e vira true quando o personagem alcança K."
    ],
    "steps": [
      {
        "code": "mapa = [\"#######\", \"#@..KD#\", \"#######\"]\nfor linha in mapa:\n    print(linha)",
        "explain": "O cenário é uma lista de textos. A posição de cada símbolo informa onde há parede, personagem, chave ou porta."
      },
      {
        "code": "inventario = []\ninventario.append(\"chave\")\nif \"chave\" in inventario:\n    print(\"Porta aberta!\")\nelse:\n    print(\"Encontre a chave.\")",
        "explain": "Uma lista guarda os objetos encontrados. in verifica se a chave já está no inventário antes de abrir a porta."
      },
      {
        "code": global.PyCodeASCII.rpg,
        "explain": "Jogo completo: copie toda esta célula para o Colab e execute. Ele começa automaticamente. Clique no desenho e use as setas ou botões. Python chama Javascript para receber as teclas e desenhar o ASCII. As etapas 1 e 2 são exercícios preparatórios; não são o jogo completo.",
        "colabOnly": true,
        "asciiGame": true
      }
    ],
    "defaultStep": 2
  },
  {
    "id": "bot",
    "name": "Bot clássico ELIZA",
    "tag": "08 • IA sem LLM",
    "subtitle": "Palavras-chave, regras e menus",
    "intro": "Programe uma ELIZA didática que lê suas frases e faz perguntas usando padrões. O programa completo abre uma conversa com input no Colab. Não é uma LLM nem uma reprodução integral da ELIZA original.",
    "challenge": "Adicione uma regra para frases que começam com \"eu gosto de\". Teste com duas frases diferentes e confira se o bot usa o restante da sua mensagem.",
    "hints": [
      "A regra deve capturar a parte da frase que muda.",
      "(.+) captura um trecho não vazio; re.fullmatch verifica a frase inteira.",
      "O laço while recebe várias mensagens. Digite sair para encerrar."
    ],
    "steps": [
      {
        "code": "frase = \"oi professor\"\nif \"oi\" in frase:\n    print(\"Olá! Vamos estudar Python?\")",
        "explain": "Um if pode reconhecer a presença de uma palavra numa frase."
      },
      {
        "code": "def responder(frase):\n    frase = frase.lower()\n    if \"lista\" in frase:\n        return \"Use [ ] para criar uma lista.\"\n    if \"oi\" in frase:\n        return \"Olá, estudante!\"\n    return \"Me conte mais.\"\n\nprint(responder(\"como criar lista?\"))",
        "explain": "Uma função reúne várias regras. Ela retorna uma resposta por vez."
      },
      {
        "code": "# ELIZA didática: padrões e perguntas, sem LLM.\nimport re\nimport unicodedata\n\n\ndef normalizar(texto):\n    texto = unicodedata.normalize(\"NFD\", texto.lower())\n    return \"\".join(c for c in texto if not unicodedata.combining(c)).strip()\n\n\ndef refletir(texto):\n    trocas = {\"eu\": \"você\", \"meu\": \"seu\", \"minha\": \"sua\",\n              \"meus\": \"seus\", \"minhas\": \"suas\", \"mim\": \"você\"}\n    return re.sub(r\"\\b\\w+\\b\", lambda m: trocas.get(m[0], m[0]), texto)\n\n\ndef responder(frase):\n    frase = normalizar(frase).rstrip(\".!?\")\n    regras = [\n        (r\"(?:eu )?sinto (.+)\", \"O que faz você sentir {}?\"),\n        (r\"(?:eu )?estou (.+)\", \"Há quanto tempo você está {}?\"),\n        (r\"(?:eu )?sou (.+)\", \"O que faz você dizer que é {}?\"),\n        (r\"(?:eu )?quero (.+)\", \"Por que você quer {}?\"),\n        (r\"(?:eu )?nao consigo (.+)\", \"O que dificulta {}?\"),\n        (r\"porque (.+)\", \"Essa é a única razão para {}?\"),\n    ]\n    for padrao, pergunta in regras:\n        resultado = re.fullmatch(padrao, frase)\n        if resultado:\n            return pergunta.format(refletir(resultado[1]))\n    if re.search(r\"\\b(oi|ola)\\b\", frase):\n        return \"Olá! Sobre o que você quer conversar?\"\n    return \"Pode explicar melhor ou dar um exemplo?\"\n\n\nprint(\"ELIZA: Olá! Sou um bot de regras. Digite sair para encerrar.\")\ntry:\n    while True:\n        frase = input(\"Você: \").strip()\n        if normalizar(frase) == \"sair\":\n            print(\"ELIZA: Até a próxima!\")\n            break\n        if frase:\n            print(\"ELIZA:\", responder(frase))\nexcept (EOFError, KeyboardInterrupt):\n    print(\"\\nELIZA: Conversa encerrada.\")\n",
        "explain": "Conversa completa em Python: execute uma célula e digite no campo Você. Teste \"eu estou feliz\" e \"eu quero aprender Python\". A resposta usa o trecho da sua frase. Digite sair para terminar.",
        "interactiveBot": true
      }
    ],
    "defaultStep": 2
  },
  {
    "id": "colab",
    "name": "Minha primeira LLM no Colab",
    "tag": "09 • Projeto final",
    "subtitle": "LLM leve e responsável",
    "intro": "Esta etapa exige internet e uma sessão do Google Colab. O site continua sendo um tutor por regras: a LLM será executada somente no Colab. Começaremos carregando um modelo pequeno e limitado, sem treinar um modelo do zero.",
    "challenge": "No Colab, modifique a pergunta e compare a resposta da LLM com uma resposta do seu bot de regras. Registre três diferenças.",
    "hints": [
      "Primeiro execute a célula de instalação no Colab.",
      "Execute cada célula na ordem.",
      "Modelos pequenos podem produzir respostas incorretas: sempre teste."
    ],
    "steps": [
      {
        "code": "!pip -q install transformers torch",
        "explain": "Esta célula instala os pacotes no Colab. O símbolo ! executa um comando de terminal — não é uma instrução da linguagem Python.",
        "colabOnly": true
      },
      {
        "code": "from transformers import pipeline\n\ngerador = pipeline(\"text-generation\", model=\"HuggingFaceTB/SmolLM2-135M-Instruct\", device=-1)",
        "explain": "Baixa um modelo de aproximadamente 135 milhões de parâmetros para o ambiente da sessão. Execute a instalação primeiro; espere este carregamento terminar antes da etapa 3. O primeiro carregamento precisa de internet e pode demorar.",
        "colabOnly": true,
        "requiresPrevious": true
      },
      {
        "code": "mensagens = [{\"role\": \"user\", \"content\": \"Explique o que é uma lista Python em duas frases.\"}]\nsaida = gerador(mensagens, max_new_tokens=80, do_sample=False)\nprint(saida[0][\"generated_text\"][-1][\"content\"])",
        "explain": "Use a MESMA sessão em que gerador foi criado na etapa 2. Se reiniciar a sessão, execute novamente as etapas anteriores. Enviamos uma pergunta e imprimimos a última mensagem.",
        "colabOnly": true,
        "requiresPrevious": true
      }
    ]
  }
];
const byId=Object.fromEntries(modules.map(x=>[x.id,x]));
global.PyCodeCurriculo={modules,byId};
})(window);
