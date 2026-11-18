// 📖 Récupère le texte Louis Segond 1910 exact via api.getbible.net (gratuit, sans clé).
// En cas d'échec (hors ligne…), on garde le texte intégré dans content.js.
window.Bible = (function () {
  const CACHE = "bc-bible-cache-v1";
  const cache = (() => { try { return JSON.parse(localStorage.getItem(CACHE)) || {}; } catch (e) { return {}; } })();
  const save = () => { try { localStorage.setItem(CACHE, JSON.stringify(cache)); } catch (e) {} };

  async function chapter(book, ch) {
    const k = book + ":" + ch;
    if (cache[k]) return cache[k];
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    try {
      const r = await fetch(`https://api.getbible.net/v2/ls1910/${book}/${ch}.json`, { signal: ctrl.signal });
      if (!r.ok) return null;
      const j = await r.json();
      const out = {};
      (j.verses || []).forEach((v) => { out[v.verse] = String(v.text || "").replace(/\s+/g, " ").trim(); });
      cache[k] = out; save();
      return out;
    } catch (e) { return null; } finally { clearTimeout(t); }
  }

  // Renvoie {verset: texte} pour un passage, texte en ligne si dispo
  async function passage(p) {
    if (!window.APP_CONFIG.fetchBibleOnline) return null;
    const ch = await chapter(p.book, p.chapter);
    if (!ch) return null;
    const out = {};
    for (const v of Object.keys(p.text)) { if (!ch[v]) return null; out[v] = ch[v]; }
    return out;
  }

  return { passage, chapter };
})();
