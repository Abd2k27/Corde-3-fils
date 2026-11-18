// Écran d'accueil
// ---------- écran : accueil ----------
function renderHome() {
  const t = totals(), s = streak(), o = other(me), pc = PARCOURS.find((x) => x.id === curP), built = piecesBuilt(pc), done = parcoursDone(pc);
  const notifs = [];
  WEEKS.forEach((wk) => {
    const st = weekState(wk.id);
    if (unlocked(wk.id) && st.theirs && !st.mine) notifs.push(`<a href="#/semaine/${wk.id}" class="notif">${avatar(o, "sm")} ${esc(P(o).name)} a fini « ${esc(weekLabel(wk))} », à toi de jouer !</a>`);
    const jk = Store.get(`joker/${wk.id}/${o}`);
    if (jk && jk.q && !jk.a) notifs.push(`<a href="#/semaine/${wk.id}" class="notif">🃏 ${esc(P(o).name)} t'a posé une question Joker (${esc(weekLabel(wk))})</a>`);
  });
  const readyL = listOf("letters/").filter((l) => l.to === me && !l.openedAt && daysUntil(l.openAt) <= 0).length;
  if (readyL) notifs.push(`<a href="#/lettres" class="notif">💌 Une lettre de ${esc(P(o).name)} peut être ouverte !</a>`);
  const unsigned = listOf("promises/").filter((p) => p.couple && !(p.signed || {})[me]).length;
  if (unsigned) notifs.push(`<a href="#/promesses" class="notif">✍️ ${esc(P(o).name)} attend ta signature sur une promesse</a>`);

  $app.innerHTML = `
    <header class="top">
      <div><div class="eyebrow">Bonjour ${esc(P(me).name)}</div><h1 class="h-title">${esc(CFG.appName)}</h1></div>
      <div class="row tight"><button class="icon-btn" onclick="location.hash='#/guide'" title="Comment ça marche ?" aria-label="Comment ça marche ?">?</button><div class="duo">${avatar("a")}${avatar("b")}</div></div>
    </header>
    <div class="home-grid">
    <div class="home-side">
    ${notifs.join("")}
    ${soirCardHTML(todayStr(), true)}
    ${readingCardHTML()}
    ${countdownHTML()}
    </div>
    <div class="home-main">

    <h2 class="section">Parcours</h2>
    <div class="parcours-bar">
      ${PARCOURS.map((x) => { const d = parcoursDone(x); return `<button class="pc ${x.id === curP ? "on" : ""}" data-pc="${x.id}">
        <span class="pc-emoji">${x.emoji}</span><strong>${esc(x.title)}</strong>
        <span class="pc-prog"><span style="width:${Math.round((d / (x.weeks.length || 1)) * 100)}%"></span></span>
        <span class="small muted">${x.custom && !x.weeks.length ? "À vous de créer !" : `${d}/${x.weeks.length} semaines`}</span></button>`; }).join("")}
    </div>
    <p class="pc-desc">${pc.emoji} <strong>${esc(pc.title)}</strong> — ${esc(pc.desc)}</p>
    <section class="card house-card">
      ${houseSVG(built)}
      <div class="house-meta">
        <div><strong>${done}/${pc.weeks.length}</strong><span>semaines</span></div>
        <div><strong>${t.total}</strong><span>points</span></div>
        <div><strong>${s} 🔥</strong><span>série</span></div>
      </div>
      <p class="small muted center-text">${built < 7 ? `Prochaine pièce : ${PIECES[built]}` : "Cette maison est bâtie sur le roc 🙌"} · Matthieu 7:24</p>
      ${done ? `<a class="btn ${done === pc.weeks.length ? "" : "ghost"} sm bilan-link" href="#/bilan/${pc.id}">${done === pc.weeks.length ? "🎉 Parcours terminé : voir le bilan" : "📊 Voir le bilan"}</a>` : ""}
    </section>
    <div class="weeks">
      ${pc.weeks.map((wk) => {
        const st = weekState(wk.id), open = unlocked(wk.id);
        let chip = `<span class="chip">À faire</span>`;
        if (!open) chip = `<span class="chip lock">🔒</span>`;
        else if (st.both) chip = `<span class="chip done">Terminée ✔</span>`;
        else if (st.mine) chip = `<span class="chip wait">En attente de ${esc(P(other(me)).name)}</span>`;
        else if (st.theirs) chip = `<span class="chip hot">À toi !</span>`;
        else if (st.started) chip = `<span class="chip">En cours</span>`;
        return `<button class="week ${open ? "" : "locked"}" ${open ? `data-w="${wk.id}"` : "disabled"}>
          <span class="week-emoji">${wk.emoji}</span>
          <span class="week-txt"><span class="eyebrow">Semaine ${wk.n}</span><strong>${esc(wk.title)}</strong><span class="small muted">${wk.passages.map((p) => esc(p.ref)).join(" · ")}</span></span>
          ${chip}
        </button>`;
      }).join("")}
      ${pc.custom ? `<a class="btn ghost full" href="#/creer">✨ Créer une semaine</a>` : ""}
    </div></div></div>` + nav("home");
  $app.querySelectorAll(".week[data-w]").forEach((b) => b.onclick = () => go(`#/semaine/${b.dataset.w}`));
  $app.querySelectorAll("[data-pc]").forEach((b) => b.onclick = () => { curP = b.dataset.pc; localStorage.setItem("bc-parcours", curP); renderHome(); });
  const on = $app.querySelector(".pc.on"); if (on) on.scrollIntoView({ inline: "center", block: "nearest" });
  const lo = document.getElementById("logout");
  if (lo) lo.onclick = (e) => { e.preventDefault(); Store.signOut(); };
  const rs = document.getElementById("reset");
  if (rs) rs.onclick = async (e) => {
    e.preventDefault();
    if (!confirm("Effacer toutes les données de test ?")) return;
    await Store.reset();
    Object.keys(localStorage).filter((k) => k.startsWith("bc-draft-")).forEach((k) => localStorage.removeItem(k));
    render();
  };
}
