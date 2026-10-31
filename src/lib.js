// საერთო კონსტანტები და დამხმარე ფუნქციები
export const SCRIPT_COLORS = { mkhedruli: '#92F277', asomtavruli: '#C6F277', nuskhuri: '#F2D277' }

// ხმის წარმოთქმა ბრაუზერის Speech API-ით (თუ ქართული ხმა ხელმისაწვდომია)
export function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return false
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ka-GE'
    u.rate = 0.8
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang?.startsWith('ka'))
    if (voice) u.voice = voice
    window.speechSynthesis.speak(u)
    return true
  } catch {
    return false
  }
}
