import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getLesson, LESSONS, LEVELS } from '../data/lessons'
import { findLetter } from '../data/letters'
import { completeLesson, learnLetters } from '../store/progressSlice'
import { useLang } from '../i18n'
import { SCRIPT_COLORS } from '../lib'
import TracePad from '../components/TracePad'
import Icon from '../components/Icon'

// თეორიული გაკვეთილი: განყოფილებები, ასოების ცხრილი და წერის სავარჯიშო
export default function TheoryLesson() {
  const { id } = useParams()
  const { lang, t } = useLang()
  const ka = lang === 'ka'
  const lesson = getLesson(id)
  const done = useSelector((s) => s.progress.completedLessons.includes(id))
  const dispatch = useDispatch()
  const [trace, setTrace] = useState(0)
  if (!lesson) return <Navigate to="/lessons" replace />

  const letters = lesson.letters.map(findLetter)
  const idx = LESSONS.indexOf(lesson)
  const nextLesson = LESSONS[idx + 1]
  const color = SCRIPT_COLORS[lesson.script]

  const finish = () => {
    dispatch(completeLesson(lesson.id))
    dispatch(learnLetters({ script: lesson.script, letters: lesson.letters }))
  }

  return (
    <div className="container narrow">
      <Link to="/lessons" className="crumb">
        <Icon name="left" size={16} /> {t.nav.lessons}
      </Link>
      <div className="lc-title inline">{t.scripts[lesson.script].name}</div>
      <h1 className="theory-h">{lesson.title}</h1>
      <p className="muted light">
        {LEVELS.find((l) => l.key === lesson.level).title} · {lesson.minutes} {ka ? 'წუთი' : 'min'}
      </p>

      {lesson.sections.map((s) => (
        <section className="panel theory-sec" key={s.heading}>
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
        </section>
      ))}

      <section className="panel theory-sec">
        <h2>{ka ? 'ამ გაკვეთილის ასოები' : 'Letters in this lesson'}</h2>
        <div className="mini-grid">
          {letters.map((l, i) => (
            <button key={l.id} className={`mini ${i === trace ? 'sel' : ''}`} style={{ '--c': color }} onClick={() => setTrace(i)}>
              <span className="geo g">{l[lesson.script]}</span>
              <span className="n">
                {l.name} · {l.value}
              </span>
            </button>
          ))}
        </div>
        <TracePad glyph={letters[trace][lesson.script]} label={ka ? 'წერის სავარჯიშო — მოხაზე ასო' : 'Writing practice — trace the letter'} />
      </section>

      <div className="row-between">
        {done ? (
          <span className="done-tag big">✓ {ka ? 'გაკვეთილი დასრულებულია' : 'Lesson completed'}</span>
        ) : (
          <button className="btn btn-blue" onClick={finish}>
            <Icon name="check" size={18} /> {ka ? 'გაკვეთილის დასრულება (+50 ქულა)' : 'Complete lesson (+50 pts)'}
          </button>
        )}
        {nextLesson && (
          <Link className="btn btn-outline light" to={`/lessons/${nextLesson.id}`}>
            {ka ? 'შემდეგი გაკვეთილი' : 'Next lesson'} <Icon name="right" size={18} />
          </Link>
        )}
      </div>
    </div>
  )
}
