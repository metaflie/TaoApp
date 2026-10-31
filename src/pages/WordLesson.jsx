import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { WORD_LESSONS, wordLessonId } from '../data/words'
import { transliterate } from '../data/letters'
import { completeLesson, learnLetters } from '../store/progressSlice'
import { useLang } from '../i18n'
import { SCRIPT_COLORS, speak } from '../lib'
import Icon from '../components/Icon'
import owl from '../assets/owl.webp'

// Figma: „Lesson - Asomtavruli/Nuskhuri/Mkhedruli“ (შესავალი) და „lesson- asomtavruli“ (სიტყვა-ბარათები)
export default function WordLesson() {
  const { script } = useParams()
  const { t, lang } = useLang()
  const ka = lang === 'ka'
  const dispatch = useDispatch()
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const lesson = WORD_LESSONS[script]
  if (!lesson) return <Navigate to="/lessons" replace />

  const name = t.scripts[script].name
  const cards = lesson.cards
  const tr = (s) => transliterate(s, script)

  // შესავალი გვერდი
  if (step === 0)
    return (
      <div className={`lesson-intro intro-${script}`}>
        <div className="intro-bg geo" aria-hidden="true">
          {tr('აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ').repeat(3)}
        </div>
        <div className="intro-content">
          <p>{ka ? lesson.intro : lesson.introEn}</p>
          <button className="btn-start" onClick={() => setStep(1)}>
            {t.startShort} <Icon name="triRight" size={16} />
          </button>
        </div>
      </div>
    )

  // დასრულება
  if (step > cards.length)
    return (
      <div className="container">
        <div className="panel finish">
          <img src={owl} alt="" width="110" />
          <h1>{ka ? 'გაკვეთილი დასრულებულია!' : 'Lesson complete!'}</h1>
          <p>
            {ka ? `შენ გაიარე ${cards.length} სიტყვა დამწერლობაზე „${name}“ და მიიღე 50 ქულა.` : `You went through ${cards.length} words in ${name} and earned 50 points.`}
          </p>
          <div className="finish-words geo">{cards.map((c) => tr(c.word)).join(' · ')}</div>
          <div className="row-center">
            <Link className="btn btn-blue" to={`/exam?script=${script}`}>
              {ka ? 'ტესტის გავლა' : 'Take the exam'}
            </Link>
            <Link className="btn btn-outline light" to="/lessons">
              {ka ? 'ყველა გაკვეთილი' : 'All lessons'}
            </Link>
          </div>
        </div>
      </div>
    )

  const card = cards[step - 1]
  const first = card.word[0]
  const next = () => {
    if (step === cards.length) {
      dispatch(completeLesson(wordLessonId(script)))
      dispatch(learnLetters({ script, letters: [...new Set(cards.flatMap((c) => [...c.word]))] }))
    }
    setStep(step + 1)
  }
  const play = () => {
    setPlaying(true)
    speak(card.word)
    setTimeout(() => setPlaying(false), 1600)
  }

  return (
    <div className="lesson-card-page container">
      <div className="lc-head">
        <div className="lc-title">
          {name} — {ka ? 'გაკვეთილი N1' : 'lesson N1'}
        </div>
        <div className="lc-num">{step}.</div>
      </div>

      <div className="lc-main">
        <div className="lc-letters">
          <div className="lc-circle" style={{ background: SCRIPT_COLORS[script] }}>
            <span className="geo">{tr(first)}</span>
          </div>
          {card.word.length > 1 && (
            <div className="lc-circle second" style={{ background: SCRIPT_COLORS[script] }}>
              <span className="geo">{tr(card.word[1])}</span>
            </div>
          )}
        </div>

        <div className="lc-word">
          <div className="geo lc-big">{tr(card.word)}</div>
          <div className="geo lc-syll">
            {card.syllables.map((s, i) => (
              <span key={i}>{tr(s)}</span>
            ))}
          </div>
          <button className={`sound-btn ${playing ? 'playing' : ''}`} onClick={play} aria-label={ka ? 'მოსმენა' : 'Play sound'}>
            <span className="sound-play">
              <Icon name="play" size={26} />
            </span>
            <span className="waves" aria-hidden="true">
              {Array.from({ length: 14 }).map((_, i) => (
                <i key={i} style={{ animationDelay: `${(i % 7) * 0.09}s` }} />
              ))}
            </span>
          </button>
        </div>

        <div className="lc-image" aria-label={card.en}>
          <span>{card.emoji}</span>
        </div>
      </div>

      <h2 className="lc-mp">{ka ? 'მნიშვნელობა და წარმოთქმა' : 'Meaning & Pronunciation'}</h2>
      <div className="lc-meaning panel">
        <div>
          <h3>{ka ? 'მნიშვნელობა:' : 'Meaning:'}</h3>
          <p className="big-t">{ka ? card.meaning : card.en}</p>
          <p className="muted">
            {ka ? 'ინგლისურად' : 'Georgian'}: “{ka ? card.en : card.word}”
          </p>
        </div>
        <div>
          <h3>{ka ? 'წარმოთქმა:' : 'Pronunciation:'}</h3>
          <p className="big-t">“{card.translit}”</p>
          <p className="muted">“{[...card.translit].join(' ')}”</p>
        </div>
      </div>

      <div className="lc-nav">
        <button className="btn-round" onClick={() => setStep(step - 1)} aria-label={t.back}>
          <Icon name="triLeft" size={22} />
        </button>
        <div className="dots" aria-hidden="true">
          {cards.map((_, i) => (
            <i key={i} className={i < step ? 'on' : ''} />
          ))}
        </div>
        <button className="btn-next" onClick={next}>
          {step === cards.length ? (ka ? 'დასრულება' : 'Finish') : ka ? 'შემდეგი' : 'Next'}
          <span className="btn-round">
            <Icon name="triRight" size={22} />
          </span>
        </button>
      </div>
    </div>
  )
}
