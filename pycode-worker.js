/* Py-Code Worker: runtime Python isolado do thread principal. */
const PYODIDE_VERSAO="0.28.3";
const CDN=[
  {
    nome:"jsDelivr",
    script:"https://cdn.jsdelivr.net/pyodide/v"+PYODIDE_VERSAO+"/full/pyodide.js",
    index:"https://cdn.jsdelivr.net/pyodide/v"+PYODIDE_VERSAO+"/full/"
  },
  {
    nome:"UNPKG",
    script:"https://unpkg.com/pyodide@"+PYODIDE_VERSAO+"/pyodide.js",
    index:"https://unpkg.com/pyodide@"+PYODIDE_VERSAO+"/"
  }
];

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
  const erros=[];

  for(const cdn of CDN){
    try{
      send("status",{value:"Conectando ao Python via "+cdn.nome+"…"});
      importScripts(cdn.script);

      if(typeof loadPyodide!=="function"){
        throw new Error("loadPyodide não foi encontrado.");
      }

      pyodide=await loadPyodide({indexURL:cdn.index});

      pyodide.setStdout({
        batched:(msg)=>send("stdout",{value:String(msg??"")})
      });
      pyodide.setStderr({
        batched:(msg)=>send("stderr",{value:String(msg??"")})
      });

      send("status",{value:"Python carregado via "+cdn.nome});
      return cdn.nome;
    }catch(e){
      erros.push(cdn.nome+": "+String(e&&e.message||e));
      try{delete self.loadPyodide}catch(_){}
    }
  }

  throw new Error(
    "Erro de conexão com o runtime Python. Tentativas: "+erros.join(" | ")
  );
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
