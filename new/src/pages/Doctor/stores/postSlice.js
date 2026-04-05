import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {

  posts: [],
  globalPosts: [],
  categories: [],
  totalPages: 1,
  currentPage: 1,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  currentPost: null,
  comments: [],
  isCommentLoading: false,
};

// Async Thunks
export const fetchCategories = createAsyncThunk(
  "post/fetchCategories",
  async (_, thunkAPI) => {
    try {
      return await postService.getCategories();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const requestCreatePost = createAsyncThunk(
  "post/createPost",
  async (postData, thunkAPI) => {
    try {
      return await postService.createPost(postData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchDoctorPosts = createAsyncThunk(
  "post/fetchDoctorPosts",
  async (userId, thunkAPI) => {
    try {
      return await postService.getDoctorPosts(userId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchGlobalFeed = createAsyncThunk(
  "post/fetchGlobalFeed",
  async (page, thunkAPI) => {
    try {
      return await postService.getGlobalFeed(page);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const toggleLike = createAsyncThunk(
  "post/toggleLike",
  async ({ postId, isLiked }, thunkAPI) => {
    try {
      if (isLiked) {
        return await postService.unlikePost(postId);
      } else {
        return await postService.likePost(postId);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const toggleCommentLike = createAsyncThunk(
  "post/toggleCommentLike",
  async ({ commentId, isLiked }, thunkAPI) => {
    try {
      if (isLiked) {
        return await postService.unlikeComment(commentId);
      } else {
        return await postService.likeComment(commentId);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchPostDetails = createAsyncThunk(
  "post/fetchPostDetails",
  async (postId, thunkAPI) => {
    try {
      return await postService.getPostById(postId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchComments = createAsyncThunk(
  "post/fetchComments",
  async (postId, thunkAPI) => {
    try {
      return await postService.getComments(postId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const requestAddComment = createAsyncThunk(
  "post/addComment",
  async ({ postId, commentData }, thunkAPI) => {
    try {
      return await postService.addComment(postId, commentData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    resetPostState: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
      state.currentPost = null;
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create Post
      .addCase(requestCreatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestCreatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Add new post to top of both lists
        if (action.payload.post) {
          state.posts.unshift(action.payload.post);
          state.globalPosts.unshift(action.payload.post);
        }
      })
      .addCase(requestCreatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch Doctor Posts
      .addCase(fetchDoctorPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctorPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload; // array of posts
      })
      .addCase(fetchDoctorPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch Global Feed
      .addCase(fetchGlobalFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGlobalFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.currentPage === 1) {
          state.globalPosts = action.payload.posts;
        } else {
          // Append for pagination
          state.globalPosts = [...state.globalPosts, ...action.payload.posts];
        }
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchGlobalFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        // The payload is the updated post
        const updatedPost = action.payload;
        // Update in doctor posts
        const docIndex = state.posts.findIndex(
          (p) => p.id === updatedPost.id || p._id === updatedPost._id,
        );
        if (docIndex !== -1) state.posts[docIndex] = updatedPost;
        // Update in global feed
        const globalIndex = state.globalPosts.findIndex(
          (p) => p.id === updatedPost.id || p._id === updatedPost._id,
        );
        if (globalIndex !== -1) state.globalPosts[globalIndex] = updatedPost;

        if (
          state.currentPost &&
          (state.currentPost._id === updatedPost._id ||
            state.currentPost.id === updatedPost.id)
        ) {
          state.currentPost = updatedPost;
        }
      })
      // Fetch Post Details
      .addCase(fetchPostDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.isCommentLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isCommentLoading = false;
        state.comments = action.payload;
      })
      // Add Comment
      .addCase(requestAddComment.fulfilled, (state, action) => {
        const newComment = action.payload;

        // 1. Update the comments list (for the detailed view)
        if (!newComment.parentComment) {
          state.comments.unshift(newComment);
        } else {
          const updateNestedInComments = (comments) => {
            for (let i = 0; i < comments.length; i++) {
              if (comments[i]._id === newComment.parentComment) {
                if (!comments[i].replies) comments[i].replies = [];
                comments[i].replies.push(newComment);
                return true;
              }
              if (
                comments[i].replies &&
                updateNestedInComments(comments[i].replies)
              ) {
                return true;
              }
            }
            return false;
          };
          updateNestedInComments(state.comments);
        }

        // 2. Increment comment count in the posts lists (for the feed view)
        const postId = newComment.post || newComment.postId;
        const updateCount = (list) => {
          const index = list.findIndex(
            (p) => p._id === postId || p.id === postId,
          );
          if (index !== -1) {
            list[index].commentsCount = (list[index].commentsCount || 0) + 1;
            if (!list[index].comments) list[index].comments = [];
            list[index].comments.push(newComment._id || newComment.id);
          }
        };

        updateCount(state.posts);
        updateCount(state.globalPosts);
        if (
          state.currentPost &&
          (state.currentPost._id === postId || state.currentPost.id === postId)
        ) {
          state.currentPost.commentsCount =
            (state.currentPost.commentsCount || 0) + 1;
          if (!state.currentPost.comments) state.currentPost.comments = [];
          state.currentPost.comments.push(newComment._id || newComment.id);
        }
      })
      // Toggle Comment Like
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const updatedComment = action.payload;

        const updateNested = (comments) => {
          for (let i = 0; i < comments.length; i++) {
            if (comments[i]._id === updatedComment._id) {
              comments[i].likes = updatedComment.likes;
              return true;
            }
            if (comments[i].replies && updateNested(comments[i].replies)) {
              return true;
            }
          }
          return false;
        };

        updateNested(state.comments);
      });
  },

});

export const { resetPostState } = postSlice.actions;
export default postSlice.reducer;
