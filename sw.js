const CACHE="py-code-v29";
const APP_SHELL=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pycode-worker.js",
  "./pycode_worker.py",
  "./jogo.html",
  "./diagnostico.html",
  "./professor-bot.js",
  "./aws-code-library.js",
  "./code-audit.js",
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
    caches.open(CACHE)
      .then(cache=>cache.addAll(APP_SHELL))
      .then(()=>self.skipWaiting())
      .catch(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  const url=new URL(request.url);

  if(url.origin!==location.origin)return;

  event.respondWith(
    caches.match(request).then(cached=>{
      if(cached)return cached;

      return fetch(request).then(response=>{
        if(request.method==="GET"&&response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy));
        }
        return response;
      });
    })
  );
});
