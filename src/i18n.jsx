import { createContext, useContext, useEffect, useState } from 'react'
import { readJSON, writeJSON } from './store/storage'

// ინტერფეისის ტექსტები ორ ენაზე (Figma-ში ენის გადამრთველი ENG/GEO)
const STRINGS = {
  ka: {
    nav: {
      home: 'მთავარი',
      alphabet: 'ანბანი',
      lessons: 'გაკვეთილები',
      exam: 'ტესტი',
      dictionary: 'ლექსიკონი',
      progress: 'პროგრესი',
      achievements: 'მიღწევები',
      about: 'ჩვენ შესახებ',
      profile: 'პროფილი',
    },
    signIn: 'შესვლა',
    signOut: 'გასვლა',
    back: 'უკან',
    menu: 'მენიუ',
    welcome:
      'მოგესალმებით ტაოში — პლატფორმაზე, სადაც ქართულ დამწერლობას ეტაპობრივად, მარტივად და სახალისოდ ისწავლით. დამწყები ხართ თუ ცოდნის გაღრმავება გსურთ, ჩვენ დაგეხმარებით.',
    motto: '„აუყევი ენის კიბეს — ასო-ასო.“',
    start: 'სწავლის დაწყება',
    startShort: 'დაწყება',
    learnScript: 'შესწავლა',
    scripts: {
      mkhedruli: {
        name: 'მხედრული',
        tag: 'თანამედროვე ქართული დამწერლობა',
        lines: ['„ხალხის დამწერლობა, დროში დახვეწილი.“', '„ძველი ფესვებიდან თანამედროვეობამდე — მხედრული გელოდება.“'],
      },
      asomtavruli: {
        name: 'ასომთავრული',
        tag: 'უძველესი ქართული დამწერლობა',
        lines: ['„დაიწყე იქ, სადაც ისტორიამ პირველი კვალი დატოვა.“', '„უძველესი მემკვიდრეობის თამამი ასოები.“'],
      },
      nuskhuri: {
        name: 'ნუსხური',
        tag: 'საეკლესიო დამწერლობა',
        lines: ['„ტრადიციის წმინდა შტრიხები — ისწავლე ნუსხური.“', '„სადაც რწმენა ყოველ ასოში ხვდება სინატიფეს.“'],
      },
    },
    footer: 'ტაო — ქართული დამწერლობის ისტორია თანამედროვე ტექნოლოგიებში',
  },
  en: {
    nav: {
      home: 'Home',
      alphabet: 'Alphabet',
      lessons: 'Lessons',
      exam: 'Exam',
      dictionary: 'Dictionary',
      progress: 'Progress',
      achievements: 'Achievements',
      about: 'About Us',
      profile: 'Profile',
    },
    signIn: 'Log In',
    signOut: 'Sign Out',
    back: 'Back',
    menu: 'Menu',
    welcome:
      "Welcome to TAO, your go-to platform for learning the beautiful Georgian language. Whether you're a beginner or looking to refine your skills, we're here to make learning fun and effective.",
    motto: '"Climb the ladder of language, one letter at a time."',
    start: 'Start learning',
    startShort: 'Start',
    learnScript: 'Learn',
    scripts: {
      mkhedruli: {
        name: 'Mkhedruli',
        tag: 'The modern Georgian script',
        lines: ['"The script of the people, refined through time."', '"From ancient roots to modern use: Mkhedruli awaits."'],
      },
      asomtavruli: {
        name: 'Asomtavruli',
        tag: 'The oldest Georgian script',
        lines: ['"Begin where history first inked its mark: Asomtavruli."', '"Bold letters of an ancient legacy."'],
      },
      nuskhuri: {
        name: 'Nuskhuri',
        tag: 'The ecclesiastical script',
        lines: ['"Sacred strokes of tradition: Learn Nuskhuri."', '"Where devotion meets elegance in every letter."'],
      },
    },
    footer: 'TAO — the history of Georgian script in modern technology',
  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => readJSON('tao-lang', 'ka'))
  useEffect(() => {
    writeJSON('tao-lang', lang)
    document.documentElement.lang = lang
  }, [lang])
  return <LangContext.Provider value={{ lang, setLang, t: STRINGS[lang] }}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext)
