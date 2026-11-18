// Question du jour
// ---------- 🌙 Question du jour ----------
const SOIR = window.SOIR_QUESTIONS || ["Qu'est-ce qui t'a fait sourire aujourd'hui ?"];
const builtinQ = (day) => { const n = Math.round(parseDay(day).getTime() / 864e5); return SOIR[((n % SOIR.length) + SOIR.length) % SOIR.length]; };
// Questions proposées par le couple (clé soirq/) : elles passent avant la liste intégrée, dans l'ordre d'ajout.
// La question est enregistrée avec chaque réponse ({a, at, q}) : une fois répondue, elle ne change plus.
const usedSoirQ = () => new Set(Store.list("soir/").map((x) => x.value && x.value.q).filter(Boolean));
const pendingSoirQ = () => { const used = usedSoirQ(); return listOf("soirq/").filter((q) => q.text && !used.has(q.text)).sort((a, b) => a.at - b.at); };
function soirQ(day) {
  const saved = ["a", "b"].map((u) => Store.get(`soir/${day}/${u}`)).find((x) => x && x.q);
  const custom = (text) => listOf("soirq/").find((q) => q.text === text);
  if (saved) { const c = custom(saved.q); return { text: saved.q, by: c ? c.by : null }; }
  if (day === todayStr()) { const nx = pendingSoirQ()[0]; if (nx) return { text: nx.text, by: nx.by }; }
  return { text: builtinQ(day), by: null };
}
function soirCardHTML(day, compact) {
  const o = other(me), q = soirQ(day), mine = Store.get(`soir/${day}/${me}`), th = Store.get(`soir/${day}/${o}`);
  const isToday = day === todayStr();
  let body;
  if (!mine) {
    body = compact
      ? `<a class="btn sm" href="#/soir">Répondre →</a>${th ? ` <span class="small muted">${esc(P(o).name)} a déjà répondu 👀</span>` : ""}`
      : `<textarea data-soir-in="${day}" rows="3" placeholder="Ta réponse… (${esc(P(o).name)} la verra quand vous aurez répondu tous les deux)"></textarea>
         <div class="row between"><span class="small muted">${th ? `${esc(P(o).name)} a déjà répondu 👀` : ""}</span><button class="btn sm" data-soir-send="${day}">Envoyer</button></div>`;
  } else if (!th) {
    body = `<div class="ans">${avatar(me, "sm")}<p>${esc(mine.a)}</p></div><p class="small muted">⏳ ${isToday ? `En attente de ${esc(P(o).name)}…` : `${esc(P(o).name)} n'a pas répondu.`}</p>`;
  } else {
    body = `<div class="ans-grid"><div class="ans">${avatar(me, "sm")}<p>${esc(mine.a)}</p></div><div class="ans">${avatar(o, "sm")}<p>${esc(th.a)}</p></div></div>`;
  }
  return `<section class="card soir ${compact ? "compact" : ""}">
    <div class="eyebrow">🌙 ${isToday ? "Question du jour" : fmtDay(day, { weekday: "long", day: "numeric", month: "long" })}</div>
    <h3>${esc(q.text)}</h3>${q.by ? `<p class="small muted q-by">✍️ Proposée par ${esc(P(q.by).name)}</p>` : ""}${body}</section>`;
}
function bindSoir(root) {
  root.querySelectorAll("[data-soir-send]").forEach((b) => b.onclick = async () => {
    const day = b.dataset.soirSend, v = root.querySelector(`[data-soir-in="${day}"]`).value.trim();
    if (!v) return;
    await Store.set(`soir/${day}/${me}`, { a: v, at: Date.now(), q: soirQ(day).text });
    if (Store.get(`soir/${day}/${other(me)}`)) confetti(); else toast("Réponse envoyée 🌙");
    render();
  });
}
function renderSoir() {
  const t = todayStr();
  const days = [...new Set(Store.list("soir/").map((x) => x.path.split("/")[1]))].filter((d) => d !== t).sort().reverse();
  $app.innerHTML = pageHead("Chaque jour", "Question du jour") + soirCardHTML(t) + soirQueueHTML() +
    `<h2 class="section">Les jours précédents</h2>` +
    (days.length ? days.map((d) => soirCardHTML(d)).join("") : `<p class="muted center-text small">Vos réponses s'afficheront ici, jour après jour.</p>`) + nav("soir");
  bindSoir($app);
  $app.querySelector("#sqAdd").onclick = async () => {
    const v = $app.querySelector("#sqT").value.trim(); if (!v) return;
    if (pendingSoirQ().some((q) => q.text === v) || usedSoirQ().has(v)) return toast("Cette question existe déjà");
    await Store.set(`soirq/${newId()}`, { text: v, by: me, at: Date.now() });
    toast("Question ajoutée ✍️"); render();
  };
  $app.querySelectorAll("[data-sq-del]").forEach((b) => b.onclick = async () => { await Store.remove(`soirq/${b.dataset.sqDel}`); render(); });
}
function soirQueueHTML() {
  const today = soirQ(todayStr()).text; // déjà affichée au-dessus : on ne la compte pas comme « en attente »
  const pend = pendingSoirQ().filter((q) => q.text !== today), own = pend.filter((q) => q.by === me), theirs = pend.length - own.length;
  return `<section class="card">
    <div class="eyebrow">✍️ Vos questions</div>
    <p class="small muted">Propose une question pour un prochain soir : les vôtres passent avant les questions prévues, dans l'ordre d'ajout.</p>
    <textarea id="sqT" rows="2" placeholder="Ta question…"></textarea>
    <div class="row end"><button class="btn sm" id="sqAdd">Ajouter</button></div>
    ${theirs ? `<p class="small muted">+ ${theirs} question${theirs > 1 ? "s" : ""} de ${esc(P(other(me)).name)} en attente : surprise 🤫</p>` : ""}
    ${own.length ? `<ul class="recap">${own.map((q) => `<li class="row between q-row"><span class="grow">${esc(q.text)}</span><button class="link danger" data-sq-del="${q.id}">Retirer</button></li>`).join("")}</ul>` : ""}
  </section>`;
}
