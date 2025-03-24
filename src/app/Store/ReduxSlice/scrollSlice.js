// Store/ReduxSlice/scrollSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scrollTrigger: 0,
  scrollDirection: null, // 'up' or 'down'
  previousScroll: 0,
};

const scrollSlice = createSlice({
  name: 'scroll',
  initialState,
  reducers: {
    setScrollTrigger: (state, action) => {
      const currentScroll = action.payload;
      if (currentScroll > state.previousScroll) {
        state.scrollDirection = 'down';
      } else if (currentScroll < state.previousScroll) {
        state.scrollDirection = 'up';
      }
      state.previousScroll = currentScroll;
      state.scrollTrigger = currentScroll;
    },
  },
});

export const { setScrollTrigger } = scrollSlice.actions;
export default scrollSlice.reducer;