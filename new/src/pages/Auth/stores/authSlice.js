import { createSlice } from '@reduxjs/toolkit';
import { 
  registerUser, 
  loginUser, 
  sendResetCode, 
  verifyResetCode, 
  createNewPassword,
  verifyEmail
} from './authService';

const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null,
  isLoading: false,
  error: null,
  resetPhase: 'email', // 'email' | 'code' | 'new_password' | 'success'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPasswordPhase: (state, action) => {
      state.resetPhase = action.payload; 
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.accessToken || action.payload.token || state.token;
      })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Password Step 1: Send Reset Code
      .addCase(sendResetCode.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(sendResetCode.fulfilled, (state) => { 
        state.isLoading = false; 
        state.resetPhase = 'code'; 
      })
      .addCase(sendResetCode.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Password Step 2: Verify Reset Code
      .addCase(verifyResetCode.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyResetCode.fulfilled, (state) => { 
        state.isLoading = false; 
        state.resetPhase = 'new_password'; 
      })
      .addCase(verifyResetCode.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Password Step 3: Create New Password 
      .addCase(createNewPassword.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(createNewPassword.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.resetPhase = 'success'; 
        
        state.user = action.payload.user || action.payload;
        if(action.payload.accessToken || action.payload.token) {
          state.token = action.payload.accessToken || action.payload.token;
        }
      })
      .addCase(createNewPassword.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Verify Email
      .addCase(verifyEmail.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.accessToken || action.payload.token || state.token;
      })
      .addCase(verifyEmail.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { logout, clearError, resetPasswordPhase } = authSlice.actions;
export default authSlice.reducer;
