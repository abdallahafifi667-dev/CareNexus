import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

/**
 * Search the medical knowledge base (Local, Wikipedia, OpenFDA)
 */
export const searchKnowledge = createAsyncThunk(
  "knowledge/search",
  async ({ query, lang = "ar" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/knowledge/search?query=${encodeURIComponent(query)}&lang=${lang}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  },
);

/**
 * Get drug name suggestions for autocomplete
 */
export const getDrugSuggestions = createAsyncThunk(
  "knowledge/getDrugSuggestions",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/knowledge/drugs/suggestions?query=${encodeURIComponent(query)}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch suggestions",
      );
    }
  },
);

/**
 * Get full drug details
 */
export const getDrugDetails = createAsyncThunk(
  "knowledge/getDrugDetails",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/knowledge/drugs/details?name=${encodeURIComponent(name)}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch drug details",
      );
    }
  },
);
