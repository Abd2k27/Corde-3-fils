// Bilan d'un parcours
// ---------- 📊 Bilan d'un parcours ----------
function renderBilan(pid) {
  const pc = PARCOURS.find((x) => x.id === pid);
  if (!pc) return go("#/plus");
  const doneW = pc.weeks.filter((wk) => weekState(wk.id).both);
  const st = { a: { pts: 0, ok: 0, tot: 0, kw: 0, memo: 0, defi: 0 }, b: { pts: 0, ok: 0, tot: 0, kw: 0, memo: 0, defi: 0 } };
  let bonus = 0;
  const perfect = [], opens = [], lastDone = Math.max(0, ...doneW.map((wk) => Math.max(prog(wk.id, "a").submitted || 0, prog(wk.id, "b").submitted || 0)));
  pc.weeks.forEach((wk) => {
    const pts = weekPoints(wk.id); bonus += pts.bonus;
    ["a", "b"].forEach((u) => { const p = prog(wk.id, u); st[u].pts += pts[u]; if (p.keyword) st[u].kw++; if (p.memo) st[u].memo++; if (p.defi) st[u].defi++; });
  });
  doneW.forEach((wk) => {
    const A = prog(wk.id, "a").answers || {}, B = prog(wk.id, "b").answers || {};
    wk.questions.forEach((q) => {
      if (q.type === "ouverte") { opens.push({ wk, q, a: A[q.id]?.self, b: B[q.id]?.self }); return; }
      const ga = guessScore(q, A[q.id]?.guess, B[q.id]?.self), gb = guessScore(q, B[q.id]?.guess, A[q.id]?.self);
      st.a.tot++; st.b.tot++; if (ga) st.a.ok++; if (gb) st.b.ok++;
      if (ga === 10 && gb === 10) perfect.push({ wk, q, a: A[q.id]?.self, b: B[q.id]?.self });
    });
  });
  const prayers = listOf("prayers/").filter((p) => p.week != null && WK[p.week] && WK[p.week].parcours.id === pid);
  const complete = pc.weeks.length > 0 && doneW.length === pc.weeks.length;
  const pct = (u) => (st[u].tot ? Math.round((st[u].ok / st[u].tot) * 100) : 0);
  const statRow = (label, k) => `<tr><td>${label}</td><td>${st.a[k]}</td><td>${st.b[k]}</td></tr>`;
  $app.innerHTML = pageHead(complete ? "🎉 Parcours terminé" : `Bilan en cours · ${doneW.length}/${pc.weeks.length} semaines`, `${pc.emoji} ${esc(pc.title)}`, "#/plus") + `
    ${complete ? `<section class="card center-text bilan-hero">${houseSVG(7)}<p>Terminé le <strong>${new Date(lastDone).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>. Votre maison est bâtie sur le roc !</p></section>` : ""}
    <section class="card">
      <div class="eyebrow">Les chiffres</div>
      <table class="g-table bilan-t">
        <tr><th></th><th>${avatar("a", "sm")} ${esc(P("a").name)}</th><th>${avatar("b", "sm")} ${esc(P("b").name)}</th></tr>
        ${statRow("Points", "pts")}
        <tr><td>Paris justes</td><td>${st.a.ok}/${st.a.tot} (${pct("a")} %)</td><td>${st.b.ok}/${st.b.tot} (${pct("b")} %)</td></tr>
        ${statRow("Mots cachés trouvés", "kw")}${statRow("Versets mémorisés", "memo")}${statRow("Défis relevés", "defi")}
      </table>
      <p class="small muted">+ ${bonus} points bonus gagnés à deux · total du parcours : <strong>${st.a.pts + st.b.pts + bonus}</strong></p>
    </section>
    ${perfect.length ? `<h2 class="section">🎯 Vos plus beaux paris</h2><p class="small muted">Les questions où vous vous êtes devinés tous les deux.</p>
      ${perfect.slice(0, 8).map((x) => `<section class="card"><div class="eyebrow">${esc(weekLabel(x.wk))}</div><h4>${esc(x.q.text)}</h4>
        <div class="ans-grid"><div class="ans">${avatar("a", "sm")}<p>${esc(answerLabel(x.q, x.a))}</p></div><div class="ans">${avatar("b", "sm")}<p>${esc(answerLabel(x.q, x.b))}</p></div></div></section>`).join("")}` : ""}
    ${opens.length ? `<h2 class="section">💬 Vos réponses ouvertes</h2>
      ${opens.map((x) => `<section class="card"><div class="eyebrow">${esc(weekLabel(x.wk))}</div><h4>${esc(x.q.text)}</h4>
        <div class="ans-grid"><div class="ans">${avatar("a", "sm")}<p>${esc(x.a || "—")}</p></div><div class="ans">${avatar("b", "sm")}<p>${esc(x.b || "—")}</p></div></div></section>`).join("")}` : ""}
    <h2 class="section">🎯 Les défis</h2>
    ${pc.weeks.map((wk) => { const a = prog(wk.id, "a").defi, b = prog(wk.id, "b").defi; return `<div class="card defi-line"><span class="small muted">S${wk.n}</span><p>${esc(wk.defi)}</p><span>${a ? avatar("a", "sm") : ""}${b ? avatar("b", "sm") : ""}${!a && !b ? `<span class="small muted">—</span>` : ""}</span></div>`; }).join("")}
    ${prayers.length ? `<h2 class="section">🙏 Prières de ce parcours</h2>${prayers.map((p) => `<div class="card"><p>${esc(p.text)}</p><span class="small ${p.answered ? "ok" : "muted"}">${avatar(p.by, "sm")} ${p.answered ? "Exaucée 🙌" : "En prière"}</span></div>`).join("")}` : ""}
    ${doneW.length === 0 ? `<p class="muted center-text">Terminez une première semaine à deux pour voir votre bilan se remplir.</p>` : ""}` + nav("plus");
}
