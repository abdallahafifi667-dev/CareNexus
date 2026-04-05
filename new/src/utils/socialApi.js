import axiosInstance from "./axiosInstance";

const socialApi = {
  // Friendship
  searchUsers: (query) =>
    axiosInstance.get(`/social/friends/search?q=${query}`),
  sendFriendRequest: (recipientId) =>
    axiosInstance.post("/social/friends/request", { recipientId }),
  respondToRequest: (requestId, status) =>
    axiosInstance.put("/social/friends/respond", { requestId, status }),
  getFriends: () => axiosInstance.get("/social/friends"),
  getPendingRequests: () => axiosInstance.get("/social/friends/pending"),
  getUserProfile: (userId) => axiosInstance.get(`/user/profile/${userId}`),

  // Social Chat
  sendMessage: (to, message, messageType = "text") =>
    axiosInstance.post("/social/chat/send", { to, message, messageType }),
  getMessages: (friendId) => axiosInstance.get(`/social/chat/${friendId}`),
  getUnreadCount: () => axiosInstance.get("/social/chat/unread/count"),
};

export default socialApi;
