import { createSlice } from '@reduxjs/toolkit'
import { readJSON } from './storage'

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: readJSON('tao-session', null) },
  reducers: {
    signIn: (state, action) => {
      state.user = action.payload
    },
    signOut: (state) => {
      state.user = null
    },
  },
})

export const { signIn, signOut } = authSlice.actions
export default authSlice.reducer
