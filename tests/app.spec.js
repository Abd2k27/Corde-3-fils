// Tests de bout en bout du site (mode local, sans Firebase). Lancer : `npm test`
const { test, expect, jour, donnees, aller } = require("./outils");

const PAGES = ["#/", "#/lecture", "#/lecture/plans", "#/soir", "#/histoire", "#/lettres", "#/journal", "#/promesses", "#/bocal",
  "#/dates", "#/plus", "#/creer", "#/semaine/1", "#/bilan/couple", "#/guide"];

test("chaque page s'affiche sans erreur", async ({ ouvrir }) => {
  const page = await ouvrir();
  for (const chemin of PAGES) {
    await aller(page, chemin);
    await expect(page.locator("#app h1, #app h2, #app strong").first(), chemin).toBeVisible();
  }
});

test("navigation : menu latéral sur ordinateur, barre du bas sur mobile", async ({ ouvrir }, info) => {
  const page = await ouvrir();
  if (info.project.name === "ordinateur") {
    await expect(page.locator("#side")).toBeVisible();
    await expect(page.locator(".bottom-nav")).toBeHidden();
    await page.locator("#side .side-link", { hasText: "Bocal à idées" }).click();
    await expect(page.locator("h1")).toHaveText("Bocal à idées");
  } else {
    await expect(page.locator("#side")).toBeHidden();
    await page.locator(".bottom-nav a", { hasText: "Lecture" }).click();
    await expect(page.locator("h1")).toContainText("Choisir un plan");
  }
});

test("semaine : de la carte au mot caché", async ({ ouvrir }) => {
  const page = await ouvrir({ chemin: "#/semaine/1" });
  await page.locator("#flip").click(); // il faut retourner la carte pour continuer
  await page.locator("#nx").click();
  await expect(page.locator(".passage").first()).toContainText("Genèse 2:18-25");
  await page.locator("#kwIn").fill("aimera");
  await page.locator("#kwOk").click();
  await expect(page.locator("#kwZone")).toContainText("Pas tout à fait");
  await page.locator("#kwIn").fill("attachera");
  await page.locator("#kwOk").click();
  await expect(page.locator("#kwZone")).toContainText("Trouvé");
  expect((await donnees(page))["progress/1/a"]).toMatchObject({ keyword: true, kwDone: true });
});

test("question du jour : la question proposée passe en premier et reste liée à la réponse", async ({ ouvrir }) => {
  const page = await ouvrir({ chemin: "#/soir", donnees: { "soirq/q1": { text: "Ma question perso ?", by: "b", at: 1 } } });
  await expect(page.locator(".soir h3").first()).toHaveText("Ma question perso ?");
  await expect(page.locator(".soir").first()).toContainText("Proposée par");
  await page.locator("[data-soir-in]").fill("Ma réponse");
  await page.locator("[data-soir-send]").click();
  expect((await donnees(page))[`soir/${jour()}/a`]).toMatchObject({ a: "Ma réponse", q: "Ma question perso ?" });
});

test("bocal : coller une liste puis tirer une idée", async ({ ouvrir }) => {
  const page = await ouvrir({ chemin: "#/bocal", donnees: { "idees/x": { text: "Soirée crêpes", cat: "maison", by: "a", at: 1, done: false } } });
  await page.locator(".idea-paste summary").click();
  await page.locator("#ipT").fill("- [ ] ⚽ Faire du basket — H-O-R-S-E à deux\nSoirée crêpes\n🙏 Prier ensemble");
  await expect(page.locator("#ipPrev")).toContainText("2 idées à ajouter, dont 1 avec astuce · 1 déjà dans le bocal");
  await page.locator("#ipAdd").click();
  const idees = Object.values(await donnees(page)).filter((v) => v && v.cat);
  expect(idees.map((x) => [x.text, x.cat, x.tip]).sort()).toEqual([["Faire du basket", "sport", "H-O-R-S-E à deux"], ["Prier ensemble", "foi", ""], ["Soirée crêpes", "maison", undefined]]);
  await page.locator("#draw").click();
  await expect(page.locator(".idea-paper")).toBeVisible({ timeout: 4000 });
});

test("nos dates : ajout et compte à rebours sur l'accueil", async ({ ouvrir }) => {
  const page = await ouvrir({ chemin: "#/dates" });
  await page.locator("#dT").fill("Notre rencontre");
  await page.locator("#dD").fill(jour(3).replace(/^\d{4}/, "2022"));
  await page.locator("#dAdd").click();
  await expect(page.locator(".date-item")).toContainText("Notre rencontre");
  await aller(page, "#/");
  await expect(page.locator(".countdown")).toContainText("Notre rencontre");
  await expect(page.locator(".countdown .cd-num b")).toHaveText("3");
});

test("lecture à deux : le jour suivant s'ouvre quand les deux ont lu", async ({ ouvrir }) => {
  const a = await ouvrir({ chemin: "#/lecture/plans" });
  await a.locator('[data-plan="proverbes"]').click();
  await expect(a.locator(".r-prog .reading-ref")).toHaveText("Proverbes 1");
  await a.locator("#lnNote").fill("La crainte de l'Éternel");
  await a.locator("#lnDone").click();
  await expect(a.locator(".r-read")).toContainText("En attente de");
  // l'autre joueur lit à son tour dans un autre onglet
  const b = await ouvrir({ joueur: "b", chemin: "#/lecture" });
  await expect(b.locator(".r-read")).toContainText("a déjà lu");
  await b.locator("#lnDone").click();
  await expect(b.locator(".r-read")).toContainText("La crainte de l'Éternel");
  await expect(b.locator(".r-read a.btn")).toHaveText("Jour 2 →");
});

test("une erreur d'enregistrement est signalée", async ({ ouvrir, erreurs }) => {
  const page = await ouvrir({ chemin: "#/soir" });
  await page.evaluate(() => { const o = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === "bc-data-v1") throw new Error("QuotaExceededError"); return o.call(this, k, v); }; });
  await page.locator("[data-soir-in]").fill("test");
  await page.locator("[data-soir-send]").click();
  await expect(page.locator("#toast")).toContainText("⚠️");
  expect(erreurs.join()).toContain("Stockage local plein"); // l'appli consigne l'erreur dans la console : attendu ici
  erreurs.length = 0;
});

test("thème sombre", async ({ ouvrir }) => {
  const page = await ouvrir({ chemin: "#/plus" });
  await page.locator('[data-theme-set="dark"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("modifier une idée du bocal", async ({ ouvrir }) => {
  const page = await ouvrir({ chemin: "#/bocal", donnees: { "idees/x": { text: "Soirée crepes", cat: "maison", tip: "", by: "a", at: 1, done: false } } });
  await page.locator(".idea-list summary").click();
  await page.locator('[data-idea-edit="x"]').click();
  await page.locator("#ieT").fill("Soirée crêpes");
  await page.locator("#ieC").selectOption("gratuit");
  await page.locator("#ieTip").fill("Farine, œufs, lait");
  await page.locator("#ieSave").click();
  await expect(page.locator(".idea-list")).toContainText("Farine, œufs, lait");
  expect((await donnees(page))["idees/x"]).toMatchObject({ text: "Soirée crêpes", cat: "gratuit", tip: "Farine, œufs, lait", by: "a" });
});

test("modifier une date", async ({ ouvrir }) => {
  const page = await ouvrir({ chemin: "#/dates", donnees: { "dates/d": { title: "Rencontre", date: "2022-01-10", emoji: "💞", recurring: true, remind: 7, by: "b", at: 1 } } });
  await page.locator('[data-date-edit="d"]').click();
  await expect(page.locator("#dT")).toHaveValue("Rencontre");
  await page.locator("#dT").fill("Notre rencontre");
  await page.locator('[data-demoji="💍"]').click();
  await page.locator("#dAdd").click();
  await expect(page.locator(".date-item")).toContainText("Notre rencontre");
  expect((await donnees(page))["dates/d"]).toMatchObject({ title: "Notre rencontre", emoji: "💍", date: "2022-01-10", by: "b" });
  expect(Object.keys(await donnees(page)).filter((k) => k.startsWith("dates/"))).toHaveLength(1);
});

test("modifier un moment de l'histoire", async ({ ouvrir }) => {
  const page = await ouvrir({ chemin: "#/histoire", donnees: { "story/s": { date: "2023-05-01", emoji: "💞", title: "Premier rendez-vous", text: "", by: "b", at: 1, hasPhoto: false } } });
  await page.locator('[data-edit-story="s"]').click();
  await expect(page.locator("#sT")).toHaveValue("Premier rendez-vous");
  await page.locator("#sX").fill("Au café du coin");
  await page.locator("#sSave").click();
  await expect(page.locator(".m-card")).toContainText("Au café du coin");
  expect((await donnees(page))["story/s"]).toMatchObject({ title: "Premier rendez-vous", text: "Au café du coin", by: "b", date: "2023-05-01" });
});

test("effets réduits : plus de flou", async ({ ouvrir }) => {
  const page = await ouvrir({ chemin: "#/plus" });
  const flou = () => page.locator(".tile").first().evaluate((e) => getComputedStyle(e).backdropFilter);
  expect(await flou()).not.toBe("none");
  await page.locator("#liteFx").check();
  await expect(page.locator("html")).toHaveClass(/lite/);
  expect(await flou()).toBe("none");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/lite/);
});

test("semaine sur ordinateur : le passage reste visible à côté des questions", async ({ ouvrir }, info) => {
  const page = await ouvrir({ chemin: "#/semaine/1", donnees: { "progress/1/a": { seen: true, kwDone: true, memoDone: true } } });
  const aside = page.locator(".week-aside");
  if (info.project.name === "ordinateur") {
    await expect(aside).toBeVisible();
    await expect(aside).toContainText("Genèse 2:18-25");
    const [q, a] = await Promise.all([page.locator("#stepBody").boundingBox(), aside.boundingBox()]);
    expect(a.x).toBeGreaterThan(q.x + q.width - 1); // à droite des questions
  } else {
    await expect(aside).toBeHidden();
  }
});

test.describe("hors ligne", () => {
  test.use({ serviceWorkers: "allow" });
  test("le site se rouvre sans réseau grâce au service worker", async ({ ouvrir, context }, info) => {
    test.skip(info.project.name !== "mobile", "un seul passage suffit");
    const page = await ouvrir({ chemin: "#/bocal", donnees: { "idees/x": { text: "Pique-nique", cat: "dehors", by: "a", at: 1, done: false } } });
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload(); // la page est désormais servie par le service worker
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator("h1")).toHaveText("Bocal à idées");
    await expect(page.locator("body")).toHaveClass(/offline/);
    await context.setOffline(false);
  });
});

test.describe("rendez-vous de la semaine", () => {
  const jourSemaine = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getDay(); };

  test("lancer le suivi : échéance dans 7 jours", async ({ ouvrir }) => {
    const page = await ouvrir();
    await page.locator("#ryStart").click();
    await expect(page.locator(".rythme")).toContainText("Encore 7 jours");
    expect((await donnees(page)).rythme).toMatchObject({ day: jourSemaine(0), since: jour(0), by: "a" });
    expect((await donnees(page))["vu/a"]).toBe(jour(0)); // dernière visite enregistrée
  });

  const fait = () => ({ submitted: Date.now(), answers: {} });
  test("la semaine faite le jour du départ ne compte pas pour l'échéance", async ({ ouvrir }) => {
    const page = await ouvrir({ donnees: { rythme: { day: jourSemaine(0), since: jour(0) }, "progress/1/a": fait(), "progress/1/b": fait() } });
    await expect(page.locator(".rythme")).toContainText("Encore 7 jours");
    await expect(page.locator(".rythme a.btn")).toHaveAttribute("href", "#/semaine/2");
  });
  test("une semaine finie à deux valide l'échéance", async ({ ouvrir }) => {
    const page = await ouvrir({ donnees: { rythme: { day: jourSemaine(-3), since: jour(-3) }, "progress/1/a": fait(), "progress/1/b": fait() } });
    await expect(page.locator(".rythme")).toContainText("Semaine faite");
    await expect(page.locator(".ry-dot.ok")).toHaveCount(1);
  });

  test("semaine manquée et absence signalées", async ({ ouvrir }) => {
    const page = await ouvrir({ donnees: { rythme: { day: jourSemaine(-10), since: jour(-10) }, "vu/b": jour(-9) } });
    const carte = page.locator(".rythme");
    await expect(carte).toHaveClass(/late/);
    await expect(carte).toContainText("Encore 4 jours");
    await expect(carte).toContainText("manquée");
    await expect(carte).toContainText("depuis 9 jours");
    await expect(page.locator(".ry-dot.missed")).toHaveCount(1);
    await expect(carte).toContainText("0/1 à l'heure");
  });

  test("réglages : rappel calendrier et arrêt du suivi", async ({ ouvrir }) => {
    const page = await ouvrir({ chemin: "#/plus", donnees: { rythme: { day: 3, since: jour(-2) } } });
    const [dl] = await Promise.all([page.waitForEvent("download"), page.locator("#ryIcs").click()]);
    const ics = require("fs").readFileSync(await dl.path(), "utf8");
    expect(ics).toContain("RRULE:FREQ=WEEKLY");
    expect(ics).toContain(`DTSTART;VALUE=DATE:${jour(5).replace(/-/g, "")}`);
    await page.locator("#ryStop").click();
    await expect(page.locator("#ryIcs")).toHaveCount(0);
    expect((await donnees(page)).rythme).toBeUndefined();
  });
});
