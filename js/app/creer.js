// Créer une semaine
// ---------- ✨ Créer une semaine ----------
const BOOKS = ["Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome", "Josué", "Juges", "Ruth", "1 Samuel", "2 Samuel", "1 Rois", "2 Rois", "1 Chroniques", "2 Chroniques", "Esdras", "Néhémie", "Esther", "Job", "Psaumes", "Proverbes", "Ecclésiaste", "Cantique des cantiques", "Ésaïe", "Jérémie", "Lamentations", "Ézéchiel", "Daniel", "Osée", "Joël", "Amos", "Abdias", "Jonas", "Michée", "Nahum", "Habacuc", "Sophonie", "Aggée", "Zacharie", "Malachie", "Matthieu", "Marc", "Luc", "Jean", "Actes", "Romains", "1 Corinthiens", "2 Corinthiens", "Galates", "Éphésiens", "Philippiens", "Colossiens", "1 Thessaloniciens", "2 Thessaloniciens", "1 Timothée", "2 Timothée", "Tite", "Philémon", "Hébreux", "Jacques", "1 Pierre", "2 Pierre", "1 Jean", "2 Jean", "3 Jean", "Jude", "Apocalypse"];
const QTYPES = [["echelle", "Échelle 1 à 10"], ["tupref", "Tu préfères (A ou B)"], ["choix", "Choix multiple"], ["ouverte", "Question ouverte"]];
function blankCW() {
  return { emoji: "✨", title: "", intro: "", book: 1, chapter: 1, from: 1, to: 3, text: "", kw: "", kwHint: "", memoRef: "", memo: "", traps: "",
    questions: [{ type: "echelle", text: "", low: "Pas du tout", high: "Tout à fait" }, { type: "tupref", text: "", options: ["", ""] }, { type: "ouverte", text: "" }], defi: "", priere: "" };
}
function cwFromWeek(w) {
  const ps = w.passages[0] || {}, vs = Object.keys(ps.text || {}).map(Number);
  return { emoji: w.emoji, title: w.title, intro: w.intro || "", book: ps.book || 1, chapter: ps.chapter || 1, from: Math.min(...vs) || 1, to: Math.max(...vs) || 1,
    text: vs.map((v) => `${v} ${ps.text[v]}`).join("\n"), kw: w.keyword ? w.keyword.answers[0] : "", kwHint: w.keyword ? w.keyword.hint : "",
    memoRef: w.memo ? w.memo.ref : "", memo: w.memo ? w.memo.text : "", traps: w.memo ? w.memo.distractors.join(", ") : "",
    questions: JSON.parse(JSON.stringify(w.questions)), defi: w.defi || "", priere: w.priere || "" };
}
function collectCW() {
  const cw = ui.cw, $ = (s) => $app.querySelector(s);
  ["emoji", "title", "intro", "text", "kw", "kwHint", "memoRef", "memo", "traps", "defi", "priere"].forEach((k) => { const el = $(`[data-cw="${k}"]`); if (el) cw[k] = el.value; });
  ["book", "chapter", "from", "to"].forEach((k) => { const el = $(`[data-cw="${k}"]`); if (el) cw[k] = +el.value || 1; });
  cw.questions = cw.questions.map((q, i) => {
    const g = (f) => $(`[data-q="${i}"][data-f="${f}"]`);
    const nq = { type: g("type").value, text: g("text").value };
    if (nq.type === "echelle") { nq.low = g("low")?.value || "Pas du tout"; nq.high = g("high")?.value || "Tout à fait"; }
    if (nq.type === "tupref") nq.options = [g("A")?.value || "", g("B")?.value || ""];
    if (nq.type === "choix") nq.options = (g("opts")?.value || "").split("\n").map((s) => s.trim()).filter(Boolean);
    return nq;
  });
}
function questionEditor(q, i) {
  let extra = "";
  if (q.type === "echelle") extra = `<div class="row"><input data-q="${i}" data-f="low" value="${esc(q.low || "Pas du tout")}" placeholder="Valeur 1"><input data-q="${i}" data-f="high" value="${esc(q.high || "Tout à fait")}" placeholder="Valeur 10"></div>`;
  if (q.type === "tupref") extra = `<input data-q="${i}" data-f="A" value="${esc((q.options || [])[0] || "")}" placeholder="Option A"><input data-q="${i}" data-f="B" value="${esc((q.options || [])[1] || "")}" placeholder="Option B">`;
  if (q.type === "choix") extra = `<textarea data-q="${i}" data-f="opts" rows="4" placeholder="Une option par ligne (2 à 5)">${esc((q.options || []).join("\n"))}</textarea>`;
  return `<div class="q-edit">
    <div class="row between"><strong>Question ${i + 1}</strong><button class="link danger" data-qdel="${i}">Retirer</button></div>
    <select data-q="${i}" data-f="type">${QTYPES.map(([v, l]) => `<option value="${v}" ${q.type === v ? "selected" : ""}>${l}</option>`).join("")}</select>
    <input data-q="${i}" data-f="text" value="${esc(q.text)}" placeholder="Texte de la question (écris-la à la 1re personne : « Je… »)">
    ${extra}
  </div>`;
}
function parseVerses(text, from) {
  const out = {}; let n = from || 1;
  text.split("\n").map((l) => l.trim()).filter(Boolean).forEach((l) => {
    const m = l.match(/^(\d+)\s*[.|:)\-]?\s+(.+)$/);
    if (m) { out[+m[1]] = m[2]; n = +m[1] + 1; } else { out[n] = l; n++; }
  });
  return out;
}
function renderCreer(editId) {
  const mine = listOf("custom/").sort((a, b) => a.at - b.at);
  if (!ui.cw || ui.cwEdit !== (editId || null)) {
    const ex = editId && Store.get(`custom/${editId}`);
    ui.cw = ex ? cwFromWeek(ex) : blankCW(); ui.cwEdit = editId || null;
  }
  const cw = ui.cw;
  $app.innerHTML = pageHead("Nos semaines", editId ? "Modifier la semaine" : "Créer une semaine", "#/plus") + `
    ${!editId && mine.length ? `<section class="card"><div class="eyebrow">Vos semaines créées</div>
      ${mine.map((w) => `<div class="row between cw-item"><span>${esc(w.emoji)} ${esc(w.title)} <span class="small muted">· ${esc(P(w.by).name)}</span></span>
        <span><a class="link" href="#/semaine/perso-${w.id}">Jouer</a> · <a class="link" href="#/creer/${w.id}">Modifier</a></span></div>`).join("")}</section>` : ""}
    <section class="card form">
      <div class="eyebrow">1 · Le thème</div>
      <div class="row"><input data-cw="emoji" value="${esc(cw.emoji)}" class="emoji-in" maxlength="4"><input data-cw="title" value="${esc(cw.title)}" placeholder="Titre de la semaine" class="grow"></div>
      <textarea data-cw="intro" rows="3" placeholder="Une courte introduction (ce qu'on va découvrir)">${esc(cw.intro)}</textarea>
    </section>
    <section class="card form">
      <div class="eyebrow">2 · Le passage (Louis Segond 1910)</div>
      <select data-cw="book">${BOOKS.map((b, i) => `<option value="${i + 1}" ${cw.book === i + 1 ? "selected" : ""}>${b}</option>`).join("")}</select>
      <div class="row"><label class="mini">Chapitre<input type="number" min="1" data-cw="chapter" value="${cw.chapter}"></label><label class="mini">Du verset<input type="number" min="1" data-cw="from" value="${cw.from}"></label><label class="mini">Au verset<input type="number" min="1" data-cw="to" value="${cw.to}"></label></div>
      <button class="btn sm ghost" id="cwLoad">📖 Charger le texte</button>
      <textarea data-cw="text" rows="6" placeholder="Le texte apparaîtra ici (un verset par ligne : « 18 Texte du verset »). Tu peux aussi le coller ou l'écrire.">${esc(cw.text)}</textarea>
    </section>
    <section class="card form">
      <div class="eyebrow">3 · Le mot caché (facultatif)</div>
      <div class="row"><input data-cw="kw" value="${esc(cw.kw)}" placeholder="Mot à trouver"><input data-cw="kwHint" value="${esc(cw.kwHint)}" placeholder="Indice (ex. Verset 3 : …)"></div>
    </section>
    <section class="card form">
      <div class="eyebrow">4 · Le verset à retenir (facultatif)</div>
      <input data-cw="memoRef" value="${esc(cw.memoRef)}" placeholder="Référence (ex. Jean 3:16)">
      <textarea data-cw="memo" rows="3" placeholder="Mets les mots à cacher entre crochets : Car Dieu a tant [aimé] le monde…">${esc(cw.memo)}</textarea>
      <input data-cw="traps" value="${esc(cw.traps)}" placeholder="Mots pièges, séparés par des virgules (ex. joie, paix)">
    </section>
    <section class="card form">
      <div class="eyebrow">5 · Les questions « Devine ma réponse »</div>
      ${cw.questions.map(questionEditor).join("")}
      ${cw.questions.length < 6 ? `<button class="btn sm ghost" id="cwAddQ">+ Ajouter une question</button>` : ""}
    </section>
    <section class="card form">
      <div class="eyebrow">6 · Défi et prière</div>
      <textarea data-cw="defi" rows="2" placeholder="Le défi de la semaine">${esc(cw.defi)}</textarea>
      <textarea data-cw="priere" rows="2" placeholder="Une prière à dire ensemble">${esc(cw.priere)}</textarea>
    </section>
    <button class="btn full" id="cwSave">${editId ? "Enregistrer les modifications" : "Créer la semaine ✨"}</button>
    ${editId ? `<button class="btn ghost full danger-btn" id="cwDel">Supprimer cette semaine</button>` : ""}
    <div class="nav-space"></div>`;

  $app.querySelectorAll('[data-f="type"]').forEach((s) => s.onchange = () => { collectCW(); renderCreer(editId); });
  $app.querySelectorAll("[data-qdel]").forEach((b) => b.onclick = () => { collectCW(); cw.questions.splice(+b.dataset.qdel, 1); renderCreer(editId); });
  const addQ = $app.querySelector("#cwAddQ"); if (addQ) addQ.onclick = () => { collectCW(); cw.questions.push({ type: "choix", text: "", options: [] }); renderCreer(editId); };
  $app.querySelector("#cwLoad").onclick = async (e) => {
    collectCW(); e.target.textContent = "Chargement…";
    const ch = await Bible.chapter(cw.book, cw.chapter);
    if (!ch) { e.target.textContent = "📖 Charger le texte"; return toast("Texte introuvable (hors ligne ?) : colle-le à la main"); }
    const lines = []; for (let v = cw.from; v <= Math.max(cw.from, cw.to); v++) if (ch[v]) lines.push(`${v} ${ch[v]}`);
    if (!lines.length) { e.target.textContent = "📖 Charger le texte"; return toast("Ces versets n'existent pas dans ce chapitre"); }
    cw.text = lines.join("\n"); renderCreer(editId);
  };
  $app.querySelector("#cwSave").onclick = async () => {
    collectCW();
    if (!cw.title.trim()) return toast("Il manque le titre");
    const text = parseVerses(cw.text, cw.from);
    if (!Object.keys(text).length) return toast("Il manque le texte du passage");
    const qs = cw.questions.filter((q) => q.text.trim());
    if (!qs.length) return toast("Ajoute au moins une question");
    for (const q of qs) {
      if (q.type === "tupref" && (!q.options[0].trim() || !q.options[1].trim())) return toast("Une question « Tu préfères » n'a pas ses 2 options");
      if (q.type === "choix" && q.options.length < 2) return toast("Une question à choix multiple a moins de 2 options");
    }
    const blanks = [...cw.memo.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
    if (cw.memo.trim() && !blanks.length) return toast("Verset à retenir : mets au moins un mot entre [crochets]");
    let traps = cw.traps.split(",").map((s) => s.trim()).filter((s) => s && !blanks.includes(s));
    ["foi", "joie", "paix", "vie"].forEach((d) => { if (traps.length < 2 && !blanks.includes(d) && !traps.includes(d)) traps.push(d); });
    const vs = Object.keys(text).map(Number), ref = `${BOOKS[cw.book - 1]} ${cw.chapter}:${Math.min(...vs)}${vs.length > 1 ? "-" + Math.max(...vs) : ""}`;
    const id = editId || newId(), prev = editId ? Store.get(`custom/${editId}`) : null;
    const data = {
      emoji: cw.emoji.trim() || "✨", title: cw.title.trim(), intro: cw.intro.trim(),
      passages: [{ ref, book: cw.book, chapter: cw.chapter, text }],
      keyword: cw.kw.trim() ? { answers: [cw.kw.trim()], hint: cw.kwHint.trim() || "Trouve le mot caché dans le passage." } : null,
      memo: blanks.length ? { ref: cw.memoRef.trim() || ref, text: cw.memo.trim(), distractors: traps } : null,
      questions: qs.map((q, i) => ({ ...q, id: "q" + (i + 1), text: q.text.trim() })),
      defi: cw.defi.trim() || "Prenez un moment cette semaine pour reparler de ce thème ensemble.",
      priere: cw.priere.trim() || "Seigneur, merci pour ta Parole. Fais-nous grandir ensemble.",
      by: prev ? prev.by : me, at: prev ? prev.at : Date.now(), editedAt: Date.now()
    };
    await Store.set(`custom/${id}`, data);
    ui.cw = null; ui.cwEdit = null; curP = "perso"; localStorage.setItem("bc-parcours", "perso");
    toast(editId ? "Semaine modifiée ✨" : "Semaine créée ✨"); go("#/");
  };
  const del = $app.querySelector("#cwDel");
  if (del) del.onclick = async () => {
    if (!confirm("Supprimer cette semaine (et les réponses associées restent archivées) ?")) return;
    await Store.remove(`custom/${editId}`); ui.cw = null; ui.cwEdit = null; go("#/creer");
  };
}
