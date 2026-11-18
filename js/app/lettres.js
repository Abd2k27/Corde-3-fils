// Lettres à ouvrir plus tard
// ---------- 💌 Lettres à ouvrir plus tard ----------
function addMonths(n) { const d = new Date(); d.setMonth(d.getMonth() + n); return todayStr(d); }
function letterHTML(l) {
  const o = other(me), d = daysUntil(l.openAt), received = l.to === me;
  if (!received) {
    return `<article class="card letter sent">
      <div class="eyebrow">À ${esc(P(l.to).name)} · écrite le ${fmtDate(l.at)}</div>
      <h3>✉️ ${esc(l.title)}</h3>
      <p class="small muted">${l.openedAt ? `Ouverte le ${fmtDate(l.openedAt)} 💌` : d > 0 ? `S'ouvrira le ${fmtDay(l.openAt)} (dans ${d} jour${d > 1 ? "s" : ""})` : "Prête à être ouverte"}</p>
      ${!l.openedAt ? `<button class="link danger" data-del-letter="${l.id}">Supprimer</button>` : ""}
    </article>`;
  }
  if (l.openedAt) {
    return `<article class="card letter open">
      <div class="eyebrow">De ${esc(P(l.from).name)} · écrite le ${fmtDate(l.at)} · ouverte le ${fmtDate(l.openedAt)}</div>
      <h3>💌 ${esc(l.title)}</h3>
      <p class="letter-txt">${esc(l.text)}</p>
      <p class="letter-sign">— ${esc(P(l.from).name)}</p>
    </article>`;
  }
  if (d > 0) {
    return `<article class="card letter locked">
      <div class="envelope">🔒✉️</div>
      <h3>${esc(l.title)}</h3>
      <p class="small muted">De ${esc(P(l.from).name)} · s'ouvrira le <strong>${fmtDay(l.openAt)}</strong><br>encore ${d} jour${d > 1 ? "s" : ""} de patience…</p>
    </article>`;
  }
  return `<article class="card letter ready">
    <div class="envelope bounce">💌</div>
    <h3>${esc(l.title)}</h3>
    <p class="small muted">De ${esc(P(l.from).name)} · c'est le moment !</p>
    <button class="btn" data-open-letter="${l.id}">Ouvrir la lettre</button>
  </article>`;
}
function renderLettres() {
  const tab = ui.letterTab || "recues", o = other(me);
  const all = listOf("letters/");
  const recues = all.filter((l) => l.to === me).sort((a, b) => (a.openedAt ? 1 : 0) - (b.openedAt ? 1 : 0) || a.openAt.localeCompare(b.openAt));
  const envoyees = all.filter((l) => l.from === me).sort((a, b) => b.at - a.at);
  let body = "";
  if (tab === "ecrire") {
    const quick = [["Dans 1 mois", addMonths(1)], ["Dans 6 mois", addMonths(6)], ["Dans 1 an", addMonths(12)]];
    body = `<section class="card">
      <p class="small muted">Écris une lettre à ${esc(P(o).name)}. Elle restera scellée jusqu'à la date choisie.</p>
      <input id="lT" placeholder="Titre (ex. Pour nos 1 an, Pour le jour de nos fiançailles…)">
      <textarea id="lX" rows="8" placeholder="Ta lettre…"></textarea>
      <div class="eyebrow" style="margin-top:10px">Date d'ouverture</div>
      <div class="row">${quick.map(([l, d]) => `<button class="chip-btn" data-quick="${d}">${l}</button>`).join("")}</div>
      <input type="date" id="lD" min="${todayStr()}" value="${addMonths(1)}">
      <button class="btn full" id="lSend">Sceller et envoyer 💌</button>
    </section>`;
  } else {
    const list = tab === "recues" ? recues : envoyees;
    body = list.length ? list.map(letterHTML).join("") : `<p class="muted center-text small">${tab === "recues" ? `Aucune lettre de ${esc(P(o).name)} pour l'instant.` : "Tu n'as pas encore écrit de lettre."}</p>`;
  }
  const ready = recues.filter((l) => !l.openedAt && daysUntil(l.openAt) <= 0).length;
  $app.innerHTML = pageHead("Pour plus tard", "Lettres scellées") + `
    <div class="tabs">
      <button class="${tab === "recues" ? "on" : ""}" data-lt="recues">Reçues${ready ? ` (${ready} 💌)` : ""}</button>
      <button class="${tab === "envoyees" ? "on" : ""}" data-lt="envoyees">Envoyées</button>
      <button class="${tab === "ecrire" ? "on" : ""}" data-lt="ecrire">✍️ Écrire</button>
    </div>${body}` + nav("lettres");
  $app.querySelectorAll("[data-lt]").forEach((b) => b.onclick = () => { ui.letterTab = b.dataset.lt; renderLettres(); });
  $app.querySelectorAll("[data-quick]").forEach((b) => b.onclick = () => { $app.querySelector("#lD").value = b.dataset.quick; });
  const send = $app.querySelector("#lSend");
  if (send) send.onclick = async () => {
    const title = $app.querySelector("#lT").value.trim() || "Une lettre pour toi", text = $app.querySelector("#lX").value.trim(), openAt = $app.querySelector("#lD").value;
    if (!text) return toast("La lettre est vide 🙂");
    if (!openAt || daysUntil(openAt) < 0) return toast("Choisis une date à venir");
    await Store.set(`letters/${newId()}`, { from: me, to: o, title, text, openAt, at: Date.now() });
    ui.letterTab = "envoyees"; toast("Lettre scellée 💌"); render();
  };
  $app.querySelectorAll("[data-open-letter]").forEach((b) => b.onclick = async () => {
    const k = `letters/${b.dataset.openLetter}`;
    await Store.set(k, { ...Store.get(k), openedAt: Date.now() }); confetti(); render();
  });
  $app.querySelectorAll("[data-del-letter]").forEach((b) => b.onclick = async () => {
    if (!confirm("Supprimer cette lettre ?")) return;
    await Store.remove(`letters/${b.dataset.delLetter}`); render();
  });
}
