// Erreurs d'enregistrement : jamais d'échec silencieux
// ---------- erreurs d'enregistrement ----------
// Toutes les écritures passent par Store : on les enveloppe pour ne jamais échouer en silence.
const errMsg = (e) => {
  const c = (e && e.code) || "";
  if (c.includes("permission-denied")) return "Accès refusé : ce compte ne peut pas enregistrer.";
  if (c.includes("unavailable") || !navigator.onLine) return "Pas de connexion : rien n'a été enregistré.";
  if (c.includes("resource-exhausted") || /quota|plein|too large|exceeds/i.test(e && e.message)) return "Trop volumineux : enregistrement impossible.";
  return "Erreur d'enregistrement : " + ((e && e.message) || "inconnue");
};
function guardStore(S) {
  ["set", "remove", "setBlob", "removeBlob"].forEach((m) => {
    const f = S[m] && S[m].bind(S);
    if (!f || f._guarded) return;
    const g = async (...args) => {
      try { return await f(...args); }
      catch (e) { console.error(`Store.${m}`, args[0], e); toast("⚠️ " + errMsg(e), 4500); if (e && typeof e === "object") e.shown = true; throw e; }
    };
    g._guarded = true; S[m] = g;
  });
}
window.addEventListener("unhandledrejection", (ev) => {
  const e = ev.reason; if (e && e.shown) { ev.preventDefault(); return; }
  console.error(e); toast("⚠️ " + errMsg(e), 4500);
});
const netBanner = () => document.body.classList.toggle("offline", !navigator.onLine);
window.addEventListener("online", () => { netBanner(); toast("De nouveau en ligne ✓"); });
window.addEventListener("offline", netBanner);
window.addEventListener("store-pending", () => toast("📴 Enregistré sur cet appareil : ce sera envoyé dès le retour du réseau.", 5000));
window.addEventListener("store-synced", () => toast("Enregistré ✓"));
window.addEventListener("store-error", (ev) => toast("⚠️ " + errMsg(ev.detail), 5000));
function confetti() {
  const colors = ["#b5562f", "#3f6b4f", "#d8a24a", "#e8b4a0", "#7fa88d"];
  for (let i = 0; i < 60; i++) {
    const s = document.createElement("span");
    s.className = "confetti";
    s.style.left = Math.random() * 100 + "vw";
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = Math.random() * 0.4 + "s";
    s.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2600);
  }
}
