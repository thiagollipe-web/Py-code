/* Py-Code — Professor Bot offline */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const messages=$("botMessages"), input=$("botInput"), send=$("botSend");
  const hintBtn=$("botHintBtn"), challengeBtn=$("botChallenge");
  if(!messages||!input||!send||!hintBtn||!challengeBtn)return;
  let helpLevel=0,lastFingerprint="",lastAnalysis=null;

  function add(text,kind="bot"){
    const item=document.createElement("div");
    item.className="bot-msg "+kind;
    item.textContent=text;
    messages.appendChild(item);
    messages.scrollTop=messages.scrollHeight;
  }
  function code(){return window.__pyCodeGetCode?window.__pyCodeGetCode():"";}
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
    const o=(s.match(/[({\[]/g)||[]).length, c=(s.match(/[)}\]]/g)||[]).length;
    if(o>c)r.errors.push("há algum símbolo de abertura sem fechamento");
    if(c>o)r.errors.push("há algum símbolo de fechamento sem abertura");
    if(/(^|\n)\s*(if|for|while|def)\b[^:\n]*$/m.test(s)||/=\s*$/m.test(s))r.errors.push("há uma linha que parece incompleta");
    if(r.errors.length)r.focus="erro";
    else if(!r.concepts.includes("print"))r.focus="print";
    else if(!r.concepts.includes("variáveis"))r.focus="variáveis";
    else if(!r.concepts.includes("condições")&&!r.concepts.includes("for"))r.focus="próximo conceito";
    else r.focus="próximo passo";
    return r;
  }
  function fingerprint(s){return String(s||"").replace(/\s+/g," ").trim().slice(0,700)}
  function nextHint(){
    const info=lastAnalysis||analyze(code()); helpLevel=Math.min(3,helpLevel+1);
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
    if(!info.concepts.includes("variáveis"))return add("DESAFIO: crie uma variável chamada pontos e guarde um número nela.","bot");
    if(!info.concepts.includes("condições"))return add("DESAFIO: use pontos em uma condição e mostre uma mensagem conforme o valor.","bot");
    if(!info.concepts.includes("for"))return add("DESAFIO: repita uma mensagem cinco vezes sem escrever cinco print separados.","bot");
    add("DESAFIO: crie uma função pequena que receba dois números e devolva o resultado de uma operação.","bot");
  }
  function observe(){
    const fp=fingerprint(code());
    if(fp===lastFingerprint)return;
    lastFingerprint=fp;helpLevel=0;lastAnalysis=analyze(code());
    if(lastAnalysis.errors.length){
      add("Encontrei uma pista: "+lastAnalysis.errors[0]+". Qual parte dessa linha você acha que precisa ser revista?","bot");
    }else if(lastAnalysis.concepts.includes("print")&&!lastAnalysis.concepts.includes("variáveis")){
      add("Você já conseguiu mostrar algo no terminal. Agora pense em guardar uma informação para usar depois. O que poderia virar uma variável?","bot");
    }
  }
  function respond(){
    const t=input.value.trim(); if(!t)return;
    add(t,"user"); input.value="";
    const n=t.toLowerCase();
    if(/dica|ajuda|help/.test(n))return add(nextHint(),"bot");
    if(/desafio|exerc/.test(n))return challenge();
    if(/não entendi|nao entendi|porque|por que|como/.test(n)){
      return add(lastAnalysis?.errors?.length
        ?"Vamos por partes: encontre a linha indicada pelo Python e procure o símbolo ou comando que parece incompleto."
        :"Pense primeiro no objetivo da linha. O que você quer que o Python faça ali?","bot");
    }
    add("Entendi. Continue tentando no editor. Eu vou orientar por perguntas e pistas, sem escrever a solução pronta.","bot");
  }
  send.addEventListener("click",respond);
  input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();respond();}});
  hintBtn.addEventListener("click",()=>add(nextHint(),"bot"));
  challengeBtn.addEventListener("click",challenge);
  setInterval(observe,1200);
  add("Olá! Sou o Professor Bot. Não vou fazer o exercício por você. Vou ajudar você a descobrir o caminho.","bot");
})();