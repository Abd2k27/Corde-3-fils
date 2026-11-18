(function () {
  const CFG = window.APP_CONFIG, WEEKS = window.WEEKS, Bible = window.Bible;
  let Store = window.Store; // remplacé par FirebaseStore au démarrage en mode firebase
  const FB = CFG.mode === "firebase";
  const $app = document.getElementById("app");

  // ---------- utilitaires ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmtDate = (t) => new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const other = (u) => (u === "a" ? "b" : "a");
  const P = (u) => CFG.players[u];
  const avatar = (u, size = "") => `<span class="avatar ${size}" style="background:${P(u).color}">${esc(P(u).initial)}</span>`;

  let me = null;
  function resolveMe() {
    if (!FB) { me = sessionStorage.getItem("bc-player"); return; }
    me = Store.user ? Store.get(`members/${Store.user.uid}`) || null : null;
  }
  const ui = { step: {}, q: {}, phase: {}, memo: {}, kwTries: {}, revealed: {}, journalTab: "open" };

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }
  function confetti() {
    const colors = ["#b5562f", "#3f6b4f", "#d8a24a", "#e8b4a0", "#7fa88d"];
    for (let i = 0; i < 60; i++) {
      const s = document.createElement("span");
      s.className = "confetti";
      s.style.left = Math.random() * 100 + "vw";
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = Math.random() * 0.4 + "s";
      s.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 2600);
    }
  }

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
  const unlocked = (w) => CFG.unlockAll || w === 1 || weekState(w - 1).both;

  function guessScore(q, guess, actual) {
    if (guess == null || actual == null) return 0;
    if (q.type === "echelle") { const d = Math.abs(guess - actual); return d <= 1 ? 10 : d === 2 ? 5 : 0; }
    return guess === actual ? 10 : 0;
  }
  function weekPoints(w) {
    const wk = WEEKS[w - 1], pts = { a: 0, b: 0, bonus: 0 };
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

  // ---------- routeur ----------
  function parseRoute() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    return { name: h[0] || "home", arg: h[1] };
  }
  function render() {
    resolveMe();
    if (FB && Store.status === "error") return renderMsg("⚠️", "Connexion à Firebase impossible", esc(Store.error || ""));
    if (FB && Store.status === "signedOut") return renderLogin();
    if (FB && Store.status === "denied") return renderMsg("🔒", "Accès réservé", `Le compte <strong>${esc(Store.user?.email)}</strong> n'est pas autorisé.`, true);
    if (!me) return renderPlayer();
    const r = parseRoute();
    if (r.name === "semaine") return renderWeek(+r.arg);
    if (r.name === "journal") return renderJournal();
    if (r.name === "joueur") return renderPlayer();
    return renderHome();
  }
  window.addEventListener("hashchange", () => { window.scrollTo(0, 0); render(); });
  // Mise à jour quand l'autre joue (autre onglet / plus tard Firebase) — sans casser une saisie en cours
  function onStoreChange(reason) {
    if (reason === "auth") return render();
    const r = parseRoute();
    if (r.name === "home" || r.name === "journal" || (r.name === "semaine" && [4, 5].includes(ui.step[+r.arg]))) {
      if (document.activeElement && ["TEXTAREA", "INPUT"].includes(document.activeElement.tagName)) return;
      render();
    }
  }
  const go = (h) => { location.hash = h; };

  // ---------- écran : choix du joueur ----------
  function renderPlayer() {
    const taken = FB ? Store.list("members/").filter((m) => m.path !== `members/${Store.user.uid}`).map((m) => m.value) : [];
    $app.innerHTML = `
      <div class="screen center">
        <div class="logo">🪢</div>
        <h1>${esc(CFG.appName)}</h1>
        <p class="muted">« La corde à trois fils ne se rompt pas facilement. » — Ecclésiaste 4:12</p>
        <h3>${FB ? "Qui es-tu ?" : "Qui joue ?"}</h3>
        <div class="players">
          ${["a", "b"].map((u) => `<button class="player-btn" data-u="${u}" ${taken.includes(u) ? "disabled" : ""}>${avatar(u, "lg")}<span>${esc(P(u).name)}</span></button>`).join("")}
        </div>
        ${Store.mode === "local" ? `<p class="small muted">Mode test : ouvre 2 onglets, un par joueur.</p>` : ""}
      </div>`;
    $app.querySelectorAll(".player-btn").forEach((b) => b.onclick = async () => {
      if (FB) await Store.set(`members/${Store.user.uid}`, b.dataset.u);
      else sessionStorage.setItem("bc-player", b.dataset.u);
      go("#/"); render();
    });
  }

  // ---------- écrans : connexion / messages (mode Firebase) ----------
  function renderLogin() {
    $app.innerHTML = `
      <div class="screen center">
        <div class="logo">🪢</div>
        <h1>${esc(CFG.appName)}</h1>
        <p class="muted">« La corde à trois fils ne se rompt pas facilement. » — Ecclésiaste 4:12</p>
        <button class="btn" id="login">Se connecter avec Google</button>
      </div>`;
    $app.querySelector("#login").onclick = () => Store.signIn().catch((e) => toast("Connexion annulée"));
  }
  function renderMsg(icon, title, html, withLogout) {
    $app.innerHTML = `<div class="screen center"><div class="logo">${icon}</div><h2>${title}</h2><p class="muted">${html}</p>
      ${withLogout ? `<button class="btn ghost" id="out">Changer de compte</button>` : ""}</div>`;
    const o = $app.querySelector("#out"); if (o) o.onclick = () => Store.signOut();
  }

  // ---------- écran : accueil ----------
  function renderHome() {
    const t = totals(), s = streak(), o = other(me);
    const notifs = [];
    WEEKS.forEach((wk) => {
      const st = weekState(wk.id);
      if (unlocked(wk.id) && st.theirs && !st.mine) notifs.push(`<a href="#/semaine/${wk.id}" class="notif">${avatar(o, "sm")} ${esc(P(o).name)} a fini la semaine ${wk.id}, à toi de jouer !</a>`);
      const jk = Store.get(`joker/${wk.id}/${o}`);
      if (jk && jk.q && !jk.a) notifs.push(`<a href="#/semaine/${wk.id}" class="notif">🃏 ${esc(P(o).name)} t'a posé une question Joker (semaine ${wk.id})</a>`);
    });

    $app.innerHTML = `
      <header class="top">
        <div><div class="eyebrow">Bonjour ${esc(P(me).name)}</div><h1 class="h-title">${esc(CFG.appName)}</h1></div>
        <div class="duo">${avatar("a")}${avatar("b")}</div>
      </header>
      ${notifs.join("")}
      <section class="card house-card">
        ${houseSVG(t.built)}
        <div class="house-meta">
          <div><strong>${t.built}/7</strong><span>maison</span></div>
          <div><strong>${t.total}</strong><span>points</span></div>
          <div><strong>${s} 🔥</strong><span>série</span></div>
        </div>
        <p class="small muted center-text">${t.built < 7 ? `Prochaine pièce : ${PIECES[t.built]}` : "Votre maison est bâtie sur le roc 🙌"} · Matthieu 7:24</p>
      </section>

      <h2 class="section">Parcours : couple, mariage & foyer</h2>
      <div class="weeks">
        ${WEEKS.map((wk) => {
          const st = weekState(wk.id), open = unlocked(wk.id);
          let chip = `<span class="chip">À faire</span>`;
          if (!open) chip = `<span class="chip lock">🔒</span>`;
          else if (st.both) chip = `<span class="chip done">Terminée ✔</span>`;
          else if (st.mine) chip = `<span class="chip wait">En attente de ${esc(P(other(me)).name)}</span>`;
          else if (st.theirs) chip = `<span class="chip hot">À toi !</span>`;
          else if (st.started) chip = `<span class="chip">En cours</span>`;
          return `<button class="week ${open ? "" : "locked"}" ${open ? `data-w="${wk.id}"` : "disabled"}>
            <span class="week-emoji">${wk.emoji}</span>
            <span class="week-txt"><span class="eyebrow">Semaine ${wk.id}</span><strong>${esc(wk.title)}</strong><span class="small muted">${wk.passages.map((p) => esc(p.ref)).join(" · ")}</span></span>
            ${chip}
          </button>`;
        }).join("")}
      </div>

      <button class="btn ghost full" onclick="location.hash='#/journal'">🙏 Journal de prière</button>
      <footer class="foot small muted">
        Joueur : <strong>${esc(P(me).name)}</strong> · ${FB ? `<a href="#" id="logout">se déconnecter</a>` : `<a href="#/joueur">changer</a>`}
        ${Store.mode === "local" ? ` · <a href="#" id="reset">réinitialiser (test)</a>` : ""}
        <div>Texte biblique : Louis Segond 1910</div>
      </footer>`;
    $app.querySelectorAll(".week[data-w]").forEach((b) => b.onclick = () => go(`#/semaine/${b.dataset.w}`));
    const lo = document.getElementById("logout");
    if (lo) lo.onclick = (e) => { e.preventDefault(); Store.signOut(); };
    const rs = document.getElementById("reset");
    if (rs) rs.onclick = async (e) => {
      e.preventDefault();
      if (!confirm("Effacer toutes les données de test ?")) return;
      await Store.reset();
      Object.keys(localStorage).filter((k) => k.startsWith("bc-draft-")).forEach((k) => localStorage.removeItem(k));
      render();
    };
  }

  // ---------- écran : semaine ----------
  const STEPS = ["Carte", "Lecture", "Mémo", "Questions", "Révélation", "Défi"];

  function renderWeek(w) {
    const wk = WEEKS[w - 1];
    if (!wk || !unlocked(w)) return go("#/");
    if (ui.step[w] == null) {
      const st = weekState(w);
      ui.step[w] = st.mine ? 4 : prog(w, me).memoDone ? 3 : prog(w, me).kwDone ? 2 : prog(w, me).seen ? 1 : 0;
    }
    const step = ui.step[w];
    $app.innerHTML = `
      <header class="top slim">
        <button class="icon-btn" onclick="location.hash='#/'">←</button>
        <div class="grow"><div class="eyebrow">Semaine ${w} · ${STEPS[step]}</div><strong>${esc(wk.title)}</strong></div>
      </header>
      <nav class="steps">${STEPS.map((s, i) => `<button class="dot ${i === step ? "on" : ""} ${i < step ? "past" : ""}" data-s="${i}" title="${s}"></button>`).join("")}</nav>
      <main id="stepBody"></main>`;
    $app.querySelectorAll(".dot").forEach((d) => d.onclick = () => {
      const s = +d.dataset.s;
      if (s === 3 || s <= step || weekState(w).mine || s <= 2) { ui.step[w] = s; renderWeek(w); }
    });
    const body = document.getElementById("stepBody");
    [stepCard, stepRead, stepMemo, stepQuestions, stepReveal, stepDefi][step](wk, body);
  }
  const next = (w) => { ui.step[w]++; window.scrollTo(0, 0); renderWeek(w); };

  // 0 — Carte
  function stepCard(wk, el) {
    el.innerHTML = `
      <div class="flip-wrap"><div class="flip" id="flip">
        <div class="face front"><div class="big-emoji">${wk.emoji}</div><div class="eyebrow">Semaine ${wk.id}</div><p>Touche la carte pour la retourner</p></div>
        <div class="face back"><h2>${esc(wk.title)}</h2><p>${esc(wk.intro)}</p><p class="small muted">${wk.passages.map((p) => esc(p.ref)).join(" · ")}</p></div>
      </div></div>
      <button class="btn full" id="nx" disabled>Lire le passage →</button>`;
    const f = el.querySelector("#flip"), nx = el.querySelector("#nx");
    f.onclick = () => { f.classList.add("flipped"); nx.disabled = false; };
    nx.onclick = async () => { if (!prog(wk.id, me).seen) await setProg(wk.id, { seen: true }); next(wk.id); };
  }

  // 1 — Lecture + mot caché
  function stepRead(wk, el) {
    const w = wk.id, p = prog(w, me), kw = wk.keyword;
    el.innerHTML = `
      ${wk.passages.map((ps, i) => `
        <article class="card passage">
          <div class="eyebrow">${esc(ps.ref)}</div>
          <div class="verses" id="ps${i}">${versesHTML(ps.text)}</div>
        </article>`).join("")}
      <section class="card kw">
        <div class="eyebrow">🔎 Mot caché</div>
        <p>${esc(kw.hint)}</p>
        <div id="kwZone"></div>
      </section>
      <button class="btn full" id="nx">Continuer →</button>`;
    wk.passages.forEach((ps, i) => Bible.passage(ps).then((t) => { if (t) { const n = el.querySelector("#ps" + i); if (n) n.innerHTML = versesHTML(t); } }));

    const zone = el.querySelector("#kwZone");
    const drawKw = () => {
      const pp = prog(w, me);
      if (pp.kwDone) {
        zone.innerHTML = pp.keyword ? `<p class="ok">✔ Trouvé : <strong>${esc(kw.answers[0])}</strong> · +5 pts</p>` : `<p class="muted">Le mot était : <strong>${esc(kw.answers[0])}</strong></p>`;
        return;
      }
      const tries = ui.kwTries[w] || 0;
      zone.innerHTML = `
        <div class="blanks">${kw.answers[0].split("").map(() => "<span></span>").join("")}</div>
        <div class="row"><input id="kwIn" placeholder="Ton mot…" autocomplete="off"><button class="btn sm" id="kwOk">Valider</button></div>
        ${tries >= 3 ? `<button class="link" id="kwGive">Je donne ma langue au chat 🐱</button>` : tries ? `<p class="small muted">Pas tout à fait… (${tries}/3)</p>` : ""}`;
      const inp = zone.querySelector("#kwIn");
      const check = async () => {
        if (kw.answers.map(norm).includes(norm(inp.value))) { await setProg(w, { keyword: true, kwDone: true }); toast("Bien vu ! +5 points"); drawKw(); }
        else { ui.kwTries[w] = tries + 1; inp.classList.add("shake"); setTimeout(drawKw, 350); }
      };
      zone.querySelector("#kwOk").onclick = check;
      inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
      const gv = zone.querySelector("#kwGive");
      if (gv) gv.onclick = async () => { await setProg(w, { keyword: false, kwDone: true }); drawKw(); };
    };
    drawKw();
    el.querySelector("#nx").onclick = async () => { if (!prog(w, me).kwDone) await setProg(w, { kwDone: true, keyword: false }); next(w); };
  }
  const versesHTML = (t) => Object.keys(t).map((v) => `<p><sup>${v}</sup>${esc(t[v])}</p>`).join("");

  // 2 — Mémo (texte à trous)
  function stepMemo(wk, el) {
    const w = wk.id, m = wk.memo;
    const parts = m.text.split(/\[([^\]]+)\]/); // impairs = mots à trouver
    const answers = parts.filter((_, i) => i % 2);
    if (!ui.memo[w]) ui.memo[w] = { filled: [], bank: shuffle([...answers, ...m.distractors]) };
    const st = ui.memo[w], done = prog(w, me).memoDone;

    const sentence = parts.map((txt, i) => {
      if (i % 2 === 0) return esc(txt);
      const k = (i - 1) / 2, val = done ? answers[k] : st.filled[k];
      return `<span class="slot ${val ? "filled" : ""} ${st.wrong && st.wrong.includes(k) ? "bad" : ""}">${val ? esc(val) : "&nbsp;"}</span>`;
    }).join("");

    el.innerHTML = `
      <section class="card memo">
        <div class="eyebrow">🧠 Verset à retenir · ${esc(m.ref)}</div>
        <p class="memo-text">${sentence}</p>
        ${done ? `<p class="ok">${prog(w, me).memo ? "✔ Parfait ! +5 pts" : "Verset complété"}</p>` : `
          <div class="bank">${st.bank.map((wd, i) => `<button class="word" data-i="${i}" ${st.used?.includes(i) ? "disabled" : ""}>${esc(wd)}</button>`).join("")}</div>
          <button class="link" id="undo">↺ Recommencer</button>`}
        <p class="small muted">Astuce : relisez-le à voix haute ensemble, 3 fois.</p>
      </section>
      <button class="btn full" id="nx">Aux questions →</button>`;

    if (!done) {
      el.querySelectorAll(".word").forEach((b) => b.onclick = async () => {
        st.used = st.used || []; st.used.push(+b.dataset.i);
        st.filled.push(st.bank[+b.dataset.i]); st.wrong = null;
        if (st.filled.length === answers.length) {
          const wrong = answers.map((a, k) => (a === st.filled[k] ? -1 : k)).filter((k) => k >= 0);
          if (!wrong.length) { await setProg(w, { memo: true, memoDone: true }); toast("Verset mémorisé ! +5 points"); }
          else { st.wrong = wrong; renderMemoLater(); return; }
        }
        renderWeek(w);
      });
      const renderMemoLater = () => { renderWeek(w); setTimeout(() => { st.filled = []; st.used = []; st.wrong = null; renderWeek(w); }, 1100); };
      el.querySelector("#undo").onclick = () => { st.filled = []; st.used = []; st.wrong = null; renderWeek(w); };
    }
    el.querySelector("#nx").onclick = async () => { if (!prog(w, me).memoDone) await setProg(w, { memoDone: true, memo: false }); next(w); };
  }

  // 3 — Questions « Devine ma réponse »
  function stepQuestions(wk, el) {
    const w = wk.id, o = other(me);
    if (weekState(w).mine) {
      el.innerHTML = `<section class="card center-text"><div class="big-emoji">📨</div><p>Tes réponses sont envoyées.</p><button class="btn" id="nx">Voir la révélation →</button></section>`;
      el.querySelector("#nx").onclick = () => { ui.step[w] = 4; renderWeek(w); };
      return;
    }
    const d = getDraft(w);
    let qi = ui.q[w] || 0;
    if (qi >= wk.questions.length) return drawSummary();
    const q = wk.questions[qi];
    const phase = ui.phase[w] || "self"; // self | guess
    const cur = d[q.id] || {};
    const val = phase === "self" ? cur.self : cur.guess;
    const title = phase === "self"
      ? `<div class="phase self">${avatar(me, "sm")} Ta réponse</div>`
      : `<div class="phase guess">${avatar(o, "sm")} Devine ce que ${esc(P(o).name)} va répondre</div>`;

    let input = "";
    if (q.type === "echelle") {
      input = `<div class="scale">${Array.from({ length: 10 }, (_, i) => `<button class="sc ${val === i + 1 ? "on" : ""}" data-v="${i + 1}">${i + 1}</button>`).join("")}</div>
        <div class="scale-lbl small muted"><span>${esc(q.low)}</span><span>${esc(q.high)}</span></div>`;
    } else if (q.type === "tupref") {
      input = `<div class="tupref">${q.options.map((op, i) => `<button class="opt big ${val === i ? "on" : ""}" data-v="${i}"><b>${i ? "B" : "A"}</b>${esc(op)}</button>`).join(`<span class="vs">ou</span>`)}</div>`;
    } else if (q.type === "choix") {
      input = `<div class="choices">${q.options.map((op, i) => `<button class="opt ${val === i ? "on" : ""}" data-v="${i}">${esc(op)}</button>`).join("")}</div>`;
    } else {
      input = `<textarea id="txt" rows="5" placeholder="Écris librement… ${esc(P(o).name)} le lira à la révélation.">${esc(cur.self || "")}</textarea>`;
    }

    el.innerHTML = `
      <div class="qprog">Question ${qi + 1}/${wk.questions.length}${q.type === "ouverte" ? " · question ouverte" : ""}</div>
      <section class="card question ${phase}">
        ${title}
        <h3>${esc(q.text)}</h3>
        ${input}
      </section>
      <div class="row between">
        <button class="btn ghost" id="prev" ${qi === 0 && phase === "self" ? "disabled" : ""}>←</button>
        <button class="btn" id="nx" ${q.type !== "ouverte" && val == null ? "disabled" : ""}>Suivant →</button>
      </div>`;

    const save = (k, v) => { d[q.id] = { ...(d[q.id] || {}), [k]: v }; setDraft(w, d); };
    el.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => { save(phase, +b.dataset.v); renderWeek(w); });
    const txt = el.querySelector("#txt");
    if (txt) txt.oninput = () => save("self", txt.value);

    el.querySelector("#nx").onclick = () => {
      if (phase === "self" && q.type !== "ouverte") ui.phase[w] = "guess";
      else { ui.phase[w] = "self"; ui.q[w] = qi + 1; }
      renderWeek(w);
    };
    el.querySelector("#prev").onclick = () => {
      if (phase === "guess") ui.phase[w] = "self";
      else if (qi > 0) { ui.q[w] = qi - 1; ui.phase[w] = wk.questions[qi - 1].type === "ouverte" ? "self" : "guess"; }
      renderWeek(w);
    };

    function drawSummary() {
      const missing = wk.questions.filter((q) => q.type !== "ouverte" && (d[q.id]?.self == null || d[q.id]?.guess == null));
      el.innerHTML = `
        <section class="card">
          <h3>Prêt(e) à envoyer ?</h3>
          <ul class="recap">${wk.questions.map((q) => `<li><span>${esc(q.text)}</span><b>${esc(answerLabel(q, d[q.id]?.self))}</b>${q.type !== "ouverte" ? `<em>pari : ${esc(answerLabel(q, d[q.id]?.guess))}</em>` : ""}</li>`).join("")}</ul>
          ${missing.length ? `<p class="warn">Il manque ${missing.length} réponse(s).</p>` : `<p class="small muted">Une fois envoyées, tes réponses sont verrouillées. Elles seront dévoilées quand ${esc(P(o).name)} aura répondu aussi.</p>`}
        </section>
        <div class="row between"><button class="btn ghost" id="back">Modifier</button><button class="btn" id="send" ${missing.length ? "disabled" : ""}>Envoyer 📨</button></div>`;
      el.querySelector("#back").onclick = () => { ui.q[w] = 0; ui.phase[w] = "self"; renderWeek(w); };
      el.querySelector("#send").onclick = async () => {
        const answers = {};
        wk.questions.forEach((q) => { answers[q.id] = { self: d[q.id]?.self ?? null, ...(q.type !== "ouverte" ? { guess: d[q.id]?.guess ?? null } : {}) }; });
        await setProg(w, { answers, submitted: Date.now() });
        localStorage.removeItem(draftKey(w));
        ui.step[w] = 4; renderWeek(w);
        if (weekState(w).both) confetti();
      };
    }
  }

  // 4 — Révélation + Joker
  function stepReveal(wk, el) {
    const w = wk.id, o = other(me), st = weekState(w);
    if (!st.mine) {
      el.innerHTML = `<section class="card center-text"><div class="big-emoji">🙈</div><p>Réponds d'abord aux questions pour pouvoir découvrir celles de ${esc(P(o).name)}.</p><button class="btn" id="go">Aux questions →</button></section>`;
      el.querySelector("#go").onclick = () => { ui.step[w] = 3; renderWeek(w); };
      return;
    }
    if (!st.theirs) {
      el.innerHTML = `
        <section class="card center-text waiting"><div class="big-emoji pulse">⏳</div>
          <h3>En attente de ${esc(P(o).name)}</h3>
          <p class="muted">Les réponses se dévoileront ici dès que ${esc(P(o).name)} aura fini. Pas de triche possible 😉</p></section>
        ${jokerHTML(w)}
        <button class="btn full" id="nx">Voir le défi de la semaine →</button>`;
      bindJoker(w, el);
      el.querySelector("#nx").onclick = () => next(w);
      return;
    }
    if (!ui.revealed[w] && !prog(w, me).revealed) {
      el.innerHTML = `<section class="card center-text"><div class="big-emoji">🎁</div><h3>Vous avez répondu tous les deux !</h3><p>Installez-vous ensemble (ou en appel) avant d'ouvrir.</p><button class="btn" id="rv">Révéler les réponses ✨</button></section>`;
      el.querySelector("#rv").onclick = async () => { ui.revealed[w] = true; await setProg(w, { revealed: true }); confetti(); renderWeek(w); };
      return;
    }
    const mine = prog(w, me).answers || {}, theirs = prog(w, o).answers || {};
    const pts = weekPoints(w);
    el.innerHTML = `
      <section class="score card">
        <div>${avatar(me)}<strong>${pts[me]}</strong><span>${esc(P(me).name)}</span></div>
        <div class="plus">+ ${pts.bonus} bonus duo</div>
        <div>${avatar(o)}<strong>${pts[o]}</strong><span>${esc(P(o).name)}</span></div>
      </section>
      ${wk.questions.map((q, i) => {
        const a = mine[q.id] || {}, b = theirs[q.id] || {};
        const myG = guessScore(q, a.guess, b.self), thG = guessScore(q, b.guess, a.self);
        return `<section class="card reveal" style="animation-delay:${i * 0.12}s">
          <h4>${esc(q.text)}</h4>
          <div class="ans-grid">
            <div class="ans">${avatar(me, "sm")}<p>${esc(answerLabel(q, a.self))}</p></div>
            <div class="ans">${avatar(o, "sm")}<p>${esc(answerLabel(q, b.self))}</p></div>
          </div>
          ${q.type !== "ouverte" ? `<div class="guesses small">
            <span class="${myG ? "ok" : "ko"}">Tu avais parié : ${esc(answerLabel(q, a.guess))} ${myG ? `✔ +${myG}` : "✘"}</span>
            <span class="${thG ? "ok" : "ko"}">${esc(P(o).name)} avait parié : ${esc(answerLabel(q, b.guess))} ${thG ? `✔ +${thG}` : "✘"}</span>
          </div>` : `<p class="small muted">💬 Prenez 5 minutes pour en parler.</p>`}
        </section>`;
      }).join("")}
      ${jokerHTML(w)}
      <button class="btn full" id="nx">Défi de la semaine →</button>`;
    bindJoker(w, el);
    el.querySelector("#nx").onclick = () => next(w);
  }

  function jokerHTML(w) {
    const o = other(me), mineJ = Store.get(`joker/${w}/${me}`), theirJ = Store.get(`joker/${w}/${o}`);
    let html = `<section class="card joker"><div class="eyebrow">🃏 Carte Joker</div>`;
    if (theirJ && theirJ.q) {
      html += `<div class="jk"><p>${avatar(o, "sm")} <strong>${esc(P(o).name)}</strong> te demande : « ${esc(theirJ.q)} »</p>
        ${theirJ.a ? `<p class="jk-a">Ta réponse : ${esc(theirJ.a)}</p>` : `<textarea id="jkA" rows="3" placeholder="Ta réponse…"></textarea><button class="btn sm" id="jkASend">Répondre</button>`}</div>`;
    }
    if (mineJ && mineJ.q) {
      html += `<div class="jk"><p>Ta question : « ${esc(mineJ.q)} »</p>${mineJ.a ? `<p class="jk-a">${avatar(o, "sm")} ${esc(mineJ.a)}</p>` : `<p class="small muted">En attente de la réponse de ${esc(P(o).name)}…</p>`}</div>`;
    } else {
      html += `<p class="small muted">Une question par semaine, celle que tu veux, à poser à ${esc(P(o).name)}.</p>
        <textarea id="jkQ" rows="2" placeholder="Ta question pour ${esc(P(o).name)}…"></textarea><button class="btn sm" id="jkQSend">Poser ma question</button>`;
    }
    return html + `</section>`;
  }
  function bindJoker(w, el) {
    const o = other(me);
    const q = el.querySelector("#jkQSend");
    if (q) q.onclick = async () => { const v = el.querySelector("#jkQ").value.trim(); if (!v) return; await Store.set(`joker/${w}/${me}`, { q: v, at: Date.now() }); toast("Question envoyée 🃏"); renderWeek(w); };
    const a = el.querySelector("#jkASend");
    if (a) a.onclick = async () => { const v = el.querySelector("#jkA").value.trim(); if (!v) return; const j = Store.get(`joker/${w}/${o}`); await Store.set(`joker/${w}/${o}`, { ...j, a: v, aAt: Date.now() }); toast("Réponse envoyée"); renderWeek(w); };
  }

  // 5 — Défi + prière
  function stepDefi(wk, el) {
    const w = wk.id, o = other(me), my = prog(w, me), th = prog(w, o);
    el.innerHTML = `
      <section class="card defi">
        <div class="eyebrow">🎯 Défi de la semaine</div>
        <p class="defi-txt">${esc(wk.defi)}</p>
        <div class="defi-who">
          <button class="check ${my.defi ? "on" : ""}" id="dMe">${avatar(me, "sm")} ${my.defi ? "Fait ✔" : "Je l'ai fait"}</button>
          <span class="check static ${th.defi ? "on" : ""}">${avatar(o, "sm")} ${th.defi ? "Fait ✔" : "Pas encore"}</span>
        </div>
        <p class="small muted">+10 points chacun</p>
      </section>
      <section class="card">
        <div class="eyebrow">🙏 Prière de la semaine</div>
        <p class="prayer">${esc(wk.priere)}</p>
        <textarea id="pr" rows="3" placeholder="Ajoute ton intention de prière…"></textarea>
        <div class="row"><button class="btn sm ghost" id="prSug">+ Ajouter la prière ci-dessus</button><button class="btn sm" id="prAdd">+ Ajouter mon intention</button></div>
      </section>
      <button class="btn full" onclick="location.hash='#/'">🏡 Retour à la maison</button>`;
    el.querySelector("#dMe").onclick = async () => { const v = !prog(w, me).defi; await setProg(w, { defi: v, defiAt: v ? Date.now() : null }); if (v) toast("Défi relevé ! +10 points"); renderWeek(w); };
    el.querySelector("#prSug").onclick = () => addPrayer(wk.priere, w);
    el.querySelector("#prAdd").onclick = () => { const v = el.querySelector("#pr").value.trim(); if (v) addPrayer(v, w); };
  }
  async function addPrayer(text, w) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    await Store.set(`prayers/${id}`, { by: me, text, at: Date.now(), week: w || null, answered: false });
    toast("Ajoutée au journal 🙏");
    render();
  }

  // ---------- écran : journal ----------
  function renderJournal() {
    const all = Store.list("prayers/").map((x) => ({ id: x.path.split("/")[1], ...x.value })).sort((a, b) => b.at - a.at);
    const tab = ui.journalTab, list = all.filter((p) => (tab === "open" ? !p.answered : p.answered));
    $app.innerHTML = `
      <header class="top slim"><button class="icon-btn" onclick="location.hash='#/'">←</button><div class="grow"><div class="eyebrow">Ensemble</div><strong>Journal de prière</strong></div></header>
      <section class="card">
        <textarea id="pr" rows="3" placeholder="Une intention de prière, un sujet de reconnaissance…"></textarea>
        <button class="btn full" id="add">Ajouter</button>
      </section>
      <div class="tabs"><button class="${tab === "open" ? "on" : ""}" data-t="open">En prière (${all.filter((p) => !p.answered).length})</button><button class="${tab === "done" ? "on" : ""}" data-t="done">Exaucées 🙌 (${all.filter((p) => p.answered).length})</button></div>
      ${list.length ? list.map((p) => `
        <article class="card prayer-item ${p.answered ? "answered" : ""}">
          <div class="pi-head">${avatar(p.by, "sm")}<span class="small muted">${esc(P(p.by).name)} · ${fmtDate(p.at)}${p.week ? ` · semaine ${p.week}` : ""}</span></div>
          <p>${esc(p.text)}</p>
          ${p.answered ? `<p class="small ok">Exaucée le ${fmtDate(p.answeredAt)} 🙌</p>` : `<button class="link" data-done="${p.id}">Marquer comme exaucée</button>`}
        </article>`).join("") : `<p class="muted center-text">${tab === "open" ? "Aucune intention pour l'instant." : "Les prières exaucées apparaîtront ici."}</p>`}`;
    $app.querySelector("#add").onclick = () => { const v = $app.querySelector("#pr").value.trim(); if (v) addPrayer(v); };
    $app.querySelectorAll("[data-t]").forEach((b) => b.onclick = () => { ui.journalTab = b.dataset.t; renderJournal(); });
    $app.querySelectorAll("[data-done]").forEach((b) => b.onclick = async () => {
      const k = `prayers/${b.dataset.done}`;
      await Store.set(k, { ...Store.get(k), answered: true, answeredAt: Date.now() });
      confetti(); renderJournal();
    });
  }

  // ---------- démarrage ----------
  function boot() {
    Store = window.Store;
    Store.subscribe(onStoreChange);
    Store.init().then(render);
  }
  if (FB) {
    if (!CFG.firebaseConfig) $app.innerHTML = `<div class="screen center"><h2>Config Firebase manquante</h2><p class="muted">Colle firebaseConfig dans js/config.js.</p></div>`;
    else if (window.Store && window.Store.mode === "firebase") boot();
    else window.addEventListener("store-ready", boot, { once: true });
  } else boot();
})();
