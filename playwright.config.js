// Tests de bout en bout : `npm test`. Le site est servi par tests/serve.mjs en mode « local »
// (données dans le navigateur, sans Firebase) : rien ne touche à vos vraies données.
// (CommonJS : le chargeur de modules ES de Playwright 1.49 se bloque avec Node 24)
const { defineConfig, devices } = require("@playwright/test");

const PORT = 4173;
module.exports = defineConfig({
  testDir: "tests",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}/`, locale: "fr-FR", timezoneId: "Europe/Paris", serviceWorkers: "block" },
  projects: [
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: false, hasTouch: false } },
    { name: "ordinateur", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }
  ],
  webServer: { command: `node tests/serve.mjs ${PORT}`, url: `http://localhost:${PORT}/`, reuseExistingServer: true }
});
