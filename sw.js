const CACHE='py-code-v42';
const APP_SHELL=['./','./index.html','./academia.css?v=42','./academia.js?v=42','./ascii-games.js?v=42','./curriculo.js?v=42','./tutor.js?v=42','./manifest.webmanifest','./assets/py-mentor.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('py-code-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).catch(()=>caches.match(new URL('./index.html',self.registration.scope).href)));return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
