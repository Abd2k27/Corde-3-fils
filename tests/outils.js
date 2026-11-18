// Outils communs aux tests : ouvrir le site avec des données de départ, simuler l'autre joueur, relever les erreurs.
const { test: base, expect } = require("@playwright/test");

const jour = (n = 0) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

// Faux texte biblique (évite de dépendre d'api.getbible.net pendant les tests)
const FAUX_CHAPITRE = { verses: Array.from({ length: 180 }, (_, i) => ({ verse: i + 1, text: `Verset de test ${i + 1}.` })) };

async function preparer(context) {
  await context.route("https://api.getbible.net/**", (r) => r.fulfill({ json: FAUX_CHAPITRE }));
  await context.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
}

const test = base.extend({
  // erreurs JavaScript relevées sur toutes les pages ouvertes ; le test échoue s'il y en a
  erreurs: async ({}, use) => { const e = []; await use(e); expect(e, "erreurs JavaScript dans la page").toEqual([]); },
  // ouvre le site en tant que joueur `joueur`, avec `donnees` dans le stockage local
  ouvrir: async ({ context, erreurs }, use) => {
    await preparer(context);
    const pages = [];
    await use(async ({ joueur = "a", donnees = {}, chemin = "#/", reglages = {} } = {}) => {
      const page = pages.length ? await context.newPage() : (context.pages()[0] || await context.newPage());
      page.on("pageerror", (e) => erreurs.push(e.message));
      page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) erreurs.push(m.text()); });
      page.on("dialog", (d) => d.accept());
      await page.addInitScript(({ joueur, donnees, reglages, premier }) => {
        sessionStorage.setItem("bc-player", joueur);
        if (sessionStorage.getItem("bc-test-init")) return; // seulement au premier chargement de l'onglet
        sessionStorage.setItem("bc-test-init", "1");
        if (premier) { localStorage.clear(); localStorage.setItem("bc-data-v1", JSON.stringify(donnees)); }
        localStorage.setItem("bc-guide-seen", "1");
        for (const [k, v] of Object.entries(reglages)) localStorage.setItem(k, v);
      }, { joueur, donnees, reglages, premier: !pages.length });
      pages.push(page);
      await page.goto(chemin);
      await expect(page.locator("#app")).not.toContainText("Chargement…");
      return page;
    });
  }
});

// lit les données partagées enregistrées (mode local)
const donnees = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("bc-data-v1") || "{}"));
const aller = async (page, chemin) => { await page.evaluate((h) => { location.hash = h; }, chemin); await page.waitForTimeout(150); };

module.exports = { test, expect, jour, donnees, aller };
