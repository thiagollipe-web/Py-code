/* Tutor local determinístico: contexto, conceitos, perguntas e pistas. Não executa Python. */
(function(global){
'use strict';
const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const topics=[
 {id:'append',match:/\b(append|adicionar|acrescentar)\b/,text:'append() adiciona UM elemento ao final de uma lista existente. Imagine colocar mais um livro no fim de uma prateleira. Exemplo diferente do desafio: livros.append("Atlas"). Ele modifica a própria lista; não guarde o resultado de append em outra variável.',question:'Depois de adicionar um livro, a lista fica maior ou menor?'},
 {id:'listas',match:/\b(listas?|colchetes|colecoes)\b/,text:'Uma lista reúne elementos em uma ordem. Pense em uma fila: cada pessoa tem uma posição. Em Python, os itens ficam entre [ ] e são separados por vírgulas. Exemplo: cores = ["azul", "verde"]. Uma lista pode mudar depois de criada.',question:'Qual conjunto de coisas você gostaria de guardar numa lista?'},
 {id:'indice',match:/\b(indices?|index|posicao|segundo|primeiro)\b/,text:'O índice indica a posição de um item. A contagem começa em 0: o primeiro fica em 0; o segundo em 1. Em cores = ["azul", "verde"], cores[1] representa "verde". len(cores) conta os itens, não o último índice.',question:'Se a lista tem 3 itens, qual é o índice do último?'},
 {id:'variavel',match:/\b(variaveis|variavel|guardar|atribui\w*)\b/,text:'Uma variável é um nome associado a um valor. Em energia = 8, o sinal = associa o número 8 ao nome energia. Em energia = energia + 2, Python calcula o lado direito primeiro e depois atualiza o valor.',question:'Se energia era 8 e recebe mais 2, qual valor o nome passa a representar?'},
 {id:'print',match:/\b(print|imprimir|mostrar|exibir)\b/,text:'print() mostra valores na saída da célula do Colab. Aspas indicam texto literal: print("pontos") mostra a palavra pontos. Sem aspas, print(pontos) procura o valor da variável pontos.',question:'Para mostrar o conteúdo de uma variável, você coloca o nome dela entre aspas?'},
 {id:'input',match:/\b(input|digitar|entrada)\b/,text:'input() pede uma resposta ao usuário e devolve texto. Exemplo: apelido = input("Seu apelido: "). Para fazer contas com uma resposta numérica, use int() para inteiro ou float() para decimal. Uma palavra que não representa número causará ValueError nessa conversão.',question:'Por que uma idade recebida por input pode precisar de int() antes de uma soma?'},
 {id:'if',match:/\b(if|elif|else|condic\w*|decis\w*)\b/,text:'if executa um bloco quando a condição é verdadeira. elif testa outra condição se as anteriores falharem; else trata os outros casos. Termine o cabeçalho com : e recue o bloco, normalmente quatro espaços. = atribui um valor; == compara valores.',question:'Se a condição do if for falsa e houver um else, qual bloco será executado?'},
 {id:'for',match:/\b(for|range|repet\w*|loop|laco)\b/,text:'for percorre os itens de uma sequência. range(3) produz 0, 1 e 2: o limite final fica de fora. A instrução com recuo é repetida a cada item. Pense em entregar um convite para cada pessoa de uma fila.',question:'Quantas vezes o bloco roda em for n in range(4)?'},
 {id:'while',match:/\bwhile\b/,text:'while repete um bloco enquanto uma condição for verdadeira. Algo dentro do bloco precisa permitir que ela fique falsa, ou você terá uma repetição sem fim. No Colab, use o botão de parar se isso acontecer.',question:'Se a condição é pontos < 5, o que precisa acontecer com pontos para a repetição terminar?'},
 {id:'funcao',match:/\b(def|return|funcao|funcoes|parametros?)\b/,text:'def cria uma função: um conjunto de instruções com um nome. Parâmetros recebem os valores usados nesse trabalho. return devolve um resultado e encerra aquela chamada; print apenas mostra algo. Uma função precisa ser chamada para executar seu corpo.',question:'Para usar depois o resultado de um cálculo, você escolheria print ou return?'},
 {id:'len',match:/\blen\b|tamanho da lista/,text:'len() conta quantos elementos uma coleção tem. Uma lista com três itens tem len igual a 3, mas seu último índice positivo é 2. A lista vazia tem comprimento 0.',question:'Quanto vale len([])?'},
 {id:'texto',match:/\b(str|strings?|texto|aspas|lower)\b/,text:'Uma string é um texto entre aspas simples ou duplas. lower() cria uma versão em letras minúsculas: "OLA".lower() resulta em "ola". Isso ajuda um bot de regras a reconhecer entradas sem diferenciar maiúsculas e minúsculas.',question:'Por que transformar a mensagem em minúsculas ajuda seu chatbot?'},
 {id:'numeros',match:/\b(int|float|numeros?|somar|soma|calculos?|operadores?)\b/,text:'int representa números inteiros e float representa números com parte decimal. + soma números, mas concatena textos. Assim, 2 + 3 dá 5, enquanto "2" + "3" dá "23". Use ponto para decimais no código: 2.5.',question:'"4" é um número inteiro ou um texto?'},
 {id:'igual',match:/==|\bigual\b/,text:'Um sinal = atribui um valor: vidas = 3. Dois sinais == comparam valores: vidas == 3 é verdadeiro quando vidas vale 3. Confundir os dois dentro de um if é uma causa comum de SyntaxError.',question:'Para perguntar se duas pontuações são iguais, qual operador você usaria?'},
 {id:'import',match:/\b(import|biblioteca|modulo|pip)\b/,text:'import disponibiliza um módulo para o seu programa. pip instala pacotes no ambiente; não é a mesma coisa que importar. No Colab, !pip é um comando de instalação em uma célula. Execute as células na ordem e leia as mensagens de instalação.',question:'Instalar um pacote e importar um módulo fazem a mesma coisa?'},
 {id:'python',match:/\bpython\b/,text:'Python é uma linguagem: você escreve instruções que o computador segue. Começamos mostrando mensagens, guardando valores e tomando decisões. Aqui você estuda; no Colab você escreve e executa seus programas.',question:'O que você gostaria de criar: uma lista, um jogo ou um bot?'},
 {id:'tetris',match:/\b(tetris|matriz|matrizes)\b/,text:'Uma matriz pode ser representada por uma lista de listas. Cada lista interna vira uma linha; os valores indicam espaços ocupados ou vazios. Na etapa 3, as peças caem, giram e completam linhas num jogo ASCII no Colab.',question:'Numa peça com duas linhas e três colunas, quantas posições existem?'},
 {id:'pong',match:/\b(pong|ping.pong|bola|colisao)\b/,text:'No Pong, a posição muda conforme a velocidade. Uma velocidade positiva leva a bola para um lado; negativa, para o outro. Ao alcançar um limite, invertemos seu sinal. Na etapa 3, você controla uma raquete ASCII com as setas e joga contra o computador.',question:'Se a velocidade 1 vira -1, o que muda no movimento?'},
 {id:'cobrinha',match:/\b(cobrinha|snake|cobra|coordenadas)\b/,text:'A cobrinha é uma lista de posições (x, y). A primeira posição é a cabeça. Para andar sem crescer, inserimos uma nova cabeça e retiramos a cauda. Alterar x muda a posição horizontal.',question:'Se a cabeça está em (2, 2) e anda um passo à direita, qual coordenada muda?'},
 {id:'rpg',match:/\b(rpg|inventario|aventura)\b/,text:'Um RPG textual combina variáveis para a ficha, uma lista para o inventário e condições para as escolhas. Comece com apenas dois caminhos. Só depois adicione itens e novas decisões.',question:'Que informação do personagem você guardaria em uma variável?'},
 {id:'bot',match:/\b(bot|eliza|chatbot)\b/,text:'Um bot clássico escolhe respostas usando regras. Primeiro normaliza a mensagem, depois verifica padrões, e por último usa uma resposta padrão. A ordem das regras importa. ELIZA usava padrões e transformações; nosso exercício é uma introdução simplificada por palavras-chave.',question:'Se uma mensagem contém duas palavras reconhecidas, qual regra será testada primeiro?'},
 {id:'llm',match:/\b(llm|smollm|inteligencia artificial|modelo de linguagem)\b/,text:'Uma LLM gera texto usando padrões aprendidos durante treinamento. Diferente do bot de regras, pode responder de formas novas e também errar. A trilha final usa um modelo pequeno no Colab e pede comparar as respostas. Eu, Py, sou um tutor por regras; não sou uma LLM.',question:'Por que precisamos conferir a resposta de uma LLM mesmo quando parece convincente?'}
];
function findTopic(text){
 const explicit=[['len',/\blen\b/],['while',/\bwhile\b/],['append',/\bappend\b/],['indice',/\b(indice|indices|index)\b/],['funcao',/\b(def|return)\b/],['input',/\binput\b/],['print',/\bprint\b/],['for',/\b(for|range)\b/],['if',/\b(if|elif|else)\b/]];
 const match=explicit.find(([,pattern])=>pattern.test(text));
 return match?topics.find(t=>t.id===match[0]):topics.find(t=>t.match.test(text));
}
function isCode(text){
 return /^(?:[a-zA-Z_]\w*(?:\s*,\s*\w+)*\s*=(?!=)|(?:print|input)\s*\(|def\s+\w+\s*\(|(?:if|for|while)\s+.*:|import\s+\w+|from\s+\w+\s+import\b)/m.test(text)||text.startsWith('```');
}
function explainLine(line){
 const t=line.trim();
 if(/^(const|let)\s/.test(t))return 'JavaScript: declara os valores ou o estado usado no jogo. let permite atualizar o valor durante a partida.';
 if(/^function\s/.test(t))return 'JavaScript: define uma função que reúne uma ação, como mover ou desenhar o jogo.';
 if(/^(if|for|while)\s*\(/.test(t))return 'JavaScript: controla uma condição ou repetição. As chaves delimitam o bloco de instruções.';
 if(/setInterval\(/.test(t))return 'JavaScript: repete a atualização do jogo em um intervalo de milissegundos.';
 if(/^display\(HTML/.test(t))return 'Python: mostra o quadro HTML do jogo na saída da célula do Colab.';
 if(/^jogo = r/.test(t))return 'Python: inicia um texto bruto com o HTML e o JavaScript. O prefixo r preserva barras e quebras do código incorporado.';
 if(!t)return 'Linha em branco: separa partes do programa para facilitar a leitura.';
 if(t.startsWith('#'))return 'Comentário: ajuda quem lê; não é executado pelo Python.';
 if(/^[!%]pip/.test(t))return 'Instala pacotes na sessão do Colab. Execute antes de importar as bibliotecas.';
 if(/^(from|import) /.test(t))return 'Importa uma ferramenta de outro módulo para usar neste programa.';
 if(/^def /.test(t))return 'Define a função e os parâmetros que ela recebe. O corpo com recuo executa quando ela é chamada.';
 if(/^return\b/.test(t))return 'Devolve o resultado e encerra esta chamada da função.';
 if(/^for /.test(t))return 'Repete o bloco com recuo para cada elemento da sequência indicada.';
 if(/^while /.test(t))return 'Repete o bloco enquanto a condição for verdadeira.';
 if(/^elif /.test(t))return 'Testa uma alternativa quando as condições anteriores não foram satisfeitas.';
 if(/^else:/.test(t))return 'Abre o caminho usado quando nenhuma das condições anteriores foi satisfeita.';
 if(/^if /.test(t))return 'Testa uma condição: o bloco com recuo só roda se ela for verdadeira.';
 if(/\.append\(/.test(t))return 'Acrescenta um elemento ao final da lista, modificando a própria lista.';
 if(/\.insert\(/.test(t))return 'Insere um elemento na posição indicada. Na cobrinha, a posição 0 representa a nova cabeça.';
 if(/\.pop\(/.test(t))return 'Remove e devolve o último elemento quando não é informado um índice.';
 if(/^print\(/.test(t))return 'Mostra os valores dentro dos parênteses na saída da célula. Textos literais ficam entre aspas.';
 if(/\+=/.test(t))return 'Atualiza a variável somando ou concatenando o valor à direita ao conteúdo anterior.';
 if(/^[\w, ]+\s*=/.test(t))return 'Calcula o lado direito e associa o resultado ao nome à esquerda. Nomes separados por vírgula recebem os valores correspondentes.';
 return 'Observe a chamada e os valores utilizados. Execute esta etapa no Colab e compare o resultado com a explicação da aula.';
}
const errors=[
 ['indentationerror','O recuo não corresponde ao bloco esperado. Confira a linha indicada e a anterior: depois de if, for ou def, use um bloco com recuo consistente, normalmente quatro espaços.'],
 ['taberror','Há mistura de tabulações e espaços. Refaça o recuo desse bloco usando somente espaços.'],
 ['nameerror','Um nome foi usado antes de estar definido. Confira a grafia, maiúsculas e minúsculas e se a célula que cria a variável foi executada antes.'],
 ['indexerror','A posição acessada não existe nessa sequência. Compare o índice com len(lista): para índices não negativos, ele deve ser menor que o comprimento.'],
 ['typeerror','Uma operação recebeu um tipo incompatível. Veja se está somando texto com número ou usando um valor que não pode ser chamado como função.'],
 ['valueerror','O tipo é aceitável, mas o valor não. Por exemplo, int("oi") não consegue transformar uma palavra em inteiro.'],
 ['zerodivisionerror','O programa tentou dividir por zero. Observe o divisor e descubra como ele recebeu esse valor.'],
 ['modulenotfounderror','A sessão não encontrou o módulo. Confira o nome e a instalação do pacote no ambiente do Colab.'],
 ['syntaxerror','A estrutura do código não foi aceita. Confira a linha indicada e a anterior: aspas, parênteses, colchetes e : ao abrir blocos.']
];
function diagnose(source){
 const n=normalize(source.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,'')),known=errors.find(([name])=>new RegExp('\\b'+name+'\\b').test(n));
 if(known)return known[1]+'\nQual linha aparece no erro e o que você queria que ela fizesse?';
 const lines=source.replace(/^```(?:python)?\s*\n?|```$/g,'').split('\n');
 for(let i=0;i<lines.length;i++){
  // Conservative hints, not a parser: ignore quoted/comment text when checking a header.
  const t=lines[i].replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,'STR').split('#')[0].trim();
  if(/^(?:(?:if|elif|while)\s+.*(?:[<>=!]|\bTrue\b|\bFalse\b)|for\s+\w+\s+in\s+|def\s+\w+\s*\()/.test(t)&&!t.includes(':')&&!/[\[({]$/.test(t))return 'Pista na linha '+(i+1)+': parece haver um início de bloco sem dois pontos (:). Confira o cabeçalho no Colab. Esta é uma leitura por regras, não uma validação do Python.';
  if(/^(?:if|elif)\s+.*[^=!<>]=[^=]/.test(t.split(':')[0]))return 'Pista na linha '+(i+1)+': = atribui um valor, enquanto == compara. Você quer guardar algo ou testar igualdade?';
 }
 return null;
}
function create(options={}){
 let moduleId=options.moduleId||'inicio',step=0,hintIndex=0,lastTopic=null,lastError='',awaiting=null;
 const current=()=>global.PyCodeCurriculo.byId[moduleId]||global.PyCodeCurriculo.byId.inicio;
 const stage=()=>current().steps[Math.min(step,current().steps.length-1)];
 function setLesson(id,index=0){moduleId=id;step=index;hintIndex=0;lastTopic=null;awaiting=null;lastError=''}
 function hint(){const hints=current().hints;const index=Math.min(hintIndex++,hints.length-1);return 'Pista '+(index+1)+' de '+hints.length+': '+hints[index]+'\nTente uma pequena alteração no Colab. O que você espera que aconteça?'}
 function error(text){lastError=text;return diagnose(text)||'Cole a última linha da mensagem de erro e a linha de código indicada. Depois diga o resultado que você esperava. Assim podemos investigar uma coisa de cada vez.'}
 function respond(message){
  const raw=String(message||'').trim(),n=normalize(raw);
  if(!n)return 'Qual parte da etapa você quer entender?';
  const diagnosis=diagnose(raw);if(diagnosis){lastError=raw;return diagnosis}
  if(isCode(raw)){awaiting=null;return 'Li seu trecho, mas não executei Python. '+raw.split('\n').slice(0,4).map((l,i)=>'Linha '+(i+1)+': '+explainLine(l)).join('\n')+'\nO que apareceu no Colab e o que você esperava?';}
  if(/\b(ascii|setas|teclado|nao mexe|nao movimenta|jogar)\b/.test(n))return 'Nos jogos, abra a etapa 3 e execute a célula inteira no Colab. Toque em Iniciar e clique dentro do desenho para dar foco; use as setas ou os botões na saída. Tetris gira com a seta para cima e solta com espaço. A cobrinha atravessa as bordas e o próprio corpo. Python exibe o HTML; o JavaScript recebe as teclas e anima os caracteres. Use Pausar para parar o movimento.';
  if(/\b(erro|bug|nao funciona|deu errado)\b/.test(n))return error(lastError||raw);
  if(/\b(codigo (completo|pronto)|resolva|faca (tudo|para mim)|resposta pronta|gabarito)\b/.test(n))return 'Vou ajudar você a construir, uma decisão por vez. Seu desafio é: '+current().challenge+'\nPrimeiro: quais informações o programa precisa guardar? Se já começou, cole sua tentativa.';
  if(/\b(colab|notebook|onde (escrev|program)|como executar)\b/.test(n))return 'No Google Colab:\n1. Entre com sua conta e crie um novo notebook.\n2. Escolha uma célula de código (ou clique em + Código).\n3. Escreva o pequeno exemplo desta etapa.\n4. Pressione Shift + Enter para executar.\n5. Leia a saída abaixo da célula.\nNas etapas seguintes, execute de cima para baixo. O link “Abrir o Colab” está na aula; o Colab precisa de internet.';
  if(/^(menu|inicio|opcoes|trilhas|jogos)$/.test(n))return 'Escolha nos cartões: Python, Listas, Cálculos, Cobrinha, Ping-Pong, Tetris, RPG, Bot ELIZA ou LLM. Cada trilha tem exemplos curtos e um desafio seu. Os jogos começam com desenhos em Python e terminam numa versão ASCII jogável no Colab. O que você quer criar?';
  if(/^(oi|ola|bom dia|boa tarde|boa noite)[!?. ]*$/.test(n))return 'Olá! Sou a Py. Estamos em '+current().name+', etapa '+(step+1)+'. Posso explicar uma linha, dar uma pista ou investigar um erro do Colab. Por onde começamos?';
  if(/^(dica|pista|mais uma dica|outra dica|ajuda)[!?. ]*$/.test(n))return hint();
  if(/\b(desafio|exercicio|atividade)\b/.test(n))return 'Seu desafio: '+current().challenge+'\nAntes de escrever, divida o objetivo em duas ou três ações. Qual seria a primeira?';
  const lineNumber=n.match(/\blinha\s+(\d+)\b/);
  if(lineNumber){const i=Number(lineNumber[1])-1,lines=stage().code.split('\n');return i>=0&&i<lines.length?'Linha '+(i+1)+':\n'+lines[i]+'\n\n'+explainLine(lines[i])+'\nQue resultado você espera dessa instrução?':'O exemplo atual tem '+lines.length+' linhas. Qual delas você quer analisar?'}
  if(/\b(passo|etapa|linha por linha|explique (o )?codigo)\b/.test(n))return 'Nesta etapa: '+stage().explain+'\n\n'+stage().code.split('\n').map((l,i)=>'Linha '+(i+1)+': '+explainLine(l)).join('\n')+'\nQual linha você explicaria com suas palavras?';
  if(/^(nao entendi|explique de novo|mais simples|como assim|por que|porque)[?!. ]*$/.test(n))return lastTopic?'Vamos por uma ideia só: '+lastTopic.text+'\nPense neste caso: '+lastTopic.question:'Vamos reduzir a etapa: '+stage().explain+'\nLeia apenas a primeira linha do exemplo. '+explainLine(stage().code.split('\n')[0])+'\nO que essa linha guarda ou mostra?';
  const topic=findTopic(n);
  const answerTokens={funcao:/^return[.!]?$/,if:/^else[.!]?$/,numeros:/^(texto|string)[.!]?$/,print:/^(nao|sem aspas)[.!]?$/};
  if(awaiting && (!topic || answerTokens[awaiting]?.test(n)) && n.split(/\s+/).length <= 8 && !/\b(explique|como|quero|duvida|o que|qual)\b/.test(n)){
   const checks={indice:[/^(?:e |o ultimo e |indice )?(2|dois)[.!]?$/,'O último índice é 2: as posições são 0, 1 e 2.'],variavel:[/^(?:e |vale )?(10|dez)[.!]?$/,'O novo valor é 10, porque 8 + 2 = 10.'],for:[/^(?:sao )?(4|quatro)(?: vezes)?[.!]?$/,'São quatro repetições: os valores são 0, 1, 2 e 3.'],len:[/^(?:e |vale )?(0|zero)[.!]?$/,'A lista vazia tem zero elementos.'],funcao:[/\breturn\b/,'return permite usar o resultado fora da função.'],print:[/\b(nao|sem)\b/,'Sem aspas, Python procura o valor associado ao nome.'],numeros:[/\b(texto|string)\b/,'As aspas fazem de "4" um texto.'],if:[/\belse\b/,'O else é executado quando a condição do if é falsa.']};
   const check=checks[awaiting];awaiting=null;
   if(check)return (check[0].test(n)?'Isso! ':'Vamos conferir: ')+check[1]+'\nAgora teste um caso diferente no Colab e compare.';
   return 'Você trouxe uma hipótese. Para conferir, transforme-a em um teste pequeno no Colab. '+(lastTopic?lastTopic.question:'Qual resultado você espera?');
  }
  if(topic){lastTopic=topic;awaiting=topic.id;return topic.text+'\n\n'+topic.question}
  if(/\b(entendi|consegui|deu certo|obrigad[oa])\b/.test(n))return 'Boa! Agora mude um valor e tente prever a saída antes de executar. Quando conseguir explicar o resultado, marque a etapa como entendida.';
  if(/^(sim|nao|ok)$/.test(n))return 'Vamos ligar isso ao exemplo: '+stage().explain+'\nO que você espera ver ao executar a primeira linha?';
  return 'Ainda não identifiquei bem sua dúvida. Estamos em '+current().name+'. Você pode perguntar “explique a linha 1”, “o que é uma lista?” ou colar um erro do Colab. Se estiver falando de outro assunto, diga qual conceito de Python está tentando usar.';
 }
 return {respond,hint,error,setLesson,setStep(n){setLesson(moduleId,n)},getLastError(){return lastError}};
}
global.PyCodeTutor={create,normalize,explainLine,diagnose};
})(window);
