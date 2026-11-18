// 📦 Service worker : garde le site en mémoire pour qu'il s'ouvre instantanément, même sans réseau.
// Stratégie « stale-while-revalidate » : on sert la copie en cache tout de suite, on la met à jour en
// arrière-plan, et si un fichier a changé on prévient la page (bandeau « Nouvelle version »).
// Les données (Firestore) ne passent pas par ici : Firebase a son propre cache hors ligne.
const CACHE = "corde-site-v1";

// À l'installation : index.html + tous les fichiers qu'il charge (lus dans la page, pas de liste à tenir à jour)
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const html = await (await fetch("index.html", { cache: "no-cache" })).text();
    const urls = ["./", "index.html", "manifest.json", "icons/icon-192.png", "icons/icon-512.png",
      ...[...html.matchAll(/(?:src|href)="([^"#:]+\.(?:js|css|json|png))"/g)].map((m) => m[1])];
    await Promise.allSettled([...new Set(urls)].map((u) => cache.add(new Request(u, { cache: "no-cache" }))));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

// Fichiers mis en cache : ceux du site, le SDK Firebase et les polices Google
const cachable = (url) => url.origin === self.location.origin || url.hostname === "www.gstatic.com" || /^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
const version = (r) => r.headers.get("etag") || r.headers.get("last-modified");

let notifyTimer = null;
function notifyUpdate() {
  clearTimeout(notifyTimer);
  notifyTimer = setTimeout(async () => {
    for (const c of await self.clients.matchAll({ type: "window" })) c.postMessage({ type: "update" });
  }, 800);
}

self.addEventListener("fetch", (event) => {
  const req = event.request, url = new URL(req.url);
  if (req.method !== "GET" || !cachable(url)) return;
  // une navigation (ouvrir le site, recharger) est servie par index.html, quel que soit le #/chemin
  const key = req.mode === "navigate" ? "index.html" : req;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(key, { ignoreSearch: true });
    const network = fetch(req, { cache: "no-cache" }).then(async (res) => {
      if (res && (res.ok || res.type === "opaque")) {
        const changed = cached && res.ok && version(cached) && version(res) && version(cached) !== version(res);
        await cache.put(key, res.clone());
        if (changed && url.origin === self.location.origin) notifyUpdate();
      }
      return res;
    }).catch(() => null);
    if (cached) { event.waitUntil(network); return cached; }
    return (await network) || new Response("Hors ligne", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  })());
});
