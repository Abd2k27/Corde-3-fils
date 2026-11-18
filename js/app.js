(function () {
  const CFG = window.APP_CONFIG, Bible = window.Bible;
  // Parcours : chaque semaine a un id FIXE écrit dans son fichier (clé de stockage de la progression).
  // On peut donc insérer / réordonner des semaines sans perdre les réponses. Ne jamais changer un id existant.
  const PARCOURS = window.PARCOURS, WEEKS = [], WK = {};
  PARCOURS.forEach((pc) => pc.weeks.forEach((wk, i) => {
    wk.n = i + 1; wk.parcours = pc;
    if (wk.id == null) { wk.id = `${pc.id}-${i + 1}`; console.warn(`Semaine sans id dans « ${pc.id} » (n°${i + 1}) : ajoute un id fixe.`); }
    wk.id = String(wk.id);
    if (WK[wk.id]) console.error(`Id de semaine en double : « ${wk.id} »`);
    WEEKS.push(wk); WK[wk.id] = wk;
  }));
  // Parcours « Nos semaines » : rempli dynamiquement avec les semaines créées par le couple
  const PERSO = { id: "perso", emoji: "✍️", title: "Nos semaines", short: "Nos semaines", desc: "Les semaines que vous créez vous-mêmes, sur les thèmes et passages qui vous parlent.", weeks: [], custom: true };
  PARCOURS.push(PERSO);
  function syncCustom() {
    for (let i = WEEKS.length - 1; i >= 0; i--) if (WEEKS[i].parcours === PERSO) { delete WK[WEEKS[i].id]; WEEKS.splice(i, 1); }
    const items = Store.list("custom/").map((x) => ({ cid: x.path.slice(7), ...x.value })).sort((a, b) => a.at - b.at);
    PERSO.weeks = items.map((it, i) => {
      const wk = JSON.parse(JSON.stringify(it));
      wk.n = i + 1; wk.parcours = PERSO; wk.id = `perso-${it.cid}`; wk.custom = true;
      WEEKS.push(wk); WK[wk.id] = wk; return wk;
    });
  }
  let curP = localStorage.getItem("bc-parcours");
  if (!PARCOURS.find((x) => x.id === curP)) curP = PARCOURS[0].id;
  const weekLabel = (wk) => `${wk.parcours.short} · semaine ${wk.n}`;
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

  function toast(msg, ms = 2200) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), ms);
  }
  // ---------- erreurs d'enregistrement ----------
  // Toutes les écritures passent par Store : on les enveloppe pour ne jamais échouer en silence.
  const errMsg = (e) => {
    const c = (e && e.code) || "";
    if (c.includes("permission-denied")) return "Accès refusé : ce compte ne peut pas enregistrer.";
    if (c.includes("unavailable") || !navigator.onLine) return "Pas de connexion : rien n'a été enregistré.";
    if (c.includes("resource-exhausted") || /quota|plein|too large|exceeds/i.test(e && e.message)) return "Trop volumineux : enregistrement impossible.";
    return "Erreur d'enregistrement : " + ((e && e.message) || "inconnue");
  };
  function guardStore(S) {
    ["set", "remove", "setBlob", "removeBlob"].forEach((m) => {
      const f = S[m] && S[m].bind(S);
      if (!f || f._guarded) return;
      const g = async (...args) => {
        try { return await f(...args); }
        catch (e) { console.error(`Store.${m}`, args[0], e); toast("⚠️ " + errMsg(e), 4500); if (e && typeof e === "object") e.shown = true; throw e; }
      };
      g._guarded = true; S[m] = g;
    });
  }
  window.addEventListener("unhandledrejection", (ev) => {
    const e = ev.reason; if (e && e.shown) { ev.preventDefault(); return; }
    console.error(e); toast("⚠️ " + errMsg(e), 4500);
  });
  const netBanner = () => document.body.classList.toggle("offline", !navigator.onLine);
  window.addEventListener("online", () => { netBanner(); toast("De nouveau en ligne ✓"); });
  window.addEventListener("offline", netBanner);
  window.addEventListener("store-pending", () => toast("⏳ Connexion lente : l'envoi se terminera dès que le réseau revient. Garde la page ouverte.", 5000));
  window.addEventListener("store-synced", () => toast("Enregistré ✓"));
  window.addEventListener("store-error", (ev) => toast("⚠️ " + errMsg(ev.detail), 5000));
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

  // ---------- routeur ----------
  function parseRoute() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    return { name: h[0] || "home", arg: h[1] };
  }
  function render() {
    document.body.classList.remove("with-nav"); $app.dataset.page = "";
    resolveMe();
    if (Store.status !== "signedOut" && Store.list) syncCustom();
    if (parseRoute().name === "guide") return renderGuide();
    if (FB && Store.status === "error") return renderMsg("⚠️", "Connexion à Firebase impossible", esc(Store.error || ""));
    if (FB && Store.status === "signedOut") return renderLogin();
    if (FB && Store.status === "denied") return renderMsg("🔒", "Accès réservé", `Le compte <strong>${esc(Store.user?.email)}</strong> n'est pas autorisé.`, true);
    if (!me) return renderPlayer();
    const r = parseRoute();
    if (!localStorage.getItem(GUIDE_KEY)) return go("#/guide");
    if (r.name === "joueur") return renderPlayer();
    const pages = {
      semaine: () => renderWeek(r.arg), journal: renderJournal, soir: renderSoir, promesses: renderPromesses, lettres: renderLettres,
      histoire: renderHistoire, bilan: () => renderBilan(r.arg), plus: renderPlus, creer: () => renderCreer(r.arg),
      bocal: renderBocal, dates: renderDates, lecture: () => renderLecture(r.arg)
    };
    $app.dataset.page = pages[r.name] ? r.name : "home"; // sert à la mise en page (largeur) sur ordinateur
    (pages[r.name] || renderHome)();
    document.body.classList.add("with-nav"); drawSide(r.name);
  }
  window.addEventListener("hashchange", () => { stopSpeak(); window.scrollTo(0, 0); render(); });
  // Mise à jour quand l'autre joue (autre onglet / plus tard Firebase) — sans casser une saisie en cours
  function onStoreChange(reason) {
    if (reason === "auth") return render();
    // pendant une animation (ex. tirage du bocal), on attend qu'elle finisse avant de redessiner
    if (Date.now() < (ui.hold || 0)) { clearTimeout(ui.holdT); ui.holdT = setTimeout(() => onStoreChange(reason), ui.hold - Date.now() + 50); return; }
    const r = parseRoute();
    if (["home", "journal", "soir", "promesses", "lettres", "histoire", "bilan", "plus", "bocal", "dates", "lecture"].includes(r.name) || (r.name === "semaine" && [4, 5].includes(ui.step[r.arg]))) {
      if (document.activeElement && ["TEXTAREA", "INPUT"].includes(document.activeElement.tagName)) return;
      render();
    }
  }
  const go = (h) => { location.hash = h; };


  // ---------- écran : guide (carrousel) ----------
  const GUIDE_KEY = "bc-guide-seen";
  const GUIDE = [
    { icon: "🪢", title: "Bienvenue !", html: `
        <p><strong>La corde à trois fils</strong>, c'est vous deux… et Dieu au milieu.</p>
        <p>Chaque semaine, un thème biblique sous forme de jeu : environ <strong>15 minutes</strong>, ensemble ou chacun de son côté.</p>
        <p><strong>${PARCOURS.filter((x) => !x.custom).length} parcours, ${WEEKS.length} semaines</strong> : de quoi grandir ensemble pendant un an.</p>
        <ul class="g-tips">${PARCOURS.filter((x) => !x.custom).map((x) => `<li>${x.emoji} ${esc(x.title)} <span class="muted">(${x.weeks.length})</span></li>`).join("")}</ul>
        <p class="small muted">Faites défiler pour découvrir comment ça marche →</p>` },
    { icon: "📅", title: "Une session en 6 étapes", html: `
        <ol class="g-steps">
          <li><b>🃏 La carte</b> : on retourne la carte du thème.</li>
          <li><b>📖 La lecture</b> : un court passage, avec un mot caché à trouver.</li>
          <li><b>🧠 Le mémo</b> : on reconstitue le verset clé avec les bons mots.</li>
          <li><b>🤔 Les questions</b> : le jeu « Devine ma réponse ».</li>
          <li><b>🎁 La révélation</b> : on découvre les réponses de l'autre.</li>
          <li><b>🎯 Le défi</b> : une action concrète pour la semaine, et une prière.</li>
        </ol>` },
    { icon: "🤔", title: "Devine ma réponse", html: `
        <p>Pour chaque question, tu donnes <strong>ta réponse</strong>, puis tu <strong>paries sur celle de l'autre</strong>.</p>
        <p>🔒 Les réponses restent cachées tant que vous n'avez pas <strong>tous les deux</strong> terminé. Impossible de copier !</p>
        <p>💬 Les questions ouvertes n'ont pas de pari : elles servent à lancer la discussion au moment de la révélation.</p>` },
    { icon: "🏡", title: "Points, maison et série", html: `
        <table class="g-table">
          <tr><td>Mot caché trouvé</td><td>+5</td></tr>
          <tr><td>Verset reconstitué</td><td>+5</td></tr>
          <tr><td>Bon pari (échelle : à 1 près)</td><td>+10</td></tr>
          <tr><td>Pari presque juste (à 2 près)</td><td>+5</td></tr>
          <tr><td>Défi relevé</td><td>+10</td></tr>
          <tr><td>Semaine finie à deux</td><td>+20</td></tr>
        </table>
        <p>Chaque parcours a sa maison : chaque semaine terminée <strong>ensemble</strong> la fait avancer et débloque la suivante. Vous pouvez mener plusieurs parcours en parallèle.</p>
        <p>🔥 La <strong>série</strong> monte si vous enchaînez les semaines (au plus 10 jours entre deux).</p>` },
    { icon: "🃏", title: "Joker et journal de prière", html: `
        <p><strong>🃏 Carte Joker</strong> : une fois par semaine, chacun peut poser <em>sa propre question</em> à l'autre.</p>
        <p><strong>🙏 Journal de prière</strong> : notez vos intentions, priez l'un pour l'autre, et marquez-les comme <em>exaucées</em> quand Dieu répond.</p>` },
    { icon: "🌙", title: "Et aussi, chaque jour…", html: `
        <ul class="g-steps">
          <li><b>🌙 Question du jour</b> : une question pour se découvrir, révélée quand vous avez répondu tous les deux.</li>
          <li><b>📸 Notre histoire</b> : la frise de vos moments importants, avec photos.</li>
          <li><b>💌 Lettres scellées</b> : écris une lettre qui ne s'ouvrira qu'à la date choisie.</li>
          <li><b>✍️ Nos promesses</b> : vos engagements, signés à deux.</li>
          <li><b>✨ Nos semaines</b> : créez vos propres thèmes. <b>📊 Bilans</b> : relisez chaque parcours terminé.</li>
        </ul>` },
    { icon: "💡", title: "Nos conseils", html: `
        <ul class="g-tips">
          <li>Choisissez un <strong>créneau fixe</strong> (ex. dimanche soir) pour la révélation, ensemble ou en appel.</li>
          <li>Répondez <strong>honnêtement</strong> : on n'est pas là pour gagner, mais pour se connaître.</li>
          <li>Prenez le temps de <strong>vivre le défi</strong> avant de passer à la semaine suivante.</li>
          <li>Ajoutez le site à votre <strong>écran d'accueil</strong> pour l'ouvrir comme une appli.</li>
        </ul>` }
  ];
  function renderGuide() {
    const i = Math.max(0, Math.min(ui.slide || 0, GUIDE.length - 1)), g = GUIDE[i], last = i === GUIDE.length - 1;
    $app.innerHTML = `
      <div class="guide">
        <div class="row between"><span class="eyebrow">Comment ça marche</span><button class="link" id="skip">${last ? "" : "Passer"}</button></div>
        <section class="card slide" id="slide">
          <div class="big-emoji">${g.icon}</div>
          <h2>${g.title}</h2>
          ${g.html}
        </section>
        <div class="g-dots">${GUIDE.map((_, k) => `<button class="${k === i ? "on" : ""}" data-k="${k}"></button>`).join("")}</div>
        <div class="row between">
          <button class="btn ghost" id="prev" ${i === 0 ? "disabled" : ""}>←</button>
          <button class="btn" id="nx">${last ? "C'est parti ! 🙌" : "Suivant →"}</button>
        </div>
      </div>`;
    const goTo = (k) => { ui.slide = k; renderGuide(); };
    const finish = () => { localStorage.setItem(GUIDE_KEY, "1"); ui.slide = 0; go("#/"); };
    $app.querySelector("#nx").onclick = () => (last ? finish() : goTo(i + 1));
    $app.querySelector("#prev").onclick = () => goTo(i - 1);
    $app.querySelector("#skip").onclick = finish;
    $app.querySelectorAll("[data-k]").forEach((b) => b.onclick = () => goTo(+b.dataset.k));
    const sl = $app.querySelector("#slide"); let x0 = null;
    sl.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    sl.addEventListener("touchend", (e) => {
      if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (dx < -50 && !last) goTo(i + 1); else if (dx > 50 && i > 0) goTo(i - 1);
    });
  }

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
      go(localStorage.getItem(GUIDE_KEY) ? "#/" : "#/guide"); render();
    });
  }

  // ---------- écrans : connexion / messages (mode Firebase) ----------
  function renderLogin() {
    $app.innerHTML = `
      <div class="landing">
        <section class="hero">
          <div class="logo">🪢</div>
          <h1>${esc(CFG.appName)}</h1>
          <p class="hero-verse">« La corde à trois fils ne se rompt pas facilement. »<br><span>Ecclésiaste 4:12</span></p>
          <p class="hero-sub">Une étude biblique en forme de jeu, pour grandir à deux dans la foi. ${PARCOURS.filter((x) => !x.custom).length} parcours, ${WEEKS.length} semaines, quinze minutes par semaine.</p>
          <button class="btn" id="login">Se connecter avec Google</button>
          <p class="small warn" id="err"></p>
        </section>
        <section class="features">
          <div class="feat"><span>📖</span><div><strong>Lire ensemble</strong><p>Un court passage sur le couple, le mariage et le foyer, avec un mot caché à trouver.</p></div></div>
          <div class="feat"><span>🤔</span><div><strong>Se découvrir</strong><p>Répondez chacun de votre côté, devinez la réponse de l'autre, puis révélez tout ensemble.</p></div></div>
          <div class="feat"><span>🏡</span><div><strong>Bâtir sa maison</strong><p>Chaque semaine terminée à deux ajoute une pièce à votre maison bâtie sur le roc.</p></div></div>
          <div class="feat"><span>🙏</span><div><strong>Prier l'un pour l'autre</strong><p>Un journal de prière commun, et la joie de cocher les prières exaucées.</p></div></div>
        </section>
        <button class="btn ghost full" onclick="location.hash='#/guide'">Comment ça marche ?</button>
        <p class="small muted center-text">Espace privé, réservé à vous deux.</p>
      </div>`;
    $app.querySelector("#login").onclick = () => Store.signIn().catch((e) => {
      const msgs = {
        "auth/unauthorized-domain": `Domaine non autorisé : ajoute « ${location.hostname} » dans Firebase > Authentication > Paramètres > Domaines autorisés.`,
        "auth/operation-not-allowed": "Le fournisseur Google n'est pas activé dans Firebase > Authentication.",
        "auth/popup-blocked": "Fenêtre bloquée par le navigateur : autorise les pop-ups pour ce site.",
        "auth/popup-closed-by-user": "Fenêtre fermée avant la fin de la connexion."
      };
      $app.querySelector("#err").innerHTML = esc(msgs[e.code] || "") + `<br><code>${esc(e.code || e.message)}</code>`;
    });
  }
  function renderMsg(icon, title, html, withLogout) {
    $app.innerHTML = `<div class="screen center"><div class="logo">${icon}</div><h2>${title}</h2><p class="muted">${html}</p>
      ${withLogout ? `<button class="btn ghost" id="out">Changer de compte</button>` : ""}</div>`;
    const o = $app.querySelector("#out"); if (o) o.onclick = () => Store.signOut();
  }

  // ---------- écran : accueil ----------
  function renderHome() {
    const t = totals(), s = streak(), o = other(me), pc = PARCOURS.find((x) => x.id === curP), built = piecesBuilt(pc), done = parcoursDone(pc);
    const notifs = [];
    WEEKS.forEach((wk) => {
      const st = weekState(wk.id);
      if (unlocked(wk.id) && st.theirs && !st.mine) notifs.push(`<a href="#/semaine/${wk.id}" class="notif">${avatar(o, "sm")} ${esc(P(o).name)} a fini « ${esc(weekLabel(wk))} », à toi de jouer !</a>`);
      const jk = Store.get(`joker/${wk.id}/${o}`);
      if (jk && jk.q && !jk.a) notifs.push(`<a href="#/semaine/${wk.id}" class="notif">🃏 ${esc(P(o).name)} t'a posé une question Joker (${esc(weekLabel(wk))})</a>`);
    });
    const readyL = listOf("letters/").filter((l) => l.to === me && !l.openedAt && daysUntil(l.openAt) <= 0).length;
    if (readyL) notifs.push(`<a href="#/lettres" class="notif">💌 Une lettre de ${esc(P(o).name)} peut être ouverte !</a>`);
    const unsigned = listOf("promises/").filter((p) => p.couple && !(p.signed || {})[me]).length;
    if (unsigned) notifs.push(`<a href="#/promesses" class="notif">✍️ ${esc(P(o).name)} attend ta signature sur une promesse</a>`);

    $app.innerHTML = `
      <header class="top">
        <div><div class="eyebrow">Bonjour ${esc(P(me).name)}</div><h1 class="h-title">${esc(CFG.appName)}</h1></div>
        <div class="row tight"><button class="icon-btn" onclick="location.hash='#/guide'" title="Comment ça marche ?" aria-label="Comment ça marche ?">?</button><div class="duo">${avatar("a")}${avatar("b")}</div></div>
      </header>
      <div class="home-grid">
      <div class="home-side">
      ${notifs.join("")}
      ${soirCardHTML(todayStr(), true)}
      ${readingCardHTML()}
      ${countdownHTML()}
      </div>
      <div class="home-main">

      <h2 class="section">Parcours</h2>
      <div class="parcours-bar">
        ${PARCOURS.map((x) => { const d = parcoursDone(x); return `<button class="pc ${x.id === curP ? "on" : ""}" data-pc="${x.id}">
          <span class="pc-emoji">${x.emoji}</span><strong>${esc(x.title)}</strong>
          <span class="pc-prog"><span style="width:${Math.round((d / (x.weeks.length || 1)) * 100)}%"></span></span>
          <span class="small muted">${x.custom && !x.weeks.length ? "À vous de créer !" : `${d}/${x.weeks.length} semaines`}</span></button>`; }).join("")}
      </div>
      <p class="pc-desc">${pc.emoji} <strong>${esc(pc.title)}</strong> — ${esc(pc.desc)}</p>
      <section class="card house-card">
        ${houseSVG(built)}
        <div class="house-meta">
          <div><strong>${done}/${pc.weeks.length}</strong><span>semaines</span></div>
          <div><strong>${t.total}</strong><span>points</span></div>
          <div><strong>${s} 🔥</strong><span>série</span></div>
        </div>
        <p class="small muted center-text">${built < 7 ? `Prochaine pièce : ${PIECES[built]}` : "Cette maison est bâtie sur le roc 🙌"} · Matthieu 7:24</p>
        ${done ? `<a class="btn ${done === pc.weeks.length ? "" : "ghost"} sm bilan-link" href="#/bilan/${pc.id}">${done === pc.weeks.length ? "🎉 Parcours terminé : voir le bilan" : "📊 Voir le bilan"}</a>` : ""}
      </section>
      <div class="weeks">
        ${pc.weeks.map((wk) => {
          const st = weekState(wk.id), open = unlocked(wk.id);
          let chip = `<span class="chip">À faire</span>`;
          if (!open) chip = `<span class="chip lock">🔒</span>`;
          else if (st.both) chip = `<span class="chip done">Terminée ✔</span>`;
          else if (st.mine) chip = `<span class="chip wait">En attente de ${esc(P(other(me)).name)}</span>`;
          else if (st.theirs) chip = `<span class="chip hot">À toi !</span>`;
          else if (st.started) chip = `<span class="chip">En cours</span>`;
          return `<button class="week ${open ? "" : "locked"}" ${open ? `data-w="${wk.id}"` : "disabled"}>
            <span class="week-emoji">${wk.emoji}</span>
            <span class="week-txt"><span class="eyebrow">Semaine ${wk.n}</span><strong>${esc(wk.title)}</strong><span class="small muted">${wk.passages.map((p) => esc(p.ref)).join(" · ")}</span></span>
            ${chip}
          </button>`;
        }).join("")}
        ${pc.custom ? `<a class="btn ghost full" href="#/creer">✨ Créer une semaine</a>` : ""}
      </div></div></div>` + nav("home");
    $app.querySelectorAll(".week[data-w]").forEach((b) => b.onclick = () => go(`#/semaine/${b.dataset.w}`));
    $app.querySelectorAll("[data-pc]").forEach((b) => b.onclick = () => { curP = b.dataset.pc; localStorage.setItem("bc-parcours", curP); renderHome(); });
    const on = $app.querySelector(".pc.on"); if (on) on.scrollIntoView({ inline: "center", block: "nearest" });
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
    const wk = WK[w];
    if (!wk || !unlocked(w)) return go("#/");
    if (curP !== wk.parcours.id) { curP = wk.parcours.id; localStorage.setItem("bc-parcours", curP); }
    if (ui.step[w] == null) {
      const st = weekState(w);
      ui.step[w] = st.mine ? 4 : prog(w, me).memoDone ? 3 : prog(w, me).kwDone ? 2 : prog(w, me).seen ? 1 : 0;
    }
    const step = ui.step[w];
    stopSpeak();
    $app.innerHTML = `
      <header class="top slim">
        <button class="icon-btn" onclick="location.hash='#/'" aria-label="Retour">←</button>
        <div class="grow"><div class="eyebrow">${esc(wk.parcours.short)} · S${wk.n} · ${STEPS[step]}</div><strong>${esc(wk.title)}</strong></div>
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
        <div class="face front"><div class="big-emoji">${wk.emoji}</div><div class="eyebrow">${esc(wk.parcours.title)} · semaine ${wk.n}</div><p>Touche la carte pour la retourner</p></div>
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
          <div class="passage-head"><div class="eyebrow">${esc(ps.ref)}</div>${TTS ? `<button class="listen" data-listen="${i}" aria-label="Écouter le passage">🔊 Écouter</button>` : ""}</div>
          <div class="verses" id="ps${i}">${versesHTML(ps.text)}</div>
        </article>`).join("")}
      ${kw ? `<section class="card kw">
        <div class="eyebrow">🔎 Mot caché</div>
        <p>${esc(kw.hint)}</p>
        <div id="kwZone"></div>
      </section>` : ""}
      <button class="btn full" id="nx">Continuer →</button>`;
    wk.passages.forEach((ps, i) => Bible.passage(ps).then((t) => { if (t) { const n = el.querySelector("#ps" + i); if (n && ui.speaking !== n) n.innerHTML = versesHTML(t); } }));
    el.querySelectorAll("[data-listen]").forEach((b) => b.onclick = () => speakPassage(el.querySelector("#ps" + b.dataset.listen), b));

    const zone = el.querySelector("#kwZone");
    const drawKw = () => {
      if (!kw) return;
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
  // ---------- 🔊 lecture audio (synthèse vocale du navigateur) ----------
  const TTS = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  if (TTS) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
  function frVoice() {
    const vs = speechSynthesis.getVoices().filter((v) => /^fr/i.test(v.lang));
    const fr = vs.filter((v) => /fr[-_]FR/i.test(v.lang));
    return fr.find((v) => /premium|enhanced|natural|amélie|thomas|audrey|google/i.test(v.name)) || fr[0] || vs[0] || null;
  }
  function stopSpeak() {
    if (!TTS) return;
    ui.speaking = null; speechSynthesis.cancel();
    document.querySelectorAll(".speaking").forEach((x) => x.classList.remove("speaking"));
    document.querySelectorAll(".listen.on").forEach((b) => { b.classList.remove("on"); b.textContent = "🔊 Écouter"; });
  }
  // Un énoncé par verset : évite la coupure des longs textes sur Chrome et permet de surligner le verset lu
  function speakPassage(node, btn) {
    if (!node) return;
    if (ui.speaking === node) return stopSpeak();
    stopSpeak();
    const ps = [...node.querySelectorAll("p")]; if (!ps.length) return;
    ui.speaking = node; btn.classList.add("on"); btn.textContent = "⏹ Arrêter";
    const voice = frVoice();
    ps.forEach((p, k) => {
      const txt = [...p.childNodes].filter((n) => n.nodeName !== "SUP").map((n) => n.textContent).join("").trim();
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = "fr-FR"; u.rate = 0.95; if (voice) u.voice = voice;
      u.onstart = () => { if (ui.speaking !== node) return; ps.forEach((x) => x.classList.remove("speaking")); p.classList.add("speaking"); };
      if (k === ps.length - 1) u.onend = () => { if (ui.speaking === node) stopSpeak(); };
      speechSynthesis.speak(u);
    });
  }
  const versesHTML = (t) => Object.keys(t).map((v) => `<p><sup>${v}</sup>${esc(t[v])}</p>`).join("");

  // 2 — Mémo (texte à trous)
  function stepMemo(wk, el) {
    const w = wk.id, m = wk.memo;
    if (!m) {
      el.innerHTML = `<section class="card center-text"><div class="big-emoji">🧠</div><p class="muted">Pas de verset à mémoriser cette semaine.</p></section><button class="btn full" id="nx">Aux questions →</button>`;
      el.querySelector("#nx").onclick = async () => { if (!prog(w, me).memoDone) await setProg(w, { memoDone: true, memo: false }); next(w); };
      return;
    }
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
      <section class="card">
        <div class="eyebrow">✍️ Une promesse à garder ?</div>
        <p class="small muted">Si ce défi vous a fait prendre un engagement, gardez-le dans « Nos promesses ».</p>
        <textarea id="pmT" rows="2" placeholder="Ex. Prier ensemble chaque dimanche soir"></textarea>
        <label class="check-row"><input type="checkbox" id="pmC" checked> Promesse de couple (à signer à deux)</label>
        <button class="btn sm" id="pmAdd">+ Ajouter à nos promesses</button>
      </section>
      <button class="btn full" onclick="location.hash='#/'">🏡 Retour à la maison</button>`;
    el.querySelector("#dMe").onclick = async () => { const v = !prog(w, me).defi; await setProg(w, { defi: v, defiAt: v ? Date.now() : null }); if (v) toast("Défi relevé ! +10 points"); renderWeek(w); };
    el.querySelector("#prSug").onclick = () => addPrayer(wk.priere, w);
    el.querySelector("#pmAdd").onclick = async () => { const v = el.querySelector("#pmT").value.trim(); if (!v) return; await addPromise(v, el.querySelector("#pmC").checked, w); el.querySelector("#pmT").value = ""; };
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


  // =====================================================================
  // ---------- utilitaires dates & navigation ----------
  const todayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parseDay = (s) => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d); };
  const fmtDay = (s, opts = { day: "numeric", month: "long", year: "numeric" }) => parseDay(s).toLocaleDateString("fr-FR", opts);
  const daysUntil = (s) => Math.round((parseDay(s) - parseDay(todayStr())) / 864e5);
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const listOf = (prefix) => Store.list(prefix).map((x) => ({ id: x.path.slice(prefix.length), ...x.value }));
  const pageHead = (eyebrow, title, back) => `
    <header class="top ${back ? "slim" : ""}">
      ${back ? `<button class="icon-btn" onclick="location.hash='${back}'" aria-label="Retour">←</button>` : ""}
      <div class="grow"><div class="eyebrow">${eyebrow}</div><h1 class="h-title">${title}</h1></div>
    </header>`;

  const NAV = [["home", "#/", "🏡", "Accueil"], ["lecture", "#/lecture", "📖", "Lecture"], ["soir", "#/soir", "🌙", "Ce soir"], ["histoire", "#/histoire", "📸", "Histoire"], ["plus", "#/plus", "☰", "Plus"]];
  function navBadges() {
    const p = activePlan(), d = p && planDay(p);
    const b = {
      soir: !Store.get(`soir/${todayStr()}/${me}`),
      lecture: !!(p && d <= p.days.length && !readOf(p.id, d, me)),
      lettres: listOf("letters/").some((l) => l.to === me && !l.openedAt && daysUntil(l.openAt) <= 0),
      promesses: listOf("promises/").some((x) => x.couple && !(x.signed || {})[me])
    };
    b.plus = b.lettres || b.promesses; // sur mobile, Lettres et Promesses sont dans « Plus »
    return b;
  }
  function nav(active) {
    const b = navBadges();
    if (!NAV.some((n) => n[0] === active)) active = "plus";
    return `<div class="nav-space"></div><nav class="bottom-nav">${NAV.map(([id, h, ic, l]) =>
      `<a href="${h}" class="${id === active ? "on" : ""}"${id === active ? ' aria-current=page' : ""}><span class="ni">${ic}${b[id] ? '<i class="dot-badge"></i>' : ""}</span><span>${l}</span></a>`).join("")}</nav>`;
  }

  // ---------- 🌙 Question du jour ----------
  const SOIR = window.SOIR_QUESTIONS || ["Qu'est-ce qui t'a fait sourire aujourd'hui ?"];
  const builtinQ = (day) => { const n = Math.round(parseDay(day).getTime() / 864e5); return SOIR[((n % SOIR.length) + SOIR.length) % SOIR.length]; };
  // Questions proposées par le couple (clé soirq/) : elles passent avant la liste intégrée, dans l'ordre d'ajout.
  // La question est enregistrée avec chaque réponse ({a, at, q}) : une fois répondue, elle ne change plus.
  const usedSoirQ = () => new Set(Store.list("soir/").map((x) => x.value && x.value.q).filter(Boolean));
  const pendingSoirQ = () => { const used = usedSoirQ(); return listOf("soirq/").filter((q) => q.text && !used.has(q.text)).sort((a, b) => a.at - b.at); };
  function soirQ(day) {
    const saved = ["a", "b"].map((u) => Store.get(`soir/${day}/${u}`)).find((x) => x && x.q);
    const custom = (text) => listOf("soirq/").find((q) => q.text === text);
    if (saved) { const c = custom(saved.q); return { text: saved.q, by: c ? c.by : null }; }
    if (day === todayStr()) { const nx = pendingSoirQ()[0]; if (nx) return { text: nx.text, by: nx.by }; }
    return { text: builtinQ(day), by: null };
  }
  function soirCardHTML(day, compact) {
    const o = other(me), q = soirQ(day), mine = Store.get(`soir/${day}/${me}`), th = Store.get(`soir/${day}/${o}`);
    const isToday = day === todayStr();
    let body;
    if (!mine) {
      body = compact
        ? `<a class="btn sm" href="#/soir">Répondre →</a>${th ? ` <span class="small muted">${esc(P(o).name)} a déjà répondu 👀</span>` : ""}`
        : `<textarea data-soir-in="${day}" rows="3" placeholder="Ta réponse… (${esc(P(o).name)} la verra quand vous aurez répondu tous les deux)"></textarea>
           <div class="row between"><span class="small muted">${th ? `${esc(P(o).name)} a déjà répondu 👀` : ""}</span><button class="btn sm" data-soir-send="${day}">Envoyer</button></div>`;
    } else if (!th) {
      body = `<div class="ans">${avatar(me, "sm")}<p>${esc(mine.a)}</p></div><p class="small muted">⏳ ${isToday ? `En attente de ${esc(P(o).name)}…` : `${esc(P(o).name)} n'a pas répondu.`}</p>`;
    } else {
      body = `<div class="ans-grid"><div class="ans">${avatar(me, "sm")}<p>${esc(mine.a)}</p></div><div class="ans">${avatar(o, "sm")}<p>${esc(th.a)}</p></div></div>`;
    }
    return `<section class="card soir ${compact ? "compact" : ""}">
      <div class="eyebrow">🌙 ${isToday ? "Question du jour" : fmtDay(day, { weekday: "long", day: "numeric", month: "long" })}</div>
      <h3>${esc(q.text)}</h3>${q.by ? `<p class="small muted q-by">✍️ Proposée par ${esc(P(q.by).name)}</p>` : ""}${body}</section>`;
  }
  function bindSoir(root) {
    root.querySelectorAll("[data-soir-send]").forEach((b) => b.onclick = async () => {
      const day = b.dataset.soirSend, v = root.querySelector(`[data-soir-in="${day}"]`).value.trim();
      if (!v) return;
      await Store.set(`soir/${day}/${me}`, { a: v, at: Date.now(), q: soirQ(day).text });
      if (Store.get(`soir/${day}/${other(me)}`)) confetti(); else toast("Réponse envoyée 🌙");
      render();
    });
  }
  function renderSoir() {
    const t = todayStr();
    const days = [...new Set(Store.list("soir/").map((x) => x.path.split("/")[1]))].filter((d) => d !== t).sort().reverse();
    $app.innerHTML = pageHead("Chaque jour", "Question du jour") + soirCardHTML(t) + soirQueueHTML() +
      `<h2 class="section">Les jours précédents</h2>` +
      (days.length ? days.map((d) => soirCardHTML(d)).join("") : `<p class="muted center-text small">Vos réponses s'afficheront ici, jour après jour.</p>`) + nav("soir");
    bindSoir($app);
    $app.querySelector("#sqAdd").onclick = async () => {
      const v = $app.querySelector("#sqT").value.trim(); if (!v) return;
      if (pendingSoirQ().some((q) => q.text === v) || usedSoirQ().has(v)) return toast("Cette question existe déjà");
      await Store.set(`soirq/${newId()}`, { text: v, by: me, at: Date.now() });
      toast("Question ajoutée ✍️"); render();
    };
    $app.querySelectorAll("[data-sq-del]").forEach((b) => b.onclick = async () => { await Store.remove(`soirq/${b.dataset.sqDel}`); render(); });
  }
  function soirQueueHTML() {
    const today = soirQ(todayStr()).text; // déjà affichée au-dessus : on ne la compte pas comme « en attente »
    const pend = pendingSoirQ().filter((q) => q.text !== today), own = pend.filter((q) => q.by === me), theirs = pend.length - own.length;
    return `<section class="card">
      <div class="eyebrow">✍️ Vos questions</div>
      <p class="small muted">Propose une question pour un prochain soir : les vôtres passent avant les questions prévues, dans l'ordre d'ajout.</p>
      <textarea id="sqT" rows="2" placeholder="Ta question…"></textarea>
      <div class="row end"><button class="btn sm" id="sqAdd">Ajouter</button></div>
      ${theirs ? `<p class="small muted">+ ${theirs} question${theirs > 1 ? "s" : ""} de ${esc(P(other(me)).name)} en attente : surprise 🤫</p>` : ""}
      ${own.length ? `<ul class="recap">${own.map((q) => `<li class="row between q-row"><span class="grow">${esc(q.text)}</span><button class="link danger" data-sq-del="${q.id}">Retirer</button></li>`).join("")}</ul>` : ""}
    </section>`;
  }

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

  // ---------- 💌 Lettres à ouvrir plus tard ----------
  function addMonths(n) { const d = new Date(); d.setMonth(d.getMonth() + n); return todayStr(d); }
  function letterHTML(l) {
    const o = other(me), d = daysUntil(l.openAt), received = l.to === me;
    if (!received) {
      return `<article class="card letter sent">
        <div class="eyebrow">À ${esc(P(l.to).name)} · écrite le ${fmtDate(l.at)}</div>
        <h3>✉️ ${esc(l.title)}</h3>
        <p class="small muted">${l.openedAt ? `Ouverte le ${fmtDate(l.openedAt)} 💌` : d > 0 ? `S'ouvrira le ${fmtDay(l.openAt)} (dans ${d} jour${d > 1 ? "s" : ""})` : "Prête à être ouverte"}</p>
        ${!l.openedAt ? `<button class="link danger" data-del-letter="${l.id}">Supprimer</button>` : ""}
      </article>`;
    }
    if (l.openedAt) {
      return `<article class="card letter open">
        <div class="eyebrow">De ${esc(P(l.from).name)} · écrite le ${fmtDate(l.at)} · ouverte le ${fmtDate(l.openedAt)}</div>
        <h3>💌 ${esc(l.title)}</h3>
        <p class="letter-txt">${esc(l.text)}</p>
        <p class="letter-sign">— ${esc(P(l.from).name)}</p>
      </article>`;
    }
    if (d > 0) {
      return `<article class="card letter locked">
        <div class="envelope">🔒✉️</div>
        <h3>${esc(l.title)}</h3>
        <p class="small muted">De ${esc(P(l.from).name)} · s'ouvrira le <strong>${fmtDay(l.openAt)}</strong><br>encore ${d} jour${d > 1 ? "s" : ""} de patience…</p>
      </article>`;
    }
    return `<article class="card letter ready">
      <div class="envelope bounce">💌</div>
      <h3>${esc(l.title)}</h3>
      <p class="small muted">De ${esc(P(l.from).name)} · c'est le moment !</p>
      <button class="btn" data-open-letter="${l.id}">Ouvrir la lettre</button>
    </article>`;
  }
  function renderLettres() {
    const tab = ui.letterTab || "recues", o = other(me);
    const all = listOf("letters/");
    const recues = all.filter((l) => l.to === me).sort((a, b) => (a.openedAt ? 1 : 0) - (b.openedAt ? 1 : 0) || a.openAt.localeCompare(b.openAt));
    const envoyees = all.filter((l) => l.from === me).sort((a, b) => b.at - a.at);
    let body = "";
    if (tab === "ecrire") {
      const quick = [["Dans 1 mois", addMonths(1)], ["Dans 6 mois", addMonths(6)], ["Dans 1 an", addMonths(12)]];
      body = `<section class="card">
        <p class="small muted">Écris une lettre à ${esc(P(o).name)}. Elle restera scellée jusqu'à la date choisie.</p>
        <input id="lT" placeholder="Titre (ex. Pour nos 1 an, Pour le jour de nos fiançailles…)">
        <textarea id="lX" rows="8" placeholder="Ta lettre…"></textarea>
        <div class="eyebrow" style="margin-top:10px">Date d'ouverture</div>
        <div class="row">${quick.map(([l, d]) => `<button class="chip-btn" data-quick="${d}">${l}</button>`).join("")}</div>
        <input type="date" id="lD" min="${todayStr()}" value="${addMonths(1)}">
        <button class="btn full" id="lSend">Sceller et envoyer 💌</button>
      </section>`;
    } else {
      const list = tab === "recues" ? recues : envoyees;
      body = list.length ? list.map(letterHTML).join("") : `<p class="muted center-text small">${tab === "recues" ? `Aucune lettre de ${esc(P(o).name)} pour l'instant.` : "Tu n'as pas encore écrit de lettre."}</p>`;
    }
    const ready = recues.filter((l) => !l.openedAt && daysUntil(l.openAt) <= 0).length;
    $app.innerHTML = pageHead("Pour plus tard", "Lettres scellées") + `
      <div class="tabs">
        <button class="${tab === "recues" ? "on" : ""}" data-lt="recues">Reçues${ready ? ` (${ready} 💌)` : ""}</button>
        <button class="${tab === "envoyees" ? "on" : ""}" data-lt="envoyees">Envoyées</button>
        <button class="${tab === "ecrire" ? "on" : ""}" data-lt="ecrire">✍️ Écrire</button>
      </div>${body}` + nav("lettres");
    $app.querySelectorAll("[data-lt]").forEach((b) => b.onclick = () => { ui.letterTab = b.dataset.lt; renderLettres(); });
    $app.querySelectorAll("[data-quick]").forEach((b) => b.onclick = () => { $app.querySelector("#lD").value = b.dataset.quick; });
    const send = $app.querySelector("#lSend");
    if (send) send.onclick = async () => {
      const title = $app.querySelector("#lT").value.trim() || "Une lettre pour toi", text = $app.querySelector("#lX").value.trim(), openAt = $app.querySelector("#lD").value;
      if (!text) return toast("La lettre est vide 🙂");
      if (!openAt || daysUntil(openAt) < 0) return toast("Choisis une date à venir");
      await Store.set(`letters/${newId()}`, { from: me, to: o, title, text, openAt, at: Date.now() });
      ui.letterTab = "envoyees"; toast("Lettre scellée 💌"); render();
    };
    $app.querySelectorAll("[data-open-letter]").forEach((b) => b.onclick = async () => {
      const k = `letters/${b.dataset.openLetter}`;
      await Store.set(k, { ...Store.get(k), openedAt: Date.now() }); confetti(); render();
    });
    $app.querySelectorAll("[data-del-letter]").forEach((b) => b.onclick = async () => {
      if (!confirm("Supprimer cette lettre ?")) return;
      await Store.remove(`letters/${b.dataset.delLetter}`); render();
    });
  }

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
          <div class="row between small muted"><span>${avatar(m.by, "sm")} ajouté par ${esc(P(m.by).name)}</span>${m.by === me ? `<button class="link danger" data-del-story="${m.id}">Supprimer</button>` : ""}</div>
        </div>
      </article>`;
    }).join("");
    $app.innerHTML = pageHead("Votre frise", "Notre histoire") + (f ? `
      <section class="card">
        <h3>Nouveau moment</h3>
        <input type="date" id="sD" value="${todayStr()}">
        <div class="emoji-pick">${MOMENT_EMOJIS.map((e, i) => `<button class="${(f.emoji || "💞") === e ? "on" : ""}" data-em="${e}">${e}</button>`).join("")}</div>
        <input id="sT" placeholder="Titre (ex. Notre rencontre, Premier culte ensemble…)">
        <textarea id="sX" rows="3" placeholder="Raconte ce moment…"></textarea>
        <label class="photo-in">📷 Ajouter une photo<input type="file" id="sP" accept="image/*" hidden></label>
        <img id="sPrev" class="m-photo" hidden alt="">
        <div class="row between"><button class="btn ghost sm" id="sCancel">Annuler</button><button class="btn sm" id="sSave">Enregistrer</button></div>
      </section>` : `<button class="btn full" id="sNew">+ Ajouter un moment</button>`) + `
      ${timeline ? `<div class="timeline">${timeline}</div>` : `<p class="muted center-text small" style="margin-top:20px">Votre histoire commence ici : ajoutez votre rencontre, vos premières fois, vos prières exaucées…</p>`}` + nav("histoire");

    const nw = $app.querySelector("#sNew"); if (nw) nw.onclick = () => { ui.storyForm = { emoji: "💞" }; renderHistoire(); };
    if (f) {
      $app.querySelectorAll("[data-em]").forEach((b) => b.onclick = () => { f.emoji = b.dataset.em; $app.querySelectorAll("[data-em]").forEach((x) => x.classList.toggle("on", x === b)); });
      $app.querySelector("#sCancel").onclick = () => { ui.storyForm = null; renderHistoire(); };
      $app.querySelector("#sP").onchange = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        try { f.photo = await compressImage(file); const pv = $app.querySelector("#sPrev"); pv.src = f.photo; pv.hidden = false; }
        catch (err) { toast("Photo illisible"); }
      };
      $app.querySelector("#sSave").onclick = async (e) => {
        const title = $app.querySelector("#sT").value.trim(); if (!title) return toast("Donne un titre au moment");
        e.target.disabled = true; e.target.textContent = "Enregistrement…";
        const id = newId();
        try {
          if (f.photo) { await Store.setBlob(id, f.photo); blobCache[id] = f.photo; }
          await Store.set(`story/${id}`, { date: $app.querySelector("#sD").value || todayStr(), emoji: f.emoji || "💞", title, text: $app.querySelector("#sX").value.trim(), by: me, at: Date.now(), hasPhoto: !!f.photo });
          ui.storyForm = null; toast("Moment ajouté 📸"); render();
        } catch (err) { toast("Erreur : " + err.message); e.target.disabled = false; e.target.textContent = "Enregistrer"; }
      };
    }
    $app.querySelectorAll("[data-photo]").forEach((img) => {
      const id = img.dataset.photo;
      if (blobCache[id]) img.src = blobCache[id];
      else Store.getBlob(id).then((src) => { if (src) { blobCache[id] = src; img.src = src; } }).catch(() => {});
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

  // ---------- 📊 Bilan d'un parcours ----------
  function renderBilan(pid) {
    const pc = PARCOURS.find((x) => x.id === pid);
    if (!pc) return go("#/plus");
    const doneW = pc.weeks.filter((wk) => weekState(wk.id).both);
    const st = { a: { pts: 0, ok: 0, tot: 0, kw: 0, memo: 0, defi: 0 }, b: { pts: 0, ok: 0, tot: 0, kw: 0, memo: 0, defi: 0 } };
    let bonus = 0;
    const perfect = [], opens = [], lastDone = Math.max(0, ...doneW.map((wk) => Math.max(prog(wk.id, "a").submitted || 0, prog(wk.id, "b").submitted || 0)));
    pc.weeks.forEach((wk) => {
      const pts = weekPoints(wk.id); bonus += pts.bonus;
      ["a", "b"].forEach((u) => { const p = prog(wk.id, u); st[u].pts += pts[u]; if (p.keyword) st[u].kw++; if (p.memo) st[u].memo++; if (p.defi) st[u].defi++; });
    });
    doneW.forEach((wk) => {
      const A = prog(wk.id, "a").answers || {}, B = prog(wk.id, "b").answers || {};
      wk.questions.forEach((q) => {
        if (q.type === "ouverte") { opens.push({ wk, q, a: A[q.id]?.self, b: B[q.id]?.self }); return; }
        const ga = guessScore(q, A[q.id]?.guess, B[q.id]?.self), gb = guessScore(q, B[q.id]?.guess, A[q.id]?.self);
        st.a.tot++; st.b.tot++; if (ga) st.a.ok++; if (gb) st.b.ok++;
        if (ga === 10 && gb === 10) perfect.push({ wk, q, a: A[q.id]?.self, b: B[q.id]?.self });
      });
    });
    const prayers = listOf("prayers/").filter((p) => p.week != null && WK[p.week] && WK[p.week].parcours.id === pid);
    const complete = pc.weeks.length > 0 && doneW.length === pc.weeks.length;
    const pct = (u) => (st[u].tot ? Math.round((st[u].ok / st[u].tot) * 100) : 0);
    const statRow = (label, k) => `<tr><td>${label}</td><td>${st.a[k]}</td><td>${st.b[k]}</td></tr>`;
    $app.innerHTML = pageHead(complete ? "🎉 Parcours terminé" : `Bilan en cours · ${doneW.length}/${pc.weeks.length} semaines`, `${pc.emoji} ${esc(pc.title)}`, "#/plus") + `
      ${complete ? `<section class="card center-text bilan-hero">${houseSVG(7)}<p>Terminé le <strong>${new Date(lastDone).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>. Votre maison est bâtie sur le roc !</p></section>` : ""}
      <section class="card">
        <div class="eyebrow">Les chiffres</div>
        <table class="g-table bilan-t">
          <tr><th></th><th>${avatar("a", "sm")} ${esc(P("a").name)}</th><th>${avatar("b", "sm")} ${esc(P("b").name)}</th></tr>
          ${statRow("Points", "pts")}
          <tr><td>Paris justes</td><td>${st.a.ok}/${st.a.tot} (${pct("a")} %)</td><td>${st.b.ok}/${st.b.tot} (${pct("b")} %)</td></tr>
          ${statRow("Mots cachés trouvés", "kw")}${statRow("Versets mémorisés", "memo")}${statRow("Défis relevés", "defi")}
        </table>
        <p class="small muted">+ ${bonus} points bonus gagnés à deux · total du parcours : <strong>${st.a.pts + st.b.pts + bonus}</strong></p>
      </section>
      ${perfect.length ? `<h2 class="section">🎯 Vos plus beaux paris</h2><p class="small muted">Les questions où vous vous êtes devinés tous les deux.</p>
        ${perfect.slice(0, 8).map((x) => `<section class="card"><div class="eyebrow">${esc(weekLabel(x.wk))}</div><h4>${esc(x.q.text)}</h4>
          <div class="ans-grid"><div class="ans">${avatar("a", "sm")}<p>${esc(answerLabel(x.q, x.a))}</p></div><div class="ans">${avatar("b", "sm")}<p>${esc(answerLabel(x.q, x.b))}</p></div></div></section>`).join("")}` : ""}
      ${opens.length ? `<h2 class="section">💬 Vos réponses ouvertes</h2>
        ${opens.map((x) => `<section class="card"><div class="eyebrow">${esc(weekLabel(x.wk))}</div><h4>${esc(x.q.text)}</h4>
          <div class="ans-grid"><div class="ans">${avatar("a", "sm")}<p>${esc(x.a || "—")}</p></div><div class="ans">${avatar("b", "sm")}<p>${esc(x.b || "—")}</p></div></div></section>`).join("")}` : ""}
      <h2 class="section">🎯 Les défis</h2>
      ${pc.weeks.map((wk) => { const a = prog(wk.id, "a").defi, b = prog(wk.id, "b").defi; return `<div class="card defi-line"><span class="small muted">S${wk.n}</span><p>${esc(wk.defi)}</p><span>${a ? avatar("a", "sm") : ""}${b ? avatar("b", "sm") : ""}${!a && !b ? `<span class="small muted">—</span>` : ""}</span></div>`; }).join("")}
      ${prayers.length ? `<h2 class="section">🙏 Prières de ce parcours</h2>${prayers.map((p) => `<div class="card"><p>${esc(p.text)}</p><span class="small ${p.answered ? "ok" : "muted"}">${avatar(p.by, "sm")} ${p.answered ? "Exaucée 🙌" : "En prière"}</span></div>`).join("")}` : ""}
      ${doneW.length === 0 ? `<p class="muted center-text">Terminez une première semaine à deux pour voir votre bilan se remplir.</p>` : ""}` + nav("plus");
  }

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
      <h2 class="section">🌓 Apparence</h2>
      <div class="tabs">${THEMES.map(([v, l]) => `<button data-theme-set="${v}" class="${getTheme() === v ? "on" : ""}">${l}</button>`).join("")}</div>
      <p class="small muted pc-desc">Auto suit le réglage de ton appareil · « Le soir » passe en sombre de 20 h à 7 h.</p>
      <footer class="foot small muted">
        Joueur : <strong>${esc(P(me).name)}</strong> · ${FB ? `<a href="#" id="logout">se déconnecter</a>` : `<a href="#/joueur">changer</a>`}
        ${Store.mode === "local" ? ` · <a href="#" id="reset">réinitialiser (test)</a>` : ""}
        <div><a href="#" id="export">💾 Télécharger une sauvegarde de nos données</a></div>
        <div>Texte biblique : Louis Segond 1910</div>
      </footer>` + nav("plus");
    const lo = document.getElementById("logout");
    if (lo) lo.onclick = (e) => { e.preventDefault(); Store.signOut(); };
    document.getElementById("export").onclick = (e) => { e.preventDefault(); exportData(); };
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

  // ---------- 📖 Plan de lecture à deux ----------
  // Un seul plan actif (clé lecture-plan). Lecture : lecture/<plan>/<jour>/<joueur> = { at, note }.
  // À votre rythme : le jour suivant s'ouvre quand vous avez lu tous les deux le jour en cours.
  const PLANS = window.LECTURE_PLANS || [];
  const planById = (id) => PLANS.find((p) => p.id === id);
  const activePlan = () => { const a = Store.get("lecture-plan"); return a ? planById(a.id) || null : null; };
  const readOf = (pid, d, u) => Store.get(`lecture/${pid}/${d}/${u}`);
  const bothRead = (pid, d) => !!(readOf(pid, d, "a") && readOf(pid, d, "b"));
  // premier jour pas encore lu par vous deux (> nombre de jours = plan terminé)
  function planDay(p) { let d = 1; while (d <= p.days.length && bothRead(p.id, d)) d++; return d; }
  const planDone = (p) => p.days.filter((_, i) => bothRead(p.id, i + 1)).length;
  // « Jean 3 – 4 », « Psaumes 1 – 3 », « Marc 16 · Luc 1 »
  function dayRef(p, d) {
    const groups = [];
    (p.days[d - 1] || []).forEach(([b, c]) => { const g = groups[groups.length - 1]; if (g && g.b === b) g.to = c; else groups.push({ b, from: c, to: c }); });
    return groups.map((g) => `${BOOKS[g.b - 1]} ${g.from}${g.to !== g.from ? ` – ${g.to}` : ""}`).join(" · ");
  }
  // série : jours de calendrier consécutifs où vous avez terminé une lecture à deux
  function readingStreak(p) {
    const days = new Set();
    for (let d = 1; d <= p.days.length; d++) {
      const a = readOf(p.id, d, "a"), b = readOf(p.id, d, "b");
      if (a && b) days.add(todayStr(new Date(Math.max(a.at, b.at))));
    }
    const cur = new Date(); if (!days.has(todayStr(cur))) cur.setDate(cur.getDate() - 1);
    let n = 0; while (days.has(todayStr(cur))) { n++; cur.setDate(cur.getDate() - 1); }
    return n;
  }
  const progBar = (done, total) => `<span class="pc-prog"><span style="width:${Math.round((done / (total || 1)) * 100)}%"></span></span>`;
  function readingCardHTML() {
    const p = activePlan();
    if (!p) return `<a class="card reading-card" href="#/lecture"><div class="eyebrow">📖 Lecture à deux</div><strong>Lire la Bible ensemble, à votre rythme</strong><div class="small muted">Choisir un plan →</div></a>`;
    const d = planDay(p), done = planDone(p), o = other(me);
    if (d > p.days.length) return `<a class="card reading-card" href="#/lecture"><div class="eyebrow">📖 ${esc(p.title)}</div><strong>🎉 Plan terminé !</strong><div class="small muted">Choisir le suivant →</div></a>`;
    const st = (u) => readOf(p.id, d, u) ? `${avatar(u, "sm")} lu ✓` : `${avatar(u, "sm")} <span class="muted">pas encore</span>`;
    return `<a class="card reading-card" href="#/lecture">
      <div class="row between tight"><div class="eyebrow">📖 Lecture du jour · ${d}/${p.days.length}</div>${readingStreak(p) ? `<span class="small">${readingStreak(p)} 🔥</span>` : ""}</div>
      <strong class="reading-ref">${esc(dayRef(p, d))}</strong>
      ${progBar(done, p.days.length)}
      <div class="row between"><span class="small">${st(me)} &nbsp; ${st(o)}</span><span class="btn sm">${readOf(p.id, d, me) ? "Voir" : "Lire"} →</span></div>
    </a>`;
  }
  function renderPlanChoice(cur) {
    $app.innerHTML = pageHead("Lecture à deux", "Choisir un plan", cur ? "#/lecture" : "") + `
      <p class="pc-desc">Chacun lit de son côté, coche « J'ai lu » et note ce qui l'a marqué. Le jour suivant s'ouvre quand vous avez lu tous les deux : personne ne prend de retard.</p>
      <div class="plan-grid">${PLANS.map((p) => { const done = planDone(p); return `<article class="card plan ${cur && cur.id === p.id ? "on" : ""}">
        <span class="plan-emoji">${p.emoji}</span><h3>${esc(p.title)}</h3><p class="small muted">${esc(p.desc)}</p>
        ${done ? `${progBar(done, p.days.length)}<p class="small muted">${done}/${p.days.length} jours lus</p>` : ""}
        <button class="btn ${cur && cur.id === p.id ? "ghost" : ""} full" data-plan="${p.id}">${cur && cur.id === p.id ? "Plan en cours" : done >= p.days.length ? "Recommencer la lecture" : done ? "Reprendre" : "Commencer"}</button>
      </article>`; }).join("")}</div>` + nav("lecture");
    $app.querySelectorAll("[data-plan]").forEach((b) => b.onclick = async () => {
      const p = planById(b.dataset.plan);
      if (cur && cur.id === p.id) return go("#/lecture");
      if (planDone(p) >= p.days.length && !confirm("Ce plan est terminé. Effacer vos lectures pour le recommencer ?")) return;
      if (planDone(p) >= p.days.length) for (let d = 1; d <= p.days.length; d++) for (const u of ["a", "b"]) if (readOf(p.id, d, u)) await Store.remove(`lecture/${p.id}/${d}/${u}`);
      await Store.set("lecture-plan", { id: p.id, by: me, at: Date.now() });
      toast(`${p.emoji} ${p.title} : c'est parti !`); go("#/lecture");
    });
  }
  function renderLecture(arg) {
    const p = activePlan();
    if (!p || arg === "plans") return renderPlanChoice(p);
    const cur = planDay(p), total = p.days.length, o = other(me);
    if (cur > total && !arg) {
      $app.innerHTML = pageHead("Lecture à deux", p.title) + `<section class="card center-text"><div class="big-emoji">🎉</div><h2>Plan terminé !</h2>
        <p class="muted">Vous avez lu ensemble les ${total} jours de « ${esc(p.title)} ».</p><a class="btn full" href="#/lecture/plans">Choisir un nouveau plan</a></section>` + nav("lecture");
      return;
    }
    const d = Math.min(Math.max(+arg || cur, 1), Math.min(cur, total));
    const mine = readOf(p.id, d, me), theirs = readOf(p.id, d, o), both = mine && theirs, chs = p.days[d - 1];
    let readBox;
    if (!mine) readBox = `<div class="eyebrow">✍️ Ce qui m'a marqué</div>
      <textarea id="lnNote" rows="3" placeholder="Une phrase, un verset… (facultatif — ${esc(P(o).name)} la verra quand vous aurez lu tous les deux)"></textarea>
      <button class="btn full" id="lnDone">✓ J'ai lu</button>${theirs ? `<p class="small muted center-text">${esc(P(o).name)} a déjà lu 👀</p>` : ""}`;
    else if (!theirs) readBox = `<div class="eyebrow">✓ Tu as lu</div>${mine.note ? `<div class="ans">${avatar(me, "sm")}<p>${esc(mine.note)}</p></div>` : ""}<p class="small muted">⏳ En attente de ${esc(P(o).name)} pour ouvrir le jour suivant…</p>`;
    else readBox = `<div class="eyebrow">💬 Ce qui vous a marqués</div>
      <div class="ans-grid"><div class="ans">${avatar(me, "sm")}<p>${esc(mine.note || "—")}</p></div><div class="ans">${avatar(o, "sm")}<p>${esc(theirs.note || "—")}</p></div></div>
      ${d < total ? `<a class="btn full" href="#/lecture/${d + 1}">Jour ${d + 1} →</a>` : `<a class="btn full" href="#/lecture">🎉 Terminer le plan</a>`}`;
    const cells = p.days.map((_, i) => {
      const n = i + 1, open = n <= cur, cls = bothRead(p.id, n) ? "both" : readOf(p.id, n, me) || readOf(p.id, n, o) ? "half" : "";
      return open ? `<a class="day-cell ${cls} ${n === d ? "on" : ""}" href="#/lecture/${n}" title="Jour ${n} · ${esc(dayRef(p, n))}">${n}</a>` : `<span class="day-cell locked">${n}</span>`;
    }).join("");
    $app.innerHTML = pageHead("Lecture à deux", `${p.emoji} ${esc(p.title)}`) + `
      <div class="reading-layout">
        <section class="card r-prog">
          <div class="row between tight"><div class="eyebrow">Jour ${d} sur ${total}</div><a class="small" href="#/lecture/plans">Changer de plan</a></div>
          <h2 class="reading-ref">${esc(dayRef(p, d))}</h2>
          ${progBar(planDone(p), total)}
          <div class="row between"><span class="small">${planDone(p)} jour${planDone(p) > 1 ? "s" : ""} lu${planDone(p) > 1 ? "s" : ""} à deux</span>${readingStreak(p) ? `<span class="small">${readingStreak(p)} jour${readingStreak(p) > 1 ? "s" : ""} de suite 🔥</span>` : ""}</div>
        </section>
        <div class="r-text">${chs.map(([b, c], i) => `<article class="card passage">
          <div class="passage-head"><div class="eyebrow">${BOOKS[b - 1]} ${c}</div>${TTS ? `<button class="listen" data-listen="${i}" aria-label="Écouter ${BOOKS[b - 1]} ${c}">🔊 Écouter</button>` : ""}</div>
          <div class="verses" id="ch${i}"><p class="muted small">Chargement du texte…</p></div></article>`).join("")}</div>
        <section class="card r-read">${readBox}</section>
        <details class="card r-days" ${innerWidth >= 1000 ? "open" : ""}><summary>📅 Tous les jours</summary><div class="day-grid">${cells}</div></details>
      </div>` + nav("lecture");
    const load = (i) => {
      const [b, c] = chs[i], el = $app.querySelector("#ch" + i); if (!el) return;
      el.innerHTML = `<p class="muted small">Chargement du texte…</p>`;
      Bible.chapter(b, c).then((t) => {
        const node = $app.querySelector("#ch" + i); if (!node) return;
        if (t && Object.keys(t).length) node.innerHTML = versesHTML(t);
        else { node.innerHTML = `<p class="muted small">Texte indisponible (pas de connexion ?). Tu peux lire ${BOOKS[b - 1]} ${c} dans ta Bible.</p><button class="link" data-retry="${i}">Réessayer</button>`; node.querySelector("[data-retry]").onclick = () => load(i); }
      });
    };
    chs.forEach((_, i) => load(i));
    $app.querySelectorAll("[data-listen]").forEach((b) => b.onclick = () => speakPassage($app.querySelector("#ch" + b.dataset.listen), b));
    const btn = $app.querySelector("#lnDone");
    if (btn) btn.onclick = async () => {
      btn.disabled = true;
      await Store.set(`lecture/${p.id}/${d}/${me}`, { at: Date.now(), note: $app.querySelector("#lnNote").value.trim() });
      if (readOf(p.id, d, o)) { confetti(); toast(d < total ? `Jour ${d + 1} débloqué 📖` : "Plan terminé 🎉"); } else toast("Lecture notée ✓");
      // on reste sur ce jour pour découvrir ce qui a marqué l'autre, avant de passer au suivant
      if (location.hash !== `#/lecture/${d}`) go(`#/lecture/${d}`); else render();
    };
  }

  // ---------- navigation : barre du bas (mobile) + menu latéral (ordinateur) ----------
  const SIDE = [
    ["Au quotidien", [["home", "#/", "🏡", "Accueil"], ["lecture", "#/lecture", "📖", "Lecture"], ["soir", "#/soir", "🌙", "Ce soir"]]],
    ["Ensemble", [["histoire", "#/histoire", "📸", "Histoire"], ["lettres", "#/lettres", "💌", "Lettres"], ["journal", "#/journal", "🙏", "Journal de prière"], ["promesses", "#/promesses", "✍️", "Promesses"], ["bocal", "#/bocal", "🫙", "Bocal à idées"], ["dates", "#/dates", "📅", "Nos dates"]]],
    ["Plus", [["creer", "#/creer", "✨", "Créer une semaine"], ["plus", "#/plus", "⚙️", "Bilans & réglages"]]]
  ];
  const SIDE_ALIAS = { semaine: "home", bilan: "plus" };
  function drawSide(route) {
    const el = document.getElementById("side"); if (!el) return;
    const active = SIDE_ALIAS[route] || route, b = navBadges();
    el.innerHTML = `
      <a class="side-brand" href="#/"><span class="side-logo">🪢</span><span><strong>${esc(CFG.appName)}</strong><span class="duo">${avatar("a", "sm")}${avatar("b", "sm")}</span></span></a>
      ${SIDE.map(([t, items]) => `<div class="side-group"><div class="eyebrow">${t}</div>${items.map(([id, h, ic, l]) =>
        `<a href="${h}" class="side-link ${id === active ? "on" : ""}"${id === active ? ' aria-current="page"' : ""}><span class="ni">${ic}</span><span class="grow">${l}</span>${b[id] ? '<i class="side-badge" aria-label="nouveau"></i>' : ""}</a>`).join("")}</div>`).join("")}
      <div class="side-foot">${avatar(me, "sm")}<span class="grow small">${esc(P(me).name)}</span>${FB ? `<button class="link small" id="sideOut">Déconnexion</button>` : `<a class="small" href="#/joueur">Changer</a>`}</div>`;
    const so = el.querySelector("#sideOut"); if (so) so.onclick = () => Store.signOut();
  }

  // ---------- 🫙 Bocal à idées de sorties ----------
  const IDEA_CATS = [["maison", "🏠", "À la maison"], ["dehors", "🌳", "Dehors"], ["resto", "🍽️", "Resto / café"], ["gratuit", "💸", "Gratuit"], ["escapade", "✈️", "Escapade"]];
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
          <div class="row between"><button class="btn sm" id="ideaDone">✔ On l'a fait !</button><button class="link" id="ideaAgain">Une autre</button></div>
        </div>` : ""}
      </section></div><div class="split-b">
      <section class="card">
        <div class="eyebrow">➕ Ajouter une idée</div>
        <input id="idT" placeholder="Pique-nique au bord du lac, soirée crêpes, musée…" maxlength="160">
        <select id="idC">${IDEA_CATS.map(([v, e, l]) => `<option value="${v}">${e} ${l}</option>`).join("")}</select>
        <button class="btn full" id="idAdd">Mettre dans le bocal</button>
      </section>
      ${todo.length ? `<details class="card idea-list"><summary>Voir les idées du bocal (${todo.length})</summary>
        ${todo.map((x) => `<div class="idea-row"><span>${catOf(x.cat)[1]}</span><span class="grow">${esc(x.text)}<br><span class="small muted">${esc(P(x.by).name)} · ${fmtDate(x.at)}</span></span><button class="link danger" data-idea-del="${x.id}">Retirer</button></div>`).join("")}
      </details>` : ""}
      ${done.length ? `<h2 class="section">✔ Déjà faites</h2>${done.map((x) => `<div class="card idea-row done"><span>${catOf(x.cat)[1]}</span><span class="grow">${esc(x.text)}<br><span class="small muted">Faite le ${fmtDate(x.doneAt)}</span></span><button class="link" data-idea-back="${x.id}">Remettre</button></div>`).join("")}` : ""}</div></div>` + nav("plus");

    $app.querySelectorAll("[data-cat]").forEach((b) => b.onclick = () => { ui.bocalCat = b.dataset.cat; renderBocal(); });
    $app.querySelector("#idAdd").onclick = async () => {
      const t = $app.querySelector("#idT").value.trim(); if (!t) return;
      await Store.set(`idees/${newId()}`, { text: t, cat: $app.querySelector("#idC").value, by: me, at: Date.now(), done: false });
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
      <div class="row between">${d.inDays >= 0 ? `<button class="chip-btn" data-ics="${d.id}">📅 Ajouter à mon calendrier</button>` : "<span></span>"}<button class="link danger" data-date-del="${d.id}">Supprimer</button></div>
    </article>`;
    $app.innerHTML = pageHead("Ensemble", "Nos dates", "#/plus") + `<div class="split"><div class="split-a">
      <section class="card">
        <div class="eyebrow">➕ Ajouter une date</div>
        <div class="emoji-pick">${DATE_EMOJIS.map((e) => `<button class="${e === ui.dateEmoji ? "on" : ""}" data-demoji="${e}">${e}</button>`).join("")}</div>
        <input id="dT" placeholder="Notre rencontre, fiançailles, anniversaire de ${esc(P(other(me)).name)}…" maxlength="80">
        <input type="date" id="dD">
        <label class="check-row"><input type="checkbox" id="dR" checked> Revient chaque année (anniversaire)</label>
        <select id="dRem">${[[1, "1 jour"], [3, "3 jours"], [7, "1 semaine"], [14, "2 semaines"], [30, "1 mois"]].map(([v, l]) => `<option value="${v}" ${v === 7 ? "selected" : ""}>🔔 Rappel ${l} avant</option>`).join("")}</select>
        <button class="btn full" id="dAdd">Ajouter</button>
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
      await Store.set(`dates/${newId()}`, { title, date, emoji: ui.dateEmoji, recurring: $app.querySelector("#dR").checked, remind: +$app.querySelector("#dRem").value, by: me, at: Date.now() });
      toast("Date ajoutée 📅"); renderDates();
    };
    $app.querySelectorAll("[data-ics]").forEach((b) => b.onclick = () => {
      const d = all.find((x) => x.id === b.dataset.ics);
      downloadFile(`${d.title.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.ics`, icsFor(d), "text/calendar");
    });
    $app.querySelectorAll("[data-date-del]").forEach((b) => b.onclick = async () => {
      if (!confirm("Supprimer cette date ?")) return;
      await Store.remove(`dates/${b.dataset.dateDel}`); renderDates();
    });
  }

  // ---------- 🌓 Thème clair / sombre ----------
  const THEME_KEY = "bc-theme";
  const THEMES = [["auto", "Auto"], ["soir", "Le soir"], ["light", "Clair"], ["dark", "Sombre"]];
  const getTheme = () => { try { return localStorage.getItem(THEME_KEY) || "auto"; } catch (e) { return "auto"; } };
  const darkMQ = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : { matches: false };
  function applyTheme() {
    const t = getTheme(), h = new Date().getHours();
    const dark = t === "dark" || (t === "auto" && darkMQ.matches) || (t === "soir" && (h >= 20 || h < 7));
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = dark ? "#17130f" : "#f5efe7";
  }
  if (darkMQ.addEventListener) darkMQ.addEventListener("change", applyTheme);
  setInterval(applyTheme, 60000); applyTheme();

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
  // =====================================================================

  // ---------- démarrage ----------
  function boot() {
    Store = window.Store;
    guardStore(Store); netBanner();
    Store.subscribe(onStoreChange);
    Store.init().then(render);
  }
  if (FB) {
    if (!CFG.firebaseConfig) $app.innerHTML = `<div class="screen center"><h2>Config Firebase manquante</h2><p class="muted">Colle firebaseConfig dans js/config.js.</p></div>`;
    else if (window.Store && window.Store.mode === "firebase") boot();
    else window.addEventListener("store-ready", boot, { once: true });
  } else boot();
})();
