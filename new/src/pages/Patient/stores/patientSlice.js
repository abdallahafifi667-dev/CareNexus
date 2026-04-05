import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  fetchPatientOrders,
  fetchOrderDetails,
  cancelOrder,
  confirmCompletion,
  markArrival,
  fetchConversations,
} from "./patientService";

const initialState = {
  orders: [],
  currentOrder: null,
  conversations: [],
  loading: false,
  actionLoading: false,
  error: null,
  currentTitle: "",
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setHeaderTitle: (state, action) => {
      state.currentTitle = action.payload;
    },
    clearPatientState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Optionally add to orders list or redirect
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Fetch Orders
      .addCase(fetchPatientOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data || action.payload;
      })
      .addCase(fetchPatientOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.conversations || [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Actions (Cancel, Confirm, Mark Arrival)
      .addMatcher(
        (action) =>
          [
            cancelOrder.pending,
            confirmCompletion.pending,
            markArrival.pending,
          ].includes(action.type),
        (state) => {
          state.actionLoading = true;
        },
      )
      .addMatcher(
        (action) =>
          [
            cancelOrder.fulfilled,
            confirmCompletion.fulfilled,
            markArrival.fulfilled,
          ].includes(action.type),
        (state) => {
          state.actionLoading = false;
        },
      )
      .addMatcher(
        (action) =>
          [
            cancelOrder.rejected,
            confirmCompletion.rejected,
            markArrival.rejected,
          ].includes(action.type),
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { resetError, clearPatientState, setHeaderTitle } =
  patientSlice.actions;
export default patientSlice.reducer;
