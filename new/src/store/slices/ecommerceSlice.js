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

export const fetchCategories = createAsyncThunk(
  "ecommerce/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await ecommerceApi.getCategories();
      const allCats = res.data?.data || res.data || [];
      return Array.isArray(allCats) 
        ? allCats.filter((cat) => cat.type === "ecommerce")
        : [];
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
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
    categories: [],
    pagination: {},
    cart: null,
    loading: false,
    error: null,
    activeFilters: {
      search: "",
      category: "",
      price: 5000,
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
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
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch Cart
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { setFilters, clearError } = ecommerceSlice.actions;
export default ecommerceSlice.reducer;
