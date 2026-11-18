// Dates, en-têtes de page, barre du bas (mobile) et menu latéral (ordinateur)
// =====================================================================
// ---------- utilitaires dates & navigation ----------
const todayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseDay = (s) => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d); };
const fmtDay = (s, opts = { day: "numeric", month: "long", year: "numeric" }) => parseDay(s).toLocaleDateString("fr-FR", opts);
const daysUntil = (s) => Math.round((parseDay(s) - parseDay(todayStr())) / 864e5);
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const listOf = (prefix) => Store.list(prefix).map((x) => ({ id: x.path.slice(prefix.length), ...x.value }));
const pageHead = (eyebrow, title, back) => `
  <header class="top ${back ? "slim" : ""}">
    ${back ? `<button class="icon-btn" onclick="location.hash='${back}'" aria-label="Retour">←</button>` : ""}
    <div class="grow"><div class="eyebrow">${eyebrow}</div><h1 class="h-title">${title}</h1></div>
  </header>`;

const NAV = [["home", "#/", "🏡", "Accueil"], ["lecture", "#/lecture", "📖", "Lecture"], ["soir", "#/soir", "🌙", "Ce soir"], ["histoire", "#/histoire", "📸", "Histoire"], ["plus", "#/plus", "☰", "Plus"]];
function navBadges() {
  const p = activePlan(), d = p && planDay(p);
  const b = {
    soir: !Store.get(`soir/${todayStr()}/${me}`),
    lecture: !!(p && d <= p.days.length && !readOf(p.id, d, me)),
    lettres: listOf("letters/").some((l) => l.to === me && !l.openedAt && daysUntil(l.openAt) <= 0),
    promesses: listOf("promises/").some((x) => x.couple && !(x.signed || {})[me])
  };
  b.plus = b.lettres || b.promesses; // sur mobile, Lettres et Promesses sont dans « Plus »
  return b;
}
function nav(active) {
  const b = navBadges();
  if (!NAV.some((n) => n[0] === active)) active = "plus";
  return `<div class="nav-space"></div><nav class="bottom-nav">${NAV.map(([id, h, ic, l]) =>
    `<a href="${h}" class="${id === active ? "on" : ""}"${id === active ? ' aria-current=page' : ""}><span class="ni">${ic}${b[id] ? '<i class="dot-badge"></i>' : ""}</span><span>${l}</span></a>`).join("")}</nav>`;
}

// ---------- navigation : barre du bas (mobile) + menu latéral (ordinateur) ----------
const SIDE = [
  ["Au quotidien", [["home", "#/", "🏡", "Accueil"], ["lecture", "#/lecture", "📖", "Lecture"], ["soir", "#/soir", "🌙", "Ce soir"]]],
  ["Ensemble", [["histoire", "#/histoire", "📸", "Histoire"], ["lettres", "#/lettres", "💌", "Lettres"], ["journal", "#/journal", "🙏", "Journal de prière"], ["promesses", "#/promesses", "✍️", "Promesses"], ["bocal", "#/bocal", "🫙", "Bocal à idées"], ["dates", "#/dates", "📅", "Nos dates"]]],
  ["Plus", [["creer", "#/creer", "✨", "Créer une semaine"], ["plus", "#/plus", "⚙️", "Bilans & réglages"]]]
];
const SIDE_ALIAS = { semaine: "home", bilan: "plus" };
function drawSide(route) {
  const el = document.getElementById("side"); if (!el) return;
  const active = SIDE_ALIAS[route] || route, b = navBadges();
  el.innerHTML = `
    <a class="side-brand" href="#/"><span class="side-logo">🪢</span><span><strong>${esc(CFG.appName)}</strong><span class="duo">${avatar("a", "sm")}${avatar("b", "sm")}</span></span></a>
    ${SIDE.map(([t, items]) => `<div class="side-group"><div class="eyebrow">${t}</div>${items.map(([id, h, ic, l]) =>
      `<a href="${h}" class="side-link ${id === active ? "on" : ""}"${id === active ? ' aria-current="page"' : ""}><span class="ni">${ic}</span><span class="grow">${l}</span>${b[id] ? '<i class="side-badge" aria-label="nouveau"></i>' : ""}</a>`).join("")}</div>`).join("")}
    <div class="side-foot">${avatar(me, "sm")}<span class="grow small">${esc(P(me).name)}</span>${FB ? `<button class="link small" id="sideOut">Déconnexion</button>` : `<a class="small" href="#/joueur">Changer</a>`}</div>`;
  const so = el.querySelector("#sideOut"); if (so) so.onclick = () => Store.signOut();
}
