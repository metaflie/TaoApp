import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LETTERS, SCRIPTS } from '../data/letters'
import { LESSONS } from '../data/lessons'
import { WORD_LESSONS, wordLessonId } from '../data/words'
import { evaluateAchievements } from '../data/achievements'
import { useLang } from '../i18n'
import { PageTitle, ProgressBar } from '../components/ui'
import { SCRIPT_COLORS } from '../lib'
import Icon from '../components/Icon'

// Figma „Progress“: შენახული გაკვეთილები პროცენტებით + მომავალი ტესტის ბარათი
export default function Progress() {
  const { lang, t } = useLang()
  const ka = lang === 'ka'
  const p = useSelector((s) => s.progress)
  const user = useSelector((s) => s.auth.user)
  const achievements = evaluateAchievements(p)
  const unlocked = achievements.filter((a) => a.done).length

  // „შემდეგი ტესტის“ დამწერლობა — სადაც ყველაზე ნაკლები ასოა ნასწავლი
  const weakest = [...SCRIPTS].sort((a, b) => p.learned[a.key].length - p.learned[b.key].length)[0]
  const lessonRows = [
    ...SCRIPTS.map((s) => ({
      id: wordLessonId(s.key),
      title: `${t.scripts[s.key].name} — ${ka ? 'სიტყვა-ბარათები' : 'word cards'}`,
      pct: p.completedLessons.includes(wordLessonId(s.key)) ? 100 : 0,
      script: s.key,
      to: `/lessons/play/${s.key}`,
      size: WORD_LESSONS[s.key].cards.length,
    })),
    ...LESSONS.map((l) => {
      const learned = l.letters.filter((x) => p.learned[l.script].includes(x)).length
      return {
        id: l.id,
        title: l.title,
        pct: p.completedLessons.includes(l.id) ? 100 : Math.round((learned / l.letters.length) * 100),
        script: l.script,
        to: `/lessons/${l.id}`,
      }
    }),
  ]

  return (
    <div className="container">
      <PageTitle sub={user ? `${user.firstName} ${user.lastName}` : ka ? 'სტუმრის რეჟიმი — პროგრესი ამ ბრაუზერში ინახება' : 'Guest mode — progress is saved in this browser'}>
        {t.nav.progress}
      </PageTitle>

      <div className="stats">
        <div className="stat">
          <Icon name="gem" />
          <b>{p.points}</b>
          <span>{ka ? 'ქულა' : 'points'}</span>
        </div>
        <div className="stat">
          <Icon name="book" />
          <b>{p.completedLessons.length}</b>
          <span>{ka ? 'დასრულებული გაკვეთილი' : 'lessons done'}</span>
        </div>
        <div className="stat">
          <Icon name="target" />
          <b>{p.quizHistory.length}</b>
          <span>{ka ? 'გავლილი ტესტი' : 'exams taken'}</span>
        </div>
        <Link to="/achievements" className="stat link">
          <Icon name="trophy" />
          <b>
            {unlocked}/{achievements.length}
          </b>
          <span>{t.nav.achievements} →</span>
        </Link>
      </div>

      <div className="progress-layout">
        <section className="panel progress-panel">
          <h2>{ka ? 'შენახული გაკვეთილები' : 'Saved lessons'}</h2>
          <ul className="saved-list">
            {lessonRows.map((r, i) => (
              <li key={r.id}>
                <Link to={r.to} className="saved-name">
                  <i style={{ background: SCRIPT_COLORS[r.script] }} />
                  {ka ? 'გაკვეთილი' : 'lesson'} {i + 1}: {r.title}
                </Link>
                <span className={`pct ${r.pct === 100 ? 'full' : ''}`}>{r.pct}%</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="progress-side">
          <Link to={`/exam?script=${weakest.key}`} className="exam-card">
            <span className="exam-card-h">
              <Icon name="calendar" /> {ka ? `შემდეგი ტესტი — „${weakest.title}“` : `Upcoming quiz for “${weakest.title}”`}
            </span>
            <span className="exam-card-b">{ka ? 'დაიწყე ახლავე →' : 'Start now →'}</span>
          </Link>

          <section className="panel">
            <h2>{ka ? 'ასოები დამწერლობების მიხედვით' : 'Letters by script'}</h2>
            {SCRIPTS.map((s) => (
              <div className="script-progress" key={s.key}>
                <div className="sp-row">
                  <span>{t.scripts[s.key].name}</span>
                  <span>
                    {p.learned[s.key].length}/{LETTERS.length}
                  </span>
                </div>
                <ProgressBar value={p.learned[s.key].length} max={LETTERS.length} color={SCRIPT_COLORS[s.key]} />
              </div>
            ))}
          </section>

          <section className="panel">
            <h2>{ka ? 'ბოლო ტესტები' : 'Recent exams'}</h2>
            {p.quizHistory.length ? (
              <ul className="quiz-hist">
                {p.quizHistory.slice(0, 5).map((q) => (
                  <li key={q.date}>
                    <span>{t.scripts[q.mode]?.name ?? q.mode}</span>
                    <span className="muted">{new Date(q.date).toLocaleDateString('ka-GE')}</span>
                    <b>
                      {q.score}/{q.total}
                    </b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">{ka ? 'ჯერ ტესტი არ გაგივლია.' : 'No exams yet.'}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
