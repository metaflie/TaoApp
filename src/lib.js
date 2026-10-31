// საერთო კონსტანტები და დამხმარე ფუნქციები
export const SCRIPT_COLORS = { mkhedruli: '#92F277', asomtavruli: '#C6F277', nuskhuri: '#F2D277' }

// ჩაწერილი ხმები (src/assets/audio): სიტყვები — word-<ტრანსლიტერაცია>.mp3, ასოები — letter-<Unicode კოდი>.mp3
const AUDIO_FILES = import.meta.glob('./assets/audio/*.mp3', { eager: true, import: 'default' })
const WORD_FILES = {
  ია: 'ia', ჟირაფი: 'zhirapi', დედა: 'deda', მზე: 'mze', ხე: 'khe',
  თითი: 'titi', ფუტკარი: 'putkari', კატა: 'kata', ვაშლი: 'vashli', წიგნი: 'tsigni',
  აქლემი: 'aklemi', ბუ: 'bu', თევზი: 'tevzi', ყვავილი: 'qvavili', სახლი: 'sakhli',
}

function audioUrl(text) {
  const name = WORD_FILES[text]
    ? `word-${WORD_FILES[text]}`
    : [...text].length === 1
      ? `letter-${text.codePointAt(0).toString(16).toUpperCase()}`
      : null
  return name ? AUDIO_FILES[`./assets/audio/${name}.mp3`] : undefined
}

let current = null

// ხმის წარმოთქმა: ჯერ ჩაწერილი ფაილი, თუ არ არსებობს — ბრაუზერის Speech API (თუ ქართული ხმა აქვს)
export function speak(text) {
  try {
    const url = audioUrl(text)
    if (url) {
      if (current) current.pause()
      current = new Audio(url)
      current.play().catch(() => {})
      return true
    }
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
