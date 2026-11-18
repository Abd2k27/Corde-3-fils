// Écrans hors appli : guide, choix du joueur, connexion, messages
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
