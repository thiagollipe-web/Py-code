/* Interface, editor, chat e execução no Pyodide. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const catalog=window.PyCodeCurriculo;
const tutor=window.PyCodeTutor.create();
const code=$("code"),terminal=$("terminal"),cards=$("cards"),nav=$("nav"),chat=$("messages");
const modules=catalog.modules;
let active="inicio",step=0,worker=null,ready=false,busy=false,bootWatch=null,runWatch=null;
let completed=new Set();
const STORE="pycode-academia-progress-v1";
try{completed=new Set(JSON.parse(localStorage.getItem(STORE)||"[]"))}catch(_){}
function persist(){try{localStorage.setItem(STORE,JSON.stringify([...completed]))}catch(_){}}
function saveCode(){try{localStorage.setItem("pycode-academia-draft-"+active,code.value)}catch(_){}}
function log(s){terminal.textContent+=(terminal.textContent?"\n":"")+String(s);terminal.scrollTop=terminal.scrollHeight}
function updateProgress(){
 $("progressLabel").textContent=completed.size+" de "+modules.length+" módulos visitados";
 $("progressBar").style.width=(completed.size/modules.length*100)+"%";
}
function setBusy(v){busy=v;$("run").disabled=v||!ready}
function greeting(){
 bot("Olá! Eu sou o Professor Bot, um chatbot de regras, inspirado nos assistentes anteriores às LLMs.");
 bot("Escolha um módulo, leia cada passo e execute programas pequenos. Digite 'dica', 'desafio', 'erro' ou pergunte algo sobre Python.");
}
function bot(text,isUser=false){
 const item=document.createElement("div");
 item.className="message"+(isUser?" user":"");
 const strong=document.createElement("strong");
 strong.textContent=isUser?"Você":"Professor Bot";
 const p=document.createElement("div");
 p.textContent=String(text);
 item.append(strong,p);chat.append(item);
 while(chat.childElementCount>90)chat.firstChild.remove();
 chat.scrollTop=chat.scrollHeight;
}
function quick(){
 const sug=$("suggestions");sug.replaceChildren();
 [["Dica","dica"],["Desafio","desafio"],["O que é Python?","o que é python"],["Menu","menu"]].forEach(([label,value])=>{
  const b=document.createElement("button");b.type="button";b.textContent=label;
  b.onclick=()=>ask(value);sug.append(b);
 });
}
function ask(text){bot(text,true);bot(tutor.respond(text))}
function renderNav(){
 nav.replaceChildren();
 modules.forEach((item,i)=>{
  const b=document.createElement("button");b.type="button";b.dataset.module=item.id;
  b.className=item.id===active?"active":"";
  const badge=document.createElement("span");badge.textContent=completed.has(item.id)?"✓":String(i+1);
  b.append(badge,document.createTextNode(item.name));b.onclick=()=>select(item.id);
  nav.append(b);
 });
}
function renderCards(){
 cards.replaceChildren();
 modules.filter(m=>m.id!==active).slice(0,4).forEach(m=>{
  const b=document.createElement("button");b.type="button";b.className="card";
  const tag=document.createElement("span");tag.className="mark";tag.textContent=m.tag;
  const title=document.createElement("b");title.textContent=m.name;
  const sub=document.createElement("small");sub.textContent=m.subtitle;
  b.append(tag,title,sub);b.onclick=()=>select(m.id);
  cards.append(b);
 });
}
function lesson(){
 const mod=catalog.byId[active],s=mod.steps[step];
 $("title").textContent=active==="inicio"?"Sua jornada começa com Python":mod.name;
 $("lead").textContent=mod.intro;
 $("lessonTitle").textContent=mod.name;
 $("lessonCounter").textContent="Etapa "+(step+1)+" / "+mod.steps.length;
 $("intro").textContent=mod.subtitle;
 $("stepLabel").textContent="ETAPA "+(step+1)+" — APRENDA FAZENDO";
 $("explain").textContent=s.explain;
 $("challenge").textContent=mod.challenge;
 $("next").textContent=step===mod.steps.length-1?"Concluir módulo":"Próxima etapa";
 $("run").textContent=s.colabOnly?"Executar no Colab":"Executar Python";
 $("run").disabled=!!s.colabOnly||!ready||busy;
 $("terminal").textContent=s.colabOnly?
  "Esta etapa usa comandos e pacotes do Google Colab.\nClique em “Copiar para Colab”.":"";
 const key="pycode-academia-draft-"+active;
 if(step===0){
  let draft=null;try{draft=localStorage.getItem(key)}catch(_){}
  code.value=draft||s.code;
 }else code.value=s.code;
 tutor.setLesson(active,step);
 renderNav();renderCards();updateProgress();
}
function select(id){
 if(!catalog.byId[id])return;
 active=id;step=0;completed.add(id);persist();lesson();
 bot("Vamos estudar "+catalog.byId[id].name+"! Leia o exemplo e execute. Se não compreender, escreva 'dica'.");
 if(innerWidth<1120)$("assistant").classList.remove("open");
}
function next(){
 const mod=catalog.byId[active];
 if(step<mod.steps.length-1){step++;lesson();bot("Agora teste a etapa "+(step+1)+". "+mod.steps[step].explain)}
 else{
  bot("Módulo concluído! Desafio: "+mod.challenge+" Escolha outra aula ou use o editor para praticar.");
  const i=modules.findIndex(m=>m.id===active);if(i<modules.length-1)select(modules[i+1].id);
 }
}
function copy(text){
 if(navigator.clipboard&&isSecureContext)return navigator.clipboard.writeText(text);
 const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.left="-9999px";
 document.body.append(ta);ta.select();const ok=document.execCommand("copy");ta.remove();
 return ok?Promise.resolve():Promise.reject(new Error("Cópia não permitida"));
}
function boot(){
 if(worker){worker.terminate();worker=null}
 clearTimeout(bootWatch);clearTimeout(runWatch);ready=false;busy=false;
 $("run").disabled=true;
 terminal.textContent="Preparando Python local... (a primeira execução pode demorar)";
 try{worker=new Worker("./pycode-worker.js?v=37",{type:"module"})}
 catch(e){log("Worker não disponível: "+e.message);return}
 const current=worker;
 bootWatch=setTimeout(()=>{if(!ready&&current===worker){
  log("Tempo limite ao preparar Pyodide. Confira a rede no primeiro acesso, ou recarregue.");
  current.terminate();worker=null;
 }},45000);
 current.onerror=e=>{clearTimeout(bootWatch);clearTimeout(runWatch);ready=false;busy=false;
  log("Erro de inicialização: "+(e.message||"Worker interrompido"));$("run").disabled=true;
 };
 current.onmessage=e=>{
  if(current!==worker)return;
  const m=e.data||{};
  if(m.type==="ready"){clearTimeout(bootWatch);ready=true;setBusy(false);
   if(!catalog.byId[active].steps[step].colabOnly)terminal.textContent="Python pronto. Clique em Executar Python.";
   return}
  if(m.type==="status"){if(!ready)terminal.textContent=m.value;return}
  if(m.type==="stdout"||m.type==="stderr"){log(m.value||"");return}
  if(m.type==="done"){clearTimeout(runWatch);setBusy(false);log("✓ Programa finalizado.");return}
  if(m.type==="fatal"||m.type==="error"){
    clearTimeout(runWatch);clearTimeout(bootWatch);
    setBusy(false);
    if(m.type==="fatal"){ready=false;$("run").disabled=true}
    const desc=String(m.value||"Erro desconhecido");
    log("Erro: "+desc);bot(tutor.error(desc));return;
  }
 };
 current.postMessage({type:"boot"});
}
function run(){
 const stage=catalog.byId[active].steps[step];
 if(stage.colabOnly){bot("Esta etapa roda no Colab, não no navegador. Use Copiar para Colab.");return}
 if(!ready||busy){bot("Aguarde o Python iniciar ou terminar a execução anterior.");return}
 setBusy(true);terminal.textContent="$ python programa.py";
 worker.postMessage({type:"run",code:code.value});
 runWatch=setTimeout(()=>{
  if(busy){
   log("Execução excedeu 12 segundos. Reiniciando Python...");
   boot();
  }
 },12000);
}
$("run").onclick=run;
$("next").onclick=next;
$("hint").onclick=()=>bot(tutor.hint());
$("reset").onclick=()=>{step=0;try{localStorage.removeItem("pycode-academia-draft-"+active)}catch(_){}lesson()};
$("copyCode").onclick=()=>copy(code.value).then(()=>bot("Código copiado. Cole em uma célula de código no Colab.")).catch(()=>bot("Não foi possível copiar automaticamente. Selecione o código no editor."));
$("download").onclick=()=>{
 const blob=new Blob([code.value+"\n"],{type:"text/x-python;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=active+".py";document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$("colab").onclick=()=>copy(code.value).then(()=>{
 bot("Código copiado! Abra https://colab.research.google.com/ em outra aba, crie um notebook, cole em uma célula e execute com ▶. A primeira etapa da LLM instala bibliotecas e só funciona no Colab.");
 window.open("https://colab.research.google.com/","_blank","noopener,noreferrer");
}).catch(()=>bot("Selecione e copie o código no editor, depois abra colab.research.google.com."));
$("chatForm").addEventListener("submit",e=>{e.preventDefault();const input=$("chatInput");
 const text=input.value.trim();if(text){ask(text);input.value=""}});
$("openBot").onclick=()=>$("assistant").classList.add("open");
$("closeBot").onclick=()=>$("assistant").classList.remove("open");
code.addEventListener("input",saveCode);
code.addEventListener("keydown",e=>{
 if(e.key==="Tab"){e.preventDefault();const a=code.selectionStart,b=code.selectionEnd;
  code.setRangeText("    ",a,b,"end");saveCode()}
 if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();run()}
});
quick();greeting();
completed.add(active);persist();
lesson();boot();
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).catch(()=>{});
})();
