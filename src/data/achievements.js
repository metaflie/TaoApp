import { LESSONS } from './lessons'
import { LETTERS } from './letters'
import { SCRIPTS } from './letters'

const totalLearned = (p) => Object.values(p.learned).reduce((n, list) => n + list.length, 0)
const bestQuiz = (p) => p.quizHistory.reduce((best, q) => Math.max(best, q.score / q.total), 0)

// თითოეული მიღწევა: მიზანი და მიმდინარე მნიშვნელობა
export const ACHIEVEMENTS = [
  { id: 'first-letter', icon: 'feather', title: 'პირველი ასო', text: 'ისწავლე პირველი ასო', goal: 1, value: totalLearned },
  { id: 'ten-letters', icon: 'scroll', title: 'მწიგნობარი', text: 'ისწავლე 10 ასო', goal: 10, value: totalLearned },
  {
    id: 'asomtavruli-master',
    icon: 'column',
    title: 'ასომთავრულის ოსტატი',
    text: 'ისწავლე ასომთავრულის ყველა ასო',
    goal: LETTERS.length,
    value: (p) => p.learned.asomtavruli.length,
  },
  { id: 'first-lesson', icon: 'book', title: 'პირველი ნაბიჯი', text: 'დაასრულე პირველი გაკვეთილი', goal: 1, value: (p) => p.completedLessons.length },
  {
    id: 'all-lessons',
    icon: 'crown',
    title: 'მოძღვარი',
    text: 'დაასრულე ყველა გაკვეთილი (თეორიული და ინტერაქციული)',
    goal: LESSONS.length + SCRIPTS.length,
    value: (p) => p.completedLessons.length,
  },
  { id: 'first-quiz', icon: 'target', title: 'გამოცდა', text: 'გაიარე პირველი ტესტი', goal: 1, value: (p) => p.quizHistory.length },
  {
    id: 'perfect-quiz',
    icon: 'star',
    title: 'უშეცდომო',
    text: 'ტესტში მიიღე მაქსიმალური ქულა',
    goal: 1,
    value: (p) => (bestQuiz(p) === 1 ? 1 : 0),
  },
  { id: 'dictionary', icon: 'bookmark', title: 'ლექსიკოგრაფი', text: 'შეინახე 5 სიტყვა ლექსიკონიდან', goal: 5, value: (p) => p.savedWords.length },
  { id: 'points', icon: 'gem', title: 'საგანძური', text: 'დააგროვე 500 ქულა', goal: 500, value: (p) => p.points },
]

export function evaluateAchievements(progress) {
  return ACHIEVEMENTS.map((a) => {
    const current = Math.min(a.value(progress), a.goal)
    return { ...a, current, done: current >= a.goal }
  })
}
