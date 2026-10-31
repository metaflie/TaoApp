// ქართული ანბანი ტრადიციული რიგით.
// სამივე დამწერლობის სიმბოლო Unicode-დან გამოითვლება:
//   მხედრული  U+10D0 + i
//   ასომთავრული U+10A0 + i
//   ნუსხური   U+2D00 + i
// რიცხვითი მნიშვნელობები — ქართული ანბანური რიცხვების სისტემა.

const RAW = [
  // [მხედრული, სახელი, ტრანსლიტერაცია, რიცხვი, არქაულია?]
  ['ა', 'ანი', 'a', 1],
  ['ბ', 'ბანი', 'b', 2],
  ['გ', 'განი', 'g', 3],
  ['დ', 'დონი', 'd', 4],
  ['ე', 'ენი', 'e', 5],
  ['ვ', 'ვინი', 'v', 6],
  ['ზ', 'ზენი', 'z', 7],
  ['ჱ', 'ჰე', 'ē', 8, true],
  ['თ', 'თანი', 't', 9],
  ['ი', 'ინი', 'i', 10],
  ['კ', 'კანი', "k'", 20],
  ['ლ', 'ლასი', 'l', 30],
  ['მ', 'მანი', 'm', 40],
  ['ნ', 'ნარი', 'n', 50],
  ['ჲ', 'იე', 'y', 60, true],
  ['ო', 'ონი', 'o', 70],
  ['პ', 'პარი', "p'", 80],
  ['ჟ', 'ჟანი', 'zh', 90],
  ['რ', 'რაე', 'r', 100],
  ['ს', 'სანი', 's', 200],
  ['ტ', 'ტარი', "t'", 300],
  ['ჳ', 'ვიე', 'w', 400, true],
  ['უ', 'უნი', 'u', 400],
  ['ფ', 'ფარი', 'p', 500],
  ['ქ', 'ქანი', 'k', 600],
  ['ღ', 'ღანი', 'gh', 700],
  ['ყ', 'ყარი', "q'", 800],
  ['შ', 'შინი', 'sh', 900],
  ['ჩ', 'ჩინი', 'ch', 1000],
  ['ც', 'ცანი', 'ts', 2000],
  ['ძ', 'ძილი', 'dz', 3000],
  ['წ', 'წილი', "ts'", 4000],
  ['ჭ', 'ჭარი', "ch'", 5000],
  ['ხ', 'ხანი', 'kh', 6000],
  ['ჴ', 'ჰარი', 'q', 7000, true],
  ['ჯ', 'ჯანი', 'j', 8000],
  ['ჰ', 'ჰაე', 'h', 9000],
  ['ჵ', 'ჰოე', 'ō', 10000, true],
]

export const LETTERS = RAW.map(([mkhedruli, name, translit, value, archaic], order) => {
  const offset = mkhedruli.codePointAt(0) - 0x10d0
  return {
    id: translit.replace("'", 'q') + '-' + offset,
    order: order + 1,
    mkhedruli,
    asomtavruli: String.fromCodePoint(0x10a0 + offset),
    nuskhuri: String.fromCodePoint(0x2d00 + offset),
    name,
    translit,
    value,
    archaic: Boolean(archaic),
  }
})

export const SCRIPTS = [
  {
    key: 'asomtavruli',
    title: 'ასომთავრული',
    short: 'მრგვლოვანი',
    era: 'V საუკუნე',
    description:
      'ქართული დამწერლობის უძველესი ფორმა. მისი ყველაზე ადრეული თარიღიანი ნიმუშები V საუკუნით თარიღდება — მათ შორისაა ბოლნისის სიონის წარწერა.',
  },
  {
    key: 'nuskhuri',
    title: 'ნუსხური',
    short: 'კუთხოვანი',
    era: 'IX საუკუნე',
    description:
      'ხელნაწერი წიგნების დამწერლობა. ასომთავრულთან ერთად ქმნიდა „ხუცურს“ — ეკლესიურ დამწერლობას, სადაც ასომთავრული მთავრული ასოს როლს ასრულებდა.',
  },
  {
    key: 'mkhedruli',
    title: 'მხედრული',
    short: 'თანამედროვე',
    era: 'X საუკუნე',
    description:
      'დღევანდელი ქართული დამწერლობა. თავდაპირველად საერო და სამოქალაქო საბუთებში გამოიყენებოდა, დღეს კი ყოველდღიური წერის ერთადერთი სტანდარტია.',
  },
]

export const getScript = (key) => SCRIPTS.find((s) => s.key === key) ?? SCRIPTS[0]

export const findLetter = (mkhedruli) => LETTERS.find((l) => l.mkhedruli === mkhedruli)

// მხედრული ტექსტის გადაყვანა სხვა დამწერლობაზე
export function transliterate(text, script) {
  if (script === 'mkhedruli') return text
  const base = script === 'asomtavruli' ? 0x10a0 : 0x2d00
  return [...text]
    .map((ch) => {
      const cp = ch.codePointAt(0)
      if (cp >= 0x10d0 && cp <= 0x10f5) return String.fromCodePoint(base + cp - 0x10d0)
      return ch
    })
    .join('')
}

SCRIPTS.forEach((s) => {
  s.sample = transliterate(s.title, s.key)
})
