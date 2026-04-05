import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create a new medical service request (Trip Request)
export const createOrder = createAsyncThunk(
  "patient/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/order/create`,
        orderData,
        {
          headers: { "auth-token": token },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create request",
      );
    }
  },
);

// Fetch patient's own requests
export const fetchPatientOrders = createAsyncThunk(
  "patient/fetchOrders",
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/order/getOrders`, {
        params,
        headers: { "auth-token": token },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch requests",
      );
    }
  },
);

// Fetch specific order details
export const fetchOrderDetails = createAsyncThunk(
  "patient/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/order/order/${orderId}`,
        {
          headers: { "auth-token": token },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch order details",
      );
    }
  },
);

// Cancel an order
export const cancelOrder = createAsyncThunk(
  "patient/cancelOrder",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/order/cancel/${orderId}`,
        { reason },
        {
          headers: { "auth-token": token },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to cancel order",
      );
    }
  },
);

// Confirm completion
export const confirmCompletion = createAsyncThunk(
  "patient/confirmCompletion",
  async ({ orderId, feedback }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/order/confirmCompletion/${orderId}`,
        { feedback },
        {
          headers: { "auth-token": token },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to confirm completion",
      );
    }
  },
);

// Mark arrival
export const markArrival = createAsyncThunk(
  "patient/markArrival",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/order/markArrival/${orderId}`,
        {},
        {
          headers: { "auth-token": token },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to mark arrival",
      );
    }
  },
);

// Fetch conversations
export const fetchConversations = createAsyncThunk(
  "patient/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/chat/conversations`, {
        headers: { "auth-token": token },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch conversations",
      );
    }
  },
);
