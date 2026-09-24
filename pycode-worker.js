/* Py-Code Worker: Python no navegador.
 * Runtime 100% local. Não usa CDN/fallback externo.
 */
const PYODIDE_VERSAO="314.0.7";
const LOCAL_BASE=new URL("./pyodide/",import.meta.url).href;
let pyodide=null;
let engineReady=false;
let running=false;
let gameMode=false;
let keys=new Set();

function send(type,data={}){ self.postMessage({type,...data}); }
function errorText(error){ return String(error?.stack||error?.message||error||"Erro desconhecido"); }

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
  send("status",{value:"Python • carregando runtime local..."});

  try{
    const mod=await import(LOCAL_BASE+"pyodide.mjs");
    if(typeof mod.loadPyodide!=="function"){
      throw new Error("loadPyodide não foi encontrado em ./pyodide/pyodide.mjs.");
    }
    pyodide=await mod.loadPyodide({indexURL:LOCAL_BASE});
    send("status",{value:"Python local carregado."});
    return "local";
  }catch(error){
    throw new Error(
      "Pyodide local não pôde ser carregado. "+
      "O Py-Code está em modo OFFLINE e não usa CDN. "+
      errorText(error)
    );
  }
}

async function carregarEngine(){
  const url=new URL("./pycode_worker.py",import.meta.url);
  const response=await fetch(url.href,{cache:"no-store",credentials:"same-origin"});

  if(!response.ok){
    throw new Error("Engine Py-Code não encontrada: HTTP "+response.status);
  }

  const source=await response.text();
  if(!source.includes("def reiniciar_programa")){
    throw new Error("Engine Py-Code inválida ou incompleta.");
  }

  pyodide.runPython(source);
}

async function boot(){
  try{
    send("status",{value:"Iniciando runtime Python local..."});
    const origem=await carregarPyodide();

    send("status",{value:"Carregando engine Py-Code..."});
    await carregarEngine();

    pyodide.setStdout({batched:(msg)=>send("stdout",{value:String(msg??"")})});
    pyodide.setStderr({batched:(msg)=>send("stderr",{value:String(msg??"")})});

    engineReady=true;
    send("ready",{origem,pyodide:PYODIDE_VERSAO,online:false});
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
    const fonte=String(codigo||"");

    // document pertence ao DOM da página principal. Este runtime roda em
    // Web Worker, portanto o usuário deve usar a API Python/Canvas do Py-Code.
    if(/\bdocument\b/.test(fonte)){
      throw new Error(
        "document não está disponível no Worker Python. "+
        "O Py-Code executa Python em um Web Worker. "+
        "Para interface/jogos use a API do Py-Code: canvas, retangulo(), "+
        "circulo(), linha(), texto(), Sprite, pressionado() e tocar()."
      );
    }

    pyodide.runPython("reiniciar_programa()");
    await pyodide.runPythonAsync(fonte);

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
      case "boot": await boot(); break;
      case "run": await executar(String(m.code||""),Boolean(m.game)); break;
      case "frame": await frame(); break;
      case "keys": keys=new Set(Array.isArray(m.keys)?m.keys:[]); break;
      case "stop": running=false; gameMode=false; break;
      default: send("warn",{value:"Mensagem desconhecida: "+String(m.type)});
    }
  }catch(error){
    running=false;
    gameMode=false;
    send("fatal",{etapa:"message-handler",value:errorText(error)});
  }
};
