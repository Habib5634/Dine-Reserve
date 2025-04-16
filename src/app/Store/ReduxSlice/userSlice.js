

import {  createSlice} from '@reduxjs/toolkit';
import { fetchUserData } from '../Actions/userAction';




const userSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: null,
    loadingData: false,
    errorUser: null,
    isAuthenticated:false
  },
  reducers: {
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loadingData = true;
        state.errorUser = null;
        state.isAuthenticated=false
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loadingData = false;
        state.userData = action.payload;
        state.isAuthenticated=true
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loadingData = false;
        state.errorUser = action.payload;
        state.isAuthenticated=false
      });
  },
});


export const {clearAuth} =userSlice.actions;


export default userSlice.reducer;