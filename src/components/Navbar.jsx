import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from '../store/authSlice'
import { hydrate } from '../store/progressSlice'
import { readJSON, progressKey } from '../store/storage'
import { useLang } from '../i18n'
import Icon, { Flag } from './Icon'
import owl from '../assets/owl.webp'

const LINKS = ['home', 'alphabet', 'lessons', 'exam', 'dictionary', 'progress', 'about', 'profile']
const PATHS = { home: '/', alphabet: '/alphabet', lessons: '/lessons', exam: '/exam', dictionary: '/dictionary', progress: '/progress', about: '/about', profile: '/profile' }

// ნავიგაციის ზოლი — Figma-ს „Test Navbar Home“ კომპონენტის მიხედვით
export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const logout = () => {
    dispatch(signOut())
    dispatch(hydrate(readJSON(progressKey(null), {})))
    navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand" aria-label="TAO">
        <img src={owl} alt="" width="58" height="67" />
        <span>TAO</span>
      </Link>

      <nav className={`nav-links ${open ? 'open' : ''}`} aria-label={t.menu}>
        {LINKS.map((key) => (
          <NavLink key={key} to={PATHS[key]} end={key === 'home'} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
            {t.nav[key]}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        {user ? (
          <button className="btn-signout" onClick={logout}>
            {t.signOut}
          </button>
        ) : (
          <Link className="btn-signout" to="/login">
            {t.signIn}
          </Link>
        )}
        <button
          className="btn-lang"
          onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')}
          aria-label={lang === 'ka' ? 'Switch to English' : 'ქართულზე გადართვა'}
        >
          {lang === 'ka' ? 'GEO' : 'ENG'} <Flag code={lang} />
        </button>
        <button className="btn-back" onClick={() => navigate(-1)} aria-label={t.back} title={t.back}>
          <Icon name="triLeft" size={20} />
        </button>
        <button className="btn-burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={t.menu}>
          <Icon name={open ? 'x' : 'menu'} size={26} />
        </button>
      </div>
    </header>
  )
}
