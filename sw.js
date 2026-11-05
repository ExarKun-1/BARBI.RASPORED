const C="raspored-v1";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  const isPage=e.request.mode==="navigate"||u.pathname.endsWith("index.html");
  if(isPage){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put("index.html",cp));return r}).catch(()=>caches.match("index.html")));return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))
    e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok||r.type==="opaque"){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})));
});
