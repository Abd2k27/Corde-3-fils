// Thème clair / sombre
// ---------- 🌓 Thème clair / sombre ----------
const THEME_KEY = "bc-theme";
const THEMES = [["auto", "Auto"], ["soir", "Le soir"], ["light", "Clair"], ["dark", "Sombre"]];
const getTheme = () => { try { return localStorage.getItem(THEME_KEY) || "auto"; } catch (e) { return "auto"; } };
const darkMQ = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : { matches: false };
// Effets réduits (verre sans flou, animations décoratives coupées) : choix enregistré, sinon réglage « transparence réduite » de l'appareil
const LITE_KEY = "bc-lite";
const liteMQ = window.matchMedia ? matchMedia("(prefers-reduced-transparency: reduce)") : { matches: false };
const getLite = () => { let v = null; try { v = localStorage.getItem(LITE_KEY); } catch (e) {} return v === null ? liteMQ.matches : v === "1"; };
function applyTheme() {
  document.documentElement.classList.toggle("lite", getLite());
  const t = getTheme(), h = new Date().getHours();
  const dark = t === "dark" || (t === "auto" && darkMQ.matches) || (t === "soir" && (h >= 20 || h < 7));
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = dark ? "#17130f" : "#f5efe7";
}
if (darkMQ.addEventListener) darkMQ.addEventListener("change", applyTheme);
setInterval(applyTheme, 60000); applyTheme();
