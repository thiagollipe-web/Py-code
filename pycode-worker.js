/* Py-Code Worker: Python no navegador.
 * Runtime 100% local. Não usa CDN/fallback externo.
 */
const PYODIDE_VERSAO="314.0.7";
const LOCAL_BASE=new URL("./pyodide/",import.meta.url).href;
let pyodide=null;
let engineReady=false;
let running=false;
let executando=false;
let gameMode=false;
let keys=new Set();

function send(type,data={}){ self.postMessage({type,...data}); }

// Erros do Pyodide trazem a pilha JS/WASM junto do traceback Python. No terminal
// interessa apenas o traceback, então a parte JS é descartada.
function limparPilha(texto){
  const linhas=String(texto).split(/\r?\n/);
  const fim=linhas.findIndex(l=>/^\s+at\s/.test(l));
  const semJs=(fim>=0?linhas.slice(0,fim):linhas);

  // O traceback também traz quadros do próprio Pyodide, que só confundem quem
  // está aprendendo: ficam apenas os quadros do programa do usuário.
  const uteis=[];
  let pulando=false;
  for(const linha of semJs){
    const quadro=linha.match(/^\s*File "([^"]*)"/);
    if(quadro){
      pulando=/^\/lib\/python|_pyodide|\/pyodide\//.test(quadro[1]);
      if(pulando)continue;
      uteis.push(linha.replace(/"<exec>"/,'"programa.py"'));
      continue;
    }
    if(pulando){
      if(/^\S/.test(linha))pulando=false;
      else continue;
    }
    uteis.push(linha);
  }
  while(uteis.length&&uteis[uteis.length-1].trim()==="")uteis.pop();
  return uteis.join("\n");
}

function errorText(error){
  if(!error)return "Erro desconhecido";
  const bruto=String(error.stack||error.message||error);
  const limpo=limparPilha(bruto)||String(error.message||bruto);
  // "PythonError" é nome interno do Pyodide; o traceback já diz o que houve.
  return limpo.replace(/^PythonError:\s*/,"");
}

// Remove comentários e literais de texto para que a checagem de DOM não
// dispare por causa de uma palavra dentro de uma string.
function codigoSemTextos(fonte){
  return String(fonte)
    .replace(/('''|""")[\s\S]*?\1/g," ")
    .replace(/(['"])(?:\\.|(?!\1)[^\\\n])*\1/g," ")
    .replace(/#[^\n]*/g," ");
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

  if(executando){
    send("warn",{value:"Já existe um programa em execução neste runtime."});
    return;
  }

  executando=true;
  gameMode=Boolean(jogo);
  running=false;

  try{
    const fonte=String(codigo||"");

    if(!fonte.trim()){
      send("warn",{value:"O editor está vazio. Escreva um programa Python antes de executar."});
      send("done");
      return;
    }

    // document/window pertencem ao DOM da página principal. Este runtime roda
    // em Web Worker, portanto o usuário deve usar a API Python/Canvas.
    const fonteLimpa=codigoSemTextos(fonte);
    const usaDom=/\b(document|window)\s*\./.test(fonteLimpa)
      || /\bfrom\s+js\s+import\b[^\n]*\b(document|window)\b/.test(fonteLimpa);

    if(usaDom){
      throw new Error(
        "document/window não estão disponíveis no Worker Python. "+
        "O Py-Code executa Python em um Web Worker, sem acesso ao DOM da página. "+
        "Para interface/jogos use a API do Py-Code: limpar(), retangulo(), "+
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
  }finally{
    executando=false;
  }
}

async function frame(){
  if(!engineReady||!running||!gameMode){
    send("frame_done");
    return;
  }

  try{
    await pyodide.runPythonAsync("__pycode_frame__()");
  }catch(error){
    running=false;
    gameMode=false;
    send("error",{value:errorText(error)});
  }finally{
    send("frame_done");
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
      case "stop": running=false; gameMode=false; send("stopped"); break;
      case "ping": send("pong",{ready:engineReady,running:executando}); break;
      default: send("warn",{value:"Mensagem desconhecida: "+String(m.type)});
    }
  }catch(error){
    running=false;
    gameMode=false;
    send("fatal",{etapa:"message-handler",value:errorText(error)});
  }
};
