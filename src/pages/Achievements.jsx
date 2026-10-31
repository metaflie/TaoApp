import { useSelector } from 'react-redux'
import { evaluateAchievements } from '../data/achievements'
import { useLang } from '../i18n'
import { PageTitle, ProgressBar } from '../components/ui'
import Icon from '../components/Icon'

// მიღწევები: დასრულებული ეტაპები და ჯილდოები
export default function Achievements() {
  const { lang, t } = useLang()
  const ka = lang === 'ka'
  const progress = useSelector((s) => s.progress)
  const list = evaluateAchievements(progress)
  const done = list.filter((a) => a.done).length

  return (
    <div className="container">
      <PageTitle sub={ka ? `გახსნილია ${done} მიღწევა ${list.length}-დან` : `${done} of ${list.length} achievements unlocked`}>{t.nav.achievements}</PageTitle>
      <div className="ach-grid">
        {list.map((a) => (
          <article key={a.id} className={`ach ${a.done ? 'done' : ''}`}>
            <div className="ach-icon">
              <Icon name={a.icon} size={34} />
            </div>
            <h3>{a.title}</h3>
            <p>{a.text}</p>
            <ProgressBar value={a.current} max={a.goal} color={a.done ? '#F2D277' : '#92F277'} />
            <span className="ach-count">{a.done ? (ka ? '✓ მიღწეულია' : '✓ Unlocked') : `${a.current}/${a.goal}`}</span>
          </article>
        ))}
      </div>
    </div>
  )
}
