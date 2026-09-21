/* Py-Code Worker: runtime Python isolado do thread principal. */
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

async function boot(){
  try{
    send("status",{value:"Carregando runtime Python…"});
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js");

    pyodide=await loadPyodide({
      indexURL:"https://cdn.jsdelivr.net/pyodide/v0.28.2/full/",
      stdout:msg=>send("stdout",{value:String(msg??"")}),
      stderr:msg=>send("stderr",{value:String(msg??"")})
    });

    const engine=await fetch("./pycode_worker.py");
    if(!engine.ok)throw new Error("Engine Py-Code não encontrada.");
    pyodide.runPython(await engine.text());

    engineReady=true;
    send("ready");
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
