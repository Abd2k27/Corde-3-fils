// 💾 Couche de stockage. Toute l'appli passe par Store : get / set / list / subscribe.
// Mode "local" : localStorage (partagé entre les onglets d'un même navigateur → 2 onglets = 2 joueurs).
// Plus tard, un FirebaseStore exposera exactement les mêmes fonctions.
window.Store = (function () {
  const KEY = "bc-data-v1";
  let data = {};
  const subs = [];

  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const write = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };

  return {
    mode: "local",
    async init() {
      data = read();
      window.addEventListener("storage", (e) => {
        if (e.key === KEY) { data = read(); subs.forEach((f) => f()); }
      });
    },
    get(path) { return data[path]; },
    list(prefix) {
      return Object.keys(data).filter((k) => k.startsWith(prefix)).map((k) => ({ path: k, value: data[k] }));
    },
    async set(path, value) { data = read(); data[path] = value; write(); },
    async remove(path) { data = read(); delete data[path]; write(); },
    subscribe(fn) { subs.push(fn); },
    async reset() { data = {}; write(); }
  };
})();
