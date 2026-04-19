import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Create a new medical service request (Trip Request)
export const createOrder = createAsyncThunk(
  "patient/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        `/order/create`,
        orderData
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
      const response = await axiosInstance.get(`/order/getOrders`, {
        params
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
      const response = await axiosInstance.get(
        `/user/profile/order/${orderId}`
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
      const response = await axiosInstance.post(
        `/order/cancel/${orderId}`,
        { reason }
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
      const response = await axiosInstance.post(
        `/order/confirmCompletion/${orderId}`,
        { feedback }
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
      const response = await axiosInstance.patch(
        `/order/markArrival/${orderId}`,
        {}
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
      const response = await axiosInstance.get(`/chat/conversations`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch conversations",
      );
    }
  },
);
