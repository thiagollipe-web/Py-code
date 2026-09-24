const CACHE="py-code-v35";
const APP_SHELL=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pycode-worker.js?v=35",
  "./pycode_worker.py",
  "./jogo.html",
  "./diagnostico.html",
  "./runtime-diagnostics.js",
  "./professor-bot.js?v=34",
  "./aws-code-library.js?v=34",
  "./code-audit.js?v=34",
  "./sw.js",
  "./assets/py-code-banner.svg"
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
