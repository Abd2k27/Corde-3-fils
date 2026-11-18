// Notre histoire (frise + photos)
// ---------- 📸 Notre histoire ----------
const blobCache = {};
function compressImage(file) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      let max = 1280, q = 0.8, out = "";
      const c = document.createElement("canvas");
      for (let i = 0; i < 7; i++) {
        const r = Math.min(1, max / Math.max(img.width, img.height));
        c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        out = c.toDataURL("image/jpeg", q);
        if (out.length < 650000) break;
        max *= 0.8; q = Math.max(0.5, q - 0.07);
      }
      URL.revokeObjectURL(url); res(out);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("Image illisible")); };
    img.src = url;
  });
}
const MOMENT_EMOJIS = ["💞", "🎉", "🙏", "✨", "🌍", "🎂", "💍", "🏠", "⛪", "🌹"];
function renderHistoire() {
  const items = listOf("story/").sort((a, b) => a.date.localeCompare(b.date) || a.at - b.at);
  const f = ui.storyForm;
  let lastYear = null;
  const timeline = items.map((m) => {
    const y = m.date.slice(0, 4), sep = y !== lastYear ? `<div class="year">${y}</div>` : ""; lastYear = y;
    return sep + `<article class="moment">
      <div class="m-dot">${esc(m.emoji || "💞")}</div>
      <div class="card m-card">
        <div class="eyebrow">${fmtDay(m.date)}</div>
        <h3>${esc(m.title)}</h3>
        ${m.text ? `<p>${esc(m.text)}</p>` : ""}
        ${m.hasPhoto ? `<img class="m-photo" data-photo="${m.id}" alt="">` : ""}
        <div class="row between small muted"><span>${avatar(m.by, "sm")} ajouté par ${esc(P(m.by).name)}</span><span class="row-actions"><button class="link" data-edit-story="${m.id}">Modifier</button>${m.by === me ? `<button class="link danger" data-del-story="${m.id}">Supprimer</button>` : ""}</span></div>
      </div>
    </article>`;
  }).join("");
  $app.innerHTML = pageHead("Votre frise", "Notre histoire") + (f ? `
    <section class="card">
      <h3>${f.edit ? "✏️ Modifier le moment" : "Nouveau moment"}</h3>
      <input type="date" id="sD" value="${esc(f.date || todayStr())}">
      <div class="emoji-pick">${MOMENT_EMOJIS.map((e, i) => `<button class="${(f.emoji || "💞") === e ? "on" : ""}" data-em="${e}">${e}</button>`).join("")}</div>
      <input id="sT" placeholder="Titre (ex. Notre rencontre, Premier culte ensemble…)" value="${esc(f.title || "")}">
      <textarea id="sX" rows="3" placeholder="Raconte ce moment…">${esc(f.text || "")}</textarea>
      ${f.edit && f.hasPhoto && !f.removePhoto && !f.photo ? `<img class="m-photo" data-photo="${f.edit}" alt=""><button class="link danger" id="sRmPhoto">Retirer la photo</button><br>` : ""}
      <label class="photo-in">📷 ${f.edit && f.hasPhoto && !f.removePhoto ? "Changer la photo" : "Ajouter une photo"}<input type="file" id="sP" accept="image/*" hidden></label>
      <img id="sPrev" class="m-photo" ${f.photo ? `src="${f.photo}"` : "hidden"} alt="">
      <div class="row between"><button class="btn ghost sm" id="sCancel">Annuler</button><button class="btn sm" id="sSave">Enregistrer</button></div>
    </section>` : `<button class="btn full" id="sNew">+ Ajouter un moment</button>`) + `
    ${timeline ? `<div class="timeline">${timeline}</div>` : `<p class="muted center-text small" style="margin-top:20px">Votre histoire commence ici : ajoutez votre rencontre, vos premières fois, vos prières exaucées…</p>`}` + nav("histoire");

  const nw = $app.querySelector("#sNew"); if (nw) nw.onclick = () => { ui.storyForm = { emoji: "💞" }; renderHistoire(); };
  if (f) {
    $app.querySelectorAll("[data-em]").forEach((b) => b.onclick = () => { f.emoji = b.dataset.em; $app.querySelectorAll("[data-em]").forEach((x) => x.classList.toggle("on", x === b)); });
    $app.querySelector("#sCancel").onclick = () => { ui.storyForm = null; renderHistoire(); };
    $app.querySelector("#sP").onchange = async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try { f.photo = await compressImage(file); keep(); renderHistoire(); } // la nouvelle photo remplace l'ancienne à l'écran
      catch (err) { toast("Photo illisible"); }
    };
    const keep = () => { f.date = $app.querySelector("#sD").value; f.title = $app.querySelector("#sT").value; f.text = $app.querySelector("#sX").value; };
    const rm = $app.querySelector("#sRmPhoto"); if (rm) rm.onclick = () => { keep(); f.removePhoto = true; renderHistoire(); };
    $app.querySelector("#sSave").onclick = async (e) => {
      const title = $app.querySelector("#sT").value.trim(); if (!title) return toast("Donne un titre au moment");
      e.target.disabled = true; e.target.textContent = "Enregistrement…";
      const id = f.edit || newId(), old = f.edit ? Store.get(`story/${id}`) || {} : null;
      try {
        if (f.photo) { await Store.setBlob(id, f.photo); blobCache[id] = f.photo; }
        else if (old && old.hasPhoto && f.removePhoto) { await Store.removeBlob(id).catch(() => {}); delete blobCache[id]; }
        const hasPhoto = !!f.photo || !!(old && old.hasPhoto && !f.removePhoto);
        const vals = { date: $app.querySelector("#sD").value || todayStr(), emoji: f.emoji || "💞", title, text: $app.querySelector("#sX").value.trim(), hasPhoto };
        await Store.set(`story/${id}`, old ? { ...old, ...vals, editedAt: Date.now() } : { ...vals, by: me, at: Date.now() });
        ui.storyForm = null; toast(old ? "Moment modifié ✏️" : "Moment ajouté 📸"); render();
      } catch (err) { toast("Erreur : " + err.message); e.target.disabled = false; e.target.textContent = "Enregistrer"; }
    };
  }
  $app.querySelectorAll("[data-photo]").forEach((img) => {
    const id = img.dataset.photo;
    if (blobCache[id]) img.src = blobCache[id];
    else Store.getBlob(id).then((src) => { if (src) { blobCache[id] = src; img.src = src; } }).catch(() => {});
  });
  $app.querySelectorAll("[data-edit-story]").forEach((b) => b.onclick = () => {
    const m = Store.get(`story/${b.dataset.editStory}`); if (!m) return;
    ui.storyForm = { edit: b.dataset.editStory, emoji: m.emoji, date: m.date, title: m.title, text: m.text, hasPhoto: m.hasPhoto };
    renderHistoire(); window.scrollTo({ top: 0, behavior: "smooth" });
  });
  $app.querySelectorAll("[data-del-story]").forEach((b) => b.onclick = async () => {
    if (!confirm("Supprimer ce moment ?")) return;
    const id = b.dataset.delStory, m = Store.get(`story/${id}`);
    if (m && m.hasPhoto) await Store.removeBlob(id).catch(() => {});
    await Store.remove(`story/${id}`); render();
  });
}
async function prayerToStory(p) {
  await Store.set(`story/${newId()}`, { date: todayStr(), emoji: "🙏", title: "Prière exaucée", text: p.text, by: me, at: Date.now(), hasPhoto: false });
  toast("Ajoutée à votre histoire 📸");
}
