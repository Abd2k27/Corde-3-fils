// Routeur (#/page/argument) et mise à jour quand l'autre joue
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
  markVisit(); // dernière visite (suivi des absences), une écriture par jour au plus
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
