import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LESSONS, LEVELS } from '../data/lessons'
import { SCRIPTS } from '../data/letters'
import { WORD_LESSONS, wordLessonId } from '../data/words'
import { useLang } from '../i18n'
import { PageTitle } from '../components/ui'
import { SCRIPT_COLORS } from '../lib'
import Icon from '../components/Icon'

const LEVEL_EN = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }

export default function Lessons() {
  const { lang, t } = useLang()
  const ka = lang === 'ka'
  const done = useSelector((s) => s.progress.completedLessons)
  const [level, setLevel] = useState('all')
  const [script, setScript] = useState('all')

  const list = useMemo(
    () => LESSONS.filter((l) => (level === 'all' || l.level === level) && (script === 'all' || l.script === script)),
    [level, script],
  )

  return (
    <div className="container">
      <PageTitle sub={ka ? 'ინტერაქციული სიტყვა-ბარათები და თეორიული გაკვეთილები სირთულის დონეების მიხედვით' : 'Interactive word cards and theory lessons by difficulty level'}>
        {t.nav.lessons}
      </PageTitle>

      <h2 className="section-h">{ka ? 'ინტერაქციული გაკვეთილები' : 'Interactive lessons'}</h2>
      <div className="word-lesson-grid">
        {SCRIPTS.map((s) => {
          const id = wordLessonId(s.key)
          const finished = done.includes(id)
          return (
            <Link key={s.key} to={`/lessons/play/${s.key}`} className="word-lesson-card" style={{ '--c': SCRIPT_COLORS[s.key] }}>
              <span className="geo big">{s.sample}</span>
              <span className="wl-title">
                {t.scripts[s.key].name} — {ka ? 'გაკვეთილი N1' : 'lesson N1'}
              </span>
              <span className="wl-meta">
                {WORD_LESSONS[s.key].cards.length} {ka ? 'სიტყვა' : 'words'} · {finished ? (ka ? '✓ დასრულებულია' : '✓ completed') : ka ? 'დაწყება →' : 'start →'}
              </span>
            </Link>
          )
        })}
      </div>

      <h2 className="section-h">{ka ? 'თეორიული გაკვეთილები' : 'Theory lessons'}</h2>
      <div className="filters">
        <div className="chip-row" role="group" aria-label={ka ? 'დონე' : 'Level'}>
          <button className={`chip ${level === 'all' ? 'on' : ''}`} onClick={() => setLevel('all')}>
            {ka ? 'ყველა დონე' : 'All levels'}
          </button>
          {LEVELS.map((l) => (
            <button key={l.key} className={`chip ${level === l.key ? 'on' : ''}`} onClick={() => setLevel(l.key)}>
              {ka ? l.title : LEVEL_EN[l.key]}
            </button>
          ))}
        </div>
        <div className="chip-row" role="group" aria-label={ka ? 'დამწერლობა' : 'Script'}>
          <button className={`chip ${script === 'all' ? 'on' : ''}`} onClick={() => setScript('all')}>
            {ka ? 'ყველა დამწერლობა' : 'All scripts'}
          </button>
          {SCRIPTS.map((s) => (
            <button key={s.key} className={`chip ${script === s.key ? 'on' : ''}`} onClick={() => setScript(s.key)}>
              {t.scripts[s.key].name}
            </button>
          ))}
        </div>
      </div>

      <div className="lesson-list">
        {list.map((l) => (
          <Link to={`/lessons/${l.id}`} key={l.id} className="lesson-card">
            <span className="lesson-badge" style={{ background: SCRIPT_COLORS[l.script] }}>
              <span className="geo">{SCRIPTS.find((s) => s.key === l.script).sample.slice(0, 1)}</span>
            </span>
            <span className="lesson-body">
              <strong>{l.title}</strong>
              <span className="muted">{l.summary}</span>
              <span className="lesson-tags">
                <span className={`level ${l.level}`}>{ka ? LEVELS.find((x) => x.key === l.level).title : LEVEL_EN[l.level]}</span>
                <span>
                  <Icon name="history" size={14} /> {l.minutes} {ka ? 'წთ' : 'min'}
                </span>
                {done.includes(l.id) && <span className="done-tag">✓ {ka ? 'დასრულებულია' : 'Completed'}</span>}
              </span>
            </span>
            <Icon name="right" />
          </Link>
        ))}
        {!list.length && <p className="empty">{ka ? 'ამ ფილტრით გაკვეთილი არ მოიძებნა' : 'No lessons match this filter'}</p>}
      </div>
    </div>
  )
}
