/* Py-Code — Professor Bot local + referências AWS Code Library */
(function(){
  "use strict";

  const $=id=>document.getElementById(id);
  const messages=$("botMessages"), input=$("botInput"), send=$("botSend");
  const hintBtn=$("botHintBtn"), challengeBtn=$("botChallenge"), status=$("botStatus");
  const awsLibrary=$("botAwsLibrary"), awsPython=$("botAwsPython");
  if(!messages||!input||!send||!hintBtn||!challengeBtn)return;

  let helpLevel=0,lastFingerprint="",lastAnalysis=null,lastRuntimeError="";

  function add(text,kind="bot",link=null){
    const item=document.createElement("div");
    item.className="bot-msg "+kind;
    item.textContent=String(text);
    if(link){
      const a=document.createElement("a");
      a.href=link.url;
      a.target="_blank";
      a.rel="noopener noreferrer";
      a.textContent="Abrir referência";
      a.style.display="inline-block";
      a.style.marginTop="6px";
      a.style.color="inherit";
      item.appendChild(document.createElement("br"));
      item.appendChild(a);
    }
    messages.appendChild(item);
    messages.scrollTop=messages.scrollHeight;
  }

  function code(){return window.__pyCodeGetCode?window.__pyCodeGetCode():"";}

  function analyze(source){
    const s=String(source||"");
    const r={concepts:[],errors:[],focus:null};
    if(/prints*(/.test(s))r.concepts.push("print");
    if(/[A-Za-z_]w*s*=s*[^=]/.test(s))r.concepts.push("variáveis");
    if(/(if|elif|else)/.test(s))r.concepts.push("condições");
    if(/for/.test(s))r.concepts.push("for");
    if(/while/.test(s))r.concepts.push("while");
    if(/defs+w+s*(/.test(s))r.concepts.push("funções");
    if(/[[^]]*]/.test(s))r.concepts.push("listas");
    if(/(import|from)/.test(s))r.concepts.push("módulos");
    const o=(s.match(/[({[]/g)||[]).length;
    const c=(s.match(/[)}]]/g)||[]).length;
    if(o>c)r.errors.push("há algum símbolo de abertura sem fechamento");
    if(c>o)r.errors.push("há algum símbolo de fechamento sem abertura");
    if(/(^|
)s*(if|for|while|def)[^:
]*$/m.test(s)||/=s*$/m.test(s))r.errors.push("há uma linha que parece incompleta");
    if(r.errors.length)r.focus="erro";
    else if(!r.concepts.includes("print"))r.focus="print";
    else if(!r.concepts.includes("variáveis"))r.focus="variáveis";
    else if(!r.concepts.includes("condições")&&!r.concepts.includes("for"))r.focus="próximo conceito";
    else r.focus="próximo passo";
    return r;
  }

  function fingerprint(s){return String(s||"").replace(/s+/g," ").trim().slice(0,700);}

  function nextHint(){
    const info=lastAnalysis||analyze(code());
    helpLevel=Math.min(3,helpLevel+1);

    if(lastRuntimeError){
      if(helpLevel===1)return "Dica 1: leia a última linha do erro; ela normalmente informa o tipo do problema.";
      if(helpLevel===2)return "Dica 2: veja o nome do erro e a linha indicada antes de mudar o código.";
      return "Dica 3: compare a mensagem com o que você pretendia que aquela instrução fizesse.";
    }

    if(info.errors.length){
      if(helpLevel===1)return "Dica 1: procure um símbolo que foi aberto e não foi fechado.";
      if(helpLevel===2)return "Dica 2: confira pares como (), [] e {}.";
      return "Dica 3: observe primeiro a linha onde o Python indica o erro e confira os delimitadores dessa instrução.";
    }
    if(info.focus==="print"){
      if(helpLevel===1)return "Dica 1: existe uma função que mostra informações no terminal.";
      if(helpLevel===2)return "Dica 2: o nome dela começa com a letra p.";
      return "Dica 3: experimente a função print com algo entre parênteses.";
    }
    if(info.focus==="variáveis"){
      if(helpLevel===1)return "Dica 1: uma variável permite guardar um valor com um nome.";
      if(helpLevel===2)return "Dica 2: pense no formato nome = valor.";
      return "Dica 3: escolha um nome simples e coloque um texto ou número depois do =.";
    }
    if(info.focus==="próximo conceito"){
      if(helpLevel===1)return "Dica 1: Python pode tomar decisões e repetir ações.";
      if(helpLevel===2)return "Dica 2: if decide; for e while repetem.";
      return "Dica 3: tente primeiro uma condição pequena usando if.";
    }
    if(helpLevel===1)return "Dica 1: mude apenas uma coisa por vez.";
    if(helpLevel===2)return "Dica 2: execute o programa e compare o resultado com o que você esperava.";
    return "Dica 3: explique para você mesmo o que cada linha deveria fazer antes de alterá-la.";
  }

  function challenge(){
    const info=analyze(code());
    if(!info.concepts.includes("variáveis"))return add("DESAFIO: crie uma variável chamada pontos e guarde um número nela.");
    if(!info.concepts.includes("condições"))return add("DESAFIO: use pontos em uma condição e mostre uma mensagem conforme o valor.");
    if(!info.concepts.includes("for"))return add("DESAFIO: repita uma mensagem cinco vezes sem escrever cinco print separados.");
    add("DESAFIO: crie uma função pequena que receba dois números e devolva o resultado de uma operação.");
  }

  function awsAssist(text){
    if(!window.PyCodeAWS)return false;
    const ref=window.PyCodeAWS.lookup(text);
    if(!ref)return false;
    add(
      "Encontrei uma referência oficial da AWS para "+ref.label+". A biblioteca organiza exemplos por serviço e SDK. Use o exemplo como referência e adapte a ideia ao seu exercício.",
      "bot",
      ref
    );
    return true;
  }

  function observe(){
    const current=code();
    const fp=fingerprint(current);
    if(fp===lastFingerprint)return;
    lastFingerprint=fp;
    helpLevel=0;
    lastAnalysis=analyze(current);
    lastRuntimeError="";

    if(lastAnalysis.errors.length){
      add("Encontrei uma pista: "+lastAnalysis.errors[0]+". Qual parte dessa linha você acha que precisa ser revista?");
    }else if(lastAnalysis.concepts.includes("print")&&!lastAnalysis.concepts.includes("variáveis")){
      add("Você já conseguiu mostrar algo no terminal. Agora pense em guardar uma informação para usar depois. O que poderia virar uma variável?");
    }
  }

  function handleRuntimeError(e){
    const message=String(e?.detail?.message||"");
    if(!message)return;
    lastRuntimeError=message;
    helpLevel=0;
    const lower=message.toLowerCase();
    let clue="Leia a última linha do erro e localize a linha indicada pelo Python.";
    if(lower.includes("syntaxerror"))clue="O Python encontrou um problema na estrutura da instrução. Revise a sintaxe da linha indicada.";
    else if(lower.includes("indentationerror"))clue="O problema está na indentação. Compare os espaços da linha com o bloco ao qual ela pertence.";
    else if(lower.includes("nameerror"))clue="O Python não reconheceu um nome. Verifique se a variável ou função foi criada antes de ser usada.";
    else if(lower.includes("typeerror"))clue="Os tipos de dados usados nessa operação podem não combinar. Verifique o tipo de cada valor envolvido.";
    else if(lower.includes("indexerror"))clue="Você tentou acessar uma posição que não existe. Confira o tamanho da lista e o índice usado.";
    add("Vi um erro real do runtime. "+clue);
  }

  function respond(){
    const t=input.value.trim();
    if(!t)return;
    add(t,"user");
    input.value="";
    const n=t.toLowerCase();

    if(/dica|ajuda|help/.test(n))return add(nextHint());
    if(/desafio|exerc/.test(n))return challenge();
    if(/aws|amazon|boto3|s3|lambda|dynamodb|bedrock|iam|ec2|cloudwatch/.test(n)){
      if(awsAssist(t))return;
    }
    if(/exemplo/.test(n)&&window.PyCodeAWS){
      const ref=window.PyCodeAWS.lookup("python boto3");
      if(ref)return add("A AWS Code Library tem exemplos por serviço e SDK. Para Python, a referência de Boto3 é um bom ponto de partida.", "bot", ref);
    }
    if(/não entendi|nao entendi|porque|por que|como/.test(n)){
      return add(lastRuntimeError
        ?"Vamos por partes: encontre a linha indicada pelo Python e identifique o tipo do erro."
        :"Pense primeiro no objetivo da linha. O que você quer que o Python faça ali?");
    }
    add("Entendi. Continue tentando no editor. Eu vou orientar por perguntas e pistas, sem escrever a solução pronta.");
  }

  send.addEventListener("click",respond);
  input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();respond();}});
  hintBtn.addEventListener("click",()=>add(nextHint()));
  challengeBtn.addEventListener("click",challenge);
  window.addEventListener("pycode:runtime-error",handleRuntimeError);
  if(status)status.textContent="ASSISTENTE LOCAL + AWS REFERENCES";

  if(awsLibrary)awsLibrary.title="Biblioteca oficial de exemplos de código da AWS";
  if(awsPython)awsPython.title="Exemplos oficiais AWS SDK para Python (Boto3)";

  setInterval(observe,1200);

  add("Olá. Sou o Professor Bot. Entrei com você para ajudar a entender Python, investigar erros e estudar exemplos. Não vou entregar a solução pronta.");
  add("Também posso apontar referências da AWS Code Library para serviços como S3, Lambda, DynamoDB, Bedrock, IAM e EC2.");
})();