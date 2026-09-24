const CACHE="py-code-v37";
const APP_SHELL=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pycode-worker.js?v=37",
  "./pycode_worker.py",
  "./jogo.html",
  "./diagnostico.html",
  "./runtime-diagnostics.js",
  "./professor-bot.js?v=37",
  "./aws-code-library.js?v=37",
  "./code-audit.js?v=37",
  "./sw.js",
  "./assets/py-code-banner.svg",
  "./pyodide/pyodide.js",
  "./pyodide/pyodide.mjs",
  "./pyodide/pyodide.asm.mjs",
  "./pyodide/pyodide-lock.json",
  "./pyodide/package.json",
  "./pyodide/pyodide.asm.wasm",
  "./pyodide/python_stdlib.zip"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(url.origin!==location.origin||request.method!=="GET")return;

  if(request.mode==="navigate"){
    event.respondWith(
      fetch(request).then(response=>{
        if(response.ok){
          event.waitUntil(
            caches.open(CACHE).then(cache=>cache.put(request,response.clone()))
          );
        }
        return response;
      }).catch(()=>{
        const fallback=new URL("./index.html",self.registration.scope).href;
        return caches.match(request).then(cached=>cached||caches.match(fallback));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached=>{
      if(cached)return cached;
      return fetch(request).then(response=>{
        if(response.ok){
          event.waitUntil(
            caches.open(CACHE).then(cache=>cache.put(request,response.clone()))
          );
        }
        return response;
      });
    })
  );
});
