import { useLang } from '../i18n'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { SCRIPT_COLORS } from '../lib'

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <span>© 2026 TAO · {t.footer}</span>
    </footer>
  )
}

export function PageTitle({ children, sub }) {
  return (
    <div className="page-title">
      <h1>{children}</h1>
      {sub && <p>{sub}</p>}
    </div>
  )
}

// ასოს ბარათი (Figma-ს მწვანე/ყვითელი მომრგვალებული კვადრატი)
export function GlyphTile({ glyph, script, size = 'md', ...rest }) {
  return (
    <div className={`glyph-tile ${size}`} style={{ background: SCRIPT_COLORS[script] }} {...rest}>
      <span className="geo">{glyph}</span>
    </div>
  )
}

export function ProgressBar({ value, max, color = '#92F277' }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// მხოლოდ ავტორიზებული მომხმარებლისთვის
export function RequireAuth({ children }) {
  const user = useSelector((s) => s.auth.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
