/* Py-Code — diagnóstico do runtime e integração */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const button=$("diagnose");
  const output=$("diagnoseOutput");

  if(!button||!output)return;

  const checks=[
    ["editor","Editor"],
    ["run","Botão EXECUTAR"],
    ["terminal","Terminal"],
    ["assistant","Professor Bot"],
    ["botInput","Entrada do Professor Bot"],
    ["botSend","Botão ENVIAR"],
    ["botHintBtn","Botão PEDIR DICA"],
    ["botChallenge","Botão DESAFIO"]
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

    if(typeof window.__pyCodeGetCode==="function")line("OK • API do editor conectada","ok");
    else line("ERRO • API do editor ausente","err");

    if(typeof window.PyCodeBot==="object"){
      line("OK • Professor Bot inicializado","ok");
    }else{
      line("ERRO • Professor Bot não inicializou","err");
    }

    const worker=new Worker("./pycode-worker.js",{type:"module"});
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