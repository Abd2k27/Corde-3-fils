// Une semaine de parcours : carte, lecture, mémo, questions, révélation, défi
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
    <div class="week-layout ${step >= 3 ? "has-aside" : ""}"><main id="stepBody"></main>${step >= 3 ? weekAsideHTML(wk) : ""}</div>`;
  $app.querySelectorAll(".dot").forEach((d) => d.onclick = () => {
    const s = +d.dataset.s;
    if (s === 3 || s <= step || weekState(w).mine || s <= 2) { ui.step[w] = s; renderWeek(w); }
  });
  if (step >= 3) wk.passages.forEach((ps, i) => Bible.passage(ps).then((t) => { const n = $app.querySelector("#wa" + i); if (t && n) n.innerHTML = versesHTML(t); }));
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
// Sur ordinateur, à partir des questions, le passage reste affiché dans une colonne à droite
// (pas pendant le mémo : il donnerait les réponses). Masqué sur mobile.
function weekAsideHTML(wk) {
  return `<aside class="card week-aside" aria-label="Le passage de la semaine"><div class="eyebrow">📖 Le passage</div>
    ${wk.passages.map((ps, i) => `<h4>${esc(ps.ref)}</h4><div class="verses" id="wa${i}">${versesHTML(ps.text)}</div>`).join("")}</aside>`;
}

function stepRead(wk, el) {
  const w = wk.id, p = prog(w, me), kw = wk.keyword;
  el.innerHTML = `<div class="read-layout"><div class="read-main">
    ${wk.passages.map((ps, i) => `
      <article class="card passage">
        <div class="passage-head"><div class="eyebrow">${esc(ps.ref)}</div>${TTS ? `<button class="listen" data-listen="${i}" aria-label="Écouter le passage">🔊 Écouter</button>` : ""}</div>
        <div class="verses" id="ps${i}">${versesHTML(ps.text)}</div>
      </article>`).join("")}
    </div><div class="read-side">
    ${kw ? `<section class="card kw">
      <div class="eyebrow">🔎 Mot caché</div>
      <p>${esc(kw.hint)}</p>
      <div id="kwZone"></div>
    </section>` : ""}
    <button class="btn full" id="nx">Continuer →</button></div></div>`;
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
