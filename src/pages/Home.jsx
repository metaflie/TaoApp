import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLang } from '../i18n'
import { GlyphTile } from '../components/ui'
import Icon from '../components/Icon'
import { LETTERS } from '../data/letters'

// Figma: „Home“ — მისალმება, დევიზი და სამი დამწერლობის ბარათი (Group 116/117/118)
const ORDER = [
  { key: 'mkhedruli', glyph: 'ა' },
  { key: 'asomtavruli', glyph: 'Ⴀ' },
  { key: 'nuskhuri', glyph: 'ⴀ' },
]

export default function Home() {
  const { t, lang } = useLang()
  const user = useSelector((s) => s.auth.user)
  const learned = useSelector((s) => s.progress.learned)

  return (
    <div className="home container">
      <section className="hero">
        <p className="welcome">
          {user && <strong className="hello">{lang === 'ka' ? `გამარჯობა, ${user.firstName}! ` : `Hello, ${user.firstName}! `}</strong>}
          {t.welcome}
        </p>
        <h2 className="motto">{t.motto}</h2>
        <Link to="/lessons" className="btn-cta">
          {t.start} <Icon name="right" size={20} />
        </Link>
      </section>

      <section className="script-list" aria-label={lang === 'ka' ? 'სასწავლო კატეგორიები' : 'Learning categories'}>
        {ORDER.map(({ key, glyph }) => {
          const s = t.scripts[key]
          const count = learned[key].length
          return (
            <article className="script-row" key={key}>
              <Link to={`/alphabet?script=${key}`} className="script-tile-link" aria-label={s.name}>
                <GlyphTile glyph={glyph} script={key} size="xl" />
              </Link>
              <div className="script-text">
                <h3>
                  {s.name} <span>({s.tag})</span>:
                </h3>
                <ul>
                  {s.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                <div className="script-meta">
                  <span>
                    {count}/{LETTERS.length} {lang === 'ka' ? 'ასო ნასწავლია' : 'letters learned'}
                  </span>
                  <Link to={`/lessons/play/${key}`} className="pill-link">
                    {t.learnScript} <Icon name="right" size={16} />
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
