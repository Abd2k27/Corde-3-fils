// ⚙️ Configuration — modifie les prénoms ici
window.APP_CONFIG = {
  appName: "La corde à trois fils",
  players: {
    a: { name: "Abdou", initial: "A", color: "#3f6b4f" },
    b: { name: "Binusè", initial: "B", color: "#b5562f" }
  },
  // "local" = données dans le navigateur (test sur ton Mac)
  // "firebase" = plus tard, pour jouer chacun sur son téléphone
  mode: "firebase",
  // Colle ici l'objet "firebaseConfig" donné par la console Firebase, puis passe mode à "firebase"
  // (ces clés ne sont pas secrètes : la sécurité est assurée par les règles Firestore)
  firebaseConfig: {
    apiKey: "AIzaSyCgibdDkaUiz64kMeUSIW7_I19Z9oq9t8I",
    authDomain: "corde-a-trois-fils.firebaseapp.com",
    projectId: "corde-a-trois-fils",
    storageBucket: "corde-a-trois-fils.firebasestorage.app",
    messagingSenderId: "458528295865",
    appId: "1:458528295865:web:e137d97634d8fb6e81c468"
  },
  // true = toutes les semaines débloquées (pratique pour tester)
  unlockAll: false,
  // Récupère le texte exact Louis Segond 1910 via api.getbible.net (sinon texte intégré)
  fetchBibleOnline: true
};
