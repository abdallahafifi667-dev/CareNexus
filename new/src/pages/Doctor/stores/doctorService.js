import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Thunks for Doctor Orders
export const fetchAvailableOrders = createAsyncThunk(
  "doctor/fetchAvailableOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/getOrdersForProvider");
      return response.data.orders || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch available orders",
      );
    }
  },
);

export const fetchActiveOrders = createAsyncThunk(
  "doctor/fetchActiveOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const confirmedRes = await axiosInstance.get(
        `/user/profile/orders/${userId}?status=confirmed`,
      );
      const inProgressRes = await axiosInstance.get(
        `/user/profile/orders/${userId}?status=in_progress`,
      );

      const combined = [
        ...(confirmedRes.data.orders || []),
        ...(inProgressRes.data.orders || []),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return combined;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch active orders",
      );
    }
  },
);

export const fetchHistoryOrders = createAsyncThunk(
  "doctor/fetchHistoryOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const completedRes = await axiosInstance.get(
        `/user/profile/orders/${userId}?status=completed`,
      );
      const cancelledRes = await axiosInstance.get(
        `/user/profile/orders/${userId}?status=cancelled`,
      );

      const combined = [
        ...(completedRes.data.orders || []),
        ...(cancelledRes.data.orders || []),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return combined;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch history orders",
      );
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  "doctor/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/user/profile/order/${orderId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details",
      );
    }
  },
);

// Order Actions
export const handleOrderAction = createAsyncThunk(
  "doctor/handleOrderAction",
  async (
    { actionType, orderId, data = {} },
    { rejectWithValue, dispatch, getState },
  ) => {
    try {
      let endpoint = "";
      let method = "post";

      switch (actionType) {
        case "accept":
          endpoint = `/order/acceptOrder/${orderId}`;
          break;
        case "confirm":
          endpoint = `/order/confirmOrder/${orderId}`;
          break;
        case "reject":
          endpoint = `/order/rejectOrder/${orderId}`;
          break;
        case "start":
          endpoint = `/order/start/${orderId}`;
          break;
        case "arrival":
          endpoint = `/order/markArrivalByProvider/${orderId}`;
          method = "patch";
          break;
        case "complete":
          endpoint = `/order/complete/${orderId}`;
          break;
        case "cancel":
          endpoint = `/order/cancelByProvider/${orderId}`;
          break;
        default:
          throw new Error("Invalid action type");
      }

      const response =
        method === "post"
          ? await axiosInstance.post(endpoint, data)
          : await axiosInstance.patch(endpoint, data);

      const { auth } = getState();
      if (actionType === "accept" || actionType === "reject") {
        dispatch(fetchAvailableOrders());
      } else {
        const userId = auth.user?._id || auth.user?.id;
        if (userId) dispatch(fetchActiveOrders(userId));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Action failed");
    }
  },
);

// Profile and Settings Actions
export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateProfile",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/user/profile/put/${userId}`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const changeDoctorPassword = createAsyncThunk(
  "doctor/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/users/changePassword",
        passwordData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password",
      );
    }
  },
);

// Chat and Reviews Actions
export const fetchConversations = createAsyncThunk(
  "doctor/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/chat/conversations");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch conversations",
      );
    }
  },
);

export const fetchDoctorReviews = createAsyncThunk(
  "doctor/fetchDoctorReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/review/doctor-reviews");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
);

export const uploadProfileImage = createAsyncThunk(
  "doctor/uploadProfileImage",
  async ({ userId, file, uploadType }, { rejectWithValue }) => {
    try {
      // 1. Get signed URL
      const fileExtension = file.name.split(".").pop();
      const signRes = await axiosInstance.post("/user/gcs/sign-upload", {
        userId,
        uploadType, // 'avatar' or 'coverPhoto'
        folder: uploadType === "avatar" ? "avatars" : "covers",
        fileExtension,
      });

      const { signedUrl, contentType } = signRes.data;

      // 2. Upload to GCS (Directly using fetch or axios without interceptors)
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload to GCS");

      return { uploadType, success: true };
    } catch (error) {
      return rejectWithValue(error.message || "Image upload failed");
    }
  },
);

const doctorService = {
  getDoctorProfile: () => axiosInstance.get('/provider/profile'),
  updateDoctorProfile: (data) => axiosInstance.put('/provider/profile', data),
  getDoctorSchedule: () => axiosInstance.get('/provider/schedule'),
  updateDoctorSchedule: (data) => axiosInstance.put('/provider/schedule', data),
  getDoctorAppointments: (params) => axiosInstance.get('/provider/appointments', { params }),
  getDoctorPatients: (params) => axiosInstance.get('/provider/patients', { params }),
  getDoctorReviews: (params) => axiosInstance.get('/provider/reviews', { params }),
  getDoctorDashboard: (params) => axiosInstance.get('/provider/dashboard', { params }),
  getDoctorNotifications: (params) => axiosInstance.get('/provider/notifications', { params }),
  markNotificationAsRead: (id) => axiosInstance.patch(`/provider/notifications/${id}/read`),
  getDoctorChatMessages: (params) => axiosInstance.get('/provider/chat/messages', { params }),
  sendDoctorChatMessage: (data) => axiosInstance.post('/provider/chat/messages', data),
  getDoctorChatContacts: (params) => axiosInstance.get('/provider/chat/contacts', { params }),
  getDoctorChatContactsCount: () => axiosInstance.get('/provider/chat/contacts/count'),
  getDoctorChatContactsSearch: (query) => axiosInstance.get('/provider/chat/contacts/search', { params: { query } }),
  getDoctorChatContactsFilter: (params) => axiosInstance.get('/provider/chat/contacts/filter', { params }),
  getDoctorChatContactsSort: (params) => axiosInstance.get('/provider/chat/contacts/sort', { params }),
  getDoctorChatContactsPagination: (params) => axiosInstance.get('/provider/chat/contacts', { params }),
  getDoctorChatContactsFilterByStatus: (status) => axiosInstance.get('/provider/chat/contacts', { params: { status } }),
  getDoctorChatContactsFilterByDate: (date) => axiosInstance.get('/provider/chat/contacts', { params: { date } })
};

export default doctorService;
