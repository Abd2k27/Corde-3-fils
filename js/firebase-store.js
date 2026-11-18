// 🔥 Stockage Firebase (Auth Google + Firestore), même interface que le Store local.
// Chaque donnée = un document de la collection "kv" : { path, v, at }.
// Les règles Firestore (firestore.rules) limitent l'accès à vos 2 adresses e-mail.
const CFG = window.APP_CONFIG;

if (CFG.mode === "firebase" && CFG.firebaseConfig) {
  const base = "https://www.gstatic.com/firebasejs/10.12.2/";
  const { initializeApp } = await import(base + "firebase-app.js");
  const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import(base + "firebase-auth.js");
  const { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } = await import(base + "firebase-firestore.js");

  const app = initializeApp(CFG.firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const idOf = (p) => p.replace(/\//g, "__");
  const clean = (v) => JSON.parse(JSON.stringify(v ?? null)); // Firestore refuse "undefined"

  let data = {}, unsub = null;
  const subs = [];
  const emit = (reason) => subs.forEach((f) => f(reason));

  const Store = {
    mode: "firebase",
    status: "loading", // loading | signedOut | denied | ready | error
    user: null,
    error: null,

    init() {
      return new Promise((resolve) => {
        let first = true;
        const done = () => { if (first) { first = false; resolve(); } else emit("auth"); };
        onAuthStateChanged(auth, (u) => {
          Store.user = u; data = {};
          if (unsub) { unsub(); unsub = null; }
          if (!u) { Store.status = "signedOut"; return done(); }
          let loaded = false;
          unsub = onSnapshot(collection(db, "kv"), (snap) => {
            const d = {};
            snap.forEach((x) => { const r = x.data(); if (r && r.path) d[r.path] = r.v; });
            data = d;
            if (!loaded) { loaded = true; Store.status = "ready"; done(); } else emit("data");
          }, (err) => {
            Store.status = err.code === "permission-denied" ? "denied" : "error";
            Store.error = err.message;
            done();
          });
        });
      });
    },
    get(path) { return data[path]; },
    list(prefix) { return Object.keys(data).filter((k) => k.startsWith(prefix)).map((k) => ({ path: k, value: data[k] })); },
    async set(path, value) {
      data[path] = clean(value);
      await setDoc(doc(db, "kv", idOf(path)), { path, v: clean(value), at: Date.now() });
    },
    async remove(path) { delete data[path]; await deleteDoc(doc(db, "kv", idOf(path))); },
    subscribe(fn) { subs.push(fn); },
    async reset() { /* désactivé en mode Firebase */ },
    signIn() { return signInWithPopup(auth, new GoogleAuthProvider()); },
    signOut() { return signOut(auth); }
  };

  window.Store = Store;
  window.dispatchEvent(new Event("store-ready"));
}
