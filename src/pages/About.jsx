import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import Icon from '../components/Icon'

// Figma „About us“ — ხუთი ტექსტური ბლოკი
const BLOCKS = {
  ka: [
    ['target', 'ჩვენი მისია', 'ჩვენი მიზანია ადამიანები ქართული ენის საშუალებით დავაკავშიროთ საქართველოს მდიდარ კულტურულ მემკვიდრეობასთან — იქნება ეს ქართველი თუ უცხოელი, რომელსაც მსოფლიოს ერთ-ერთი უძველესი ენის გაცნობა სურს.'],
    ['history', 'ძველი და ახალი ერთად', 'მეფეების დროინდელი ასომთავრული წარწერებიდან თბილისის ქუჩებში გაგონილ ყოველდღიურ ფრაზებამდე — ჩვენ ქართული ენის მდიდარ ისტორიას თანამედროვე სწავლების მეთოდებს ვუთავსებთ.'],
    ['users', 'ჩვენი გუნდი', 'ჩვენ ვართ ენის მოყვარულთა, პედაგოგებისა და ტექნოლოგების გუნდი, რომლის მიზანია ქართულის სწავლა ყველასთვის ხელმისაწვდომი გახადოს. სულ ახლა იწყებ თუ ისტორიულ ტექსტებს იკვლევ — ყოველ ნაბიჯზე გვერდით დაგიდგებით.'],
    ['globe', 'ქართული ენა: სიტყვებზე მეტი', 'ქართული მსოფლიოს ერთ-ერთი უძველესი ენაა, უნიკალური ანბანითა და ათასწლოვანი ისტორიით. ჩვენი პლატფორმა დაგეხმარება არა მხოლოდ კითხვასა და წერაში, არამედ ენის კულტურული მნიშვნელობის გააზრებაშიც.'],
    ['heart', 'შემოგვიერთდი', 'ჩვენთან ერთად ქართულის სწავლით შენ შემსწავლელთა და ენის მოყვარულთა გლობალურ საზოგადოებას უერთდები. მოდი, ერთად შევისწავლოთ, შევინარჩუნოთ და ვადიდოთ ეს ლამაზი ენა.'],
  ],
  en: [
    ['target', 'Our Mission', "We aim to connect people to Georgia's rich cultural heritage through its language, whether you're a Georgian or a global learner eager to explore one of the world's oldest languages."],
    ['history', 'Old Meets New', 'From the Asomtavruli script of ancient kings to the everyday phrases spoken in Tbilisi, we blend Georgian’s rich history with contemporary learning.'],
    ['users', 'Meet Our Team', "We are a passionate group of language lovers, educators, and technologists, committed to making Georgian learning accessible to all. Whether you're just starting out or delving into historical texts, we're here to guide you every step of the way."],
    ['globe', 'The Georgian Language: More Than Words', 'Georgian is one of the oldest languages in the world, with a unique alphabet and a history spanning thousands of years. Our platform is designed to help you not only learn to read and write Georgian but to understand its deep cultural significance.'],
    ['heart', 'Join the Community', 'When you learn Georgian with us, you’re joining a global community of learners and enthusiasts. Let’s explore, preserve, and celebrate this beautiful language together.'],
  ],
}

export default function About() {
  const { lang, t } = useLang()
  return (
    <div className="container about">
      <div className="about-card">
        {BLOCKS[lang].map(([icon, h, body]) => (
          <section key={h}>
            <h2>
              <Icon name={icon} size={26} /> {h}
            </h2>
            <p>{body}</p>
          </section>
        ))}
        <Link to="/signup" className="btn btn-blue">
          {t.start}
        </Link>
      </div>
    </div>
  )
}
