import { configureStore } from '@reduxjs/toolkit'
import aiAppReducer from './slices/aiAppSlice'
import aiChatReducer from './slices/aiChatSlice'
import aiImageReducer from './slices/aiImageSlice'
import authReducer from '../pages/Auth/stores/authSlice'
import knowledgeReducer from '../pages/public/stores/knowledgeSlice'
import sliderReducer from './slices/sliderSlice'

export const store = configureStore({
  reducer: {
    aiApp: aiAppReducer,
    aiChat: aiChatReducer,
    aiImage: aiImageReducer,
    auth: authReducer,
    knowledge: knowledgeReducer,
    slider: sliderReducer,
  },
})
