// 📖 Plans de lecture biblique à deux. Chaque jour = une liste de chapitres [livre, chapitre].
// Livres numérotés 1 (Genèse) … 66 (Apocalypse), comme l'API getBible et la liste BOOKS de app.js.
// ⚠️ L'id d'un plan et le découpage de ses jours servent de clés de stockage (lecture/<plan>/<jour>/<joueur>) :
// ne pas modifier un plan existant, en créer un nouveau avec un autre id.
(function () {
  const NB_CHAPITRES = {
    19: 150, 20: 31,
    40: 28, 41: 16, 42: 24, 43: 21, 44: 28, 45: 16, 46: 16, 47: 13, 48: 6, 49: 6, 50: 4, 51: 4, 52: 5, 53: 3,
    54: 6, 55: 4, 56: 3, 57: 1, 58: 13, 59: 5, 60: 5, 61: 3, 62: 5, 63: 1, 64: 1, 65: 1, 66: 22
  };
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const chapitres = (livres) => livres.flatMap((b) => range(1, NB_CHAPITRES[b]).map((c) => [b, c]));
  const parJour = (liste, n) => { const jours = []; for (let i = 0; i < liste.length; i += n) jours.push(liste.slice(i, i + n)); return jours; };

  window.LECTURE_PLANS = [
    { id: "proverbes", emoji: "🦉", title: "Proverbes en 31 jours", desc: "Un chapitre de sagesse par jour. Idéal pour commencer.", days: parJour(chapitres([20]), 1) },
    { id: "psaumes", emoji: "🎶", title: "Les Psaumes en 50 jours", desc: "Trois psaumes par jour : prière, louange et confiance.", days: parJour(chapitres([19]), 3) },
    { id: "evangiles", emoji: "✝️", title: "Les 4 Évangiles en 89 jours", desc: "La vie de Jésus selon Matthieu, Marc, Luc et Jean, un chapitre par jour.", days: parJour(chapitres([40, 41, 42, 43]), 1) },
    { id: "nt", emoji: "📜", title: "Le Nouveau Testament en 260 jours", desc: "Un chapitre par jour, des Évangiles à l'Apocalypse.", days: parJour(chapitres(range(40, 66)), 1) }
  ];
})();
