const CACHE="py-code-v13";
const APP_SHELL=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pycode-worker.js",
  "./pycode_worker.py",
  "./jogo.html",
  "./assets/py-code-banner.svg"
];
const PYODIDE_BASE="https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
const PYODIDE_FILES=[
  "pyodide.js",
  "pyodide.mjs",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
  "package.json"
];

async function cacheRuntime(){
  const cache=await caches.open(CACHE);
  for(const file of PYODIDE_FILES){
    const local=new Request("./pyodide/"+file);
    const remote=PYODIDE_BASE+file;
    try{
      const res=await fetch(remote,{mode:"cors",cache:"no-store"});
      if(!res.ok)throw new Error("HTTP "+res.status);
      await cache.put(local,res.clone());
    }catch(e){
      console.warn("Pyodide:",file,e);
    }
  }
}

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(APP_SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("message",event=>{
  if(event.data?.type==="precache_runtime"){
    event.waitUntil(cacheRuntime());
  }
});

self.addEventListener("fetch",event=>{
  const req=event.request;
  const url=new URL(req.url);

  if(url.origin===location.origin && url.pathname.includes("/pyodide/")){
    const file=url.pathname.split("/pyodide/").pop();
    event.respondWith(
      caches.match(req).then(cached=>{
        if(cached)return cached;

        return fetch(PYODIDE_BASE+file,{mode:"cors"}).then(res=>{
          if(!res.ok)throw new Error("Pyodide HTTP "+res.status);
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(req,copy));
          return res;
        });
      })
    );
    return;
  }

  if(url.origin!==location.origin)return;

  if(req.mode==="navigate"){
    event.respondWith(
      fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put("./index.html",copy));
        return res;
      }).catch(()=>caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached=>cached||fetch(req))
  );
});
