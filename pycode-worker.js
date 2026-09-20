/* Py-Code Worker: runtime Python isolado do thread principal. */
let pyodide=null;
let engineReady=false;
let running=false;
let keys=new Set();

function send(type,data={}){self.postMessage({type,...data})}
function pressed(k){return keys.has(String(k))||keys.has(String(k).toLowerCase())}

self.pycode_pressed=pressed;
self.pycode_sound=(frequency,duration,type,volume)=>{
  send("sound",{frequency:Number(frequency),duration:Number(duration),type:String(type||"square"),volume:Number(volume||0.05)});
};

async function boot(){
  send("status",{value:"Carregando runtime Python…"});
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js");
  pyodide=await loadPyodide({
    indexURL:"https://cdn.jsdelivr.net/pyodide/v0.28.2/full/",
    stdout:{raw:true,batched:lines=>send("stdout",{value:String(lines||"")})},
    stderr:{raw:true,batched:lines=>send("stderr",{value:String(lines||"")})}
  });
  const engine=await fetch("./pycode_worker.py").then(r=>{if(!r.ok)throw Error("Engine Py-Code não encontrada.");return r.text()});
  pyodide.runPython(engine);
  engineReady=true;
  send("ready");
}
async function executar(codigo){
  if(!engineReady)return;
  running=true;
  try{
    pyodide.runPython("reiniciar_programa()");
    await pyodide.runPythonAsync(codigo);
    send("done");
  }catch(e){send("error",{value:String(e)});}
  finally{running=false}
}
async function frame(){
  if(!engineReady||!running)return;
  try{await pyodide.runPythonAsync("__pycode_frame__()")}
  catch(e){running=false;send("error",{value:String(e)})}
}
self.onmessage=async e=>{
  const m=e.data||{};
  try{
    if(m.type==="boot"){await boot();return}
    if(m.type==="run"){await executar(String(m.code||""));return}
    if(m.type==="frame"){await frame();return}
    if(m.type==="keys"){keys=new Set(Array.isArray(m.keys)?m.keys:[]);return}
  }catch(e){send("fatal",{value:String(e)})}
};
