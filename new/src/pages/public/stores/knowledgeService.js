import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';

/**
 * Search the medical knowledge base (Local, Wikipedia, OpenFDA)
 */
export const searchKnowledge = createAsyncThunk(
    'knowledge/search',
    async ({ query, lang = 'ar' }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/knowledge/search?query=${encodeURIComponent(query)}&lang=${lang}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);
