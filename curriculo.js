/* Trilha didática Py-Code. Cada exemplo é um programa completo e curto. */
(function(global){
"use strict";
const modules=[
{
 id:"inicio",name:"O que é Python?",tag:"01 • Comece aqui",subtitle:"Comandos, texto e variáveis",intro:"Python é uma linguagem de programação. Um programa é uma sequência de instruções que o computador executa. No Google Colab você escreve Python em células e clica em executar.",challenge:"Troque o nome do aluno e faça o programa mostrar uma segunda mensagem.",hints:["O comando print mostra texto.","Textos precisam ficar entre aspas.","Uma variável guarda um valor e pode ser usada mais de uma vez."],steps:[
{code:'print("Olá, mundo!")',explain:"print() mostra uma mensagem na tela. As aspas marcam um texto."},
{code:'nome = "Ana"\nprint(nome)',explain:"A variável nome guarda um texto. print(nome) usa o conteúdo da variável."},
{code:'nome = "Ana"\nprint("Olá,", nome)',explain:"O mesmo programa pode juntar texto e variável sem complicar o código."}
]},
{
 id:"listas",name:"Listas Python",tag:"02 • Coleções",subtitle:"Guardar e percorrer valores",intro:"Listas guardam vários elementos na mesma variável. Os índices começam em zero. Experimente alterar as frutas.",challenge:"Crie uma lista de três animais, adicione um quarto com append e mostre o segundo item.",hints:["Use os colchetes: animais = [gato, cão].","Para adicionar: animais.append(peixe).","O segundo elemento usa o índice 1: animais[1]."],steps:[
{code:'frutas = ["maçã", "uva", "banana"]\nprint(frutas)',explain:"Uma lista aparece entre colchetes. Os três itens são textos."},
{code:'frutas = ["maçã", "uva", "banana"]\nprint(frutas[0])',explain:"frutas[0] pega o primeiro elemento. Python começa a contar em zero."},
{code:'frutas = ["maçã", "uva"]\nfrutas.append("banana")\nfor fruta in frutas:\n    print(fruta)',explain:"append adiciona um elemento. for percorre cada item e print o mostra."}
]},
{
 id:"calculos",name:"Cálculos e decisões",tag:"03 • Lógica",subtitle:"Variáveis, if e repetição",intro:"Programar também é escolher caminhos: if decide, for repete, e os operadores fazem cálculos.",challenge:"Altere a variável pontos para 3 e depois para 15. Explique a diferença de saída.",hints:["O operador >= significa maior ou igual.","if só executa o bloco quando a condição é verdadeira.","Os espaços antes de print indicam que ele está dentro do if."],steps:[
{code:'a = 4\nb = 3\nprint(a + b)',explain:"+ soma. Guarde os números em variáveis simples para reaproveitar."},
{code:'pontos = 12\nif pontos >= 10:\n    print("Você passou de fase!")\nelse:\n    print("Continue tentando!")',explain:"if verifica uma condição. else é o caminho contrário."},
{code:'for numero in range(1, 6):\n    print(numero)',explain:"range(1, 6) produz 1, 2, 3, 4, 5. A repetição economiza linhas."}
]},
{
 id:"cobrinha",name:"Cobrinha",tag:"04 • Jogos",subtitle:"Aprenda coordenadas e listas",intro:"Antes de desenhar a cobrinha, crie sua lógica com uma lista de posições (x, y). Depois leve a versão gráfica ao Colab com a biblioteca pygame (somente se o ambiente suportar interface gráfica).",challenge:"Faça a cobrinha dar dois passos para a direita e mostre a cabeça.",hints:["A cabeça é a posição de índice 0.","Para andar, some 1 à coordenada x.","Use inserir no início e remover no final para simular movimento."],steps:[
{code:'cobra = [(2, 2), (1, 2), (0, 2)]\nprint(cobra)',explain:"Cada tupla (x, y) representa uma parte da cobrinha."},
{code:'cobra = [(2, 2), (1, 2), (0, 2)]\nx, y = cobra[0]\ncobra.insert(0, (x + 1, y))\ncobra.pop()\nprint(cobra)',explain:"A nova cabeça vai para x+1. pop remove a última parte, mantendo o tamanho."},
{code:'cobra = [(2, 2), (1, 2), (0, 2)]\nfor passo in range(3):\n    x, y = cobra[0]\n    cobra.insert(0, (x + 1, y))\n    cobra.pop()\n    print("Passo", passo + 1, cobra)',explain:"for repete o movimento. O objetivo é compreender a regra antes do desenho."}
]},
{
 id:"pong",name:"Ping-Pong",tag:"05 • Jogos",subtitle:"Bola e colisão",intro:"O Pong é um ótimo primeiro projeto: posição, velocidade e um teste if para a bola rebater.",challenge:"Altere os limites da quadra para 0 e 6 e observe quando a bola troca de direção.",hints:["A velocidade pode ser 1 ou -1.","Se a bola encostar no limite, inverta a velocidade.","Teste o movimento com print a cada passo."],steps:[
{code:'bola = 0\nvelocidade = 1\nbola = bola + velocidade\nprint(bola)',explain:"A posição aumenta quando a velocidade é positiva."},
{code:'bola = 4\nvelocidade = 1\nif bola >= 5:\n    velocidade = -1\nprint("Direção:", velocidade)',explain:"Ao tocar a borda a velocidade fica negativa e a bola volta."},
{code:'bola = 2\nvelocidade = 1\nfor tempo in range(10):\n    bola = bola + velocidade\n    if bola == 5 or bola == 0:\n        velocidade = -velocidade\n    print(tempo, bola)',explain:"Este é um Pong textual. A mesma lógica controla um jogo gráfico maior."}
]},
{
 id:"tetris",name:"Tetris",tag:"06 • Jogos",subtitle:"Matrizes e peças",intro:"Tetris pode começar com uma matriz: uma lista que contém outras listas. Cada número corresponde a um espaço vazio ou ocupado.",challenge:"Monte uma nova peça 2 × 2 usando 1 para quadrados ocupados.",hints:["A matriz é uma lista de linhas.","Use 0 para espaço vazio e 1 para bloco.","Um for dentro de outro for pode visitar cada número."],steps:[
{code:'peca = [[1, 1], [1, 1]]\nprint(peca)',explain:"Uma peça é representada por duas linhas com dois blocos cada."},
{code:'peca = [[0, 1, 0], [1, 1, 1]]\nfor linha in peca:\n    print(linha)',explain:"Cada sublista é uma linha da peça, percorrida com for."},
{code:'peca = [[0, 1, 0], [1, 1, 1]]\nfor linha in peca:\n    desenho = ""\n    for bloco in linha:\n        desenho += "[]" if bloco else "  "\n    print(desenho)',explain:"Transformamos os números em desenho textual. A lógica é curta e funciona no Colab."}
]},
{
 id:"rpg",name:"RPG textual",tag:"07 • Jogos",subtitle:"Escolhas e histórias",intro:"Um RPG textual pode funcionar com variáveis, inventário, escolhas e if. Não precisa instalar nenhuma biblioteca.",challenge:"Adicione a opção 3, que encontra uma moeda e guarda o item no inventário.",hints:["Use uma variável escolha.","elif escolha == 3: cria uma terceira opção.","Adicione a moeda com inventario.append(moeda)."],steps:[
{code:'nome = "Aventureiro"\nvida = 10\nprint(nome, "tem", vida, "de vida")',explain:"Uma ficha de personagem pode ser feita só com duas variáveis."},
{code:'inventario = ["mapa", "espada"]\nprint("Itens:", inventario)',explain:"A lista funciona como mochila do herói."},
{code:'escolha = "1"\nif escolha == "1":\n    print("Você entrou na floresta.")\nelif escolha == "2":\n    print("Você voltou à cidade.")\nelse:\n    print("Escolha novamente.")',explain:"Troque o valor de escolha para ver os diferentes caminhos."}
]},
{
 id:"bot",name:"Bot clássico ELIZA",tag:"08 • IA sem LLM",subtitle:"Palavras-chave, regras e menus",intro:"Antes das LLMs, vários chatbots usavam regras. Um chatbot de palavras-chave não entende tudo: ele procura padrões e entrega uma resposta programada.",challenge:"Acrescente uma regra para a palavra lista que responda com uma dica sobre colchetes.",hints:["Converta o texto para minúsculas com lower().","Use if "oi" in frase para detectar uma palavra.","Coloque a regra mais específica antes da resposta padrão."],steps:[
{code:'frase = "oi professor"\nif "oi" in frase:\n    print("Olá! Vamos estudar Python?")',explain:"Um if pode reconhecer a presença de uma palavra numa frase."},
{code:'def responder(frase):\n    frase = frase.lower()\n    if "lista" in frase:\n        return "Use [ ] para criar uma lista."\n    if "oi" in frase:\n        return "Olá, estudante!"\n    return "Me conte mais."\n\nprint(responder("como criar lista?"))',explain:"Uma função reúne várias regras. Ela retorna uma resposta por vez."},
{code:'def bot(frase):\n    frase = frase.lower()\n    if "erro" in frase:\n        return "Leia a última linha do erro."\n    if "python" in frase:\n        return "Python é uma linguagem de programação."\n    return "Quer estudar listas ou jogos?"\n\nperguntas = ["O que é Python?", "Deu erro"]\nfor pergunta in perguntas:\n    print("Você:", pergunta)\n    print("Bot:", bot(pergunta))',explain:"O chatbot responde a perguntas de exemplo sem input, de forma compatível com o laboratório do site."}
]},
{
 id:"colab",name:"Minha primeira LLM no Colab",tag:"09 • Projeto final",subtitle:"LLM leve e responsável",intro:"Esta etapa exige internet e uma sessão do Google Colab. O site continua sendo um tutor por regras: a LLM será executada somente no Colab. Começaremos carregando um modelo pequeno e limitado, sem treinar um modelo do zero.",challenge:"No Colab, modifique a pergunta e compare a resposta da LLM com uma resposta do seu bot de regras. Registre três diferenças.",hints:["Primeiro execute a célula de instalação no Colab.","Execute cada célula na ordem.","Modelos pequenos podem produzir respostas incorretas: sempre teste."],steps:[
{code:'!pip -q install transformers torch',explain:"Esta célula instala os pacotes no Colab. O símbolo ! executa um comando de terminal — não funciona dentro do Python comum do Py-Code.",colabOnly:true},
{code:'from transformers import pipeline\n\ngerador = pipeline("text-generation", model="HuggingFaceTB/SmolLM2-135M-Instruct", device=-1)',explain:"Baixa um modelo de aproximadamente 135 milhões de parâmetros para o ambiente da sessão. O primeiro carregamento precisa de internet e pode demorar.",colabOnly:true},
{code:'mensagens = [{"role": "user", "content": "Explique o que é uma lista Python em duas frases."}]\nsaida = gerador(mensagens, max_new_tokens=80, do_sample=False)\nprint(saida[0]["generated_text"][-1]["content"])',explain:"Enviamos uma pergunta, limitamos a resposta e imprimimos apenas a última mensagem do assistente.",colabOnly:true}
]}
];
const byId=Object.fromEntries(modules.map(x=>[x.id,x]));
global.PyCodeCurriculo={modules,byId};
})(window);
