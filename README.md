# 🪢 La corde à trois fils

Étude biblique ludique pour deux : couple, mariage et foyer (7 semaines). Texte biblique : Louis Segond 1910.

## Tester sur le Mac

```bash
cd ~/Plus_Ultra/corde-a-trois-fils
python3 -m http.server 8000
```
Puis ouvrir http://localhost:8000 dans **deux onglets** : un en « Abdou », l'autre en « Ma chérie ».
Les deux onglets partagent les données, comme deux téléphones plus tard.

## Personnaliser
- Prénoms, couleurs et options : `js/config.js` (`unlockAll: true` pour débloquer toutes les semaines).
- Contenu (passages, questions, défis, prières) : `js/content.js`.

## Structure
- `js/store.js` : stockage (local pour l'instant ; Firebase plus tard, même interface).
- `js/bible.js` : texte exact via api.getbible.net, avec repli sur le texte intégré.
- `js/app.js` : écrans et logique du jeu.

## Déploiement
1. Firebase : Authentication (Google) + Firestore, coller `firestore.rules` (avec vos 2 e-mails) dans l'onglet Règles.
2. `js/config.js` : coller `firebaseConfig` et passer `mode` à `"firebase"`.
3. GitHub Pages (branche `main`, dossier racine), puis ajouter `<pseudo>.github.io` dans Authentication > Paramètres > Domaines autorisés.
4. Sur le téléphone : ouvrir le lien, puis « Ajouter à l'écran d'accueil ».

⚠️ Ne mets pas vos vraies adresses e-mail dans `firestore.rules` du dépôt (il est public) : seulement dans la console Firebase.
