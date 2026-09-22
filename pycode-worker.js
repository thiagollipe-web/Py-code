/* Py-Code Worker: Python no navegador.
 * Tenta runtime local primeiro e cai automaticamente para JsDelivr.
 */
const PYODIDE_VERSAO="314.0.7";
const LOCAL_BASE=new URL("./pyodide/",import.meta.url).href;
const CDN_BASE="https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";

let pyodide=null;
let engineReady=false;
let running=false;
let gameMode=false;
let keys=new Set();

function send(type,data={}){
  self.postMessage({type,...data});
}

function errorText(error){
  return String(error?.stack||error?.message||error||"Erro desconhecido");
}

function pressed(k){
  const chave=String(k);
  return keys.has(chave)||keys.has(chave.toLowerCase());
}

self.pycode_pressed=pressed;
self.pycode_sound=(frequency,duration,type,volume)=>{
  send("sound",{
    frequency:Number(frequency)||440,
    duration:Number(duration)||0.12,
    waveform:String(type||"square"),
    volume:Number(volume)||0.05
  });
};

async function importarLoader(base){
  const url=base+"pyodide.mjs";
  send("status",{
    value:(base===LOCAL_BASE?"Python local":"Python online • JsDelivr")+" • carregando..."
  });

  const mod=await import(url);
  if(typeof mod.loadPyodide!=="function"){
    throw new Error("loadPyodide não foi encontrado em "+url);
  }

  return mod.loadPyodide;
}

async function carregarPyodide(){
  let ultimoErro=null;

  try{
    const loadLocal=await importarLoader(LOCAL_BASE);
    send("status",{value:"Inicializando Python local..."});
    pyodide=await loadLocal({indexURL:LOCAL_BASE});
    send("status",{value:"Python local carregado."});
    return "local";
  }catch(error){
    ultimoErro=error;
    send("status",{
      value:"Runtime local falhou. Tentando Pyodide online..."
    });
  }

  try{
    const loadOnline=await importarLoader(CDN_BASE);
    send("status",{value:"Inicializando Pyodide online..."});
    pyodide=await loadOnline({indexURL:CDN_BASE});
    send("status",{value:"Pyodide online carregado."});
    return "online";
  }catch(error){
    throw new Error(
      "Falha no runtime local e no online.\n"+
      "LOCAL: "+errorText(ultimoErro)+"\n"+
      "ONLINE: "+errorText(error)
    );
  }
}

async function carregarEngine(){
  const url=new URL("./pycode_worker.py",import.meta.url);
  const response=await fetch(url.href,{
    cache:"no-store",
    credentials:"same-origin"
  });

  if(!response.ok){
    throw new Error(
      "Engine Py-Code não encontrada: HTTP "+response.status
    );
  }

  const source=await response.text();

  if(!source.includes("def reiniciar_programa")){
    throw new Error("Engine Py-Code inválida ou incompleta.");
  }

  pyodide.runPython(source);
}

async function boot(){
  try{
    send("status",{value:"Iniciando runtime Python..."});

    const origem=await carregarPyodide();

    send("status",{value:"Carregando engine Py-Code..."});
    await carregarEngine();

    pyodide.setStdout({
      batched:(msg)=>send("stdout",{value:String(msg??"")})
    });

    pyodide.setStderr({
      batched:(msg)=>send("stderr",{value:String(msg??"")})
    });

    engineReady=true;

    send("ready",{
      origem,
      pyodide:PYODIDE_VERSAO,
      online:origem==="online"
    });
  }catch(error){
    engineReady=false;
    send("fatal",{
      etapa:"boot",
      value:errorText(error),
      diagnostic:"boot -> "+errorText(error)
    });
  }
}

async function executar(codigo,jogo=false){
  if(!engineReady){
    send("error",{value:"Runtime Python ainda não está pronto."});
    return;
  }

  gameMode=Boolean(jogo);
  running=false;

  try{
    pyodide.runPython("reiniciar_programa()");
    await pyodide.runPythonAsync(String(codigo||""));

    if(gameMode){
      running=true;
      send("game_ready");
    }else{
      send("done");
    }
  }catch(error){
    running=false;
    gameMode=false;
    send("error",{value:errorText(error)});
  }
}

async function frame(){
  if(!engineReady||!running||!gameMode)return;

  try{
    await pyodide.runPythonAsync("__pycode_frame__()");
    send("frame_done");
  }catch(error){
    running=false;
    gameMode=false;
    send("error",{value:errorText(error)});
  }
}

self.onmessage=async(event)=>{
  const m=event.data||{};

  try{
    switch(m.type){
      case "boot":
        await boot();
        break;
      case "run":
        await executar(String(m.code||""),Boolean(m.game));
        break;
      case "frame":
        await frame();
        break;
      case "keys":
        keys=new Set(Array.isArray(m.keys)?m.keys:[]);
        break;
      case "stop":
        running=false;
        gameMode=false;
        break;
      default:
        send("warn",{value:"Mensagem desconhecida: "+String(m.type)});
    }
  }catch(error){
    running=false;
    gameMode=false;
    send("fatal",{etapa:"message-handler",value:errorText(error)});
  }
};
