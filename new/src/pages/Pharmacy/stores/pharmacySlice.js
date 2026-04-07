import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ecommerceApi from "../../../utils/ecommerceApi";

// ─────────────── Products ───────────────
export const fetchPharmacyProducts = createAsyncThunk(
  "pharmacy/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.getPharmacyProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);

export const addPharmacyProduct = createAsyncThunk(
  "pharmacy/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.addProduct(formData);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add product");
    }
  }
);

export const updatePharmacyProduct = createAsyncThunk(
  "pharmacy/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.updateProduct(id, data);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update product");
    }
  }
);

export const deletePharmacyProduct = createAsyncThunk(
  "pharmacy/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await ecommerceApi.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete product");
    }
  }
);

// ─────────────── Orders ───────────────
export const fetchPharmacyOrders = createAsyncThunk(
  "pharmacy/fetchOrders",
  async (status, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.getPharmacyOrders(status);
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

export const markOrderReady = createAsyncThunk(
  "pharmacy/markOrderReady",
  async (id, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.markOrderReady(id);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark order as ready");
    }
  }
);

// ─────────────── Contracts ───────────────
export const fetchContracts = createAsyncThunk(
  "pharmacy/fetchContracts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.getMyContracts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch contracts");
    }
  }
);

export const sendContractInvite = createAsyncThunk(
  "pharmacy/sendContractInvite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.sendContractInvite(data);
      return response.data.contract;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send invite");
    }
  }
);

export const respondContract = createAsyncThunk(
  "pharmacy/respondContract",
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
  products: [],
  orders: [],
  contracts: [],
  loading: false,
  error: null,
  currentTitle: "",
};

const pharmacySlice = createSlice({
  name: "pharmacy",
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
      // Products
      .addCase(fetchPharmacyProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPharmacyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchPharmacyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPharmacyProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updatePharmacyProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deletePharmacyProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      // Orders
      .addCase(fetchPharmacyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPharmacyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchPharmacyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markOrderReady.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      // Contracts
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendContractInvite.fulfilled, (state, action) => {
        state.contracts.unshift(action.payload);
      })
      .addCase(respondContract.fulfilled, (state, action) => {
        const index = state.contracts.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      });
  },
});

export const { clearError, setCurrentTitle } = pharmacySlice.actions;
export default pharmacySlice.reducer;
