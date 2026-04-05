import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slides: [],
  currentIndex: 0,
  isPlaying: true,
};

const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {
    setSlides: (state, action) => {
      state.slides = action.payload;
    },
    nextSlide: (state) => {
      if (state.slides.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.slides.length;
      }
    },
    prevSlide: (state) => {
      if (state.slides.length > 0) {
        state.currentIndex =
          (state.currentIndex - 1 + state.slides.length) % state.slides.length;
      }
    },
    setSlideIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});

export const { setSlides, nextSlide, prevSlide, setSlideIndex, togglePlay } =
  sliderSlice.actions;
export default sliderSlice.reducer;
