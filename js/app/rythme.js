// Rendez-vous de la semaine : une semaine de parcours à finir à deux avant le même jour chaque semaine,
// suivi des échéances, frise de régularité, absences et rappel dans le calendrier.
//
// Données partagées : `rythme` = { day (0 = dimanche … 6), since: "AAAA-MM-JJ", by, at }
// et `vu/{a|b}` = dernier jour de visite de chacun (écrit une fois par jour au plus).
// Période k = du lendemain de since + 7(k-1) jusqu'à since + 7k inclus (l'échéance).
// Une semaine compte quand les DEUX l'ont terminée, à la date de la seconde réponse.
// Une semaine faite en avance compte pour les périodes suivantes ; une période sans semaine est « manquée ».

const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const ABSENCE_JOURS = 7; // au-delà, on signale que l'autre n'est pas venu
const addDays = (s, n) => { const d = parseDay(s); d.setDate(d.getDate() + n); return todayStr(d); };
const dayDiff = (a, b) => Math.round((parseDay(b) - parseDay(a)) / 864e5);
const fmtDeadline = (s) => fmtDay(s, { weekday: "long", day: "numeric", month: "long" });
// dernier jour `day` (0–6) avant ou égal à `from`
function lastWeekday(day, from = todayStr()) { const d = parseDay(from); d.setDate(d.getDate() - ((d.getDay() - day + 7) % 7)); return todayStr(d); }

// Prochaine semaine à faire : d'abord dans le parcours choisi, sinon dans les autres
function nextWeek() {
  const todo = (pc) => pc.weeks.find((wk) => unlocked(wk.id) && !weekState(wk.id).both);
  const pc = PARCOURS.find((x) => x.id === curP);
  return (pc && todo(pc)) || PARCOURS.map(todo).find(Boolean) || null;
}

function rythmeInfo() {
  const r = Store.get("rythme"); if (!r || !r.since) return null;
  const today = todayStr(), days = Math.max(0, dayDiff(r.since, today)), K = Math.max(1, Math.ceil(days / 7));
  const count = {};
  WEEKS.forEach((wk) => {
    const a = prog(wk.id, "a").submitted, b = prog(wk.id, "b").submitted; if (!a || !b) return;
    const c = dayDiff(r.since, todayStr(new Date(Math.max(a, b))));
    if (c > 0) { const p = Math.ceil(c / 7); count[p] = (count[p] || 0) + 1; }
  });
  const periods = []; let carry = 0;
  for (let p = 1; p <= K; p++) {
    const avail = carry + (count[p] || 0);
    periods.push({ p, deadline: addDays(r.since, 7 * p), state: avail >= 1 ? "ok" : p < K ? "missed" : "pending" });
    carry = Math.max(0, avail - 1);
  }
  const cur = periods[K - 1], closed = periods.filter((x) => x.state !== "pending");
  return { r, periods, cur, left: dayDiff(today, cur.deadline), prevMissed: K > 1 && periods[K - 2].state === "missed",
    onTime: closed.filter((x) => x.state === "ok").length, closed: closed.length };
}

// Jours depuis la dernière visite d'un joueur (null si jamais enregistrée)
const awayDays = (u) => { const v = Store.get(`vu/${u}`); return v ? dayDiff(v, todayStr()) : null; };
function markVisit() { if (me && Store.get(`vu/${me}`) !== todayStr()) Store.set(`vu/${me}`, todayStr()); }

async function startRythme(day) {
  await Store.set("rythme", { day, since: lastWeekday(day), by: me, at: Date.now() });
}

// Carte de l'accueil
function rythmeCardHTML() {
  const info = rythmeInfo(), o = other(me);
  if (!info) {
    let later = false; try { later = localStorage.getItem("bc-rythme-plus-tard") === todayStr(); } catch (e) {}
    if (later) return "";
    const d = new Date().getDay();
    return `<section class="card rythme" id="rythmeSetup">
      <div class="eyebrow">📆 Notre rendez-vous de la semaine</div>
      <p class="small">Choisissez un jour : chaque semaine, vous aurez jusqu'à ce jour-là pour finir une semaine de parcours tous les deux. Le site vous dira où vous en êtes.</p>
      <select id="ryDay" aria-label="Jour du rendez-vous">${JOURS.map((j, i) => `<option value="${i}" ${i === d ? "selected" : ""}>Chaque ${j}${i === d ? " (aujourd'hui)" : ""}</option>`).join("")}</select>
      <div class="row between"><button class="link" id="ryLater">Plus tard</button><button class="btn sm" id="ryStart">Commencer le suivi</button></div>
    </section>`;
  }
  const { cur, left, prevMissed } = info, wk = nextWeek(), st = wk && weekState(wk.id);
  const lines = [];
  let tone = "ok", title, sub;
  if (cur.state === "ok") {
    title = "✅ Semaine faite, bravo !";
    sub = `La suivante est à finir avant ${fmtDeadline(addDays(cur.deadline, 7))}.`;
  } else {
    title = `📖 ${wk ? esc(weekLabel(wk)) : "Prochaine semaine"} · avant ${fmtDeadline(cur.deadline)}`;
    sub = left <= 0 ? "C'est aujourd'hui, dernier jour !" : left === 1 ? "Plus qu'un jour !" : `Encore ${left} jours`;
    if (left <= 2) tone = "soon";
    if (st && st.mine && !st.theirs) lines.push(`Tu as fini, on attend ${esc(P(o).name)}.`);
    else if (st && st.theirs && !st.mine) lines.push(`${esc(P(o).name)} a fini, à toi de jouer !`);
    if (prevMissed) { tone = "late"; lines.push(`❌ La semaine précédente a été manquée (échéance ${fmtDeadline(info.periods[info.periods.length - 2].deadline)}). On s'y remet ?`); }
  }
  const away = awayDays(o);
  if (away != null && away > ABSENCE_JOURS) { tone = "late"; lines.push(`👋 Pas de visite de ${esc(P(o).name)} sur le site depuis ${away} jours.`); }
  const shown = info.periods.slice(-8);
  const dot = (x) => `<span class="ry-dot ${x.state}" title="Échéance du ${fmtDay(x.deadline, { day: "numeric", month: "short" })} : ${x.state === "ok" ? "faite" : x.state === "missed" ? "manquée" : "en cours"}">${x.state === "ok" ? "✓" : x.state === "missed" ? "✕" : ""}</span>`;
  return `<section class="card rythme ${tone}">
    <div class="eyebrow">📆 Rendez-vous du ${JOURS[info.r.day]}</div>
    <strong class="ry-title">${title}</strong>
    <p class="ry-sub">${sub}</p>
    ${lines.map((l) => `<p class="small ry-line">${l}</p>`).join("")}
    <div class="ry-foot">
      <span class="ry-dots" aria-label="Les dernières semaines">${shown.map(dot).join("")}</span>
      ${info.closed ? `<span class="small muted">${info.onTime}/${info.closed} à l'heure</span>` : ""}
    </div>
    ${cur.state !== "ok" && wk ? `<a class="btn sm full" href="#/semaine/${wk.id}">${st && st.started ? "Continuer la semaine →" : "Commencer la semaine →"}</a>` : ""}
  </section>`;
}
function bindRythme() {
  const s = $app.querySelector("#ryStart"); if (!s) return;
  s.onclick = async () => { await startRythme(+$app.querySelector("#ryDay").value); toast("Suivi lancé 📆"); render(); };
  $app.querySelector("#ryLater").onclick = () => { try { localStorage.setItem("bc-rythme-plus-tard", todayStr()); } catch (e) {} render(); };
}

// Réglages (page Plus)
function rythmeSettingsHTML() {
  const r = Store.get("rythme");
  return `<h2 class="section">📆 Rendez-vous de la semaine</h2>
    <section class="card">
      ${r ? `<p class="small">Chaque semaine, une semaine de parcours à finir à deux avant le <strong>${JOURS[r.day]}</strong> soir. Suivi depuis le ${fmtDay(r.since, { day: "numeric", month: "long" })}.</p>` :
        `<p class="small">Le suivi n'est pas activé. Choisissez votre jour pour savoir chaque semaine où vous en êtes.</p>`}
      <select id="ryDaySet" aria-label="Jour du rendez-vous">${!r ? `<option value="" selected>Choisir un jour…</option>` : ""}${JOURS.map((j, i) => `<option value="${i}" ${r && r.day === i ? "selected" : ""}>Chaque ${j}</option>`).join("")}</select>
      ${r ? `<button class="btn ghost full" id="ryIcs">📅 Ajouter le rappel à mon calendrier</button>
      <p class="small muted">Le calendrier te prévient la veille et le jour même, chaque semaine. Si vous changez de jour, ajoute à nouveau le rappel.</p>
      <div class="row end"><button class="link danger" id="ryStop">Arrêter le suivi</button></div>` : ""}
    </section>`;
}
function bindRythmeSettings() {
  const r = Store.get("rythme");
  $app.querySelector("#ryDaySet").onchange = async (e) => {
    if (e.target.value === "") return;
    if (r && !confirm("Changer de jour fait repartir le suivi à zéro. Continuer ?")) { e.target.value = r.day; return; }
    await startRythme(+e.target.value); toast(r ? "Jour du rendez-vous changé 📆" : "Suivi lancé 📆"); renderPlus();
  };
  const ics = $app.querySelector("#ryIcs");
  if (ics) ics.onclick = () => downloadFile("rendez-vous-de-la-semaine.ics", rythmeICS(r), "text/calendar");
  const stop = $app.querySelector("#ryStop");
  if (stop) stop.onclick = async () => { if (!confirm("Arrêter le suivi des semaines ?")) return; await Store.remove("rythme"); toast("Suivi arrêté"); renderPlus(); };
}

// Évènement hebdomadaire (journée entière, le jour de l'échéance) avec alertes la veille à 9 h et le jour même à 9 h
function rythmeICS(r) {
  const first = addDays(r.since, 7), ymd = (s) => s.replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//La corde a trois fils//FR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    "UID:rendez-vous-semaine@corde-a-trois-fils", `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${ymd(first)}`, `DTEND;VALUE=DATE:${ymd(addDays(first, 1))}`,
    "RRULE:FREQ=WEEKLY", "SUMMARY:📖 Dernier jour pour notre semaine de parcours",
    "DESCRIPTION:Finir notre semaine de La corde à trois fils avant ce soir",
    "BEGIN:VALARM", "TRIGGER:-PT15H", "ACTION:DISPLAY", "DESCRIPTION:Demain\\, dernier jour pour notre semaine de parcours", "END:VALARM",
    "BEGIN:VALARM", "TRIGGER:PT9H", "ACTION:DISPLAY", "DESCRIPTION:Aujourd'hui\\, dernier jour pour notre semaine de parcours", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}
