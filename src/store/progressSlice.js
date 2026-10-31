import { createSlice } from '@reduxjs/toolkit'

export const emptyProgress = () => ({
  learned: { asomtavruli: [], nuskhuri: [], mkhedruli: [] },
  completedLessons: [],
  quizHistory: [],
  savedWords: [],
  points: 0,
})

const progressSlice = createSlice({
  name: 'progress',
  initialState: emptyProgress(),
  reducers: {
    hydrate: (_state, action) => ({ ...emptyProgress(), ...action.payload }),
    toggleLearned: (state, action) => {
      const { script, letter } = action.payload
      const list = state.learned[script]
      const i = list.indexOf(letter)
      if (i === -1) {
        list.push(letter)
        state.points += 5
      } else {
        list.splice(i, 1)
        state.points = Math.max(0, state.points - 5)
      }
    },
    learnLetters: (state, action) => {
      const { script, letters } = action.payload
      letters.forEach((l) => {
        if (!state.learned[script].includes(l)) {
          state.learned[script].push(l)
          state.points += 5
        }
      })
    },
    completeLesson: (state, action) => {
      if (!state.completedLessons.includes(action.payload)) {
        state.completedLessons.push(action.payload)
        state.points += 50
      }
    },
    recordQuiz: (state, action) => {
      const { mode, score, total } = action.payload
      state.quizHistory.unshift({ mode, score, total, date: new Date().toISOString() })
      state.quizHistory = state.quizHistory.slice(0, 20)
      state.points += score * 10
    },
    toggleWord: (state, action) => {
      const i = state.savedWords.indexOf(action.payload)
      if (i === -1) state.savedWords.push(action.payload)
      else state.savedWords.splice(i, 1)
    },
    resetProgress: () => emptyProgress(),
  },
})

export const { hydrate, toggleLearned, learnLetters, completeLesson, recordQuiz, toggleWord, resetProgress } =
  progressSlice.actions
export default progressSlice.reducer
