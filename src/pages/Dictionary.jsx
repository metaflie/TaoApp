import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WORDS, WORD_TAGS } from '../data/dictionary'
import { transliterate } from '../data/letters'
import { toggleWord } from '../store/progressSlice'
import { useLang } from '../i18n'
import { PageTitle } from '../components/ui'
import Icon from '../components/Icon'

// ლექსიკონი: ძველი ქართული სიტყვების ძიება და თანამედროვე მნიშვნელობები
export default function Dictionary() {
  const { lang, t } = useLang()
  const ka = lang === 'ka'
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('ყველა')
  const [onlySaved, setOnlySaved] = useState(false)
  const saved = useSelector((s) => s.progress.savedWords)
  const dispatch = useDispatch()

  const results = useMemo(() => {
    const term = q.trim()
    return WORDS.filter(
      (w) =>
        (tag === 'ყველა' || w.tag === tag) &&
        (!onlySaved || saved.includes(w.old)) &&
        (!term || w.old.includes(term) || w.modern.includes(term) || w.meaning.includes(term)),
    )
  }, [q, tag, onlySaved, saved])

  return (
    <div className="container">
      <PageTitle sub={ka ? 'მოძებნე ძველი ქართული სიტყვა და გაიგე მისი თანამედროვე მნიშვნელობა' : 'Search Old Georgian words and see their modern meaning'}>
        {t.nav.dictionary}
      </PageTitle>

      <div className="panel dict-tools">
        <label className="search wide">
          <Icon name="search" size={20} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={ka ? 'მაგ.: ჴელი, სიტყვა, დრო…' : 'e.g. ჴელი, სიტყვა, დრო…'} aria-label="search" />
        </label>
        <div className="chip-row dark">
          {WORD_TAGS.map((tg) => (
            <button key={tg} className={`chip ${tag === tg ? 'on' : ''}`} onClick={() => setTag(tg)}>
              {tg}
            </button>
          ))}
          <button className={`chip ${onlySaved ? 'on' : ''}`} onClick={() => setOnlySaved((v) => !v)}>
            <Icon name="bookmark" size={14} /> {ka ? 'შენახული' : 'Saved'} ({saved.length})
          </button>
        </div>
      </div>

      <p className="muted light small">
        {ka ? 'ნაპოვნია' : 'Found'}: {results.length}
      </p>

      <div className="word-grid">
        {results.map((w) => {
          const isSaved = saved.includes(w.old)
          return (
            <article className="word-card" key={w.old}>
              <div className="wc-top">
                <div>
                  <div className="wc-old">{w.old}</div>
                  <div className="geo wc-asom">{transliterate(w.old, 'asomtavruli')}</div>
                </div>
                <button className={`icon-btn ${isSaved ? 'saved' : ''}`} onClick={() => dispatch(toggleWord(w.old))} aria-pressed={isSaved} aria-label={ka ? 'შენახვა' : 'Save'}>
                  <Icon name={isSaved ? 'bookmarkFill' : 'bookmark'} size={20} />
                </button>
              </div>
              <div className="wc-modern">
                → <strong>{w.modern}</strong>
              </div>
              <p>{w.meaning}</p>
              <p className="wc-ex">„{w.example}“</p>
              <span className="wc-tag">{w.tag}</span>
            </article>
          )
        })}
      </div>
      {!results.length && <p className="empty light">{ka ? 'სიტყვა ვერ მოიძებნა' : 'No words found'}</p>}
    </div>
  )
}
