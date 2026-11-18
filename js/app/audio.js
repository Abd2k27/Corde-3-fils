// Lecture audio des passages (synthèse vocale du navigateur)
// ---------- 🔊 lecture audio (synthèse vocale du navigateur) ----------
const TTS = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
if (TTS) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
function frVoice() {
  const vs = speechSynthesis.getVoices().filter((v) => /^fr/i.test(v.lang));
  const fr = vs.filter((v) => /fr[-_]FR/i.test(v.lang));
  return fr.find((v) => /premium|enhanced|natural|amélie|thomas|audrey|google/i.test(v.name)) || fr[0] || vs[0] || null;
}
function stopSpeak() {
  if (!TTS) return;
  ui.speaking = null; speechSynthesis.cancel();
  document.querySelectorAll(".speaking").forEach((x) => x.classList.remove("speaking"));
  document.querySelectorAll(".listen.on").forEach((b) => { b.classList.remove("on"); b.textContent = "🔊 Écouter"; });
}
// Un énoncé par verset : évite la coupure des longs textes sur Chrome et permet de surligner le verset lu
function speakPassage(node, btn) {
  if (!node) return;
  if (ui.speaking === node) return stopSpeak();
  stopSpeak();
  const ps = [...node.querySelectorAll("p")]; if (!ps.length) return;
  ui.speaking = node; btn.classList.add("on"); btn.textContent = "⏹ Arrêter";
  const voice = frVoice();
  ps.forEach((p, k) => {
    const txt = [...p.childNodes].filter((n) => n.nodeName !== "SUP").map((n) => n.textContent).join("").trim();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = "fr-FR"; u.rate = 0.95; if (voice) u.voice = voice;
    u.onstart = () => { if (ui.speaking !== node) return; ps.forEach((x) => x.classList.remove("speaking")); p.classList.add("speaking"); };
    if (k === ps.length - 1) u.onend = () => { if (ui.speaking === node) stopSpeak(); };
    speechSynthesis.speak(u);
  });
}
