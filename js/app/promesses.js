// Promesses
// ---------- ✍️ Promesses ----------
async function addPromise(text, couple, week) {
  await Store.set(`promises/${newId()}`, { text, couple: !!couple, by: me, at: Date.now(), week: week || null, signed: couple ? { [me]: Date.now() } : null });
  toast(couple ? "Promesse ajoutée : à signer à deux ✍️" : "Promesse ajoutée ✍️");
}
function promiseHTML(p) {
  const signed = p.signed || {}, wk = p.week && WK[p.week], sealed = p.couple && signed.a && signed.b;
  return `<article class="card promise ${sealed ? "sealed" : ""}">
    ${sealed ? `<span class="seal" title="Signée par vous deux">💞</span>` : ""}
    <p class="promise-txt">« ${esc(p.text)} »</p>
    <div class="pi-head small muted">${avatar(p.by, "sm")} ${esc(P(p.by).name)} · ${fmtDate(p.at)}${wk ? ` · ${esc(weekLabel(wk))}` : ""}</div>
    ${p.couple ? `<div class="signs">${["a", "b"].map((u) => signed[u]
      ? `<span class="sign on">${avatar(u, "sm")} Signé</span>`
      : u === me ? `<button class="sign" data-sign="${p.id}">${avatar(u, "sm")} Signer ✍️</button>` : `<span class="sign">${avatar(u, "sm")} Pas encore signé</span>`).join("")}</div>` : ""}
    ${p.by === me ? `<button class="link danger" data-del-promise="${p.id}">Supprimer</button>` : ""}
  </article>`;
}
function renderPromesses() {
  const all = listOf("promises/").sort((a, b) => b.at - a.at);
  const couple = all.filter((p) => p.couple), perso = all.filter((p) => !p.couple);
  $app.innerHTML = pageHead("Ensemble", "Nos promesses", "#/plus") + `
    <section class="card">
      <textarea id="prT" rows="2" placeholder="Une promesse, un engagement que vous voulez garder…"></textarea>
      <label class="check-row"><input type="checkbox" id="prC" checked> Promesse de couple (à signer tous les deux)</label>
      <button class="btn full" id="prAdd">Ajouter</button>
    </section>
    <h2 class="section">💞 Promesses de couple</h2>
    ${couple.length ? couple.map(promiseHTML).join("") : `<p class="muted small">Aucune pour l'instant. Les défis de certaines semaines vous en feront écrire !</p>`}
    <h2 class="section">🙋 Promesses personnelles</h2>
    ${perso.length ? perso.map(promiseHTML).join("") : `<p class="muted small">Aucune pour l'instant.</p>`}` + nav("plus");
  $app.querySelector("#prAdd").onclick = async () => {
    const v = $app.querySelector("#prT").value.trim(); if (!v) return;
    await addPromise(v, $app.querySelector("#prC").checked); render();
  };
  bindPromises($app);
}
function bindPromises(root) {
  root.querySelectorAll("[data-sign]").forEach((b) => b.onclick = async () => {
    const k = `promises/${b.dataset.sign}`, p = Store.get(k);
    const signed = { ...(p.signed || {}), [me]: Date.now() };
    await Store.set(k, { ...p, signed });
    if (signed.a && signed.b) confetti(); render();
  });
  root.querySelectorAll("[data-del-promise]").forEach((b) => b.onclick = async () => {
    if (!confirm("Supprimer cette promesse ?")) return;
    await Store.remove(`promises/${b.dataset.delPromise}`); render();
  });
}
