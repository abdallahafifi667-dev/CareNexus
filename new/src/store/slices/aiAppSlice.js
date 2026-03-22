import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  darkMode: false,
  language: 'ar',
  isLoading: false,
}

const aiAppSlice = createSlice({
  name: 'aiApp',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { toggleDarkMode, setLanguage, setLoading } = aiAppSlice.actions
export default aiAppSlice.reducer
