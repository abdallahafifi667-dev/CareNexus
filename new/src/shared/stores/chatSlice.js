import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChats: [], // Array of friend objects { id, username, avatar, isMinimized }
  unreadCounts: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat: (state, action) => {
      const friend = action.payload;
      const exists = state.activeChats.find((c) => c.id === friend.id || c._id === friend.id);
      if (!exists) {
        // Limit to 3 open chats for UI sanity
        if (state.activeChats.length >= 3) {
          state.activeChats.shift();
        }
        state.activeChats.push({ ...friend, isMinimized: false });
      } else {
        // If it exists, maximize it
        const chat = state.activeChats.find((c) => c.id === friend.id || c._id === friend.id);
        chat.isMinimized = false;
      }
    },
    closeChat: (state, action) => {
      const friendId = action.payload;
      state.activeChats = state.activeChats.filter((c) => c.id !== friendId && c._id !== friendId);
    },
    toggleMinimize: (state, action) => {
      const friendId = action.payload;
      const chat = state.activeChats.find((c) => c.id === friendId || c._id === friendId);
      if (chat) {
        chat.isMinimized = !chat.isMinimized;
      }
    },
    setUnread: (state, action) => {
      const { friendId, count } = action.payload;
      state.unreadCounts[friendId] = count;
    },
  },
});

export const { openChat, closeChat, toggleMinimize, setUnread } = chatSlice.actions;
export default chatSlice.reducer;
