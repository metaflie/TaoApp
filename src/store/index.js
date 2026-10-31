import { configureStore } from '@reduxjs/toolkit'
import progressReducer from './progressSlice'
import authReducer from './authSlice'
import { readJSON, writeJSON, progressKey } from './storage'

const session = readJSON('tao-session', null)

export const store = configureStore({
  reducer: { progress: progressReducer, auth: authReducer },
  preloadedState: {
    auth: { user: session },
    progress: { ...progressReducer(undefined, { type: '@@init' }), ...readJSON(progressKey(session), {}) },
  },
})

// ყოველ ცვლილებაზე პროგრესი და სესია ლოკალურად ინახება
let prev = store.getState()
store.subscribe(() => {
  const next = store.getState()
  if (next.auth.user !== prev.auth.user) writeJSON('tao-session', next.auth.user)
  if (next.progress !== prev.progress && next.auth.user === prev.auth.user) {
    writeJSON(progressKey(next.auth.user), next.progress)
  }
  prev = next
})
