/* Py-Code — Professor Bot local
 * Sem servidor. Sem LLM remoto. Funciona como tutor heurístico no navegador.
 * Pode consultar referências locais do módulo aws-code-library.js.
 */
(function(){
  "use strict";

  function iniciar(){
    const $=id=>document.getElementById(id);
    const messages=$("botMessages");
    const input=$("botInput");
    const send=$("botSend");
    const hintBtn=$("botHintBtn");
    const challengeBtn=$("botChallenge");
    const status=$("botStatus");

    if(!messages||!input||!send||!hintBtn||!challengeBtn){
      console.error("[Py-Code] Professor Bot: elementos da interface não encontrados.");
      return false;
    }

    let helpLevel=0;
    let lastFingerprint="";
    let lastAnalysis=null;
    let lastRuntimeError="";

    function setBotStatus(text){
      if(status)status.textContent=text;
    }

    function add(text,kind="bot",link=null){
      const item=document.createElement("div");
      item.className="bot-msg "+kind;
      item.textContent=String(text);

      if(link&&link.url){
        const br=document.createElement("br");
        const a=document.createElement("a");
        a.href=link.url;
        a.target="_blank";
        a.rel="noopener noreferrer";
        a.textContent="Abrir referência oficial";
        a.style.display="inline-block";
        a.style.marginTop="6px";
        a.style.color="inherit";
        item.append(br,a);
      }

      messages.appendChild(item);
      messages.scrollTop=messages.scrollHeight;
    }

    function code(){
      try{
        return typeof window.__pyCodeGetCode==="function"
          ? String(window.__pyCodeGetCode()||"")
          : "";
      }catch(error){
        setBotStatus("ERRO AO LER EDITOR");
        return "";
      }
    }

    function normalize(text){
      return String(text||"").toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");
    }

    function analyze(source){
      const s=String(source||"");
      const r={concepts:[],errors:[],focus:null};

      if(/\bprint\s*\(/.test(s))r.concepts.push("print");
      if(/\b[A-Za-z_]\w*\s*=\s*[^=]/.test(s))r.concepts.push("variáveis");
      if(/\b(if|elif|else)\b/.test(s))r.concepts.push("condições");
      if(/\bfor\b/.test(s))r.concepts.push("for");
      if(/\bwhile\b/.test(s))r.concepts.push("while");
      if(/\bdef\s+\w+\s*\(/.test(s))r.concepts.push("funções");
      if(/\[[^\]]*\]/.test(s))r.concepts.push("listas");
      if(/\b(import|from)\b/.test(s))r.concepts.push("módulos");

      const opens=(s.match(/[({\[]/g)||[]).length;
      const closes=(s.match(/[)}\]]/g)||[]).length;
      if(opens>closes)r.errors.push("há um símbolo de abertura sem fechamento");
      if(closes>opens)r.errors.push("há um símbolo de fechamento sem abertura");

      const lines=s.split(/\r?\n/);
      lines.forEach(function(line,index){
        const t=line.trim();
        if(/^(if|elif|else|for|while|def)\b.*[^:]$/.test(t)){
          r.errors.push("a linha "+(index+1)+" parece iniciar um bloco sem ':'");
        }
        if(/=\s*$/.test(t)){
          r.errors.push("a linha "+(index+1)+" termina com '=' e parece incompleta");
        }
      });

      if(r.errors.length)r.focus="erro";
      else if(!r.concepts.includes("print"))r.focus="print";
      else if(!r.concepts.includes("variáveis"))r.focus="variáveis";
      else if(!r.concepts.includes("condições")&&!r.concepts.includes("for"))r.focus="próximo conceito";
      else r.focus="próximo passo";

      return r;
    }

    function fingerprint(source){
      return String(source||"").replace(/\s+/g," ").trim();
    }

    function nextHint(){
      const info=lastAnalysis||analyze(code());
      helpLevel=Math.min(3,helpLevel+1);

      if(lastRuntimeError){
        if(helpLevel===1)return "Dica 1: leia a última linha do erro para descobrir o tipo do problema.";
        if(helpLevel===2)return "Dica 2: localize a linha indicada pelo Python e veja os nomes usados nela.";
        return "Dica 3: compare o que o código faz com o que você queria que aquela linha fizesse.";
      }

      if(info.errors.length){
        if(helpLevel===1)return "Dica 1: olhe a linha que parece incompleta.";
        if(helpLevel===2)return "Dica 2: confira ':' no final de if, for, while e def; também revise (), [] e {}.";
        return "Dica 3: corrija apenas a primeira pista e execute novamente.";
      }

      if(info.focus==="print"){
        if(helpLevel===1)return "Dica 1: qual função do Python escreve uma mensagem no terminal?";
        if(helpLevel===2)return "Dica 2: o nome dessa função começa com 'p'.";
        return "Dica 3: experimente pensar na função print(...).";
      }

      if(info.focus==="variáveis"){
        if(helpLevel===1)return "Dica 1: guarde um valor usando um nome.";
        if(helpLevel===2)return "Dica 2: pense na estrutura nome = valor.";
        return "Dica 3: escolha um nome simples e coloque um número ou texto à direita do =.";
      }

      if(info.focus==="próximo conceito"){
        if(helpLevel===1)return "Dica 1: depois de mostrar e guardar dados, você pode tomar decisões ou repetir ações.";
        if(helpLevel===2)return "Dica 2: if decide; for e while repetem.";
        return "Dica 3: tente um pequeno if usando a variável que você criou.";
      }

      if(helpLevel===1)return "Dica 1: mude uma coisa por vez.";
      if(helpLevel===2)return "Dica 2: execute e compare o resultado com sua expectativa.";
      return "Dica 3: explique cada linha com suas próprias palavras antes de alterar o programa.";
    }

    function challenge(){
      const info=analyze(code());
      if(!info.concepts.includes("variáveis"))return add("DESAFIO: crie uma variável chamada pontos e guarde um número.");
      if(!info.concepts.includes("condições"))return add("DESAFIO: use pontos em uma condição e mostre uma mensagem.");
      if(!info.concepts.includes("for"))return add("DESAFIO: repita uma mensagem cinco vezes sem copiar o print cinco vezes.");
      return add("DESAFIO: crie uma função que receba dois números e devolva o resultado de uma operação.");
    }

    function awsAssist(text){
      if(!window.PyCodeAWS||typeof window.PyCodeAWS.lookup!=="function")return false;
      const ref=window.PyCodeAWS.lookup(text);
      if(!ref)return false;
      add(
        "Encontrei uma referência oficial da AWS para "+ref.label+". Use-a como material de estudo e adapte a ideia ao seu exercício.",
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
      lastRuntimeError="";
      lastAnalysis=analyze(current);

      if(lastAnalysis.errors.length){
        add("Encontrei uma pista: "+lastAnalysis.errors[0]+". Qual parte dessa linha você acha que precisa ser revista?");
      }
    }

    function handleRuntimeError(event){
      const message=String(event&&event.detail&&event.detail.message||"");
      if(!message)return;

      lastRuntimeError=message;
      helpLevel=0;

      const lower=normalize(message);
      let clue="Leia a linha indicada pelo Python e identifique o tipo do erro.";

      if(lower.includes("syntaxerror"))clue="O Python encontrou um problema de sintaxe. Revise a estrutura da linha indicada.";
      else if(lower.includes("indentationerror"))clue="O Python encontrou um problema de indentação. Compare os espaços dessa linha com o bloco ao qual ela pertence.";
      else if(lower.includes("nameerror"))clue="O Python não reconheceu um nome. Verifique se a variável ou função existe antes do uso.";
      else if(lower.includes("typeerror"))clue="Os tipos dos valores usados nessa operação podem não combinar. Verifique cada valor.";
      else if(lower.includes("indexerror"))clue="A posição acessada não existe. Confira o tamanho da lista e o índice.";

      add("Vi um erro real do runtime. "+clue);
      setBotStatus("ERRO DETECTADO • BOT ATENTO");
    }

    function respond(){
      const t=input.value.trim();
      if(!t)return;

      add(t,"user");
      input.value="";

      const n=normalize(t);

      if(/^(oi|ola|olá|bom dia|boa tarde|boa noite)$/.test(n)){
        return add("Olá! Vamos trabalhar no seu código. O que você está tentando fazer?");
      }

      if(/dica|ajuda|help/.test(n))return add(nextHint());
      if(/desafio|exercicio|exercício/.test(n))return challenge();

      if(/aws|amazon|boto3|s3|lambda|dynamodb|bedrock|iam|ec2|cloudwatch/.test(n)){
        if(awsAssist(t))return;
      }

      if(/erro|bug|falha|nao funciona|não funciona/.test(n)){
        if(lastRuntimeError)return add("Vamos pelo diagnóstico: leia o tipo do erro e a linha indicada. Depois escolha uma única coisa para revisar.");
        const info=lastAnalysis||analyze(code());
        if(info.errors.length)return add("A primeira pista encontrada no seu código é: "+info.errors[0]+". Confira essa linha antes das outras.");
        return add("Execute o código para gerar uma mensagem real de erro. Depois eu posso usar essa mensagem para orientar a investigação.");
      }

      if(/exemplo/.test(n)&&window.PyCodeAWS){
        const ref=window.PyCodeAWS.lookup("python boto3");
        if(ref)return add("A AWS Code Library reúne exemplos por serviço e SDK. Para Python, consulte os exemplos de Boto3.", "bot", ref);
      }

      if(/nao entendi|não entendi|porque|por que|como/.test(n)){
        return add(lastRuntimeError
          ?"Observe o tipo do erro e a linha indicada pelo Python. Qual parte dela pode estar causando esse tipo de problema?"
          :"Descreva o objetivo da linha que está te confundindo. Vou transformar isso em uma pista.");
      }

      add("Entendi. Mostre no editor o que você tentou. Eu vou fazer perguntas e dar pistas, sem entregar a solução pronta.");
    }

    try{
      send.addEventListener("click",respond);
      input.addEventListener("keydown",function(event){
        if(event.key==="Enter"){
          event.preventDefault();
          respond();
        }
      });
      hintBtn.addEventListener("click",function(){add(nextHint());});
      challengeBtn.addEventListener("click",challenge);
      window.addEventListener("pycode:runtime-error",handleRuntimeError);
      window.addEventListener("error",function(event){
        const source=String(event&&event.filename||"");
        if(source.includes("professor-bot.js")){
          setBotStatus("ERRO NO BOT • VEJA O CONSOLE");
        }
      });

      setBotStatus(window.PyCodeAWS
        ?"ASSISTENTE LOCAL + AWS REFERENCES"
        :"ASSISTENTE LOCAL");

      add("Olá. Sou o Professor Bot. Estou conectado ao editor e posso orientar seus estudos sem entregar a solução pronta.");
      add("Use PEDIR DICA, DESAFIO ou escreva sua dúvida.");

      observe();
      setInterval(observe,1200);
      window.PyCodeBot={
        respond:respond,
        hint:nextHint,
        challenge:challenge,
        analyze:function(){return analyze(code());},
        status:function(){return status?status.textContent:"";}
      };
      return true;
    }catch(error){
      console.error("[Py-Code] Professor Bot inicialização:",error);
      setBotStatus("FALHA AO INICIAR BOT");
      return false;
    }
  }

  if(!iniciar()){
    window.addEventListener("DOMContentLoaded",iniciar,{once:true});
  }
})();