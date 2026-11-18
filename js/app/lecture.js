// Plan de lecture à deux
// ---------- 📖 Plan de lecture à deux ----------
// Un seul plan actif (clé lecture-plan). Lecture : lecture/<plan>/<jour>/<joueur> = { at, note }.
// À votre rythme : le jour suivant s'ouvre quand vous avez lu tous les deux le jour en cours.
const PLANS = window.LECTURE_PLANS || [];
const planById = (id) => PLANS.find((p) => p.id === id);
const activePlan = () => { const a = Store.get("lecture-plan"); return a ? planById(a.id) || null : null; };
const readOf = (pid, d, u) => Store.get(`lecture/${pid}/${d}/${u}`);
const bothRead = (pid, d) => !!(readOf(pid, d, "a") && readOf(pid, d, "b"));
// premier jour pas encore lu par vous deux (> nombre de jours = plan terminé)
function planDay(p) { let d = 1; while (d <= p.days.length && bothRead(p.id, d)) d++; return d; }
const planDone = (p) => p.days.filter((_, i) => bothRead(p.id, i + 1)).length;
// « Jean 3 – 4 », « Psaumes 1 – 3 », « Marc 16 · Luc 1 »
function dayRef(p, d) {
  const groups = [];
  (p.days[d - 1] || []).forEach(([b, c]) => { const g = groups[groups.length - 1]; if (g && g.b === b) g.to = c; else groups.push({ b, from: c, to: c }); });
  return groups.map((g) => `${BOOKS[g.b - 1]} ${g.from}${g.to !== g.from ? ` – ${g.to}` : ""}`).join(" · ");
}
// série : jours de calendrier consécutifs où vous avez terminé une lecture à deux
function readingStreak(p) {
  const days = new Set();
  for (let d = 1; d <= p.days.length; d++) {
    const a = readOf(p.id, d, "a"), b = readOf(p.id, d, "b");
    if (a && b) days.add(todayStr(new Date(Math.max(a.at, b.at))));
  }
  const cur = new Date(); if (!days.has(todayStr(cur))) cur.setDate(cur.getDate() - 1);
  let n = 0; while (days.has(todayStr(cur))) { n++; cur.setDate(cur.getDate() - 1); }
  return n;
}
const progBar = (done, total) => `<span class="pc-prog"><span style="width:${Math.round((done / (total || 1)) * 100)}%"></span></span>`;
function readingCardHTML() {
  const p = activePlan();
  if (!p) return `<a class="card reading-card" href="#/lecture"><div class="eyebrow">📖 Lecture à deux</div><strong>Lire la Bible ensemble, à votre rythme</strong><div class="small muted">Choisir un plan →</div></a>`;
  const d = planDay(p), done = planDone(p), o = other(me);
  if (d > p.days.length) return `<a class="card reading-card" href="#/lecture"><div class="eyebrow">📖 ${esc(p.title)}</div><strong>🎉 Plan terminé !</strong><div class="small muted">Choisir le suivant →</div></a>`;
  const st = (u) => readOf(p.id, d, u) ? `${avatar(u, "sm")} lu ✓` : `${avatar(u, "sm")} <span class="muted">pas encore</span>`;
  return `<a class="card reading-card" href="#/lecture">
    <div class="row between tight"><div class="eyebrow">📖 Lecture du jour · ${d}/${p.days.length}</div>${readingStreak(p) ? `<span class="small">${readingStreak(p)} 🔥</span>` : ""}</div>
    <strong class="reading-ref">${esc(dayRef(p, d))}</strong>
    ${progBar(done, p.days.length)}
    <div class="row between"><span class="small">${st(me)} &nbsp; ${st(o)}</span><span class="btn sm">${readOf(p.id, d, me) ? "Voir" : "Lire"} →</span></div>
  </a>`;
}
function renderPlanChoice(cur) {
  $app.innerHTML = pageHead("Lecture à deux", "Choisir un plan", cur ? "#/lecture" : "") + `
    <p class="pc-desc">Chacun lit de son côté, coche « J'ai lu » et note ce qui l'a marqué. Le jour suivant s'ouvre quand vous avez lu tous les deux : personne ne prend de retard.</p>
    <div class="plan-grid">${PLANS.map((p) => { const done = planDone(p); return `<article class="card plan ${cur && cur.id === p.id ? "on" : ""}">
      <span class="plan-emoji">${p.emoji}</span><h3>${esc(p.title)}</h3><p class="small muted">${esc(p.desc)}</p>
      ${done ? `${progBar(done, p.days.length)}<p class="small muted">${done}/${p.days.length} jours lus</p>` : ""}
      <button class="btn ${cur && cur.id === p.id ? "ghost" : ""} full" data-plan="${p.id}">${cur && cur.id === p.id ? "Plan en cours" : done >= p.days.length ? "Recommencer la lecture" : done ? "Reprendre" : "Commencer"}</button>
    </article>`; }).join("")}</div>` + nav("lecture");
  $app.querySelectorAll("[data-plan]").forEach((b) => b.onclick = async () => {
    const p = planById(b.dataset.plan);
    if (cur && cur.id === p.id) return go("#/lecture");
    if (planDone(p) >= p.days.length && !confirm("Ce plan est terminé. Effacer vos lectures pour le recommencer ?")) return;
    if (planDone(p) >= p.days.length) for (let d = 1; d <= p.days.length; d++) for (const u of ["a", "b"]) if (readOf(p.id, d, u)) await Store.remove(`lecture/${p.id}/${d}/${u}`);
    await Store.set("lecture-plan", { id: p.id, by: me, at: Date.now() });
    toast(`${p.emoji} ${p.title} : c'est parti !`); go("#/lecture");
  });
}
function renderLecture(arg) {
  const p = activePlan();
  if (!p || arg === "plans") return renderPlanChoice(p);
  const cur = planDay(p), total = p.days.length, o = other(me);
  if (cur > total && !arg) {
    $app.innerHTML = pageHead("Lecture à deux", p.title) + `<section class="card center-text"><div class="big-emoji">🎉</div><h2>Plan terminé !</h2>
      <p class="muted">Vous avez lu ensemble les ${total} jours de « ${esc(p.title)} ».</p><a class="btn full" href="#/lecture/plans">Choisir un nouveau plan</a></section>` + nav("lecture");
    return;
  }
  const d = Math.min(Math.max(+arg || cur, 1), Math.min(cur, total));
  const mine = readOf(p.id, d, me), theirs = readOf(p.id, d, o), both = mine && theirs, chs = p.days[d - 1];
  let readBox;
  if (!mine) readBox = `<div class="eyebrow">✍️ Ce qui m'a marqué</div>
    <textarea id="lnNote" rows="3" placeholder="Une phrase, un verset… (facultatif — ${esc(P(o).name)} la verra quand vous aurez lu tous les deux)"></textarea>
    <button class="btn full" id="lnDone">✓ J'ai lu</button>${theirs ? `<p class="small muted center-text">${esc(P(o).name)} a déjà lu 👀</p>` : ""}`;
  else if (!theirs) readBox = `<div class="eyebrow">✓ Tu as lu</div>${mine.note ? `<div class="ans">${avatar(me, "sm")}<p>${esc(mine.note)}</p></div>` : ""}<p class="small muted">⏳ En attente de ${esc(P(o).name)} pour ouvrir le jour suivant…</p>`;
  else readBox = `<div class="eyebrow">💬 Ce qui vous a marqués</div>
    <div class="ans-grid"><div class="ans">${avatar(me, "sm")}<p>${esc(mine.note || "—")}</p></div><div class="ans">${avatar(o, "sm")}<p>${esc(theirs.note || "—")}</p></div></div>
    ${d < total ? `<a class="btn full" href="#/lecture/${d + 1}">Jour ${d + 1} →</a>` : `<a class="btn full" href="#/lecture">🎉 Terminer le plan</a>`}`;
  const cells = p.days.map((_, i) => {
    const n = i + 1, open = n <= cur, cls = bothRead(p.id, n) ? "both" : readOf(p.id, n, me) || readOf(p.id, n, o) ? "half" : "";
    return open ? `<a class="day-cell ${cls} ${n === d ? "on" : ""}" href="#/lecture/${n}" title="Jour ${n} · ${esc(dayRef(p, n))}">${n}</a>` : `<span class="day-cell locked">${n}</span>`;
  }).join("");
  $app.innerHTML = pageHead("Lecture à deux", `${p.emoji} ${esc(p.title)}`) + `
    <div class="reading-layout">
      <section class="card r-prog">
        <div class="row between tight"><div class="eyebrow">Jour ${d} sur ${total}</div><a class="small" href="#/lecture/plans">Changer de plan</a></div>
        <h2 class="reading-ref">${esc(dayRef(p, d))}</h2>
        ${progBar(planDone(p), total)}
        <div class="row between"><span class="small">${planDone(p)} jour${planDone(p) > 1 ? "s" : ""} lu${planDone(p) > 1 ? "s" : ""} à deux</span>${readingStreak(p) ? `<span class="small">${readingStreak(p)} jour${readingStreak(p) > 1 ? "s" : ""} de suite 🔥</span>` : ""}</div>
      </section>
      <div class="r-text">${chs.map(([b, c], i) => `<article class="card passage">
        <div class="passage-head"><div class="eyebrow">${BOOKS[b - 1]} ${c}</div>${TTS ? `<button class="listen" data-listen="${i}" aria-label="Écouter ${BOOKS[b - 1]} ${c}">🔊 Écouter</button>` : ""}</div>
        <div class="verses" id="ch${i}"><p class="muted small">Chargement du texte…</p></div></article>`).join("")}</div>
      <section class="card r-read">${readBox}</section>
      <details class="card r-days" ${innerWidth >= 1000 ? "open" : ""}><summary>📅 Tous les jours</summary><div class="day-grid">${cells}</div></details>
    </div>` + nav("lecture");
  const load = (i) => {
    const [b, c] = chs[i], el = $app.querySelector("#ch" + i); if (!el) return;
    el.innerHTML = `<p class="muted small">Chargement du texte…</p>`;
    Bible.chapter(b, c).then((t) => {
      const node = $app.querySelector("#ch" + i); if (!node) return;
      if (t && Object.keys(t).length) node.innerHTML = versesHTML(t);
      else { node.innerHTML = `<p class="muted small">Texte indisponible (pas de connexion ?). Tu peux lire ${BOOKS[b - 1]} ${c} dans ta Bible.</p><button class="link" data-retry="${i}">Réessayer</button>`; node.querySelector("[data-retry]").onclick = () => load(i); }
    });
  };
  chs.forEach((_, i) => load(i));
  $app.querySelectorAll("[data-listen]").forEach((b) => b.onclick = () => speakPassage($app.querySelector("#ch" + b.dataset.listen), b));
  const btn = $app.querySelector("#lnDone");
  if (btn) btn.onclick = async () => {
    btn.disabled = true;
    await Store.set(`lecture/${p.id}/${d}/${me}`, { at: Date.now(), note: $app.querySelector("#lnNote").value.trim() });
    if (readOf(p.id, d, o)) { confetti(); toast(d < total ? `Jour ${d + 1} débloqué 📖` : "Plan terminé 🎉"); } else toast("Lecture notée ✓");
    // on reste sur ce jour pour découvrir ce qui a marqué l'autre, avant de passer au suivant
    if (location.hash !== `#/lecture/${d}`) go(`#/lecture/${d}`); else render();
  };
}
