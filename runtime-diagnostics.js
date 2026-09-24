/* Py-Code — diagnóstico do runtime e integração */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const button=$("diagnose");
  const output=$("diagnoseOutput");

  if(!button||!output)return;

  const checks=[
    ["log","Painel de diagnóstico"],
    ["again","Botão TESTAR NOVAMENTE"],
    ["diagnose","Botão TESTAR INTEGRAÇÃO"],
    ["diagnoseOutput","Saída do diagnóstico"]
  ];

  function line(text,kind="info"){
    const row=document.createElement("div");
    row.className="diag "+kind;
    row.textContent=text;
    output.appendChild(row);
  }

  async function run(){
    output.textContent="";
    line("Diagnóstico iniciado...");
    for(const [id,label] of checks){
      if($(id))line("OK • "+label,"ok");
      else line("ERRO • "+label,"err");
    }

    line("INFO • Esta página testa o runtime; o editor e o Professor Bot pertencem ao index.html.","info");

    const worker=new Worker("./pycode-worker.js?v=37",{type:"module"});
    let finished=false;
    const timer=setTimeout(()=>{
      if(finished)return;
      finished=true;
      worker.terminate();
      line("ERRO • timeout do runtime","err");
    },20000);

    worker.onmessage=e=>{
      const m=e.data||{};
      if(m.type==="status")line("RUNTIME • "+m.value);
      else if(m.type==="ready"){
        line("OK • Worker + Pyodide prontos","ok");
        worker.postMessage({type:"run",code:'print("PY-CODE OK")\nprint(2+3)'});
      }else if(m.type==="stdout"){
        const text=String(m.value||"").trim();
        if(text)line("PYTHON • "+text);
      }else if(m.type==="done"){
        clearTimeout(timer);
        if(!finished){
          finished=true;
          worker.terminate();
          line("OK • EXECUÇÃO PYTHON CONCLUÍDA","ok");
        }
      }else if(m.type==="error"||m.type==="fatal"){
        clearTimeout(timer);
        if(!finished){
          finished=true;
          worker.terminate();
          line((m.type==="fatal"?"ERRO BOOT • ":"ERRO PYTHON • ")+String(m.value||"erro desconhecido"),"err");
        }
      }
    };

    worker.onerror=e=>{
      clearTimeout(timer);
      if(!finished){
        finished=true;
        worker.terminate();
        line("ERRO WORKER • "+[e.message,e.filename,e.lineno&&("linha "+e.lineno)].filter(Boolean).join(" • "),"err");
      }
    };

    worker.postMessage({type:"boot"});
  }

  button.addEventListener("click",run);
})();