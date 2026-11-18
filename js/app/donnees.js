// Progression des semaines, points, série, maison SVG
// ---------- données ----------
const prog = (w, u) => Store.get(`progress/${w}/${u}`) || {};
async function setProg(w, patch) { await Store.set(`progress/${w}/${me}`, { ...prog(w, me), ...patch }); }
const draftKey = (w) => `bc-draft-${me}-${w}`; // brouillons privés, jamais partagés
const getDraft = (w) => { try { return JSON.parse(localStorage.getItem(draftKey(w))) || {}; } catch (e) { return {}; } };
const setDraft = (w, d) => localStorage.setItem(draftKey(w), JSON.stringify(d));

function weekState(w) {
  const a = prog(w, me), b = prog(w, other(me));
  return { mine: !!a.submitted, theirs: !!b.submitted, both: !!(a.submitted && b.submitted), started: Object.keys(a).length > 0 };
}
const unlocked = (w) => { const wk = WK[w]; return !!wk && (CFG.unlockAll || wk.parcours.custom || wk.n === 1 || weekState(wk.parcours.weeks[wk.n - 2].id).both); };
function parcoursDone(pc) { return pc.weeks.filter((wk) => weekState(wk.id).both).length; }
function piecesBuilt(pc) { if (!pc.weeks.length) return 0; const d = parcoursDone(pc); return d >= pc.weeks.length ? 7 : Math.floor((d / pc.weeks.length) * 7); }

function guessScore(q, guess, actual) {
  if (guess == null || actual == null) return 0;
  if (q.type === "echelle") { const d = Math.abs(guess - actual); return d <= 1 ? 10 : d === 2 ? 5 : 0; }
  return guess === actual ? 10 : 0;
}
function weekPoints(w) {
  const wk = WK[w], pts = { a: 0, b: 0, bonus: 0 };
  const pa = prog(w, "a"), pb = prog(w, "b");
  for (const u of ["a", "b"]) {
    const p = u === "a" ? pa : pb, o = u === "a" ? pb : pa;
    if (p.keyword) pts[u] += 5;
    if (p.memo) pts[u] += 5;
    if (p.defi) pts[u] += 10;
    if (p.submitted && o.submitted)
      wk.questions.forEach((q) => { if (q.type !== "ouverte") pts[u] += guessScore(q, p.answers?.[q.id]?.guess, o.answers?.[q.id]?.self); });
  }
  if (pa.submitted && pb.submitted) pts.bonus = 20;
  return pts;
}
function totals() {
  let a = 0, b = 0, bonus = 0, built = 0;
  WEEKS.forEach((wk) => { const p = weekPoints(wk.id); a += p.a; b += p.b; bonus += p.bonus; if (p.bonus) built++; });
  return { a, b, bonus, total: a + b + bonus, built };
}
function streak() {
  const times = WEEKS.map((wk) => { const a = prog(wk.id, "a").submitted, b = prog(wk.id, "b").submitted; return a && b ? Math.max(a, b) : null; })
    .filter(Boolean).sort((x, y) => y - x);
  if (!times.length) return 0;
  const DAY = 864e5;
  if (Date.now() - times[0] > 10 * DAY) return 0;
  let n = 1;
  for (let i = 1; i < times.length; i++) { if (times[i - 1] - times[i] <= 10 * DAY) n++; else break; }
  return n;
}

function answerLabel(q, v) {
  if (v == null || v === "") return "—";
  if (q.type === "echelle") return `${v}/10`;
  if (q.type === "tupref" || q.type === "choix") return q.options[v];
  return v;
}

// ---------- maison SVG ----------
function houseSVG(n) {
  const g = (k, built, ghost) => (n >= k ? built : ghost);
  const gs = 'fill="none" stroke="#d9cfc4" stroke-dasharray="4 3" stroke-width="1.5"';
  return `<svg viewBox="0 0 200 150" class="house" aria-label="Maison : ${n} sur 7">
    ${g(7, `<g class="pop"><circle cx="170" cy="28" r="10" fill="#f2c56b"/><rect x="166" y="98" width="5" height="22" fill="#7a5a3c"/><circle cx="168.5" cy="92" r="13" fill="#7fa88d"/>
      <g fill="#e8b4a0"><circle cx="40" cy="124" r="3"/><circle cx="30" cy="127" r="3"/><circle cx="150" cy="125" r="3"/></g><g fill="#7fa88d"><circle cx="35" cy="128" r="2"/><circle cx="155" cy="128" r="2"/></g></g>`,
      `<circle cx="168.5" cy="92" r="13" ${gs}/>`)}
    ${g(1, `<g class="pop"><path d="M10 132 Q100 118 190 132 L195 148 L5 148 Z" fill="#9c8a78"/><rect x="50" y="116" width="100" height="10" rx="2" fill="#6b5a4c"/></g>`,
      `<path d="M10 132 Q100 118 190 132 L195 148 L5 148 Z" ${gs}/>`)}
    ${g(2, `<rect class="pop" x="55" y="70" width="90" height="46" fill="#f3d9b1" stroke="#c9a77a"/>`, `<rect x="55" y="70" width="90" height="46" ${gs}/>`)}
    ${g(6, `<g class="pop"><rect x="124" y="40" width="10" height="22" fill="#6b5a4c"/><g fill="#e6dfd6" class="smoke"><circle cx="129" cy="33" r="4"/><circle cx="133" cy="25" r="5"/><circle cx="138" cy="16" r="6"/></g></g>`,
      `<rect x="124" y="40" width="10" height="22" ${gs}/>`)}
    ${g(5, `<polygon class="pop" points="46,72 100,34 154,72" fill="#8b3a22"/>`, `<polygon points="46,72 100,34 154,72" ${gs}/>`)}
    ${g(3, `<g class="pop"><rect x="92" y="88" width="16" height="28" rx="2" fill="#b5562f"/><circle cx="104" cy="103" r="1.3" fill="#f2c56b"/></g>`, `<rect x="92" y="88" width="16" height="28" ${gs}/>`)}
    ${g(4, `<g class="pop" fill="#cfe6f0" stroke="#8aa9b5"><rect x="64" y="80" width="18" height="15"/><rect x="118" y="80" width="18" height="15"/></g>`,
      `<rect x="64" y="80" width="18" height="15" ${gs}/><rect x="118" y="80" width="18" height="15" ${gs}/>`)}
  </svg>`;
}
const PIECES = ["Fondations sur le roc", "Les murs", "La porte", "Les fenêtres", "Le toit", "La cheminée", "Le jardin"];
