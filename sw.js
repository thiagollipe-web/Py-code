const VERSAO="v37";
const CACHE="py-code-"+VERSAO;

// Shell mínimo: sem estes arquivos a aplicação não abre offline.
const APP_SHELL=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pycode-worker.js?v=37",
  "./pycode_worker.py",
  "./jogo.html",
  "./diagnostico.html",
  "./runtime-diagnostics.js?v=37",
  "./professor-bot.js?v=37",
  "./aws-code-library.js?v=37",
  "./code-audit.js?v=37",
  "./assets/py-code-banner.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

// Runtime Python. É grande e pode não existir em um checkout local, por isso é
// tratado separadamente: uma falha aqui não pode impedir a instalação.
const RUNTIME=[
  "./pyodide/pyodide.js",
  "./pyodide/pyodide.mjs",
  "./pyodide/pyodide.asm.mjs",
  "./pyodide/pyodide-lock.json",
  "./pyodide/package.json",
  "./pyodide/pyodide.asm.wasm",
  "./pyodide/python_stdlib.zip"
];

function ehDocumento(request){
  return request.mode==="navigate"
    || (request.destination==="document")
    || (request.headers.get("accept")||"").includes("text/html");
}

async function guardar(cache,url){
  try{
    const response=await fetch(new Request(url,{cache:"reload"}));
    if(response&&response.ok)await cache.put(url,response);
  }catch(_){
    // Um arquivo ausente não pode quebrar a instalação inteira do cache.
  }
}

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.all(APP_SHELL.concat(RUNTIME).map(url=>guardar(cache,url)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message",event=>{
  if(event.data&&event.data.type==="skip-waiting")self.skipWaiting();
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;

  const url=new URL(request.url);
  if(url.origin!==location.origin)return;
  if(url.pathname.endsWith("/sw.js"))return;

  // Páginas e código da aplicação vêm primeiro da rede, para que um novo deploy
  // chegue ao usuário; o cache é a reserva offline.
  const preferirRede=ehDocumento(request)||/\.(?:html|js|py|webmanifest|json)$/.test(url.pathname);
  const ehRuntime=url.pathname.includes("/pyodide/");

  if(preferirRede&&!ehRuntime){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        if(response&&response.ok){
          const copia=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copia)).catch(()=>{});
        }
        return response;
      }catch(error){
        const cached=await caches.match(request,{ignoreSearch:true});
        if(cached)return cached;
        throw error;
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cached=await caches.match(request,{ignoreSearch:true});
    if(cached)return cached;

    const response=await fetch(request);
    if(response&&response.ok){
      const copia=response.clone();
      caches.open(CACHE).then(cache=>cache.put(request,copia)).catch(()=>{});
    }
    return response;
  })());
});
