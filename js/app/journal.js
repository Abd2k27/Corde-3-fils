// Journal de prière
// ---------- écran : journal ----------
function renderJournal() {
  const all = Store.list("prayers/").map((x) => ({ id: x.path.split("/")[1], ...x.value })).sort((a, b) => b.at - a.at);
  const tab = ui.journalTab, list = all.filter((p) => (tab === "open" ? !p.answered : p.answered));
  $app.innerHTML = `
    <header class="top slim"><button class="icon-btn" onclick="location.hash='#/plus'" aria-label="Retour">←</button><div class="grow"><div class="eyebrow">Ensemble</div><strong>Journal de prière</strong></div></header>
    <section class="card">
      <textarea id="pr" rows="3" placeholder="Une intention de prière, un sujet de reconnaissance…"></textarea>
      <button class="btn full" id="add">Ajouter</button>
    </section>
    <div class="tabs"><button class="${tab === "open" ? "on" : ""}" data-t="open">En prière (${all.filter((p) => !p.answered).length})</button><button class="${tab === "done" ? "on" : ""}" data-t="done">Exaucées 🙌 (${all.filter((p) => p.answered).length})</button></div>
    ${list.length ? list.map((p) => `
      <article class="card prayer-item ${p.answered ? "answered" : ""}">
        <div class="pi-head">${avatar(p.by, "sm")}<span class="small muted">${esc(P(p.by).name)} · ${fmtDate(p.at)}${p.week != null && WK[p.week] ? ` · ${esc(weekLabel(WK[p.week]))}` : ""}</span></div>
        <p>${esc(p.text)}</p>
        ${p.answered ? `<p class="small ok">Exaucée le ${fmtDate(p.answeredAt)} 🙌 · <button class="link" data-story="${p.id}">📌 Ajouter à notre histoire</button></p>` : `<button class="link" data-done="${p.id}">Marquer comme exaucée</button>`}
      </article>`).join("") : `<p class="muted center-text">${tab === "open" ? "Aucune intention pour l'instant." : "Les prières exaucées apparaîtront ici."}</p>`}` + nav("plus");
  $app.querySelectorAll("[data-story]").forEach((b) => b.onclick = () => prayerToStory(Store.get(`prayers/${b.dataset.story}`)));
  $app.querySelector("#add").onclick = () => { const v = $app.querySelector("#pr").value.trim(); if (v) addPrayer(v); };
  $app.querySelectorAll("[data-t]").forEach((b) => b.onclick = () => { ui.journalTab = b.dataset.t; renderJournal(); });
  $app.querySelectorAll("[data-done]").forEach((b) => b.onclick = async () => {
    const k = `prayers/${b.dataset.done}`;
    await Store.set(k, { ...Store.get(k), answered: true, answeredAt: Date.now() });
    confetti(); renderJournal();
  });
}
