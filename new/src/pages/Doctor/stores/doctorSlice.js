import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import doctorService from './doctorService';

// Async thunks
export const fetchDoctorProfile = createAsyncThunk(
  'doctor/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  'doctor/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await doctorService.updateDoctorProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const fetchDoctorSchedule = createAsyncThunk(
  'doctor/fetchSchedule',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorSchedule();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedule');
    }
  }
);

export const updateDoctorSchedule = createAsyncThunk(
  'doctor/updateSchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await doctorService.updateDoctorSchedule(scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update schedule');
    }
  }
);

export const fetchDoctorAppointments = createAsyncThunk(
  'doctor/fetchAppointments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorAppointments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchDoctorPatients = createAsyncThunk(
  'doctor/fetchPatients',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorPatients(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const fetchDoctorReviews = createAsyncThunk(
  'doctor/fetchReviews',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorReviews(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchDoctorDashboard = createAsyncThunk(
  'doctor/fetchDashboard',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorDashboard(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

export const fetchDoctorNotifications = createAsyncThunk(
  'doctor/fetchNotifications',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'doctor/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await doctorService.markNotificationAsRead(notificationId);
      return { notificationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const deleteAllNotifications = createAsyncThunk(
  'doctor/deleteAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      await doctorService.deleteAllNotifications();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notifications');
    }
  }
);

export const fetchDoctorChatMessages = createAsyncThunk(
  'doctor/fetchChatMessages',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorChatMessages(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendDoctorChatMessage = createAsyncThunk(
  'doctor/sendChatMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await doctorService.sendDoctorChatMessage(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const fetchDoctorChatContacts = createAsyncThunk(
  'doctor/fetchChatContacts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorChatContacts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
    }
  }
);

export const fetchDoctorChatContactsCount = createAsyncThunk(
  'doctor/fetchChatContactsCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorChatContactsCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts count');
    }
  }
);

export const fetchDoctorChatContactsSearch = createAsyncThunk(
  'doctor/fetchChatContactsSearch',
  async (query, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorChatContactsSearch(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search contacts');
    }
  }
);

export const fetchDoctorChatContactsFilter = createAsyncThunk(
  'doctor/fetchChatContactsFilter',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorChatContactsFilter(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to filter contacts');
    }
  }
);

export const fetchDoctorChatContactsSort = createAsyncThunk(
  'doctor/fetchChatContactsSort',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorChatContactsSort(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sort contacts');
    }
  }
);

export const fetchDoctorChatContactsPagination = createAsyncThunk(
  'doctor/fetchChatContactsPagination',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorChatContactsPagination(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
    }
  }
);

export const fetchDoctorChatContactsFilterByStatus = createAsyncThunk(
  'doctor/fetchChatContactsFilterByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorChatContactsFilterByStatus(status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to filter contacts');
    }
  }
);

export const fetchDoctorChatContactsFilterByDate = createAsyncThunk(
  'doctor/fetchChatContactsFilterByDate',
  async (date, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorChatContactsFilterByDate(date);
      return response.data;
    } catch (error) {
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState: {
    currentDoctor: null,
    schedule: null,
    appointments: [],
    patients: [],
    reviews: [],
    dashboardStats: null,
    notifications: [],
    unreadCount: 0,
    chatMessages: [],
    chatContacts: [],
    chatContactsCount: 0,
    currentOrder: null,
    headerTitle: '',
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    setHeaderTitle: (state, action) => {
      state.headerTitle = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    clearDoctorState: (state) => {
      state.currentDoctor = null;
      state.schedule = null;
      state.appointments = [];
      state.patients = [];
      state.reviews = [];
      state.dashboardStats = null;
      state.notifications = [];
      state.chatMessages = [];
      state.chatContacts = [];
      state.chatContactsCount = 0;
      state.currentOrder = null;
      state.headerTitle = '';
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Add minimal extraReducers handling loading state to prevent errors
    builder
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload?.doctor || action.payload;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Notifications
      .addCase(fetchDoctorNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(fetchDoctorNotifications.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.notificationId,
        );
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      });
  },
});

export const { setHeaderTitle, resetError, clearDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;
