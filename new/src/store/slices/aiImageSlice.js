import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  uploadedImage: null,
  analysisResult: null,
  isAnalyzing: false,
}

const aiImageSlice = createSlice({
  name: 'aiImage',
  initialState,
  reducers: {
    setUploadedImage: (state, action) => {
      state.uploadedImage = action.payload
    },
    setAnalysisResult: (state, action) => {
      state.analysisResult = action.payload
    },
    setAnalyzing: (state, action) => {
      state.isAnalyzing = action.payload
    },
    clearImage: (state) => {
      state.uploadedImage = null
      state.analysisResult = null
    },
  },
})

export const { setUploadedImage, setAnalysisResult, setAnalyzing, clearImage } = aiImageSlice.actions
export default aiImageSlice.reducer
