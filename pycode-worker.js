/* Py-Code Worker: runtime Python isolado do thread principal.
 * Pyodide 314 exige Worker do tipo module em navegadores modernos.
 */
import { loadPyodide } from "./pyodide/pyodide.mjs";

const PYODIDE_VERSAO="314.0.7";
const PYODIDE_LOCAL=new URL("./pyodide/", import.meta.url).href;

let pyodide=null;
let engineReady=false;
let running=false;
let gameMode=false;
let keys=new Set();

function send(type,data={}){
  self.postMessage({type,...data});
}

function errorText(error){
  return String(
    error?.stack ||
    error?.message ||
    error ||
    "Erro desconhecido no Worker"
  );
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

async function carregarPyodide(){
  send("status",{
    value:"Carregando Python "+PYODIDE_VERSAO+" local…"
  });

  pyodide=await loadPyodide({
    indexURL:PYODIDE_LOCAL
  });

  pyodide.setStdout({
    batched:(msg)=>send("stdout",{value:String(msg??"")})
  });

  pyodide.setStderr({
    batched:(msg)=>send("stderr",{value:String(msg??"")})
  });

  return "local";
}

async function boot(){
  try{
    send("status",{value:"Iniciando runtime Python…"});
    const origem=await carregarPyodide();

    const engine=await fetch("./pycode_worker.py",{
      cache:"no-store",
      credentials:"same-origin"
    });

    if(!engine.ok){
      throw new Error(
        "Engine Py-Code não encontrada: HTTP "+engine.status
      );
    }

    const engineSource=await engine.text();

    if(!engineSource.includes("def reiniciar_programa")) {
      throw new Error("Engine Py-Code inválida ou incompleta.");
    }

    pyodide.runPython(engineSource);

    engineReady=true;
    send("ready",{
      origem,
      pyodide:PYODIDE_VERSAO
    });
  }catch(error){
    engineReady=false;
    send("fatal",{value:errorText(error)});
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
    send("fatal",{value:errorText(error)});
  }
};
