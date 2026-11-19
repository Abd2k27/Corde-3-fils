// Page « Plus » et sauvegarde
// ---------- ☰ Plus ----------
function renderPlus() {
  const tiles = [
    ["#/journal", "🙏", "Journal de prière", "Vos intentions et les prières exaucées"],
    ["#/promesses", "✍️", "Nos promesses", "Les engagements que vous avez signés"],
    ["#/lettres", "💌", "Lettres", "À ouvrir plus tard"],
    ["#/bocal", "🫙", "Bocal à idées", "Vos idées de sorties, tirées au hasard"],
    ["#/dates", "📅", "Nos dates", "Anniversaires et comptes à rebours"],
    ["#/creer", "✨", "Créer une semaine", "Vos propres thèmes et passages"],
    ["#/guide", "❓", "Comment ça marche", "Revoir le guide"]
  ];
  $app.innerHTML = pageHead("Ensemble", "Plus") + `
    <div class="tiles">${tiles.map(([h, i, t, d]) => `<a class="tile" href="${h}"><span>${i}</span><strong>${t}</strong><small>${d}</small></a>`).join("")}</div>
    <h2 class="section">📊 Bilans des parcours</h2>
    <div class="bilans">${PARCOURS.filter((x) => x.weeks.length).map((x) => { const d = parcoursDone(x); return `<a class="week" href="#/bilan/${x.id}">
      <span class="week-emoji">${x.emoji}</span><span class="week-txt"><strong>${esc(x.title)}</strong><span class="pc-prog"><span style="width:${Math.round((d / x.weeks.length) * 100)}%"></span></span></span>
      <span class="chip ${d === x.weeks.length ? "done" : ""}">${d === x.weeks.length ? "Terminé 🎉" : `${d}/${x.weeks.length}`}</span></a>`; }).join("")}</div>
    ${rythmeSettingsHTML()}
    <h2 class="section">🌓 Apparence</h2>
    <div class="tabs">${THEMES.map(([v, l]) => `<button data-theme-set="${v}" class="${getTheme() === v ? "on" : ""}">${l}</button>`).join("")}</div>
    <p class="small muted pc-desc">Auto suit le réglage de ton appareil · « Le soir » passe en sombre de 20 h à 7 h.</p>
    <label class="check-row pc-desc"><input type="checkbox" id="liteFx" ${getLite() ? "checked" : ""}> Effets réduits : verre sans flou et animations limitées (si le site rame sur ton téléphone)</label>
    <footer class="foot small muted">
      Joueur : <strong>${esc(P(me).name)}</strong> · ${FB ? `<a href="#" id="logout">se déconnecter</a>` : `<a href="#/joueur">changer</a>`}
      ${Store.mode === "local" ? ` · <a href="#" id="reset">réinitialiser (test)</a>` : ""}
      <div><a href="#" id="export">💾 Télécharger une sauvegarde de nos données</a></div>
      <div>Texte biblique : Louis Segond 1910</div>
    </footer>` + nav("plus");
  const lo = document.getElementById("logout");
  if (lo) lo.onclick = (e) => { e.preventDefault(); Store.signOut(); };
  document.getElementById("export").onclick = (e) => { e.preventDefault(); exportData(); };
  bindRythmeSettings();
  $app.querySelector("#liteFx").onchange = (e) => { try { localStorage.setItem(LITE_KEY, e.target.checked ? "1" : "0"); } catch (x) {} applyTheme(); };
  $app.querySelectorAll("[data-theme-set]").forEach((b) => b.onclick = () => {
    try { localStorage.setItem(THEME_KEY, b.dataset.themeSet); } catch (e) {}
    applyTheme(); renderPlus();
  });
  const rs = document.getElementById("reset");
  if (rs) rs.onclick = async (e) => {
    e.preventDefault();
    if (!confirm("Effacer toutes les données de test ?")) return;
    await Store.reset();
    Object.keys(localStorage).filter((k) => k.startsWith("bc-draft-") || k.startsWith("bc-blob-")).forEach((k) => localStorage.removeItem(k));
    go("#/"); render();
  };
}

// Sauvegarde JSON de toutes les données partagées (+ photos si demandé)
async function exportData() {
  const out = { app: CFG.appName, exportedAt: new Date().toISOString(), data: {} };
  Store.list("").forEach(({ path, value }) => { out.data[path] = value; });
  const ids = Store.list("story/").filter((x) => x.value && x.value.hasPhoto).map((x) => x.path.slice(6));
  if (ids.length && confirm(`Inclure les ${ids.length} photo(s) ? (fichier plus lourd)`)) {
    toast("Récupération des photos…");
    out.photos = {};
    for (const id of ids) { try { out.photos[id] = await Store.getBlob(id); } catch (e) { console.warn("photo", id, e); } }
  }
  downloadFile(`corde-a-trois-fils-${todayStr()}.json`, JSON.stringify(out, null, 1), "application/json");
  toast("Sauvegarde téléchargée 💾");
}
