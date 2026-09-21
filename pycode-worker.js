/* Py-Code Worker: runtime Python isolado do thread principal. */
const PYODIDE_VERSAO="314.0.7";
const PYODIDE_LOCAL="./pyodide/";
let pyodide=null;
let engineReady=false;
let running=false;
let gameMode=false;
let keys=new Set();

function send(type,data={}){self.postMessage({type,...data})}
function pressed(k){return keys.has(String(k))||keys.has(String(k).toLowerCase())}

self.pycode_pressed=pressed;
self.pycode_sound=(frequency,duration,type,volume)=>{
  send("sound",{
    frequency:Number(frequency),
    duration:Number(duration),
    waveform:String(type||"square"),
    volume:Number(volume||0.05)
  });
};

async function carregarPyodide(){
  send("status",{value:"Carregando Python local…"});
  importScripts(PYODIDE_LOCAL+"pyodide.js");

  if(typeof loadPyodide!=="function"){
    throw new Error("Runtime Python local não disponível.");
  }

  pyodide=await loadPyodide({indexURL:PYODIDE_LOCAL});

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
    send("status",{value:"Carregando runtime Python…"});
    const origem=await carregarPyodide();

    const engine=await fetch("./pycode_worker.py",{cache:"no-store"});
    if(!engine.ok)throw new Error("Engine Py-Code não encontrada.");
    pyodide.runPython(await engine.text());

    engineReady=true;
    send("ready",{origem});
  }catch(e){
    engineReady=false;
    send("fatal",{value:String(e&&e.stack||e)});
  }
}

async function executar(codigo,jogo=false){
  if(!engineReady)return;

  gameMode=Boolean(jogo);
  running=false;

  try{
    pyodide.runPython("reiniciar_programa()");
    await pyodide.runPythonAsync(codigo);

    if(gameMode){
      running=true;
      send("game_ready");
    }else{
      send("done");
    }
  }catch(e){
    running=false;
    gameMode=false;
    send("error",{value:String(e&&e.stack||e)});
  }
}

async function frame(){
  if(!engineReady||!running||!gameMode)return;

  try{
    await pyodide.runPythonAsync("__pycode_frame__()");
    send("frame_done");
  }catch(e){
    running=false;
    gameMode=false;
    send("error",{value:String(e&&e.stack||e)});
  }
}

self.onmessage=async e=>{
  const m=e.data||{};

  try{
    if(m.type==="boot"){
      await boot();
      return;
    }

    if(m.type==="run"){
      await executar(String(m.code||""),Boolean(m.game));
      return;
    }

    if(m.type==="frame"){
      await frame();
      return;
    }

    if(m.type==="keys"){
      keys=new Set(Array.isArray(m.keys)?m.keys:[]);
      return;
    }

    if(m.type==="stop"){
      running=false;
      gameMode=false;
      return;
    }
  }catch(e){
    running=false;
    gameMode=false;
    send("fatal",{value:String(e&&e.stack||e)});
  }
};
