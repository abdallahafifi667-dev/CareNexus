import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ecommerceApi from "../../utils/ecommerceApi";

export const fetchProducts = createAsyncThunk(
  "ecommerce/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchCartItems = createAsyncThunk(
  "ecommerce/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ecommerceApi.getCartItems();
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const addToCart = createAsyncThunk(
  "ecommerce/addToCart",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await ecommerceApi.addToCart(data);
      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "ecommerce/removeFromCart",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await ecommerceApi.removeFromCart(id);
      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const ecommerceSlice = createSlice({
  name: "ecommerce",
  initialState: {
    products: [],
    pagination: {},
    cart: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })
      // Fetch Cart
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { clearError } = ecommerceSlice.actions;
export default ecommerceSlice.reducer;
