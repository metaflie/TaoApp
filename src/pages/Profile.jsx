import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '../store/authSlice'
import { updateUser } from '../store/users'
import { resetProgress } from '../store/progressSlice'
import { LETTERS, SCRIPTS } from '../data/letters'
import { LESSONS } from '../data/lessons'
import { useLang } from '../i18n'
import { ProgressBar } from '../components/ui'
import { SCRIPT_COLORS } from '../lib'
import Icon from '../components/Icon'

// Figma „PROFILE“: ავატარი, სახელი და ცისფერი ღილაკები (Exercise Status, Lesson/Program, Goal, Edit, Email)
export default function Profile() {
  const { lang, t } = useLang()
  const ka = lang === 'ka'
  const user = useSelector((s) => s.auth.user)
  const p = useSelector((s) => s.progress)
  const dispatch = useDispatch()
  const [openKey, setOpenKey] = useState('status')
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, goal: user.goal ?? '' })
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) return
    const updated = updateUser(user.email, { firstName: form.firstName.trim(), lastName: form.lastName.trim(), goal: form.goal.trim() })
    dispatch(signIn(updated ?? { ...user, ...form }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const best = p.quizHistory.reduce((b, q) => Math.max(b, Math.round((q.score / q.total) * 100)), 0)
  const items = [
    {
      key: 'status',
      label: ka ? 'სავარჯიშოების სტატუსი' : 'Exercise Status',
      body: (
        <div className="kv">
          <span>{ka ? 'გავლილი ტესტები' : 'Exams taken'}</span>
          <b>{p.quizHistory.length}</b>
          <span>{ka ? 'საუკეთესო შედეგი' : 'Best score'}</span>
          <b>{best}%</b>
          <span>{ka ? 'ქულები' : 'Points'}</span>
          <b>{p.points}</b>
        </div>
      ),
    },
    {
      key: 'program',
      label: ka ? 'გაკვეთილები, პროგრამა' : 'Lesson, Program',
      body: (
        <div>
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
          <p className="small">
            {ka ? 'დასრულებული თეორიული გაკვეთილები' : 'Theory lessons completed'}: {p.completedLessons.filter((id) => LESSONS.some((l) => l.id === id)).length}/{LESSONS.length} ·{' '}
            <Link to="/lessons">{t.nav.lessons} →</Link>
          </p>
        </div>
      ),
    },
    {
      key: 'goal',
      label: ka ? 'მიზანი' : 'Goal',
      body: <p>{user.goal ? `🎯 ${user.goal}` : ka ? 'მიზანი ჯერ არ დაგისახავს — დააჭირე „რედაქტირებას“.' : 'No goal yet — press “Edit”.'}</p>,
    },
    {
      key: 'edit',
      label: ka ? 'რედაქტირება' : 'EDIT',
      body: (
        <form className="edit-form" onSubmit={save}>
          <label>
            {ka ? 'სახელი' : 'First name'}
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </label>
          <label>
            {ka ? 'გვარი' : 'Last name'}
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </label>
          <label className="full">
            {ka ? 'სწავლის მიზანი' : 'Learning goal'}
            <input value={form.goal} placeholder={ka ? 'მაგ.: ასომთავრულის სრულად შესწავლა ერთ თვეში' : 'e.g. learn Asomtavruli in a month'} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          </label>
          <div className="full row">
            <button className="btn btn-blue">{ka ? 'შენახვა' : 'Save'}</button>
            {saved && <span className="saved-msg">✓ {ka ? 'შენახულია' : 'Saved'}</span>}
            <button
              type="button"
              className="btn btn-outline danger"
              onClick={() => window.confirm?.(ka ? 'წაიშალოს მთელი პროგრესი?' : 'Reset all progress?') && dispatch(resetProgress())}
            >
              {ka ? 'პროგრესის განულება' : 'Reset progress'}
            </button>
          </div>
        </form>
      ),
    },
    {
      key: 'email',
      label: ka ? 'ელფოსტა' : 'Email address',
      body: (
        <p>
          <Icon name="mail" size={16} /> {user.email} · @{user.username}
        </p>
      ),
    },
  ]

  return (
    <div className="container">
      <div className="profile-card">
        <div className="profile-left">
          <div className="avatar">
            <div className="avatar-inner">{(user.firstName[0] + user.lastName[0]).toUpperCase()}</div>
          </div>
          <div className="name-pill">
            {user.firstName} {user.lastName}
          </div>
          <p className="member">
            {ka ? 'წევრია' : 'Member since'} {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ka-GE') : '—'}
          </p>
        </div>
        <div className="profile-right">
          {items.map((it) => (
            <div key={it.key} className={`pill-item ${openKey === it.key ? 'open' : ''}`}>
              <button className="pill-btn" onClick={() => setOpenKey(openKey === it.key ? '' : it.key)} aria-expanded={openKey === it.key}>
                {it.label}
              </button>
              {openKey === it.key && <div className="pill-body">{it.body}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
