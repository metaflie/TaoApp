import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { LETTERS, SCRIPTS, transliterate } from '../data/letters'
import { WORD_LESSONS } from '../data/words'
import { recordQuiz } from '../store/progressSlice'
import { useLang } from '../i18n'
import { PageTitle } from '../components/ui'
import { SCRIPT_COLORS, speak } from '../lib'
import Icon from '../components/Icon'

const MODERN = LETTERS.filter((l) => !l.archaic)
const ALL_WORDS = Object.values(WORD_LESSONS).flatMap((w) => w.cards)
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
const pick = (arr, n) => shuffle(arr).slice(0, n)
const LABELS = ['a', 'b', 'c', 'd']

// სიტყვის „დამახინჯებული“ ვარიანტები არასწორი პასუხებისთვის
function distort(word) {
  const chars = [...word]
  const out = new Set()
  if (chars.length > 1) out.add([...chars].reverse().join(''))
  while (out.size < 4) {
    const c = [...chars]
    const i = Math.floor(Math.random() * c.length)
    c[i] = MODERN[Math.floor(Math.random() * MODERN.length)].mkhedruli
    const w = c.join('')
    if (w !== word) out.add(w)
  }
  return [...out].filter((w) => w !== word)
}

// ტესტის გენერაცია — Figma „Exam“ გვერდის კითხვების ტიპების მიხედვით
function buildExam(script) {
  const tr = (s) => transliterate(s, script)
  const qs = []
  // 1. ანბანის რიგი („Which one is the first letter of alphabet“)
  const ordIdx = Math.floor(Math.random() * 6)
  const ordinals = ['პირველი', 'მეორე', 'მესამე', 'მეოთხე', 'მეხუთე', 'მეექვსე']
  const ordinalsEn = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']
  const ordLetter = LETTERS[ordIdx]
  qs.push({
    type: 'choice',
    ka: `რომელია ანბანის ${ordinals[ordIdx]} ასო?`,
    en: `Which one is the ${ordinalsEn[ordIdx]} letter of the alphabet?`,
    options: shuffle([ordLetter, ...pick(LETTERS.slice(6, 20), 2)].map((l) => l[script])),
    answer: ordLetter[script],
    glyphs: true,
  })
  // 2–3. ასოს ამოცნობა
  pick(MODERN, 2).forEach((l) => {
    const wrong = pick(MODERN.filter((x) => x !== l), 2)
    qs.push({
      type: 'choice',
      ka: `რომელია ასო „${l.mkhedruli}“ (${l.name})?`,
      en: `Which one is the letter “${l.mkhedruli}” (${l.translit})?`,
      options: shuffle([l, ...wrong].map((x) => x[script])),
      answer: l[script],
      glyphs: true,
    })
  })
  // 4–5. სიტყვის სწორი ფორმა („Which is the correct form of violet?“)
  pick(ALL_WORDS, 2).forEach((w) => {
    qs.push({
      type: 'choice',
      ka: `რომელია სიტყვის „${w.meaning}“ სწორი ფორმა?`,
      en: `Which is the correct form of “${w.en}”?`,
      options: shuffle([w.word, ...distort(w.word).slice(0, 2)].map(tr)),
      answer: tr(w.word),
      glyphs: true,
    })
  })
  // 6. მოსმენა („choose what you hear“)
  const [heard, ...others] = pick(ALL_WORDS, 3)
  qs.push({
    type: 'listen',
    ka: 'აირჩიე ის, რაც გესმის',
    en: 'Choose what you hear',
    say: heard.word,
    hint: heard.translit,
    options: shuffle([heard, ...others].map((w) => tr(w.word))),
    answer: tr(heard.word),
    glyphs: true,
  })
  // 7. რიცხვითი მნიშვნელობა
  const numL = pick(MODERN, 1)[0]
  const wrongNums = pick(MODERN.filter((x) => x.value !== numL.value), 2).map((x) => x.value)
  qs.push({
    type: 'choice',
    ka: `რა რიცხვს აღნიშნავდა ასო „${numL[script]}“ ძველ ქართულში?`,
    en: `Which number did the letter “${numL[script]}” stand for in Old Georgian?`,
    options: shuffle([numL.value, ...wrongNums].map(String)),
    answer: String(numL.value),
  })
  // 8. წერა კლავიატურით
  const wWord = pick(ALL_WORDS.filter((w) => w.word.length <= 5), 1)[0]
  qs.push({
    type: 'write',
    ka: `დაწერე სიტყვა „${wWord.word}“ (${wWord.meaning}) კლავიატურის გამოყენებით`,
    en: `Write the word “${wWord.word}” (${wWord.en}) using the keyboard`,
    answer: tr(wWord.word),
    keys: shuffle([...new Set([...wWord.word, ...pick(MODERN, 8).map((l) => l.mkhedruli)])]).map(tr),
  })
  return qs
}

export default function Exam() {
  const { lang, t } = useLang()
  const ka = lang === 'ka'
  const dispatch = useDispatch()
  const [params, setParams] = useSearchParams()
  const script = SCRIPTS.some((s) => s.key === params.get('script')) ? params.get('script') : 'asomtavruli'
  const [round, setRound] = useState(0)
  const questions = useMemo(() => buildExam(script), [script, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [hints, setHints] = useState({})

  const score = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0)
  const answeredAll = questions.every((_, i) => answers[i])

  const setAnswer = (i, v) => !checked && setAnswers((a) => ({ ...a, [i]: v }))
  const check = () => {
    setChecked(true)
    dispatch(recordQuiz({ mode: script, score, total: questions.length }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const restart = (s = script) => {
    setAnswers({})
    setChecked(false)
    setHints({})
    setRound((r) => r + 1)
    if (s !== script) setParams({ script: s })
  }

  return (
    <div className="container exam">
      <PageTitle sub={ka ? 'უპასუხე კითხვებს, შეამოწმე პასუხები და დააგროვე ქულები' : 'Answer the questions, check your answers and earn points'}>
        {t.nav.exam}
      </PageTitle>

      <div className="tabs">
        {SCRIPTS.map((s) => (
          <button
            key={s.key}
            className={s.key === script ? 'tab active' : 'tab'}
            style={s.key === script ? { background: SCRIPT_COLORS[s.key] } : undefined}
            onClick={() => restart(s.key)}
          >
            {t.scripts[s.key].name}
          </button>
        ))}
      </div>

      {checked && (
        <div className="panel result" role="status">
          <div className="score-ring" style={{ '--p': `${(score / questions.length) * 100}%` }}>
            <span>
              {score}/{questions.length}
            </span>
          </div>
          <div>
            <h2>
              {score === questions.length
                ? ka
                  ? 'შესანიშნავია — უშეცდომოდ!'
                  : 'Perfect score!'
                : score >= questions.length / 2
                  ? ka
                    ? 'კარგი შედეგია!'
                    : 'Good result!'
                  : ka
                    ? 'სცადე ხელახლა'
                    : 'Try again'}
            </h2>
            <p>
              {ka ? `მიიღე ${score * 10} ქულა. სწორი პასუხები მწვანედაა მონიშნული.` : `You earned ${score * 10} points. Correct answers are marked green.`}
            </p>
            <div className="row">
              <button className="btn btn-blue" onClick={() => restart()}>
                <Icon name="refresh" size={18} /> {ka ? 'ახალი ტესტი' : 'New exam'}
              </button>
              <Link className="btn btn-outline" to="/progress">
                {t.nav.progress}
              </Link>
            </div>
          </div>
        </div>
      )}

      <ol className="q-list">
        {questions.map((q, i) => {
          const ok = checked && answers[i] === q.answer
          const bad = checked && answers[i] !== q.answer
          return (
            <li key={`${round}-${i}`} className={`q-card ${ok ? 'ok' : ''} ${bad ? 'bad' : ''}`}>
              <h3>
                <span className="q-num">{i + 1}.</span> {ka ? q.ka : q.en}
              </h3>

              {q.type === 'listen' && (
                <div className="listen-row">
                  <button className="sound-btn small" onClick={() => speak(q.say)} aria-label={ka ? 'მოსმენა' : 'Play'}>
                    <span className="sound-play">
                      <Icon name="play" size={22} />
                    </span>
                    <span className="waves" aria-hidden="true">
                      {Array.from({ length: 10 }).map((_, k) => (
                        <i key={k} />
                      ))}
                    </span>
                  </button>
                  <button className="link-btn" onClick={() => setHints((h) => ({ ...h, [i]: true }))}>
                    {hints[i] ? `“${q.hint}”` : ka ? 'ხმა არ ისმის? მინიშნება' : 'No sound? Show hint'}
                  </button>
                </div>
              )}

              {q.type === 'write' ? (
                <WriteAnswer value={answers[i] ?? ''} keys={q.keys} disabled={checked} onChange={(v) => setAnswer(i, v)} />
              ) : (
                <div className="options">
                  {q.options.map((o, k) => {
                    const sel = answers[i] === o
                    const cls = checked ? (o === q.answer ? 'correct' : sel ? 'wrong' : '') : sel ? 'sel' : ''
                    return (
                      <button key={o + k} className={`opt ${cls}`} onClick={() => setAnswer(i, o)} aria-pressed={sel}>
                        <span className="opt-l">{LABELS[k]})</span> <span className={q.glyphs ? 'geo opt-g' : 'opt-g'}>{o}</span>
                      </button>
                    )
                  })}
                </div>
              )}
              {bad && q.type === 'write' && (
                <p className="answer-note">
                  {ka ? 'სწორი პასუხი' : 'Correct answer'}: <span className="geo">{q.answer}</span>
                </p>
              )}
            </li>
          )
        })}
      </ol>

      {!checked && (
        <div className="row-center">
          <button className="btn btn-blue big" disabled={!answeredAll} onClick={check}>
            <Icon name="check" size={20} /> {ka ? 'პასუხების შემოწმება' : 'Check answers'}
          </button>
          {!answeredAll && <p className="muted light small">{ka ? 'უპასუხე ყველა კითხვას' : 'Answer every question first'}</p>}
        </div>
      )}
    </div>
  )
}

// Figma „Component 4“: ხაზზე დაწერა + კლავიატურის ღილაკი
function WriteAnswer({ value, keys, disabled, onChange }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="write">
      <div className="write-line">
        <span className="geo">{value || ' '}</span>
        <button className="icon-btn" disabled={disabled || !value} onClick={() => onChange([...value].slice(0, -1).join(''))} aria-label="backspace">
          <Icon name="left" size={18} />
        </button>
      </div>
      <button className="kbd-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="keyboard">
        <Icon name="keyboard" size={30} />
      </button>
      {open && (
        <div className="kbd">
          {keys.map((k) => (
            <button key={k} className="key geo" disabled={disabled} onClick={() => onChange(value + k)}>
              {k}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
