/* Professor Bot clássico: regras, palavras-chave, estado e dicas progressivas. */
(function(global){
"use strict";
const normalize=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
const rules=[
{match:/^(oi|ola|e ai|bom dia|boa tarde|boa noite)\b/,answer:"Olá! Sou seu Professor Bot. Vamos aprender Python brincando? Escolha um módulo ou pergunte como funciona o código."},
{match:/\b(o que e python|python serve|linguagem python)\b/,answer:"Python é uma linguagem de programação: você escreve instruções e o computador as executa. Comece com print(\"Olá!\"). No Colab, pressione ▶ ao lado da célula."},
{match:/\b(lista|listas|append|indice|index)\b/,answer:"Lista guarda vários valores: frutas = [\"uva\", \"maçã\"]. Para ler o primeiro valor, use frutas[0]. Para adicionar um novo valor, use frutas.append(\"banana\")."},
{match:/\b(variavel|variaveis)\b/,answer:"Uma variável é um nome que guarda um valor. Exemplo: pontos = 10. Depois você pode escrever print(pontos)."},
{match:/\b(print|imprimir|mostrar)\b/,answer:"print() exibe mensagens no terminal. Escreva print(\"Olá, turma!\") e clique em Executar Python."},
{match:/\b(if|else|condicao|decisao)\b/,answer:"if testa uma condição. Exemplo: if pontos > 5: print(\"Boa!\"). Observe que a linha do print precisa de recuo."},
{match:/\b(for|while|repetir|repeticao|loop)\b/,answer:"for repete instruções. Exemplo: for n in range(3): print(n). A saída é 0, 1 e 2."},
{match:/\b(tetris|matriz|matrizes)\b/,answer:"No Tetris, uma peça é uma lista de linhas. Exemplo: [[1, 1], [1, 1]]. 1 é bloco; 0 é espaço vazio. Comece desenhando a peça com print."},
{match:/\b(pong|ping.pong|bola|colisao)\b/,answer:"No Pong, guarde a posição e a velocidade da bola. Quando tocar a borda, inverta a direção: velocidade = -velocidade."},
{match:/\b(cobra|cobrinha|snake)\b/,answer:"A cobrinha pode começar com posições [(2, 2), (1, 2)]. Use insert para inserir uma nova cabeça e pop para remover a cauda."},
{match:/\b(rpg|aventura|personagem|inventario)\b/,answer:"RPG textual precisa só de variáveis, listas e if. Guarde vida = 10 e inventario = [\"mapa\"]. As decisões do jogador mudam a história."},
{match:/\b(eliza|chatbot|bot|assistente de regras)\b/,answer:"Bots clássicos funcionam com regras: se a frase contiver uma palavra-chave, retornam uma resposta preparada. Você mesmo vai programar o seu."},
{match:/\b(llm|colab|modelo de linguagem|smollm)\b/,answer:"Primeiro domine variáveis, listas, if e funções. Depois, no Google Colab, instale transformers e carregue SmolLM2-135M-Instruct. O download e a execução exigem internet e uma sessão Colab."},
{match:/\b(input|entrada de dados)\b/,answer:"input() permite digitar informações no Python. Nos exemplos do site usamos valores prontos para facilitar o teste automático. No Colab você pode usar nome = input(\"Seu nome: \")."},
{match:/\b(erro|bug|syntaxerror|nameerror|indentationerror|typeerror)\b/,answer:"Um erro é uma pista! Leia a última linha da mensagem. SyntaxError costuma indicar sintaxe; NameError indica nome não definido; IndentationError indica recuo. Me envie o erro e diga qual linha você estava tentando executar."}
];
function create(options={}){
 let moduleId=options.moduleId||"inicio",step=0,hintIndex=0,lastError="";
 function current(){return global.PyCodeCurriculo?.byId[moduleId]||global.PyCodeCurriculo.byId.inicio}
 function setLesson(id,index=0){moduleId=id;step=index;hintIndex=0;lastError=""}
 function hint(){const a=current().hints;const h=a[Math.min(hintIndex,a.length-1)];hintIndex++;return "Pista "+Math.min(hintIndex,a.length)+": "+h+"\nAgora tente mudar apenas uma linha do programa."}
 function error(message){lastError=String(message||"");const n=normalize(lastError);
  if(n.includes("syntaxerror"))return "O Python encontrou um erro de escrita. Confira parênteses, aspas e dois pontos.";
  if(n.includes("indentationerror"))return "O recuo está inconsistente. Depois de if, for ou def use quatro espaços.";
  if(n.includes("nameerror"))return "Você usou um nome não definido. Veja se a variável foi criada antes de ser usada.";
  if(n.includes("indexerror"))return "Esse índice não existe na lista. Lembre-se: a primeira posição é 0.";
  if(n.includes("typeerror"))return "Talvez você esteja misturando tipos incompatíveis, como texto e número.";
  return "O Python encontrou um erro. Leia a última linha e veja a instrução que o causou. Se precisar, escreva 'dica'.";
 }
 function respond(message){
  const n=normalize(message);
  if(!n)return "Escreva uma pergunta sobre o programa ou escolha um comando.";
  if(/^(menu|inicio|modulos|opcoes)$/.test(n))return "Menu de estudos: Python, Listas, Cálculos, Cobrinha, Pong, Tetris, RPG, Bot clássico e LLM no Colab. Escolha um na coluna de módulos.";
  if(/\b(dica|pista|ajuda|nao entendi|explique de novo)\b/.test(n))return hint();
  if(/\b(desafio|exercicio|atividade)\b/.test(n))return "Seu desafio atual: "+current().challenge+"\nTente no editor e execute o código. Não vou resolver tudo por você.";
  if(/\b(erro|bug|falha|deu errado)\b/.test(n)&&lastError)return error(lastError);
  const rule=rules.find(r=>r.match.test(n));
  if(rule)return rule.answer;
  if(/\b(passo|linha|codigo)\b/.test(n)){
   const s=current().steps[Math.min(step,current().steps.length-1)];
   return "Nesta etapa: "+s.explain+"\nExperimente executar o exemplo e altere um valor.";
  }
  return "Vou ajudar por partes. Você quer saber o que a linha faz, por que houve um erro ou como começar o desafio? Digite 'dica', 'erro', 'listas', 'jogos' ou 'Colab'.";
 }
 return {respond,hint,error,setLesson,setStep(n){step=n;hintIndex=0},getLastError(){return lastError}};
}
global.PyCodeTutor={create,normalize};
})(window);
