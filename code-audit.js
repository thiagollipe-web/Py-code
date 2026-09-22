/* Auditoria local do Py-Code. Não executa o código do usuário. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const btn=$("audit"), panel=$("auditPanel"), result=$("auditResult"), summary=$("auditSummary");
if(!btn||!panel||!result)return;
function getCode(){return window.__pyCodeGetCode?window.__pyCodeGetCode():"";}
function add(arr,sev,title,detail,fix){arr.push({sev,title,detail,fix});}
function analyzePython(source){
 const a=[], lines=String(source||"").split(/\r?\n/);
 const open=(source.match(/[([{]/g)||[]).length, close=(source.match(/[)\]}]/g)||[]).length;
 if(open!==close)add(a,"CRÍTICO","Delimitadores desbalanceados","A quantidade de símbolos de abertura e fechamento não coincide.","Revise (), [] e {}.");
 lines.forEach(function(line,index){
   const t=line.trim(), n=index+1;
   if(/^(if|elif|else|for|while|def)\b.*[^:]$/.test(t))add(a,"ALTO","Possível bloco sem dois-pontos — linha "+n,"A construção parece iniciar um bloco sem terminar com : .","Finalize a declaração com dois-pontos.");
   if(/=\s*$/.test(t))add(a,"ALTO","Atribuição incompleta — linha "+n,"A linha termina em = e provavelmente ainda falta o valor.","Complete a atribuição.");
 });
 if(/\b(import|from)\s+(os|subprocess|socket|ctypes)\b/.test(source))add(a,"MÉDIO","Módulo com acesso ao sistema","O código usa módulos que podem acessar recursos do sistema.","Revise se isso é necessário para o exercício.");
 if(source.length>200000)add(a,"MÉDIO","Código muito grande","Todo o conteúdo será enviado ao Worker de uma vez.","Divida o programa em partes menores.");
 return a;
}
function analyzeApp(){
 const a=[];
 if(location.protocol==="file:")add(a,"ALTO","Execução por file://","Worker module e Service Worker podem falhar ao abrir como arquivo local.","Use a versão publicada em HTTPS.");
 if(typeof Worker==="undefined")add(a,"CRÍTICO","Web Worker indisponível","O runtime Python depende de Web Worker.","Use um navegador moderno.");
 if(!("serviceWorker" in navigator))add(a,"MÉDIO","Service Worker indisponível","O cache offline não poderá ser registrado.","Verifique o suporte do navegador.");
 return a;
}
function render(items){
 const groups={CRÍTICO:0,ALTO:0,MÉDIO:0,BAIXO:0,INFO:0};
 items.forEach(x=>groups[x.sev]++);
 summary.textContent=items.length+" achado(s)";
 result.textContent="";
 const head=document.createElement("div"); head.className="audit-head";
 Object.keys(groups).forEach(function(k){const s=document.createElement("span");s.textContent=k+": "+groups[k];s.className="audit-tag";head.appendChild(s);});
 const close=document.createElement("button"); close.textContent="FECHAR"; close.className="audit-close"; close.onclick=function(){panel.hidden=true}; head.appendChild(close); result.appendChild(head);
 if(!items.length){const ok=document.createElement("div");ok.className="audit-card";ok.textContent="Nenhum problema local conhecido foi detectado.";result.appendChild(ok);return;}
 items.forEach(function(x){
   const card=document.createElement("div");card.className="audit-card";
   const title=document.createElement("div");title.className="audit-title";title.textContent="["+x.sev+"] "+x.title;card.appendChild(title);
   const d=document.createElement("div");d.textContent=x.detail;card.appendChild(d);
   if(x.fix){const f=document.createElement("div");f.className="audit-code";f.textContent="Correção: "+x.fix;card.appendChild(f);}
   result.appendChild(card);
 });
}
btn.addEventListener("click",function(){panel.hidden=false;render(analyzePython(getCode()).concat(analyzeApp()));});
})();