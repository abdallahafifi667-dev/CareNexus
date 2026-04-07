import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ecommerceApi from "../../../utils/ecommerceApi";

// ─────────────── Orders ───────────────
export const fetchShippedOrders = createAsyncThunk(
  "shipping/fetchShippedOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.getShippedOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

export const fetchCompletedDeliveries = createAsyncThunk(
  "shipping/fetchCompletedDeliveries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.getCompletedDeliveries();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch completed deliveries");
    }
  }
);

export const markOrderPickedUp = createAsyncThunk(
  "shipping/markOrderPickedUp",
  async (id, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.markOrderPickedUp(id);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark order as picked up");
    }
  }
);

export const markOrderDelivered = createAsyncThunk(
  "shipping/markOrderDelivered",
  async (id, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.markOrderDelivered(id);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark order as delivered");
    }
  }
);

// ─────────────── Contracts ───────────────
export const fetchShippingContracts = createAsyncThunk(
  "shipping/fetchContracts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.getMyContracts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch contracts");
    }
  }
);

export const sendShippingContractInvite = createAsyncThunk(
  "shipping/sendContractInvite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.sendContractInvite(data);
      return response.data.contract;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send invite");
    }
  }
);

export const respondShippingContract = createAsyncThunk(
  "shipping/respondContract",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.respondContract(id, action);
      return response.data.contract;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to respond to contract");
    }
  }
);

const initialState = {
  activeOrders: [],
  completedOrders: [],
  contracts: [],
  loading: false,
  error: null,
  currentTitle: "",
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTitle: (state, action) => {
      state.currentTitle = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Active Orders
      .addCase(fetchShippedOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShippedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.activeOrders = action.payload;
      })
      .addCase(fetchShippedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markOrderPickedUp.fulfilled, (state, action) => {
        const index = state.activeOrders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.activeOrders[index] = action.payload;
        }
      })
      .addCase(markOrderDelivered.fulfilled, (state, action) => {
        state.activeOrders = state.activeOrders.filter((o) => o._id !== action.payload._id);
        state.completedOrders.unshift(action.payload);
      })
      // Completed Deliveries
      .addCase(fetchCompletedDeliveries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompletedDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        // avoid duplicates if we just added one from markOrderDelivered
        state.completedOrders = action.payload;
      })
      .addCase(fetchCompletedDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Contracts
      .addCase(fetchShippingContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShippingContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchShippingContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendShippingContractInvite.fulfilled, (state, action) => {
        state.contracts.unshift(action.payload);
      })
      .addCase(respondShippingContract.fulfilled, (state, action) => {
        const index = state.contracts.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      });
  },
});

export const { clearError, setCurrentTitle } = shippingSlice.actions;
export default shippingSlice.reducer;
