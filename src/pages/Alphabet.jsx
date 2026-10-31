import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LETTERS, SCRIPTS } from '../data/letters'
import { toggleLearned } from '../store/progressSlice'
import { useLang } from '../i18n'
import { PageTitle } from '../components/ui'
import { SCRIPT_COLORS, speak } from '../lib'
import Icon from '../components/Icon'

// ანბანის გვერდი: სამი დამწერლობა, ასოს არჩევა და მისი მონაცემები
export default function Alphabet() {
  const { lang } = useLang()
  const [params, setParams] = useSearchParams()
  const script = SCRIPTS.some((s) => s.key === params.get('script')) ? params.get('script') : 'asomtavruli'
  const [selected, setSelected] = useState(LETTERS[0].id)
  const [query, setQuery] = useState('')
  const [hideArchaic, setHideArchaic] = useState(false)
  const learned = useSelector((s) => s.progress.learned[script])
  const dispatch = useDispatch()
  const info = SCRIPTS.find((s) => s.key === script)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LETTERS.filter((l) => (!hideArchaic || !l.archaic) && (!q || l.mkhedruli === q || l.name.includes(q) || l.translit.toLowerCase() === q))
  }, [query, hideArchaic])

  const letter = LETTERS.find((l) => l.id === selected) ?? LETTERS[0]
  const isLearned = learned.includes(letter.mkhedruli)
  const ka = lang === 'ka'

  return (
    <div className="container">
      <PageTitle sub={ka ? 'აირჩიე დამწერლობა და დააჭირე ასოს მისი მნიშვნელობის სანახავად' : 'Choose a script and tap a letter to see its details'}>
        {ka ? 'ქართული ანბანი' : 'Georgian Alphabet'}
      </PageTitle>

      <div className="tabs" role="tablist">
        {SCRIPTS.map((s) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={s.key === script}
            className={s.key === script ? 'tab active' : 'tab'}
            style={s.key === script ? { background: SCRIPT_COLORS[s.key] } : undefined}
            onClick={() => setParams({ script: s.key })}
          >
            <span className="geo">{s.sample}</span>
          </button>
        ))}
      </div>

      <p className="script-desc">
        <strong>{info.title}</strong> · {info.era} — {info.description}
      </p>

      <div className="alphabet-layout">
        <div className="panel">
          <div className="toolbar">
            <label className="search">
              <Icon name="search" size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ka ? 'ძიება: ასო, სახელი ან ლათინური' : 'Search: letter, name or latin'} />
            </label>
            <label className="check">
              <input type="checkbox" checked={hideArchaic} onChange={(e) => setHideArchaic(e.target.checked)} />
              {ka ? 'არქაული ასოების დამალვა' : 'Hide archaic letters'}
            </label>
          </div>
          <div className="letter-grid">
            {visible.map((l) => (
              <button
                key={l.id}
                className={`letter-cell ${l.id === letter.id ? 'selected' : ''} ${learned.includes(l.mkhedruli) ? 'learned' : ''}`}
                onClick={() => setSelected(l.id)}
                aria-label={`${l.name} (${l.translit})`}
                style={l.id === letter.id ? { background: SCRIPT_COLORS[script] } : undefined}
              >
                <span className="geo">{l[script]}</span>
                {l.archaic && <i className="dot" title={ka ? 'არქაული' : 'archaic'} />}
              </button>
            ))}
            {!visible.length && <p className="empty">{ka ? 'ვერაფერი მოიძებნა' : 'Nothing found'}</p>}
          </div>
        </div>

        <aside className="letter-detail panel" aria-live="polite">
          <div className="detail-glyph" style={{ background: SCRIPT_COLORS[script] }}>
            <span className="geo">{letter[script]}</span>
          </div>
          <h2>
            {letter.name} <small>/{letter.translit}/</small>
          </h2>
          <dl className="facts">
            <div>
              <dt>{ka ? 'ასომთავრული' : 'Asomtavruli'}</dt>
              <dd className="geo">{letter.asomtavruli}</dd>
            </div>
            <div>
              <dt>{ka ? 'ნუსხური' : 'Nuskhuri'}</dt>
              <dd className="geo">{letter.nuskhuri}</dd>
            </div>
            <div>
              <dt>{ka ? 'მხედრული' : 'Mkhedruli'}</dt>
              <dd className="geo">{letter.mkhedruli}</dd>
            </div>
            <div>
              <dt>{ka ? 'რიგი' : 'Order'}</dt>
              <dd>{letter.order}</dd>
            </div>
            <div>
              <dt>{ka ? 'რიცხვითი მნიშვნელობა' : 'Numeric value'}</dt>
              <dd>{letter.value.toLocaleString('ka-GE')}</dd>
            </div>
          </dl>
          {letter.archaic && <p className="note">{ka ? 'არქაული ასო — თანამედროვე ანბანში აღარ გამოიყენება.' : 'Archaic letter — no longer used in the modern alphabet.'}</p>}
          <div className="detail-actions">
            <button className="btn btn-blue" onClick={() => speak(letter.mkhedruli)}>
              <Icon name="speaker" size={18} /> {ka ? 'მოსმენა' : 'Listen'}
            </button>
            <button className={`btn ${isLearned ? 'btn-green' : 'btn-outline'}`} onClick={() => dispatch(toggleLearned({ script, letter: letter.mkhedruli }))}>
              <Icon name="check" size={18} /> {isLearned ? (ka ? 'ნასწავლია' : 'Learned') : ka ? 'მონიშნე ნასწავლად' : 'Mark as learned'}
            </button>
          </div>
          <p className="muted small">
            {ka ? 'ნასწავლი ასოები' : 'Learned letters'}: {learned.length}/{LETTERS.length}
          </p>
        </aside>
      </div>
    </div>
  )
}
