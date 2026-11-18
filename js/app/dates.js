// Nos dates
// ---------- 📅 Nos dates ----------
const DATE_EMOJIS = ["💞", "💍", "🎂", "⛪", "🌹", "✈️", "🏡", "🎉"];
// Prochaine occurrence : chaque année pour un anniversaire, sinon la date elle-même
function nextOcc(d) {
  if (!d.recurring) return { day: d.date, years: null };
  const o = parseDay(d.date), t = parseDay(todayStr());
  let y = t.getFullYear(), n = new Date(y, o.getMonth(), o.getDate());
  if (n < t) n = new Date(++y, o.getMonth(), o.getDate());
  return { day: todayStr(n), years: y - o.getFullYear() };
}
const datesInfo = () => listOf("dates/").filter((d) => d.date).map((d) => { const n = nextOcc(d); return { ...d, next: n.day, years: n.years, inDays: daysUntil(n.day), remind: d.remind ?? 7 }; });
const yearsLbl = (d) => (d.years > 0 ? ` · ${d.years} an${d.years > 1 ? "s" : ""}` : "");
const cdNum = (d) => d.inDays === 0 ? `<div class="cd-num today"><b>🎉</b><span>aujourd'hui</span></div>`
  : d.inDays > 0 ? `<div class="cd-num"><b>${d.inDays}</b><span>jour${d.inDays > 1 ? "s" : ""}</span></div>`
  : `<div class="cd-num past"><span>il y a</span><b>${-d.inDays}</b><span>jour${d.inDays < -1 ? "s" : ""}</span></div>`;
// Carte(s) compte à rebours de l'accueil : toutes les dates dans leur fenêtre de rappel, sinon la plus proche
function countdownHTML() {
  const up = datesInfo().filter((d) => d.inDays >= 0).sort((a, b) => a.inDays - b.inDays);
  const soon = up.filter((d) => d.inDays <= d.remind), shown = soon.length ? soon : up.slice(0, 1);
  shown.filter((d) => d.inDays === 0).forEach((d) => {
    const k = `bc-fete-${d.id}-${todayStr()}`;
    try { if (!localStorage.getItem(k)) { localStorage.setItem(k, "1"); setTimeout(confetti, 400); } } catch (e) {}
  });
  return shown.map((d) => `<a class="card countdown ${d.inDays <= d.remind ? "soon" : ""}" href="#/dates">
    <span class="cd-emoji">${esc(d.emoji || "📅")}</span>
    <div class="grow"><div class="eyebrow">${d.inDays === 0 ? "C'est aujourd'hui !" : d.inDays <= d.remind ? "⏰ Rappel" : "Prochaine date"}</div>
      <strong>${esc(d.title)}</strong><div class="small muted">${fmtDay(d.next, { weekday: "long", day: "numeric", month: "long" })}${yearsLbl(d)}</div></div>
    ${cdNum(d)}</a>`).join("");
}
function downloadFile(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
// Fichier .ics : ajoute la date au calendrier du téléphone, avec un vrai rappel X jours avant et le jour même
function icsFor(d) {
  const icsEsc = (s) => String(s).replace(/[\\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
  const start = d.recurring ? d.date : d.next, end = new Date(parseDay(start).getTime() + 864e5 + 36e5);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//La corde a trois fils//FR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${d.id}@corde-a-trois-fils`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${start.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${todayStr(end).replace(/-/g, "")}`,
    `SUMMARY:${icsEsc(`${d.emoji || ""} ${d.title}`.trim())}`, ...(d.recurring ? ["RRULE:FREQ=YEARLY"] : []),
    "BEGIN:VALARM", `TRIGGER:-P${d.remind}D`, "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(`${d.title} dans ${d.remind} jours`)}`, "END:VALARM",
    "BEGIN:VALARM", "TRIGGER:PT9H", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(`C'est aujourd'hui : ${d.title}`)}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}
function renderDates() {
  const all = datesInfo(), up = all.filter((d) => d.inDays >= 0).sort((a, b) => a.inDays - b.inDays), past = all.filter((d) => d.inDays < 0).sort((a, b) => a.inDays - b.inDays);
  ui.dateEmoji = ui.dateEmoji || DATE_EMOJIS[0];
  const item = (d) => `<article class="card date-item">
    <div class="date-main"><span class="cd-emoji">${esc(d.emoji || "📅")}</span>
      <div class="grow"><strong>${esc(d.title)}</strong><div class="small muted">${fmtDay(d.next, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}${yearsLbl(d)}${d.recurring ? " · chaque année" : ""}</div>
      ${d.inDays >= 0 ? `<div class="small muted">🔔 Rappel ${d.remind} jour${d.remind > 1 ? "s" : ""} avant</div>` : ""}</div>
      ${cdNum(d)}</div>
    <div class="row between">${d.inDays >= 0 ? `<button class="chip-btn" data-ics="${d.id}">📅 Ajouter à mon calendrier</button>` : "<span></span>"}<span class="row-actions"><button class="link" data-date-edit="${d.id}">Modifier</button><button class="link danger" data-date-del="${d.id}">Supprimer</button></span></div>
  </article>`;
  const ed = ui.dateEdit && Store.get(`dates/${ui.dateEdit}`); // date en cours de modification
  if (ui.dateEdit && !ed) ui.dateEdit = null;
  $app.innerHTML = pageHead("Ensemble", "Nos dates", "#/plus") + `<div class="split"><div class="split-a">
    <section class="card ${ed ? "editing" : ""}" id="dForm">
      <div class="eyebrow">${ed ? "✏️ Modifier la date" : "➕ Ajouter une date"}</div>
      <div class="emoji-pick">${DATE_EMOJIS.map((e) => `<button class="${e === ui.dateEmoji ? "on" : ""}" data-demoji="${e}">${e}</button>`).join("")}</div>
      <input id="dT" placeholder="Notre rencontre, fiançailles, anniversaire de ${esc(P(other(me)).name)}…" maxlength="80" value="${ed ? esc(ed.title) : ""}">
      <input type="date" id="dD" value="${ed ? esc(ed.date) : ""}">
      <label class="check-row"><input type="checkbox" id="dR" ${!ed || ed.recurring ? "checked" : ""}> Revient chaque année (anniversaire)</label>
      <select id="dRem">${[[1, "1 jour"], [3, "3 jours"], [7, "1 semaine"], [14, "2 semaines"], [30, "1 mois"]].map(([v, l]) => `<option value="${v}" ${v === (ed ? ed.remind ?? 7 : 7) ? "selected" : ""}>🔔 Rappel ${l} avant</option>`).join("")}</select>
      <button class="btn full" id="dAdd">${ed ? "Enregistrer les modifications" : "Ajouter"}</button>
      ${ed ? `<button class="btn ghost full" id="dCancel">Annuler</button>` : ""}
    </section></div><div class="split-b">
    ${up.length ? `<h2 class="section">⏳ À venir</h2>${up.map(item).join("")}` : ""}
    ${past.length ? `<h2 class="section">🕰️ Souvenirs</h2>${past.map(item).join("")}` : ""}
    ${!all.length ? `<p class="muted center-text small">Ajoutez vos dates importantes : un compte à rebours apparaîtra sur l'accueil, avec un rappel quelques jours avant.</p>` : ""}
    <p class="small muted center-text">Le rappel s'affiche sur l'accueil. Pour une notification sur ton téléphone, utilise « Ajouter à mon calendrier ».</p></div></div>` + nav("plus");
  $app.querySelectorAll("[data-demoji]").forEach((b) => b.onclick = () => {
    ui.dateEmoji = b.dataset.demoji;
    $app.querySelectorAll("[data-demoji]").forEach((x) => x.classList.toggle("on", x === b));
  });
  $app.querySelector("#dAdd").onclick = async () => {
    const title = $app.querySelector("#dT").value.trim(), date = $app.querySelector("#dD").value;
    if (!title) return toast("Donne un nom à cette date");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return toast("Choisis une date");
    const vals = { title, date, emoji: ui.dateEmoji, recurring: $app.querySelector("#dR").checked, remind: +$app.querySelector("#dRem").value };
    if (ed) await Store.set(`dates/${ui.dateEdit}`, { ...ed, ...vals, editedAt: Date.now() });
    else await Store.set(`dates/${newId()}`, { ...vals, by: me, at: Date.now() });
    toast(ed ? "Date modifiée ✏️" : "Date ajoutée 📅"); ui.dateEdit = null; ui.dateEmoji = null; renderDates();
  };
  $app.querySelectorAll("[data-ics]").forEach((b) => b.onclick = () => {
    const d = all.find((x) => x.id === b.dataset.ics);
    downloadFile(`${d.title.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.ics`, icsFor(d), "text/calendar");
  });
  const dc = $app.querySelector("#dCancel"); if (dc) dc.onclick = () => { ui.dateEdit = null; ui.dateEmoji = null; renderDates(); };
  $app.querySelectorAll("[data-date-edit]").forEach((b) => b.onclick = () => {
    ui.dateEdit = b.dataset.dateEdit; ui.dateEmoji = Store.get(`dates/${ui.dateEdit}`).emoji || DATE_EMOJIS[0];
    renderDates(); $app.querySelector("#dForm").scrollIntoView({ behavior: "smooth", block: "center" }); $app.querySelector("#dT").focus({ preventScroll: true });
  });
  $app.querySelectorAll("[data-date-del]").forEach((b) => b.onclick = async () => {
    if (!confirm("Supprimer cette date ?")) return;
    await Store.remove(`dates/${b.dataset.dateDel}`); renderDates();
  });
}
