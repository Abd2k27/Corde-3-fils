// Démarrage (à charger en dernier)
// =====================================================================

// ---------- démarrage ----------
// Service worker (sw.js) : site gardé en cache → ouverture instantanée et usage hors ligne
function registerSW() {
  if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
  navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).catch((e) => console.warn("Service worker non enregistré :", e.message));
  // le service worker signale qu'une nouvelle version a été téléchargée
  navigator.serviceWorker.addEventListener("message", (e) => {
    if (!e.data || e.data.type !== "update" || document.getElementById("updateBar")) return;
    const bar = Object.assign(document.createElement("button"), { id: "updateBar", className: "update-bar", textContent: "✨ Nouvelle version disponible · Recharger" });
    bar.onclick = () => location.reload();
    document.body.appendChild(bar);
  });
}
registerSW();

function boot() {
  Store = window.Store;
  guardStore(Store); netBanner();
  Store.subscribe(onStoreChange);
  Store.init().then(render);
}
if (FB) {
  if (!CFG.firebaseConfig) $app.innerHTML = `<div class="screen center"><h2>Config Firebase manquante</h2><p class="muted">Colle firebaseConfig dans js/config.js.</p></div>`;
  else if (window.Store && window.Store.mode === "firebase") boot();
  else window.addEventListener("store-ready", boot, { once: true });
} else boot();
