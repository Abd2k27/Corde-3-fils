// Configuration, parcours, état partagé (joueur, Store, ui) et petits utilitaires
const CFG = window.APP_CONFIG, Bible = window.Bible;
// Parcours : chaque semaine a un id FIXE écrit dans son fichier (clé de stockage de la progression).
// On peut donc insérer / réordonner des semaines sans perdre les réponses. Ne jamais changer un id existant.
const PARCOURS = window.PARCOURS, WEEKS = [], WK = {};
PARCOURS.forEach((pc) => pc.weeks.forEach((wk, i) => {
  wk.n = i + 1; wk.parcours = pc;
  if (wk.id == null) { wk.id = `${pc.id}-${i + 1}`; console.warn(`Semaine sans id dans « ${pc.id} » (n°${i + 1}) : ajoute un id fixe.`); }
  wk.id = String(wk.id);
  if (WK[wk.id]) console.error(`Id de semaine en double : « ${wk.id} »`);
  WEEKS.push(wk); WK[wk.id] = wk;
}));
// Parcours « Nos semaines » : rempli dynamiquement avec les semaines créées par le couple
const PERSO = { id: "perso", emoji: "✍️", title: "Nos semaines", short: "Nos semaines", desc: "Les semaines que vous créez vous-mêmes, sur les thèmes et passages qui vous parlent.", weeks: [], custom: true };
PARCOURS.push(PERSO);
function syncCustom() {
  for (let i = WEEKS.length - 1; i >= 0; i--) if (WEEKS[i].parcours === PERSO) { delete WK[WEEKS[i].id]; WEEKS.splice(i, 1); }
  const items = Store.list("custom/").map((x) => ({ cid: x.path.slice(7), ...x.value })).sort((a, b) => a.at - b.at);
  PERSO.weeks = items.map((it, i) => {
    const wk = JSON.parse(JSON.stringify(it));
    wk.n = i + 1; wk.parcours = PERSO; wk.id = `perso-${it.cid}`; wk.custom = true;
    WEEKS.push(wk); WK[wk.id] = wk; return wk;
  });
}
let curP = localStorage.getItem("bc-parcours");
if (!PARCOURS.find((x) => x.id === curP)) curP = PARCOURS[0].id;
const weekLabel = (wk) => `${wk.parcours.short} · semaine ${wk.n}`;
let Store = window.Store; // remplacé par FirebaseStore au démarrage en mode firebase
const FB = CFG.mode === "firebase";
const $app = document.getElementById("app");

// ---------- utilitaires ----------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtDate = (t) => new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const other = (u) => (u === "a" ? "b" : "a");
const P = (u) => CFG.players[u];
const avatar = (u, size = "") => `<span class="avatar ${size}" style="background:${P(u).color}">${esc(P(u).initial)}</span>`;

let me = null;
function resolveMe() {
  if (!FB) { me = sessionStorage.getItem("bc-player"); return; }
  me = Store.user ? Store.get(`members/${Store.user.uid}`) || null : null;
}
const ui = { step: {}, q: {}, phase: {}, memo: {}, kwTries: {}, revealed: {}, journalTab: "open" };

function toast(msg, ms = 2200) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), ms);
}
