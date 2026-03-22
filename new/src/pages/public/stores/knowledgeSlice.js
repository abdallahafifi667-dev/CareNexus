import { createSlice } from '@reduxjs/toolkit';
import { searchKnowledge } from './knowledgeService';

const initialState = {
    results: [],
    chatHistory: [
        {
            id: 'welcome',
            text: 'WELCOME_KEY',
            sender: 'ai',
            timestamp: new Date().toISOString(),
        }
    ],
    isLoading: false,
    error: null,
};

const knowledgeSlice = createSlice({
    name: 'knowledge',
    initialState,
    reducers: {
        addUserMessage: (state, action) => {
            state.chatHistory.push({
                id: Date.now(),
                text: action.payload,
                sender: 'user',
                timestamp: new Date().toISOString(),
            });
        },
        addAiMessage: (state, action) => {
            state.chatHistory.push({
                id: Date.now(),
                text: action.payload.text,
                sender: 'ai',
                results: action.payload.results || [],
                timestamp: new Date().toISOString(),
            });
        },
        clearHistory: (state) => {
            state.chatHistory = [initialState.chatHistory[0]];
            state.results = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchKnowledge.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchKnowledge.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload.results;
            })
            .addCase(searchKnowledge.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { addUserMessage, addAiMessage, clearHistory } = knowledgeSlice.actions;
export default knowledgeSlice.reducer;
