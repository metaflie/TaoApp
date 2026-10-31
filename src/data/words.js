// სიტყვა-ბარათები თითოეული დამწერლობის ინტერაქციული გაკვეთილისთვის.
// პირველი ორი სიტყვა ყველგან Figma-ს მაკეტიდანაა (ია, ჟირაფი, თითი, ფუტკარი, აქლემი, ბუ).
export const WORD_LESSONS = {
  asomtavruli: {
    intro:
      'ქართული დამწერლობა უნიკალური კულტურული მემკვიდრეობაა, რომელიც UNESCO-ს არამატერიალური კულტურული მემკვიდრეობის სიაშიცაა შეტანილი. ქართულ დამწერლობას სამი სახე აქვს: ასომთავრული, ნუსხური და მხედრული. ასომთავრული უძველესი დამწერლობაა — მისი თარიღიანი ნიმუშები V საუკუნით თარიღდება. მას ახასიათებს მრგვლოვანი, მონუმენტური ფორმები და ძირითადად საზეიმო წარწერებში, საეკლესიო ხელნაწერებსა და ოფიციალურ დოკუმენტებში გამოიყენებოდა.',
    introEn:
      'Georgian script is a unique cultural heritage included in the UNESCO list. It has three main types: Asomtavruli, Nuskhuri and Mkhedruli. Asomtavruli is the oldest script, dating back to the 5th century, and is characterized by bold and monumental forms. It was primarily used for ceremonial texts, religious manuscripts and official documents.',
    cards: [
      { word: 'ია', syllables: ['ი', 'ა'], meaning: 'ია (ყვავილი)', en: 'violet', translit: 'ia', emoji: '🪻' },
      { word: 'ჟირაფი', syllables: ['ჟი', 'რა', 'ფი'], meaning: 'ჟირაფი', en: 'giraffe', translit: 'zhirapi', emoji: '🦒' },
      { word: 'დედა', syllables: ['დე', 'და'], meaning: 'დედა', en: 'mother', translit: 'deda', emoji: '👩' },
      { word: 'მზე', syllables: ['მზე'], meaning: 'მზე', en: 'sun', translit: 'mze', emoji: '☀️' },
      { word: 'ხე', syllables: ['ხე'], meaning: 'ხე', en: 'tree', translit: 'khe', emoji: '🌳' },
    ],
  },
  nuskhuri: {
    intro:
      'ნუსხური VIII–IX საუკუნეებში ჩამოყალიბდა. ასომთავრულთან შედარებით უფრო დახვეწილი და მოქნილია, ასოები ვიწრო და კუთხოვანია. ასეთი ფორმა უფრო სწრაფი და პრაქტიკული წერის საშუალებას იძლეოდა, ამიტომ ნუსხური ხელნაწერი წიგნების ძირითად დამწერლობად იქცა. ასომთავრულთან ერთად ის ქმნიდა „ხუცურს“ — საეკლესიო დამწერლობას.',
    introEn:
      'Nuskhuri developed in the 8th–9th centuries and is more refined and flexible compared to Asomtavruli. Its design allowed for quicker and more practical writing, making it suitable for manuscripts. Together with Asomtavruli it formed "Khutsuri", the ecclesiastical script.',
    cards: [
      { word: 'თითი', syllables: ['თი', 'თი'], meaning: 'თითი', en: 'finger', translit: 'titi', emoji: '👆' },
      { word: 'ფუტკარი', syllables: ['ფუტ', 'კა', 'რი'], meaning: 'ფუტკარი', en: 'bee', translit: 'putkari', emoji: '🐝' },
      { word: 'კატა', syllables: ['კა', 'ტა'], meaning: 'კატა', en: 'cat', translit: 'kata', emoji: '🐈' },
      { word: 'ვაშლი', syllables: ['ვაშ', 'ლი'], meaning: 'ვაშლი', en: 'apple', translit: 'vashli', emoji: '🍎' },
      { word: 'წიგნი', syllables: ['წიგ', 'ნი'], meaning: 'წიგნი', en: 'book', translit: 'tsigni', emoji: '📖' },
    ],
  },
  mkhedruli: {
    intro:
      'მხედრული IX–X საუკუნეებში გაჩნდა და დღემდე გამოიყენება. თავდაპირველად საერო და სამოქალაქო საბუთების დამწერლობა იყო, დროთა განმავლობაში კი თანამედროვე ქართულის ერთადერთ სტანდარტად იქცა. მარტივი და პრაქტიკულია — მას ყოველდღიურ ცხოვრებასა და ოფიციალურ დოკუმენტაციაში ვიყენებთ.',
    introEn:
      'Mkhedruli, which emerged in the 9th–10th centuries, is still in use today. It is simple and practical, which made it the dominant script for modern Georgian. Mkhedruli is used in daily life and official documentation.',
    cards: [
      { word: 'აქლემი', syllables: ['აქ', 'ლე', 'მი'], meaning: 'აქლემი', en: 'camel', translit: 'aklemi', emoji: '🐫' },
      { word: 'ბუ', syllables: ['ბ', 'უ'], meaning: 'ბუ', en: 'owl', translit: 'bu', emoji: '🦉' },
      { word: 'თევზი', syllables: ['თევ', 'ზი'], meaning: 'თევზი', en: 'fish', translit: 'tevzi', emoji: '🐟' },
      { word: 'ყვავილი', syllables: ['ყვა', 'ვი', 'ლი'], meaning: 'ყვავილი', en: 'flower', translit: 'qvavili', emoji: '🌸' },
      { word: 'სახლი', syllables: ['სახ', 'ლი'], meaning: 'სახლი', en: 'house', translit: 'sakhli', emoji: '🏠' },
    ],
  },
}

export const wordLessonId = (script) => `words-${script}`
