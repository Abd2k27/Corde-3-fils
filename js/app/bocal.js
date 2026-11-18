// Bocal à idées
// ---------- 🫙 Bocal à idées de sorties ----------
const IDEA_CATS = [["maison", "🏠", "À la maison"], ["dehors", "🌳", "Dehors"], ["resto", "🍽️", "Resto / café"], ["gratuit", "💸", "Gratuit"], ["sport", "⚽", "Sport"], ["foi", "🙏", "Foi"], ["escapade", "✈️", "Escapade"]];
const ideaBy = (x) => (x.by ? esc(P(x.by).name) : "Notre liste 💞");
// « Coller une liste » : une idée par ligne, astuce facultative après un tiret long ( — ) ou une barre ( | ).
// Une ligne peut commencer par l'emoji d'une catégorie (⚽ …) ; puces et cases « - [ ] » sont ignorées.
const noVS = (t) => t.replace(/\uFE0F/g, "");
function parseIdeas(raw, defCat) {
  return raw.split("\n").map((l) => l.trim().replace(/^[-*•]\s*(\[[ xX]?\]\s*)?/, "").trim()).filter(Boolean).map((l) => {
    let cat = defCat;
    const c = IDEA_CATS.find(([, e]) => noVS(l).startsWith(noVS(e)));
    if (c) { cat = c[0]; l = noVS(l).slice(noVS(c[1]).length).trim(); }
    const m = l.match(/\s(?:—|–|\||-)\s/);
    const text = (m ? l.slice(0, m.index) : l).trim(), tip = m ? l.slice(m.index + m[0].length).trim() : "";
    return { text: text.slice(0, 160), tip: tip.slice(0, 400), cat };
  }).filter((x) => x.text);
}
const catOf = (c) => IDEA_CATS.find((x) => x[0] === c) || ["", "💡", "Idée"];
function renderBocal() {
  const all = listOf("idees/").sort((a, b) => b.at - a.at);
  const todo = all.filter((x) => !x.done), done = all.filter((x) => x.done).sort((a, b) => b.doneAt - a.doneAt);
  const cat = ui.bocalCat || "all", pool = todo.filter((x) => cat === "all" || x.cat === cat);
  const pick = Store.get("idees-tirage"), picked = pick && todo.find((x) => x.id === pick.id);
  const anim = ui.bocalAnim; ui.bocalAnim = false;
  $app.innerHTML = pageHead("Ensemble", "Bocal à idées", "#/plus") + `<div class="split"><div class="split-a">
    <section class="card jar-card">
      <div class="jar" id="jar" aria-hidden="true"><span class="jar-glass">🫙</span>${todo.slice(0, 7).map((_, i) => `<i class="paper p${i}"></i>`).join("")}</div>
      <p class="center-text muted small">${todo.length ? `${todo.length} idée${todo.length > 1 ? "s" : ""} dans le bocal` : "Le bocal est vide : ajoutez vos premières idées !"}</p>
      <div class="cat-filter">${[["all", "✨", "Toutes"], ...IDEA_CATS].map(([v, e, l]) => `<button class="chip-btn ${cat === v ? "on" : ""}" data-cat="${v}">${e} ${l}</button>`).join("")}</div>
      <button class="btn full" id="draw" ${pool.length ? "" : "disabled"}>🎲 Tirer une idée au hasard</button>
      ${picked ? `<div class="idea-paper ${anim ? "unfold" : ""}">
        <div class="eyebrow">${catOf(picked.cat)[1]} ${esc(catOf(picked.cat)[2])} · tirée par ${esc(P(pick.by).name)}</div>
        <p class="idea-txt">${esc(picked.text)}</p>
        ${picked.tip ? `<p class="idea-tip">💡 ${esc(picked.tip)}</p>` : ""}
        <div class="row between"><button class="btn sm" id="ideaDone">✔ On l'a fait !</button><button class="link" id="ideaAgain">Une autre</button></div>
      </div>` : ""}
    </section></div><div class="split-b">
    <section class="card">
      <div class="eyebrow">➕ Ajouter une idée</div>
      <input id="idT" placeholder="Pique-nique au bord du lac, soirée crêpes, musée…" maxlength="160">
      <select id="idC">${IDEA_CATS.map(([v, e, l]) => `<option value="${v}">${e} ${l}</option>`).join("")}</select>
      <textarea id="idTip" rows="2" maxlength="400" placeholder="💡 Astuce (facultatif) : ce qu'il faut prévoir, comment s'y prendre…"></textarea>
      <button class="btn full" id="idAdd">Mettre dans le bocal</button>
    </section>
    <details class="card idea-paste"><summary>📋 Coller une liste d'idées</summary>
      <p class="small muted">Une idée par ligne. Astuce facultative après un tiret long : <em>Pique-nique au parc — prendre une nappe</em>. Une ligne peut commencer par l'emoji d'une catégorie (⚽, 🙏…), sinon c'est la catégorie choisie ci-dessous.</p>
      <textarea id="ipT" rows="7" placeholder="- Danser un zouk — tuto débutant au salon\n- ⚽ Faire du basket\n- Soirée crêpes"></textarea>
      <select id="ipC">${IDEA_CATS.map(([v, e, l]) => `<option value="${v}">Par défaut : ${e} ${l}</option>`).join("")}</select>
      <p class="small muted" id="ipPrev"></p>
      <button class="btn full" id="ipAdd" disabled>Ajouter au bocal</button>
    </details>
    ${todo.length ? `<details class="card idea-list" ${ui.ideaListOpen ? "open" : ""}><summary>Voir les idées du bocal (${todo.length})</summary>
      ${todo.map((x) => ui.ideaEdit === x.id ? `<div class="idea-edit">
        <input id="ieT" value="${esc(x.text)}" maxlength="160" aria-label="Idée">
        <select id="ieC">${IDEA_CATS.map(([v, e, l]) => `<option value="${v}" ${x.cat === v ? "selected" : ""}>${e} ${l}</option>`).join("")}</select>
        <textarea id="ieTip" rows="3" maxlength="400" placeholder="💡 Astuce (facultatif)">${esc(x.tip || "")}</textarea>
        <div class="row between"><button class="btn ghost sm" id="ieCancel">Annuler</button><button class="btn sm" id="ieSave">Enregistrer</button></div>
      </div>` : `<div class="idea-row"><span>${catOf(x.cat)[1]}</span><span class="grow">${esc(x.text)}${x.tip ? `<span class="idea-tip small">💡 ${esc(x.tip)}</span>` : ""}<span class="small muted">${ideaBy(x)} · ${fmtDate(x.at)}</span></span><span class="row-actions"><button class="link" data-idea-edit="${x.id}">Modifier</button><button class="link danger" data-idea-del="${x.id}">Retirer</button></span></div>`).join("")}
    </details>` : ""}
    ${done.length ? `<h2 class="section">✔ Déjà faites</h2>${done.map((x) => `<div class="card idea-row done"><span>${catOf(x.cat)[1]}</span><span class="grow">${esc(x.text)}<br><span class="small muted">Faite le ${fmtDate(x.doneAt)}</span></span><button class="link" data-idea-back="${x.id}">Remettre</button></div>`).join("")}` : ""}</div></div>` + nav("plus");

  $app.querySelectorAll("[data-cat]").forEach((b) => b.onclick = () => { ui.bocalCat = b.dataset.cat; renderBocal(); });
  const ipT = $app.querySelector("#ipT"), ipC = $app.querySelector("#ipC"), ipAdd = $app.querySelector("#ipAdd"), ipPrev = $app.querySelector("#ipPrev");
  const known = new Set(all.map((x) => x.text.trim().toLowerCase()));
  const pasted = () => parseIdeas(ipT.value, ipC.value).filter((x, i, arr) => !known.has(x.text.toLowerCase()) && arr.findIndex((y) => y.text.toLowerCase() === x.text.toLowerCase()) === i);
  const preview = () => {
    const list = pasted(), total = parseIdeas(ipT.value, ipC.value).length, skip = total - list.length;
    ipPrev.textContent = total ? `${list.length} idée${list.length > 1 ? "s" : ""} à ajouter${list.filter((x) => x.tip).length ? `, dont ${list.filter((x) => x.tip).length} avec astuce` : ""}${skip ? ` · ${skip} déjà dans le bocal (ignorée${skip > 1 ? "s" : ""})` : ""}` : "";
    ipAdd.disabled = !list.length;
  };
  ipT.oninput = preview; ipC.onchange = preview;
  ipAdd.onclick = async () => {
    const list = pasted(); if (!list.length) return;
    ipAdd.disabled = true; ipAdd.textContent = "Ajout en cours…";
    const base = Date.now();
    for (const [i, x] of list.entries()) await Store.set(`idees/${newId()}`, { ...x, by: me, at: base + i, done: false });
    toast(`🫙 ${list.length} idée${list.length > 1 ? "s" : ""} ajoutée${list.length > 1 ? "s" : ""} au bocal`); renderBocal();
  };
  // modification sur place d'une idée
  $app.querySelectorAll("[data-idea-edit]").forEach((b) => b.onclick = () => { ui.ideaEdit = b.dataset.ideaEdit; ui.ideaListOpen = true; renderBocal(); $app.querySelector("#ieT")?.focus(); });
  const ieSave = $app.querySelector("#ieSave");
  if (ieSave) {
    $app.querySelector("#ieCancel").onclick = () => { ui.ideaEdit = null; renderBocal(); };
    ieSave.onclick = async () => {
      const k = `idees/${ui.ideaEdit}`, text = $app.querySelector("#ieT").value.trim(); if (!text) return toast("L'idée ne peut pas être vide");
      await Store.set(k, { ...Store.get(k), text, cat: $app.querySelector("#ieC").value, tip: $app.querySelector("#ieTip").value.trim(), editedAt: Date.now() });
      ui.ideaEdit = null; toast("Idée modifiée ✏️"); renderBocal();
    };
  }
  $app.querySelector("#idAdd").onclick = async () => {
    const t = $app.querySelector("#idT").value.trim(); if (!t) return;
    await Store.set(`idees/${newId()}`, { text: t, cat: $app.querySelector("#idC").value, tip: $app.querySelector("#idTip").value.trim(), by: me, at: Date.now(), done: false });
    toast("Idée ajoutée au bocal 🫙"); renderBocal();
  };
  $app.querySelector("#draw").onclick = () => {
    const choices = pool.length > 1 && picked ? pool.filter((x) => x.id !== picked.id) : pool;
    if (!choices.length) return;
    const choice = choices[Math.floor(Math.random() * choices.length)];
    const jar = $app.querySelector("#jar"); jar.classList.remove("shake-jar"); void jar.offsetWidth; jar.classList.add("shake-jar");
    $app.querySelector("#draw").disabled = true;
    ui.hold = Date.now() + 2200;
    setTimeout(async () => {
      await Store.set("idees-tirage", { id: choice.id, by: me, at: Date.now() });
      ui.bocalAnim = true; renderBocal();
    }, 1000);
  };
  const dn = $app.querySelector("#ideaDone");
  if (dn) dn.onclick = async () => {
    await Store.set(`idees/${picked.id}`, { ...Store.get(`idees/${picked.id}`), done: true, doneAt: Date.now() });
    await Store.remove("idees-tirage"); confetti();
    if (confirm("Ajouter ce moment à votre histoire ?")) {
      await Store.set(`story/${newId()}`, { date: todayStr(), emoji: catOf(picked.cat)[1], title: picked.text, text: "", by: me, at: Date.now(), hasPhoto: false });
      toast("Ajouté à votre histoire 📸");
    }
    renderBocal();
  };
  const ag = $app.querySelector("#ideaAgain"); if (ag) ag.onclick = () => $app.querySelector("#draw").click();
  $app.querySelectorAll("[data-idea-del]").forEach((b) => b.onclick = async () => {
    if (!confirm("Retirer cette idée du bocal ?")) return;
    await Store.remove(`idees/${b.dataset.ideaDel}`); renderBocal();
  });
  $app.querySelectorAll("[data-idea-back]").forEach((b) => b.onclick = async () => {
    const k = `idees/${b.dataset.ideaBack}`; await Store.set(k, { ...Store.get(k), done: false, doneAt: null }); renderBocal();
  });
}
